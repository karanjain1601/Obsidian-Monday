---
title: Bundler and Gems
aliases:
  - Ruby Gems
  - Gemfile
  - Bundler
  - RubyGems
tags: [Ruby, Rails, bundler, gems, gemfile, dependencies]
domain: Ruby
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Ruby_Overview]]"
  - "[[Ruby_Performance_and_Tooling]]"
  - "[[Sinatra_and_API_Alternatives]]"
status: complete
---

# Bundler and Gems

> [!abstract] TL;DR
> RubyGems is Ruby's package manager; Bundler manages per-project gem dependencies through `Gemfile` and `Gemfile.lock`. The Gemfile specifies version constraints; the lockfile pins exact resolved versions for reproducible builds. Key ecosystem gems include Puma (server), Faraday (HTTP), Nokogiri (HTML/XML), and Pagy (pagination). Publishing a gem requires a `gemspec` file.

---

## Intuition

**Analogy:** RubyGems is like an app store. Bundler is like `package.json` + `package-lock.json` combined — it resolves all gems and their transitive dependencies to exact versions, writes them to `Gemfile.lock`, and ensures every developer and CI server runs with identical gems. `bundle exec rails s` runs `rails` with exactly the versions in the lockfile, ignoring any other versions installed globally.

---

## Gemfile Anatomy

```ruby
# Gemfile
source "https://rubygems.org"

ruby "3.3.0"   # lock Ruby version (rbenv/.ruby-version reads this)

# Core application gems
gem "rails",        "~> 7.1"       # ~> 7.1 means >= 7.1, < 8.0
gem "pg",           ">= 1.5"       # >= 1.5 (any future version)
gem "puma",         "~> 6.0"       # web server
gem "redis",        "~> 5.0"       # Redis client
gem "sidekiq",      "~> 7.0"       # background jobs
gem "devise",       "~> 4.9"       # authentication
gem "pundit",       "~> 2.3"       # authorization
gem "pagy",         "~> 6.0"       # pagination (faster than kaminari/will_paginate)
gem "faraday",      "~> 2.0"       # HTTP client (composable middleware)
gem "nokogiri"                      # no version constraint (latest)

# Git source — use unreleased version
gem "some_gem", git: "https://github.com/user/some_gem", branch: "main"

# Local path — local development of a gem
gem "my_local_gem", path: "../my_local_gem"

group :development, :test do
  gem "rspec-rails",         "~> 6.0"
  gem "factory_bot_rails",   "~> 6.2"
  gem "faker",               "~> 3.0"
  gem "pry-rails"
  gem "debug"
end

group :development do
  gem "rubocop",             require: false   # don't require at boot
  gem "rubocop-rails",       require: false
  gem "bullet"               # N+1 detector
  gem "rack-mini-profiler"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"
  gem "vcr"
  gem "webmock"
  gem "database_cleaner-active_record"
end

group :production do
  gem "sentry-ruby"
  gem "sentry-rails"
end
```

---

## Version Constraint Operators

| Operator | Meaning | Example |
|---|---|---|
| `"1.0"` | Exact version | `gem "rails", "7.1.0"` |
| `">= 1.0"` | Greater than or equal | any 1.0+ |
| `"~> 1.0"` | Pessimistic: >= 1.0, < 2.0 | patch/minor updates |
| `"~> 1.0.0"` | Pessimistic: >= 1.0.0, < 1.1 | patch updates only |
| `"!= 1.2"` | Not this version | exclude buggy release |

---

## Bundler Commands

```bash
bundle install              # install all gems, write/update Gemfile.lock
bundle install --without production  # skip production group
bundle update               # update ALL gems to latest allowed by constraints
bundle update rails         # update only rails (and its deps)
bundle update --conservative  # update only the specified gem, not deps

bundle exec rails s         # run command in bundler context (correct gem versions)
bundle exec rspec           # run rspec with bundled gems
bundle exec rake db:migrate

bundle check               # verifies Gemfile.lock is up to date
bundle outdated             # list gems with newer versions available
bundle info nokogiri        # show gem details
bundle open nokogiri        # open gem source in $EDITOR
bundle show rails           # print path to gem

# Binstubs — wrappers in bin/ that auto-use bundler
bundle binstubs rspec-core  # creates bin/rspec
bin/rspec spec/             # no bundle exec needed
```

---

## Gemfile.lock

```
# Gemfile.lock (auto-generated — do NOT edit by hand)
GEM
  remote: https://rubygems.org/
  specs:
    actioncable (7.1.3)
      actionpack (= 7.1.3)
      ...
    rails (7.1.3)
      actioncable (= 7.1.3)
      actionmailer (= 7.1.3)
      ...

BUNDLED WITH
   2.5.3

# Rule: COMMIT Gemfile.lock for applications (reproducible builds)
#       DO NOT commit Gemfile.lock for libraries/gems (broad compatibility)
```

---

## Popular Gems Reference

| Category | Gem | Purpose |
|---|---|---|
| Web server | `puma` | Multi-threaded Rack server |
| HTTP client | `faraday`, `httparty` | Making HTTP requests with middleware |
| HTML parsing | `nokogiri` | Parse HTML/XML (used by many gems) |
| File upload | `activestorage`, `carrierwave` | Upload to disk/S3 |
| Pagination | `pagy`, `kaminari` | Paginate ActiveRecord collections |
| Analytics | `ahoy_matey` | User activity tracking |
| Admin UI | `administrate`, `activeadmin` | Auto-generated admin panels |
| Full-text search | `pg_search`, `elasticsearch-rails` | Search features |
| Money | `money-rails` | Currency arithmetic |
| State machine | `aasm` | Model lifecycle state machines |
| Decorator | `draper` | View-logic objects for models |
| Serializer | `jsonapi-serializer` | JSON:API output |
| Auth | `devise`, `rodauth` | Authentication |
| Authorization | `pundit`, `cancancan` | Role/policy authorization |
| SMS | `twilio-ruby` | Send SMS |
| PDF | `prawn`, `wicked_pdf` | Generate PDFs |
| Background | `sidekiq`, `good_job` | Async job processing |

---

## Building and Publishing a Gem

```ruby
# mygem.gemspec
Gem::Specification.new do |spec|
  spec.name          = "mygem"
  spec.version       = "1.0.0"
  spec.authors       = ["Alice"]
  spec.email         = ["alice@example.com"]

  spec.summary       = "A useful Ruby gem"
  spec.description   = "Longer description of what mygem does"
  spec.homepage      = "https://github.com/alice/mygem"
  spec.license       = "MIT"

  spec.required_ruby_version = ">= 3.0"

  spec.files         = Dir["lib/**/*", "LICENSE", "README.md"]
  spec.require_paths = ["lib"]

  spec.add_dependency "faraday", "~> 2.0"
  spec.add_development_dependency "rspec", "~> 3.12"
end
```

```bash
gem build mygem.gemspec         # creates mygem-1.0.0.gem
gem push mygem-1.0.0.gem        # publish to rubygems.org (requires account)
gem yank mygem -v 1.0.0         # retract a release
```

---

## Common Pitfalls

- **`bundle update` vs `bundle install`** — `bundle install` installs what the lockfile says; `bundle update` re-resolves all constraints and may upgrade gems. Only run `bundle update` intentionally.
- **Not committing `Gemfile.lock`** — without the lockfile, `bundle install` may pick different versions on different machines, causing "works on my machine" bugs in CI.
- **`require: false` for dev gems** — gems only used on the command line (rubocop, guard) should have `require: false` so they don't slow down application boot.
- **Version constraint too loose** — `gem "rails"` with no constraint accepts major version bumps. Use `~>` to limit to patch/minor updates: `gem "rails", "~> 7.1"`.
- **Conflicting transitive dependencies** — two gems requiring incompatible versions of a shared dependency cause `Bundler::GemConflict`. Use `bundle update` cautiously and check for a newer version of one gem.

---

## Review Questions

1. What is the difference between `~> 7.1` and `~> 7.1.0` as version constraints? Which would allow upgrading from 7.1.0 to 7.2.0?
2. Why should `Gemfile.lock` be committed in an application but NOT committed for a gem library?
3. What does `bundle exec` do? When would omitting it cause a bug?
4. A dependency conflict prevents `bundle install` from resolving. How would you diagnose which gems are conflicting and what are your options?

---

#Ruby #Rails
