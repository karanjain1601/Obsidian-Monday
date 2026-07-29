---
title: Ruby Overview
aliases:
  - Ruby Introduction
  - Ruby Language
  - MRI Ruby
tags: [Ruby, Rails, overview, fundamentals]
domain: Ruby
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Ruby_Types_and_Variables]]"
  - "[[Bundler_and_Gems]]"
  - "[[Rails_Overview]]"
status: complete
---

# Ruby Overview

> [!abstract] TL;DR
> Ruby is a dynamic, object-oriented language designed by Yukihiro "Matz" Matsumoto and optimized for developer happiness — every design decision prioritizes expressiveness and joy over raw performance. Everything is an object, code reads like natural language, and the ecosystem is dominated by Rails, the web framework that popularized Convention over Configuration.

---

## Intuition

**Analogy:** Ruby is a language designed to make the programmer smile. Where C gives you a chisel and says "good luck," and Java gives you a blueprint factory, Ruby gives you a thoughtful assistant who anticipates what you mean and handles the ceremony. The tradeoff: the assistant has opinions (strong conventions), and when you fight them, productivity suffers. Work with the idioms and Ruby code reads almost like English prose.

Matz's guiding principle: "Ruby is designed to make programmers happy." This is not marketing — it has architectural consequences. Blocks, open classes, symbol shortcuts, and sensible defaults all exist because they remove friction. The language trusts the programmer.

---

## Ruby Philosophy and Design Principles

Matz released Ruby in 1995, influenced by Perl, Smalltalk, Eiffel, Ada, and Lisp. Key design tenets:

- **Principle of Least Surprise (POLS):** Behavior should match programmer intuition. `"hello".length` returns `5`, not an error or a Promise.
- **Everything is an object:** `1.class` → `Integer`, `nil.class` → `NilClass`, `true.class` → `TrueClass`. There is no primitive/object split.
- **Expressiveness over verbosity:** You write what you mean. `3.times { print "Ruby! " }`, `5.minutes.from_now`, `users.select(&:active?)`.
- **Duck typing:** If an object responds to the right methods, it works — no interface declarations needed.

```ruby
# Ruby's expressiveness in practice
["alice", "bob", "charlie"].map(&:capitalize).join(", ")
# => "Alice, Bob, Charlie"

(1..10).select(&:odd?).sum
# => 25

5.times { puts "Hello, Ruby!" }
```

---

## Ruby Implementations

| Implementation | Runtime | Key Use Case |
|---|---|---|
| **MRI (CRuby)** | C | Reference implementation; most gems work here |
| **JRuby** | JVM | True parallelism (no GIL), Java interop |
| **TruffleRuby** | GraalVM | High performance, compatible with MRI |
| **mruby** | Embedded C | Microcontrollers, embedded systems |

MRI has a **Global Interpreter Lock (GIL)** — only one thread runs Ruby code at a time. I/O threads can run concurrently, but CPU-bound parallelism requires multiple processes or JRuby/TruffleRuby.

---

## REPL and Development Tools

```bash
# IRB — Interactive Ruby (built-in)
irb
> 2 + 2          # => 4
> "hello".upcase # => "HELLO"

# Pry — enhanced REPL with debugging
gem install pry
pry
> show-method Array#map
> ls String       # list all String methods
> binding.pry     # breakpoint inside code
```

---

## Package Management: RubyGems and Bundler

**RubyGems** is Ruby's package manager. A gem is a packaged library:

```bash
gem install rails        # install globally
gem list                 # list installed gems
gem search nokogiri      # search rubygems.org
```

**Bundler** manages per-project dependencies via `Gemfile`:

```ruby
# Gemfile
source "https://rubygems.org"

ruby "3.3.0"

gem "rails", "~> 7.1"          # ~> means >= 7.1, < 8.0
gem "pg", ">= 1.5"
gem "puma", "~> 6.0"

group :development, :test do
  gem "rspec-rails"
  gem "factory_bot_rails"
  gem "pry-rails"
end

group :test do
  gem "capybara"
  gem "faker"
end
```

```bash
bundle install          # install all gems, creates Gemfile.lock
bundle exec rails s     # run rails in Bundler context
bundle update rails     # update only rails and its dependencies
bundle open nokogiri    # open gem source in editor
```

---

## Ruby Version Management

Three main tools for managing Ruby versions across projects:

```bash
# rbenv (lightweight, recommended)
rbenv install 3.3.0
rbenv global 3.3.0          # set default
rbenv local 3.2.2           # .ruby-version file in project dir

# rvm (feature-rich, uses shell functions)
rvm install 3.3.0
rvm use 3.3.0 --default

# mise (modern, polyglot — also handles Node, Python)
mise install ruby@3.3.0
mise use ruby@3.3.0
```

---

## The Rails Ecosystem

Rails (Ruby on Rails) is the dominant Ruby web framework. It introduced "Convention over Configuration" to the mainstream and pioneered ideas later adopted by Django, Laravel, and Spring Boot:

- **Active Record** — ORM with database schema inference
- **Action Controller** — RESTful controllers
- **Action View** — ERB templates and helpers
- **Active Job** — background job interface
- **Action Cable** — WebSocket support
- **Active Storage** — file upload abstraction

Rails commands give you a consistent workflow:
```bash
rails new blog --database=postgresql
rails generate model Post title:string body:text
rails db:migrate
rails server                    # starts Puma on :3000
rails console                   # loads app in IRB/Pry
rails routes                    # lists all registered routes
```

---

## Common Pitfalls

- **Gemfile.lock must be committed** — it pins exact versions for reproducible builds across machines and CI. Never add it to `.gitignore` for applications (only for libraries/gems).
- **System Ruby vs managed Ruby** — modifying the system Ruby requires `sudo` and can break OS tools. Always use rbenv/rvm/mise for development.
- **GIL misunderstanding** — Ruby threads work well for I/O-bound concurrency (database queries, HTTP calls). For CPU-bound parallelism, use `fork`-based servers (Puma) or switch to JRuby.
- **`bundle exec` prefix** — running `rails` directly may use the wrong gem version if multiple are installed globally. Always prefix with `bundle exec` or use Bundler's `binstubs`.

---

## Review Questions

1. What does "optimized for developer happiness" actually mean architecturally? Give two Ruby language features that exist specifically because of this principle.
2. What is the GIL in MRI Ruby and when is it a practical concern? When does it NOT matter?
3. Explain the difference between `Gemfile` and `Gemfile.lock`. Which should be committed to version control and why?
4. A junior developer installed Rails globally with `gem install rails` but the project uses Rails 7.1 while their system has Rails 6.1. How would they ensure the correct version runs?

---

#Ruby #Rails
