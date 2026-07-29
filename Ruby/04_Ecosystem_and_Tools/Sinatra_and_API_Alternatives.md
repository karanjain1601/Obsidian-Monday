---
title: Sinatra and API Alternatives
aliases:
  - Sinatra
  - Hanami
  - Grape API
  - Sorbet Ruby
  - Rack middleware
tags: [Ruby, Rails, Sinatra, Hanami, Grape, Rack, microservices]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rails_Overview]]"
  - "[[Rails_Views_and_API]]"
  - "[[Bundler_and_Gems]]"
status: complete
---

# Sinatra and API Alternatives

> [!abstract] TL;DR
> Not every Ruby web application needs Rails. Sinatra is a minimalist DSL for small apps and microservices — routes are declared with `get`/`post`/`delete` directly. Grape specializes in REST API development with built-in parameter validation, versioning, and documentation hooks. Hanami is an MVC alternative to Rails with better separation of concerns. Rack is the underlying protocol that all Ruby web frameworks implement. Sorbet adds static type checking to Ruby.

---

## Intuition

**Analogy:** Sinatra is a food cart — fast to set up, focused on one thing, no overhead. Rails is a full restaurant — kitchen, waitstaff, menu design, reservations system included. Rack is the food safety code that both must comply with. Grape is a specialized catering service — it only does formal sit-down dinners (REST APIs) but does them with ceremony and precision.

Choose based on scope: a webhook receiver → Sinatra; a complex web app with admin and auth → Rails; a large REST API with multiple versions → Grape or Rails API mode.

---

## Rack — The Foundation

All Ruby web frameworks implement the Rack specification: a callable that accepts `env` (request hash) and returns `[status, headers, body]`.

```ruby
# A complete Rack application (one file, no framework)
# config.ru
app = ->(env) {
  path   = env["PATH_INFO"]
  method = env["REQUEST_METHOD"]

  case [method, path]
  when ["GET", "/"]
    [200, { "Content-Type" => "text/html" }, ["<h1>Hello, Rack!</h1>"]]
  when ["GET", "/health"]
    [200, { "Content-Type" => "application/json" }, ['{"status":"ok"}']]
  else
    [404, { "Content-Type" => "text/plain" }, ["Not Found"]]
  end
}

# Rack middleware — wraps another app
class LoggerMiddleware
  def initialize(app)
    @app = app
  end

  def call(env)
    start = Time.now
    status, headers, body = @app.call(env)   # call inner app
    duration = ((Time.now - start) * 1000).round
    puts "#{env["REQUEST_METHOD"]} #{env["PATH_INFO"]} → #{status} (#{duration}ms)"
    [status, headers, body]
  end
end

# Rack middleware stack
use LoggerMiddleware
use Rack::Deflater    # gzip compression
run app

# rackup config.ru   # start server
```

---

## Sinatra

```ruby
# Gemfile
gem "sinatra"
gem "sinatra-contrib"   # extra helpers, streaming, namespace
gem "puma"

# app.rb
require "sinatra"
require "sinatra/json"
require "json"

# Route handlers
get "/" do
  "Hello, Sinatra!"
end

get "/users/:id" do
  user = User.find_by(id: params[:id])
  halt 404, json({ error: "Not found" }) unless user
  json(user.as_json(only: [:id, :name, :email]))
end

post "/users" do
  data = JSON.parse(request.body.read)
  user = User.create!(data.slice("name", "email"))
  status 201
  json user.as_json
rescue ActiveRecord::RecordInvalid => e
  status 422
  json({ errors: e.record.errors.as_json })
end

# Before filter (like before_action)
before "/admin/*" do
  halt 401 unless authenticated?
end

# Error handling
not_found do
  json({ error: "Route not found" })
end

error 500 do
  json({ error: "Internal server error" })
end

# Modular style (for larger apps)
class MyApp < Sinatra::Base
  configure :development do
    enable :logging
  end

  get "/health" do
    json({ status: "ok", time: Time.now.iso8601 })
  end
end

# config.ru
require_relative "app"
run MyApp
```

---

## Sinatra Microservice Pattern

```ruby
# webhook_service.rb — a focused Sinatra microservice
require "sinatra/base"
require "json"

class WebhookService < Sinatra::Base
  before do
    content_type :json
    @payload = JSON.parse(request.body.read) rescue {}
  end

  post "/webhook/github" do
    event = request.env["HTTP_X_GITHUB_EVENT"]
    case event
    when "push"
      ProcessGithubPushJob.perform_async(@payload)
      { status: "queued" }.to_json
    when "pull_request"
      { status: "ignored" }.to_json
    else
      halt 400, { error: "Unknown event: #{event}" }.to_json
    end
  end

  post "/webhook/stripe" do
    signature = request.env["HTTP_STRIPE_SIGNATURE"]
    halt 400, { error: "Invalid signature" }.to_json unless valid_stripe_sig?(signature)
    ProcessStripeWebhookJob.perform_async(@payload)
    { status: "ok" }.to_json
  end
end
```

---

## Grape REST API Framework

```ruby
# Gemfile
gem "grape"
gem "grape-entity"    # response formatters
gem "grape-swagger"   # auto-generate Swagger docs

# app/api/v1/articles_api.rb
module API
  module V1
    class ArticlesAPI < Grape::API
      version "v1", using: :path   # /api/v1/...
      format :json
      prefix "api"

      helpers do
        def current_user
          @current_user ||= User.find_by(api_token: headers["Authorization"]&.sub("Bearer ", ""))
        end

        def authenticate!
          error!("Unauthorized", 401) unless current_user
        end
      end

      resource :articles do
        desc "List published articles" do
          success [{ code: 200, message: "OK" }]
        end
        params do
          optional :page,    type: Integer, default: 1, desc: "Page number"
          optional :per,     type: Integer, default: 20, values: 1..100
          optional :tag,     type: String,  desc: "Filter by tag slug"
        end
        get do
          articles = Article.published.order(created_at: :desc)
          articles = articles.by_tag(params[:tag]) if params[:tag]
          articles.page(params[:page]).per(params[:per])
        end

        desc "Create an article"
        params do
          requires :title, type: String,  desc: "Article title"
          requires :body,  type: String,  desc: "Article body"
          optional :published, type: Boolean, default: false
        end
        post do
          authenticate!
          article = current_user.articles.create!(declared(params))
          present article, with: API::Entities::Article
        end

        route_param :id do
          get do
            Article.find(params[:id])
          end

          delete do
            authenticate!
            article = current_user.articles.find(params[:id])
            article.destroy
            { message: "Deleted" }
          end
        end
      end
    end
  end
end

# config.ru
require_relative "app/api/v1/articles_api"
run API::V1::ArticlesAPI
```

---

## Hanami — Rails Alternative

```ruby
# Hanami 2.x — modern, layered architecture
# hanami new bookshelf

# app/actions/books/index.rb
module Bookshelf
  module Actions
    module Books
      class Index < Bookshelf::Action
        def handle(request, response)
          books = BookRepository.new.all
          response.render view, books: books
        end
      end
    end
  end
end

# Hanami philosophy:
# - Actions are plain objects (not Rails controller methods)
# - Views are objects (not templates), templates are separate
# - Repositories isolate DB access from domain objects
# - Stricter separation: domain logic CANNOT access HTTP request directly
```

---

## Sorbet Type Checking

```ruby
# Gemfile
gem "sorbet-runtime"
gem "sorbet", require: false   # type checking tool (run via CLI)

# app/models/user.rb
# typed: strict

require "sorbet-runtime"

class UserService
  extend T::Sig

  sig { params(name: String, age: Integer).returns(T::Boolean) }
  def create_user(name, age)
    return false if name.empty? || age.negative?
    User.create!(name: name, age: age)
    true
  rescue ActiveRecord::RecordInvalid
    false
  end

  sig { params(ids: T::Array[Integer]).returns(T::Array[User]) }
  def find_users(ids)
    User.where(id: ids).to_a
  end

  sig { params(role: T.nilable(String)).void }
  def set_role(role)
    @role = role   # T.nilable — can be String or nil
  end
end

# srb tc     # run type checker
# srb init   # initialize Sorbet in project (creates sorbet/ directory)
```

---

## Framework Comparison

| Framework | Size | Use Case | Key Strength |
|---|---|---|---|
| **Rails** | Full-stack | Web apps with views, admin, auth | Convention, ecosystem, generators |
| **Rails API** | API | JSON APIs with ActiveRecord | Rails ecosystem, familiar |
| **Sinatra** | Micro | Webhooks, microservices | Zero overhead, simple |
| **Grape** | DSL | REST APIs with validation | Parameter DSL, versioning, Swagger |
| **Hanami** | MVC | Clean architecture apps | Strict separation, testability |
| **Roda** | Routing tree | High-performance APIs | Speed, composable plugins |

---

## Common Pitfalls

- **Sinatra route order matters** — routes are matched top-to-bottom. A broad route (`get "/:id"`) before a specific one (`get "/new"`) catches `"/new"` first. Order specific routes before general ones.
- **Grape parameter type coercion** — `params do; requires :id, type: Integer; end` coerces `"42"` to `42`. Forgetting type declarations means you get strings where integers are expected.
- **Sinatra sessions** — Sinatra doesn't enable sessions by default. Add `enable :sessions` or use Rack session middleware.
- **Sorbet gradual adoption** — don't add `# typed: strict` to all files at once. Start with `# typed: false` (no checking), then `true` (checks annotated methods), then `strict` (requires all annotations).
- **Rack middleware order** — middleware wraps in reverse order. The first `use` middleware is the outermost layer (called first on request, last on response). Authentication middleware should be outer; logging middleware should be outermost.

---

## Review Questions

1. What is the Rack specification? Why does it matter that all Ruby web frameworks implement it?
2. When would you choose Sinatra over Rails for a new project? Give two concrete examples.
3. Explain how Grape's `params do...end` block works. What happens when a required parameter is missing?
4. What problem does Sorbet solve in Ruby? What does the `# typed: strict` comment enable, and what does it require from the developer?

---

#Ruby #Rails
