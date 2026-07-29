---
title: Rails Auth and Background Jobs
aliases:
  - Devise
  - Pundit
  - Sidekiq
  - Rails Authentication
  - Rails Authorization
  - Active Job
tags: [Ruby, Rails, authentication, authorization, Devise, Pundit, Sidekiq, background-jobs]
domain: Ruby
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Rails_Overview]]"
  - "[[Rails_Controllers_and_Routing]]"
  - "[[Rails_Testing]]"
status: complete
---

# Rails Auth and Background Jobs

> [!abstract] TL;DR
> Devise provides full authentication scaffolding (registration, login, password reset, email confirmation) with Warden strategies. Pundit handles fine-grained authorization through policy objects. Active Job provides a unified interface for background work; Sidekiq (Redis-backed) is the dominant backend. Background jobs decouple slow work (email, webhooks, image processing) from the request cycle.

---

## Intuition

**Analogy:** Devise is like hiring a security company — they handle the front door (login form), key management (password reset), and visitor log (session tracking), so you don't build any of it from scratch. Pundit is the internal policy manual that says *what* each type of visitor is allowed to do once inside. Sidekiq is the warehouse crew working in the background — the customer checks out (request ends) while the warehouse is still packing and shipping (async jobs).

---

## Devise Authentication

```ruby
# Gemfile
gem "devise"

# Setup
rails generate devise:install
rails generate devise User
rails db:migrate

# app/models/user.rb — Devise modules
class User < ApplicationRecord
  devise :database_authenticatable,   # password hashing (bcrypt)
         :registerable,               # sign up
         :recoverable,                # password reset via email
         :rememberable,               # "remember me" cookie
         :validatable,                # email/password validations
         :confirmable,                # email confirmation before login
         :lockable,                   # lock after N failed attempts
         :trackable                   # last_sign_in_at, sign_in_count

  has_many :articles, dependent: :destroy
end

# config/routes.rb
devise_for :users, controllers: {
  sessions:      "users/sessions",
  registrations: "users/registrations"
}
```

```ruby
# Devise view helpers (available in controllers and views)
user_signed_in?          # => true/false
current_user             # => User or nil
authenticate_user!       # before_action that redirects if not logged in

# Custom Devise controllers
class Users::RegistrationsController < Devise::RegistrationsController
  private

  def sign_up_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
```

---

## JWT Authentication (API mode)

```ruby
# Gemfile
gem "devise"
gem "devise-jwt"

# config/initializers/devise.rb
Devise.setup do |config|
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.devise_jwt_secret_key!
    jwt.dispatch_requests = [["POST", %r{^/users/sign_in$}]]
    jwt.revocation_requests = [["DELETE", %r{^/users/sign_out$}]]
    jwt.expiration_time = 1.day.to_i
  end
end

# User model
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher
  devise :database_authenticatable, :registerable,
         :jwt_authenticatable, jwt_revocation_strategy: self
end

# In API controllers — current_user is set by Devise JWT
class Api::V1::ArticlesController < ApplicationController
  before_action :authenticate_user!  # same helper, JWT-based
end
```

---

## Pundit Authorization

```ruby
# Gemfile
gem "pundit"

# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  include Pundit::Authorization
  after_action :verify_authorized, except: :index     # ensures authorize is called
  after_action :verify_policy_scoped, only: :index    # ensures policy_scope is called
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  private

  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_back(fallback_location: root_path)
  end
end

# app/policies/article_policy.rb
class ArticlePolicy < ApplicationPolicy
  # record = the Article being authorized
  # user = current_user (injected by Pundit)

  def index?
    true   # anyone can list
  end

  def show?
    record.published? || user == record.user || user.admin?
  end

  def create?
    user.present?   # must be logged in
  end

  def update?
    user == record.user || user.admin?
  end

  def destroy?
    user == record.user || user.admin?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if user.admin?
        scope.all
      elsif user
        scope.where(published: true).or(scope.where(user: user))
      else
        scope.where(published: true)
      end
    end
  end
end

# In controller
class ArticlesController < ApplicationController
  def index
    @articles = policy_scope(Article).includes(:user).recent   # uses Scope#resolve
  end

  def show
    @article = Article.find(params[:id])
    authorize @article                    # calls ArticlePolicy#show?
  end

  def update
    @article = Article.find(params[:id])
    authorize @article                    # calls ArticlePolicy#update?
    @article.update!(article_params)
  end
end
```

---

## Active Job Interface

```ruby
# rails generate job ProcessUpload
# app/jobs/process_upload_job.rb
class ProcessUploadJob < ApplicationJob
  queue_as :default
  retry_on ActiveRecord::Deadlocked, wait: 5.seconds, attempts: 3
  discard_on ActiveRecord::RecordNotFound

  def perform(upload_id)
    upload = Upload.find(upload_id)
    upload.process!
    UserMailer.upload_complete(upload.user, upload).deliver_later
  end
end

# Enqueue
ProcessUploadJob.perform_later(upload.id)             # async
ProcessUploadJob.set(wait: 5.minutes).perform_later(upload.id)   # delayed
ProcessUploadJob.set(queue: :critical).perform_later(upload.id)  # named queue
ProcessUploadJob.perform_now(upload.id)               # synchronous (testing)
```

---

## Sidekiq Setup

```ruby
# Gemfile
gem "sidekiq"
gem "sidekiq-cron"   # cron-style recurring jobs

# config/application.rb
config.active_job.queue_adapter = :sidekiq

# config/sidekiq.yml
:concurrency: 10
:queues:
  - [critical, 3]
  - [default, 2]
  - [mailers, 1]
  - [low, 1]

# Startup
bundle exec sidekiq -C config/sidekiq.yml

# Sidekiq Web UI (mount in routes)
require "sidekiq/web"
Rails.application.routes.draw do
  authenticate :user, ->(u) { u.admin? } do
    mount Sidekiq::Web => "/sidekiq"
  end
end

# Direct Sidekiq worker (when Active Job abstraction is too heavy)
class HardWorker
  include Sidekiq::Worker
  sidekiq_options queue: :critical, retry: 5

  def perform(user_id, message)
    user = User.find(user_id)
    user.send_notification(message)
  end
end

HardWorker.perform_async(user.id, "Your report is ready")
HardWorker.perform_in(2.hours, user.id, "Reminder")
```

---

## Recurring Jobs with sidekiq-cron

```ruby
# config/initializers/sidekiq_cron.rb
Sidekiq::Cron::Job.load_from_hash(
  "daily_digest" => {
    "cron"  => "0 8 * * *",          # daily at 8am UTC
    "class" => "DailyDigestJob"
  },
  "cleanup_expired" => {
    "cron"  => "0 2 * * *",          # daily at 2am UTC
    "class" => "CleanupExpiredTokensJob"
  }
)
```

---

## CanCanCan (Alternative to Pundit)

```ruby
# Gemfile
gem "cancancan"

# app/models/ability.rb
class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new  # guest user

    if user.admin?
      can :manage, :all
    else
      can :read, Article, published: true
      can :create, Article if user.persisted?
      can :update, Article, user_id: user.id
      can :destroy, Article, user_id: user.id
    end
  end
end

# In controller
def show
  @article = Article.find(params[:id])
  authorize! :read, @article   # raises CanCan::AccessDenied if not allowed
end
```

---

## Common Pitfalls

- **Devise + API mode** — Devise was designed for session-based auth. Use `devise-jwt` or a dedicated JWT library (Knock, jwt gem) for stateless APIs.
- **Pundit `verify_authorized`** — forgetting to call `authorize` in an action raises `Pundit::AuthorizationNotPerformedError`. This is the safety net — remove the `after_action` check only for actions that are intentionally public.
- **Sidekiq arguments must be serializable** — only pass primitive types (integers, strings, arrays, hashes) to `perform_later`/`perform_async`. Passing Active Record objects will fail on deserialization after the model changes. Pass `id` and look up in `perform`.
- **Jobs are not transactional** — if `perform_later` is called inside a database transaction that later rolls back, the job is already queued in Redis. Use `after_commit` callbacks or Sidekiq's `after_commit` option to ensure jobs only run after the transaction commits.
- **CanCanCan `load_and_authorize_resource`** — this before_action auto-loads and authorizes in one call, but it requires strict RESTful naming and can be confusing with custom actions. Pundit's explicit authorize calls are more transparent.

---

## Review Questions

1. Devise uses Warden under the hood. What is Warden and what does it provide that Devise builds on?
2. Pundit policies check permissions against `user` and `record`. Where does `user` come from in `authorize @article`? How would you pass a different user context?
3. Why should you never pass an Active Record object as a Sidekiq job argument? What should you pass instead?
4. Explain why a job enqueued inside a database transaction can cause a race condition, and how `after_commit` hooks or Sidekiq's transaction-aware enqueueing solves it.

---

#Ruby #Rails
