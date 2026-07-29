---
title: Rails Models and Active Record
aliases:
  - Active Record
  - Rails ORM
  - Rails Migrations
  - Rails Associations
tags: [Ruby, Rails, active-record, models, migrations, associations]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rails_Overview]]"
  - "[[Rails_Controllers_and_Routing]]"
  - "[[Rails_Testing]]"
status: complete
---

# Rails Models and Active Record

> [!abstract] TL;DR
> Active Record is Rails' ORM — it maps Ruby classes to database tables using naming conventions, provides a fluent query interface (`where`/`order`/`includes`/`joins`), manages schema changes through migrations, and enforces business rules through validations and callbacks. The `includes` method solves the N+1 query problem by eager-loading associations.

---

## Intuition

**Analogy:** Active Record is like a bilingual secretary who speaks both Ruby and SQL fluently. You say `Article.where(published: true).order(created_at: :desc).limit(10)` and she translates to `SELECT * FROM articles WHERE published = true ORDER BY created_at DESC LIMIT 10`, fetches the results, and hands you an array of `Article` objects. The translation is lazy — nothing happens until you actually need the data.

The N+1 problem is the most common performance mistake: loading 100 articles then calling `article.author.name` in a loop fires 101 queries. `includes(:author)` fetches all authors in one extra query.

---

## Model and Migration

```ruby
# Generate model (creates model file AND migration)
# rails generate model Article title:string body:text published:boolean user:references

# db/migrate/20260729_create_articles.rb
class CreateArticles < ActiveRecord::Migration[7.1]
  def change
    create_table :articles do |t|
      t.string  :title,     null: false
      t.text    :body
      t.boolean :published, default: false, null: false
      t.string  :slug,      null: false
      t.references :user,   null: false, foreign_key: true

      t.timestamps           # adds created_at and updated_at
    end

    add_index :articles, :slug, unique: true
    add_index :articles, [:published, :created_at]
  end
end

# Add column to existing table
class AddViewCountToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :view_count, :integer, default: 0, null: false
    add_index  :articles, :view_count
  end
end
```

---

## Model Definition

```ruby
# app/models/article.rb
class Article < ApplicationRecord
  # Associations
  belongs_to :user
  has_many   :comments,  dependent: :destroy
  has_many   :taggings,  dependent: :destroy
  has_many   :tags,      through: :taggings
  has_one    :thumbnail, dependent: :destroy

  # Validations
  validates :title, presence: true, length: { minimum: 5, maximum: 255 }
  validates :slug,  presence: true, uniqueness: true,
                    format: { with: /\A[a-z0-9-]+\z/, message: "only lowercase letters, digits, hyphens" }
  validates :body,  presence: true
  validates :user,  presence: true

  # Scopes
  scope :published, -> { where(published: true) }
  scope :recent,    -> { order(created_at: :desc) }
  scope :popular,   -> { order(view_count: :desc) }
  scope :by_tag,    ->(tag_name) { joins(:tags).where(tags: { name: tag_name }) }

  # Callbacks
  before_validation :generate_slug, if: -> { slug.blank? }
  after_create      :notify_subscribers
  before_destroy    :check_references

  private

  def generate_slug
    self.slug = title.parameterize if title.present?
  end

  def notify_subscribers
    NotifySubscribersJob.perform_later(id) if published?
  end

  def check_references
    if comments.where(featured: true).any?
      throw :abort   # cancel the destroy
    end
  end
end
```

---

## Query Interface

```ruby
# Basic queries — all return ActiveRecord::Relation (lazy)
Article.all
Article.where(published: true)
Article.where("view_count > ?", 100)              # ? placeholders prevent SQL injection
Article.where(published: true, user_id: [1, 2, 3])
Article.where.not(published: false)
Article.order(created_at: :desc)
Article.limit(10).offset(20)
Article.select(:id, :title, :created_at)          # only fetch needed columns

# Chainable
Article.published.recent.limit(10)                # chains scopes

# Finders
Article.find(1)                    # raises ActiveRecord::RecordNotFound
Article.find_by(slug: "hello")     # returns nil if not found
Article.find_by!(slug: "hello")    # raises RecordNotFound

# Aggregates
Article.count
Article.published.count
Article.maximum(:view_count)
Article.average(:view_count)
Article.sum(:view_count)

# Existence
Article.exists?(id: 1)
Article.published.exists?

# Pluck — returns array of values (no model instantiation — fast)
Article.published.pluck(:id, :title)   # => [[1, "First"], [2, "Second"]]
Article.pluck(:user_id).uniq           # distinct user ids

# Group and count
Article.group(:published).count        # => {false=>3, true=>7}
Article.published.group("DATE(created_at)").count  # daily breakdown

# Joins vs includes
# joins — SQL INNER JOIN (no eager loading — still N+1 if you access association)
Article.joins(:user).where(users: { admin: true })

# includes — eager loading (no N+1)
Article.includes(:user, :tags).published.recent.limit(10)
# Executes: SELECT articles...; SELECT users WHERE id IN (...); SELECT tags...

# eager_load — forces LEFT OUTER JOIN (use when filtering on association column)
Article.eager_load(:user).where(users: { admin: true })
```

---

## Associations

```ruby
# belongs_to (adds user_id foreign key to articles)
class Comment < ApplicationRecord
  belongs_to :article                      # required by default in Rails 5+
  belongs_to :user, optional: true         # make optional
  belongs_to :article, counter_cache: true # updates articles.comments_count
end

# has_many / has_one
class User < ApplicationRecord
  has_many :articles, dependent: :destroy  # destroy user → destroy articles
  has_many :comments, through: :articles   # indirect association
  has_one  :profile,  dependent: :destroy
end

# has_many :through — join model with extra data
class Article < ApplicationRecord
  has_many :taggings
  has_many :tags, through: :taggings
end

class Tagging < ApplicationRecord
  belongs_to :article
  belongs_to :tag
  # Can add extra columns: position, created_by, etc.
end

# has_and_belongs_to_many — simple M2M (no extra columns on join table)
class Article < ApplicationRecord
  has_and_belongs_to_many :categories
end

# Polymorphic associations
class Comment < ApplicationRecord
  belongs_to :commentable, polymorphic: true
end
class Article < ApplicationRecord
  has_many :comments, as: :commentable
end
class Video < ApplicationRecord
  has_many :comments, as: :commentable
end
```

---

## Callbacks

```ruby
class Article < ApplicationRecord
  # Callback order for save:
  # before_validation → validate → after_validation →
  # before_save → before_create/update → after_create/update → after_save → after_commit

  before_save   :normalize_title
  after_save    :invalidate_cache
  after_create  :send_welcome_email
  after_destroy :remove_from_search_index
  after_commit  :broadcast_change, on: [:create, :update]  # after DB transaction commits

  private

  def normalize_title
    self.title = title.strip.squeeze(" ") if title.present?
  end

  def invalidate_cache
    Rails.cache.delete("article_#{id}")
  end

  def broadcast_change
    ActionCable.server.broadcast("articles", { id: id, action: "updated" })
  end
end
```

---

## N+1 Query Problem

```ruby
# BAD — 1 query for articles + 1 query per article for user = N+1
articles = Article.published.limit(20)
articles.each do |article|
  puts "#{article.title} by #{article.user.name}"  # N queries for user
end

# GOOD — 2 queries total
articles = Article.published.includes(:user).limit(20)
articles.each do |article|
  puts "#{article.title} by #{article.user.name}"  # uses preloaded data
end

# GOOD for filtering on joined table
articles = Article.published
                  .eager_load(:user)
                  .where(users: { verified: true })
                  .limit(20)

# Bullet gem — automatically detects N+1 in development
# config/environments/development.rb
# config.after_initialize { Bullet.enable = true; Bullet.rails_logger = true }
```

---

## Common Pitfalls

- **N+1 queries** — the most common Rails performance bug. Always use `includes` when iterating over associations. Detect with the `bullet` gem.
- **`dependent: :destroy` on large associations** — destroying a user with `has_many :posts, dependent: :destroy` loads all posts into memory and calls `destroy` on each (triggering callbacks). Use `dependent: :delete_all` for bulk deletion without callbacks when callbacks are not needed.
- **Callbacks for cross-model side effects** — `after_save` that emails users or hits external APIs makes tests slow and introduces surprising failures. Prefer service objects for multi-step operations.
- **`validates :uniqueness` race condition** — validates uniqueness at the application level, not the database level. Two concurrent requests can both pass the validation and insert duplicate rows. Always back uniqueness validations with a database UNIQUE index.
- **`find` vs `find_by`** — `find(id)` raises `ActiveRecord::RecordNotFound` (returns 404 via Rails' rescue_from); `find_by(id: id)` returns nil. Choose based on whether a missing record is an error or a normal case.

---

## Review Questions

1. Explain the N+1 problem with a concrete example. What is the difference between `includes` and `eager_load`? When does `eager_load` perform better than `includes`?
2. A `validates :uniqueness` check passes, but the database still gets duplicate rows under concurrent load. Why, and what is the correct fix?
3. Explain the difference between `dependent: :destroy` and `dependent: :delete_all`. When is `delete_all` preferred?
4. Why can `after_save` callbacks cause problems in test suites? What is the recommended alternative for side effects that involve external services?

---

#Ruby #Rails
