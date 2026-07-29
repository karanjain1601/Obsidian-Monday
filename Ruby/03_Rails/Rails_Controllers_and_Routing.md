---
title: Rails Controllers and Routing
aliases:
  - Rails Routes
  - Rails Controller Actions
  - Rails Strong Parameters
  - RESTful Rails
tags: [Ruby, Rails, controllers, routing, REST, strong-parameters]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rails_Overview]]"
  - "[[Rails_Models_ActiveRecord]]"
  - "[[Rails_Views_and_API]]"
status: complete
---

# Rails Controllers and Routing

> [!abstract] TL;DR
> Rails routing maps HTTP verbs + paths to controller actions using RESTful conventions — `resources :articles` generates 7 routes automatically. Controllers handle request/response logic with `before_action` filters, strong parameters (`require`/`permit`) for safe mass-assignment, `render`/`redirect_to` for responses, and `respond_to` for multi-format (HTML/JSON) support. Flash messages, sessions, and cookies persist data across requests.

---

## Intuition

**Analogy:** `config/routes.rb` is the switchboard. Every incoming HTTP request rings in and the switchboard maps it to the right extension (controller action). `resources :articles` is a shortcut that wires up all 7 standard extensions at once, following the RESTful convention the entire Rails ecosystem assumes.

Strong parameters are a security checkpoint: the controller says exactly which fields are permitted for mass assignment, preventing attackers from submitting `role: "admin"` in a form.

---

## Routes

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # resources — generates 7 RESTful routes
  resources :articles

  # Equivalent to:
  # GET    /articles          → articles#index
  # GET    /articles/new      → articles#new
  # POST   /articles          → articles#create
  # GET    /articles/:id      → articles#show
  # GET    /articles/:id/edit → articles#edit
  # PATCH  /articles/:id      → articles#update
  # DELETE /articles/:id      → articles#destroy

  # Nested resources
  resources :articles do
    resources :comments, only: [:create, :destroy]    # POST, DELETE
    member   { post :publish }                         # POST /articles/:id/publish
    collection { get :popular }                        # GET /articles/popular
  end

  # Namespaces (scopes controller AND URL)
  namespace :admin do
    resources :users
    # → /admin/users, Admin::UsersController
  end

  # Scope (scopes URL but not controller)
  scope :api do
    scope :v1 do
      resources :users
      # → /api/v1/users, UsersController (no module prefix)
    end
  end

  # Named routes
  get "/help",  to: "pages#help",  as: :help    # help_path, help_url

  # Root
  root "articles#index"
end
```

```bash
rails routes                          # list all routes
rails routes --grep articles          # filter by pattern
rails routes | grep POST              # filter by verb
```

---

## Controller Actions

```ruby
# app/controllers/articles_controller.rb
class ArticlesController < ApplicationController
  before_action :authenticate_user!
  before_action :set_article,        only: [:show, :edit, :update, :destroy]
  before_action :authorize_owner!,   only: [:edit, :update, :destroy]
  after_action  :track_view,         only: [:show]

  def index
    @articles = Article.published
                       .includes(:user, :tags)
                       .order(created_at: :desc)
                       .page(params[:page]).per(20)
  end

  def show
    # @article set by before_action
  end

  def new
    @article = Article.new
  end

  def create
    @article = current_user.articles.build(article_params)

    if @article.save
      redirect_to @article, notice: "Article created successfully."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @article.update(article_params)
      redirect_to @article, notice: "Article updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @article.destroy
    redirect_to articles_path, notice: "Article deleted.", status: :see_other
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def authorize_owner!
    redirect_to root_path, alert: "Not authorized" unless @article.user == current_user
  end

  def article_params
    params.require(:article).permit(:title, :body, :published, tag_ids: [])
  end

  def track_view
    ArticleViewJob.perform_later(@article.id) if @article
  end
end
```

---

## Strong Parameters

```ruby
# params is an ActionController::Parameters object — not a plain hash
# .require raises ActionController::ParameterMissing if key is absent
# .permit whitelists specific keys (others are filtered out)

def article_params
  params.require(:article).permit(
    :title,
    :body,
    :published,
    :published_at,
    tag_ids: [],                         # array of permitted values
    metadata: [:author_bio, :source_url] # nested hash
  )
end

# Without permit, any key could be mass-assigned:
# Article.create(params[:article])  # UNSAFE — attacker could set :admin => true

# Handling nested forms
def user_params
  params.require(:user).permit(
    :name,
    :email,
    address_attributes: [:street, :city, :country, :id, :_destroy]
    # _destroy: true enables nested record deletion
  )
end
```

---

## respond_to — Multi-format Responses

```ruby
def show
  @article = Article.find(params[:id])

  respond_to do |format|
    format.html                      # renders show.html.erb
    format.json { render json: @article.as_json(include: :user) }
    format.pdf  { render pdf: generate_pdf(@article) }
  end
end

def index
  @articles = Article.published.recent

  respond_to do |format|
    format.html
    format.json { render json: @articles, each_serializer: ArticleSerializer }
    format.csv  { send_data Article.to_csv, filename: "articles-#{Date.today}.csv" }
  end
end
```

---

## Flash, Session, and Cookies

```ruby
# Flash — persists for exactly one request (typically used after redirect)
redirect_to articles_path, notice: "Created!"     # flash[:notice]
redirect_to articles_path, alert: "Not allowed!"  # flash[:alert]
flash[:custom] = "Something happened"

# Flash now — available in current request (not next)
flash.now[:error] = "Invalid form"   # used before render (not redirect)

# Session — server-side, expires with browser session
session[:user_id] = user.id
session[:cart]    = { items: [] }
session.delete(:user_id)      # logout
reset_session                  # clear all session data

# Cookies — client-side
cookies[:theme] = "dark"
cookies[:theme] = { value: "dark", expires: 30.days.from_now }
cookies.encrypted[:user_id] = current_user.id    # signed and encrypted
cookies.signed[:token]      = generate_token     # signed (tamper-proof)
cookies.delete(:theme)

# In views: <%= flash[:notice] %> or <%= notice %>
```

---

## Before/After/Around Filters

```ruby
class ApplicationController < ActionController::Base
  before_action :authenticate_user!
  before_action :set_locale

  private

  def authenticate_user!
    unless session[:user_id]
      redirect_to login_path, alert: "Please log in"
    end
  end

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end
  helper_method :current_user

  def set_locale
    I18n.locale = params[:locale] || :en
  end
end

# around_action — wraps the entire action
class ApiController < ApplicationController
  around_action :track_execution_time

  private

  def track_execution_time
    start = Time.now
    yield   # executes the action
    duration_ms = ((Time.now - start) * 1000).round
    response.headers["X-Execution-Time"] = duration_ms.to_s
  end
end
```

---

## Route Helpers

```ruby
# Route helpers generated by resources :articles
articles_path           # => "/articles"
new_article_path        # => "/articles/new"
article_path(@article)  # => "/articles/1"
edit_article_path(@article) # => "/articles/1/edit"

# URL helpers (include host)
articles_url            # => "http://localhost:3000/articles"

# In views and mailers
link_to "Edit", edit_article_path(@article)
redirect_to article_path(@article)
form_with(model: @article)  # infers path from model

# Named route
get "/help", to: "pages#help", as: :help
help_path  # => "/help"
```

---

## Common Pitfalls

- **Strong parameters for nested attributes** — forgetting `_destroy: true` in `permit` means the "remove" checkbox on nested forms is silently ignored and records are never deleted.
- **`redirect_to` with 303 after DELETE** — browsers may re-issue the DELETE on back button without `status: :see_other`. Always use `status: :see_other` (303) for POST/DELETE redirects.
- **`flash` vs `flash.now`** — `flash[:notice]` survives one redirect; `flash.now[:notice]` is only available in the current render. Using `flash[:notice]` before `render` (not `redirect_to`) means the message appears twice.
- **Nested routes beyond 2 levels** — deeply nested routes (`/users/:user_id/articles/:article_id/comments`) produce unwieldy helpers. Rails guides recommend nesting max one level; use `shallow: true` to flatten.
- **`before_action` without `only:/except:`** — a global `before_action :authenticate_user!` without scoping blocks even public actions. Always specify `only:` or `except:`.

---

## Review Questions

1. What routes does `resources :articles` generate? Write the HTTP verb, path, and action name for all 7.
2. What is the security problem that strong parameters solve? Give an example attack that would succeed without them.
3. Explain the difference between `flash[:notice]` and `flash.now[:notice]`. What happens if you use `flash[:notice]` before a `render` instead of a `redirect_to`?
4. When should you use `before_action`, `after_action`, and `around_action`? Give a concrete use case where `around_action` is the right choice.

---

#Ruby #Rails
