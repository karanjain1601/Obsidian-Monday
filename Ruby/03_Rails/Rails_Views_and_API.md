---
title: Rails Views and API
aliases:
  - Rails ERB
  - Rails API mode
  - Rails Serializers
  - Rails JSON API
tags: [Ruby, Rails, views, ERB, API, serializers, JSON]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rails_Controllers_and_Routing]]"
  - "[[Rails_Models_ActiveRecord]]"
  - "[[Rails_Auth_Background_Jobs]]"
status: complete
---

# Rails Views and API

> [!abstract] TL;DR
> Rails views use ERB templates with layouts, partials, and helpers for HTML rendering. For APIs, the `--api` flag strips view layers and adds serializers (jsonapi-serializer or ActiveModel::Serializers) for controlled JSON output. `jbuilder` enables declarative JSON construction. API versioning uses namespaced routes. CORS is configured via the `rack-cors` gem.

---

## Intuition

**Analogy:** ERB is a template engine that works like a stencil: you define an HTML outline with slots (`<%= expr %>`), and Rails fills in the slots with data from the controller. Layouts are the outer frame (header, footer, nav); partials are reusable components. For APIs, the view layer is a serializer — a class that decides what JSON shape the client receives, independent of the model's internal structure.

---

## ERB Templates

```erb
<%# app/views/articles/show.html.erb %>
<% content_for :title, @article.title %>

<article class="prose">
  <h1><%= @article.title %></h1>
  <p class="meta">
    By <%= link_to @article.user.name, user_path(@article.user) %>
    on <%= @article.created_at.strftime("%B %d, %Y") %>
  </p>

  <div class="body">
    <%= simple_format(@article.body) %>
  </div>

  <% if @article.tags.any? %>
    <div class="tags">
      <% @article.tags.each do |tag| %>
        <%= link_to tag.name, articles_path(tag: tag.slug), class: "tag" %>
      <% end %>
    </div>
  <% end %>

  <%= render "comments/section", article: @article %>
</article>
```

```erb
<%# app/views/layouts/application.html.erb %>
<!DOCTYPE html>
<html>
<head>
  <title><%= yield :title %> | MyApp</title>
  <%= csrf_meta_tags %>
  <%= csp_meta_tag %>
  <%= stylesheet_link_tag "application" %>
</head>
<body>
  <%= render "shared/navbar" %>

  <main>
    <%= render "shared/flash" %>
    <%= yield %>
  </main>

  <%= javascript_include_tag "application", defer: true %>
</body>
</html>
```

---

## Partials and Helpers

```erb
<%# app/views/articles/_article.html.erb — naming convention: underscore prefix %>
<article id="article-<%= article.id %>">
  <h2><%= link_to article.title, article_path(article) %></h2>
  <p><%= truncate(article.body, length: 200) %></p>
</article>

<%# Render partial from collection — auto-loops, passes article variable %>
<%= render @articles %>
<%# equivalent to @articles.each { |a| render "articles/article", article: a } %>

<%# With locals %>
<%= render "articles/article", article: @featured, highlight: true %>
```

```ruby
# app/helpers/articles_helper.rb
module ArticlesHelper
  def article_status_badge(article)
    if article.published?
      content_tag(:span, "Published", class: "badge badge-green")
    else
      content_tag(:span, "Draft", class: "badge badge-gray")
    end
  end

  def reading_time(article)
    words = article.body.split.size
    minutes = (words / 200.0).ceil
    "#{minutes} min read"
  end
end
```

---

## Forms

```erb
<%# form_with — works for new and existing records (infers create vs update) %>
<%= form_with(model: @article, class: "article-form") do |f| %>
  <% if @article.errors.any? %>
    <div class="errors">
      <% @article.errors.full_messages.each do |msg| %>
        <p class="error"><%= msg %></p>
      <% end %>
    </div>
  <% end %>

  <div class="field">
    <%= f.label :title %>
    <%= f.text_field :title, class: "input", autofocus: true %>
  </div>

  <div class="field">
    <%= f.label :body %>
    <%= f.text_area :body, rows: 15, class: "textarea" %>
  </div>

  <div class="field">
    <%= f.label :tag_ids, "Tags" %>
    <%= f.collection_check_boxes :tag_ids, Tag.all, :id, :name %>
  </div>

  <div class="field">
    <%= f.check_box :published %>
    <%= f.label :published, "Publish now" %>
  </div>

  <%= f.submit class: "btn btn-primary" %>
<% end %>
```

---

## Rails API Mode

```bash
rails new my_api --api --database=postgresql
# Skips: views, ERB, assets, browser-session middleware, cookies
# Includes: ActionController::API (lighter base class)
```

```ruby
# app/controllers/api/v1/articles_controller.rb
module Api
  module V1
    class ArticlesController < ApplicationController
      before_action :authenticate_token!
      before_action :set_article, only: [:show, :update, :destroy]

      def index
        articles = Article.published.includes(:user, :tags).recent.page(params[:page])
        render json: {
          data: ArticleSerializer.new(articles).serializable_hash,
          meta: { total: articles.total_count, page: articles.current_page }
        }
      end

      def show
        render json: ArticleSerializer.new(@article, include: [:user, :tags]).serializable_hash
      end

      def create
        article = current_user.articles.build(article_params)
        if article.save
          render json: ArticleSerializer.new(article).serializable_hash, status: :created
        else
          render json: { errors: article.errors.as_json }, status: :unprocessable_entity
        end
      end

      private

      def authenticate_token!
        token = request.headers["Authorization"]&.sub(/\ABearer /, "")
        @current_user = User.find_by(api_token: token)
        render json: { error: "Unauthorized" }, status: :unauthorized unless @current_user
      end

      def article_params
        params.require(:article).permit(:title, :body, :published)
      end
    end
  end
end
```

---

## Serializers with jsonapi-serializer

```ruby
# Gemfile
gem "jsonapi-serializer"

# app/serializers/article_serializer.rb
class ArticleSerializer
  include JSONAPI::Serializer

  set_type :article
  set_id :id

  attributes :title, :body, :published, :created_at, :view_count

  attribute :reading_time do |article|
    (article.body.split.size / 200.0).ceil
  end

  belongs_to :user, serializer: UserSerializer
  has_many   :tags, serializer: TagSerializer
end

# Usage in controller
render json: ArticleSerializer.new(@article).serializable_hash
render json: ArticleSerializer.new(@articles, include: [:user]).serializable_hash

# jbuilder (alternative — template-based JSON)
# app/views/api/v1/articles/show.json.jbuilder
json.id      @article.id
json.title   @article.title
json.author  do
  json.id    @article.user.id
  json.name  @article.user.name
end
json.tags    @article.tags, :id, :name
```

---

## CORS Configuration

```ruby
# Gemfile
gem "rack-cors"

# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://myapp.com", "http://localhost:3001"

    resource "/api/*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      max_age: 3600
  end
end
```

---

## Versioned API Routing

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :articles
      resources :users, only: [:index, :show]
    end

    namespace :v2 do
      resources :articles   # new version — different serializer/behavior
    end
  end
end

# URL structure:
# GET /api/v1/articles    → Api::V1::ArticlesController#index
# GET /api/v2/articles    → Api::V2::ArticlesController#index
```

---

## Common Pitfalls

- **`render :edit` vs `redirect_to`** — after a failed `update`, use `render :edit` (not `redirect_to`) so the form re-displays with validation errors. `redirect_to` creates a new GET request that loses `@article.errors`.
- **Over-serializing** — returning an entire model's attributes in JSON (including internal fields) leaks implementation details and may expose sensitive data. Always use a serializer class to explicitly whitelist output.
- **CSRF in API mode** — Rails API mode disables CSRF by default (no `protect_from_forgery`). For browser-facing APIs that use cookies for auth, re-enable it. For token-based APIs (Authorization header), it's safe to leave off.
- **Missing `content_for :title`** — forgetting to set the page title in child templates leaves `<title> | MyApp</title>`. Add a sensible default in the layout: `<%= yield(:title).presence || "MyApp" %>`.
- **N+1 in serializers** — `ArticleSerializer` calling `article.user.name` for each article triggers N queries. Always `includes` the association in the controller before serializing.

---

## Review Questions

1. What is the difference between `render` and `redirect_to` in a `create` action when validation fails? Why does the wrong choice cause problems?
2. What does `rails new myapp --api` change compared to a standard app? What middleware and components are removed?
3. Explain why `rack-cors` is needed for a Rails API. When would you NOT need it?
4. Why is using a serializer class better than calling `.to_json` directly on an Active Record model?

---

#Ruby #Rails
