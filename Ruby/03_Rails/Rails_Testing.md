---
title: Rails Testing
aliases:
  - RSpec Rails
  - FactoryBot
  - Capybara
  - Rails Test Suite
tags: [Ruby, Rails, testing, RSpec, FactoryBot, Capybara]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Rails_Models_ActiveRecord]]"
  - "[[Rails_Controllers_and_Routing]]"
  - "[[Rails_Auth_Background_Jobs]]"
status: complete
---

# Rails Testing

> [!abstract] TL;DR
> Rails testing uses RSpec (describe/context/it/let/subject) with FactoryBot for test data, Faker for random values, Capybara for system (browser) tests, and VCR for HTTP mocking. `DatabaseCleaner` ensures test isolation. RSpec mocks (`double`, `instance_double`, `allow`/`expect`) stub collaborators for unit tests. The `rails_helper.rb` and `spec_helper.rb` files bootstrap the test environment.

---

## Intuition

**Analogy:** A good test suite is like a flight simulator — it exercises all the controls without leaving the ground. FactoryBot builds the aircraft (test data) with sensible defaults; RSpec describes the mission (spec); Capybara flies the plane (browser tests). The goal is confidence that real users get what they expect, without actually deploying to production to find out.

RSpec's `describe`/`context`/`it` structure mirrors how you think about behavior: "describe Article, context when published, it shows up in the published scope."

---

## RSpec Setup

```ruby
# Gemfile (test group)
group :development, :test do
  gem "rspec-rails"
  gem "factory_bot_rails"
  gem "faker"
  gem "database_cleaner-active_record"
end

group :test do
  gem "capybara"
  gem "selenium-webdriver"  # or "cuprite" for Chrome via CDP
  gem "vcr"
  gem "webmock"
end

# Install
rails generate rspec:install
# Creates: .rspec, spec/spec_helper.rb, spec/rails_helper.rb
```

```ruby
# spec/rails_helper.rb (key config)
require "spec_helper"
require "database_cleaner/active_record"

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods   # use create/build without FactoryBot.
  config.include Devise::Test::IntegrationHelpers, type: :request
  config.include Devise::Test::ControllerHelpers, type: :controller

  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.around(:each) do |example|
    DatabaseCleaner.cleaning { example.run }
  end
end
```

---

## RSpec Basics

```ruby
# spec/models/article_spec.rb
require "rails_helper"

RSpec.describe Article, type: :model do
  # subject — the object under test (default: described_class.new)
  subject(:article) { build(:article) }

  # let — lazy-evaluated, memoized per example
  let(:user) { create(:user) }
  let(:published_article) { create(:article, :published, user: user) }

  # Shared setup
  before(:each) { # runs before each example }
  before(:all)  { # runs once before all examples in this describe }
  after(:each)  { # cleanup }

  describe "#valid?" do
    it "is valid with a title and body" do
      expect(article).to be_valid
    end

    it "is invalid without a title" do
      article.title = nil
      expect(article).to be_invalid
      expect(article.errors[:title]).to include("can't be blank")
    end

    it "requires a title of at least 5 characters" do
      article.title = "Hi"
      expect(article).to be_invalid
    end
  end

  describe "scopes" do
    context "when articles exist in the database" do
      before { create_list(:article, 3, :published, user: user) }
      before { create(:article, :draft, user: user) }

      it "returns only published articles" do
        expect(Article.published.count).to eq(3)
      end

      it "orders by created_at descending" do
        expect(Article.recent.first.created_at).to be >= Article.recent.last.created_at
      end
    end
  end

  describe "associations" do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:comments).dependent(:destroy) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_length_of(:title).is_at_least(5).is_at_most(255) }
    it { is_expected.to validate_uniqueness_of(:slug) }
  end
end
```

---

## FactoryBot

```ruby
# spec/factories/articles.rb
FactoryBot.define do
  factory :article do
    association :user

    title       { Faker::Lorem.sentence(word_count: 5) }
    body        { Faker::Lorem.paragraphs(number: 3).join("\n\n") }
    published   { false }
    slug        { title.parameterize }

    # Traits — named variations
    trait :published do
      published   { true }
      published_at { 1.day.ago }
    end

    trait :draft do
      published { false }
    end

    trait :with_tags do
      after(:create) do |article|
        create_list(:tag, 3, articles: [article])
      end
    end

    trait :with_comments do
      after(:create) do |article|
        create_list(:comment, 5, article: article)
      end
    end
  end
end

# Usage
build(:article)                         # not saved to DB
create(:article)                        # saved to DB
build(:article, :published)             # trait
create_list(:article, 5, :published)    # 5 published articles
attributes_for(:article)                # hash of attributes (no DB, no associations)
build_stubbed(:article)                 # stubbed object (no DB)
```

---

## Request Specs (Integration Tests)

```ruby
# spec/requests/articles_spec.rb
require "rails_helper"

RSpec.describe "Articles API", type: :request do
  let(:user)    { create(:user) }
  let(:headers) { { "Authorization" => "Bearer #{user.generate_jwt}" } }

  describe "GET /api/v1/articles" do
    before { create_list(:article, 3, :published, user: user) }

    it "returns published articles" do
      get "/api/v1/articles", headers: headers

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json["data"].length).to eq(3)
    end

    it "returns 401 without auth token" do
      get "/api/v1/articles"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /api/v1/articles" do
    let(:params) { { article: { title: "Hello World", body: "..." } } }

    it "creates an article" do
      expect {
        post "/api/v1/articles", params: params, headers: headers, as: :json
      }.to change(Article, :count).by(1)

      expect(response).to have_http_status(:created)
    end

    it "returns errors for invalid params" do
      post "/api/v1/articles", params: { article: { title: "" } }, headers: headers, as: :json
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
```

---

## Mocks and Doubles

```ruby
# spec/services/payment_service_spec.rb
require "rails_helper"

RSpec.describe PaymentService do
  let(:user)     { build_stubbed(:user) }
  let(:gateway)  { instance_double(StripeGateway) }
  subject(:service) { described_class.new(user, gateway: gateway) }

  describe "#charge" do
    context "when payment succeeds" do
      before do
        allow(gateway).to receive(:charge).with(amount: 100, currency: "USD")
                                          .and_return({ status: "success", id: "ch_123" })
      end

      it "returns the charge id" do
        result = service.charge(amount: 100)
        expect(result[:id]).to eq("ch_123")
      end

      it "saves the transaction" do
        expect { service.charge(amount: 100) }.to change(Transaction, :count).by(1)
      end
    end

    context "when payment fails" do
      before do
        allow(gateway).to receive(:charge).and_raise(StripeGateway::ChargeError, "Card declined")
      end

      it "raises PaymentError" do
        expect { service.charge(amount: 100) }.to raise_error(PaymentError, "Card declined")
      end
    end
  end
end
```

---

## Capybara System Tests

```ruby
# spec/system/articles_spec.rb
require "rails_helper"

RSpec.describe "Article management", type: :system do
  let(:user) { create(:user) }

  before { sign_in user }   # Devise test helper

  describe "creating an article" do
    it "successfully creates and displays the article" do
      visit new_article_path

      fill_in "Title", with: "My First Post"
      fill_in "Body",  with: "This is the article body."
      check "Published"
      click_button "Create Article"

      expect(page).to have_content("Article created successfully.")
      expect(page).to have_content("My First Post")
      expect(current_path).to eq(article_path(Article.last))
    end

    it "shows errors for invalid input" do
      visit new_article_path
      click_button "Create Article"   # submit empty form

      expect(page).to have_content("Title can't be blank")
      expect(page).to have_current_path(articles_path)  # stays on form
    end
  end
end
```

---

## VCR for HTTP Tests

```ruby
# spec/support/vcr.rb
require "vcr"
VCR.configure do |config|
  config.cassette_library_dir = "spec/vcr_cassettes"
  config.hook_into :webmock
  config.configure_rspec_metadata!
  config.filter_sensitive_data("<API_KEY>") { ENV["GITHUB_API_KEY"] }
end

# Usage in spec
RSpec.describe GitHubService do
  it "fetches repositories", :vcr do
    # First run: makes real HTTP, saves to cassette
    # Subsequent runs: replays from cassette
    repos = described_class.new.fetch_repos("rails")
    expect(repos).not_to be_empty
  end
end
```

---

## Common Pitfalls

- **`create` vs `build` in unit tests** — using `create` when `build` suffices hits the database unnecessarily and slows tests. Use `build` or `build_stubbed` for unit tests that don't need persistence.
- **Factory pollution** — `create_list` inside `describe` blocks without `before` means those records persist across examples (without DatabaseCleaner). Always wrap creation in `before` or `let`.
- **`instance_double` vs `double`** — `instance_double` verifies that the methods exist on the real class (interface verification). Use it to catch mismatches between mocks and real interfaces.
- **System test flakiness** — Capybara system tests are slow and can be flaky with timing issues. Use `have_content` (which auto-waits) instead of `find(...).text` (which is immediate). Set `Capybara.default_max_wait_time`.
- **VCR cassette staleness** — cassette files capture API responses at a point in time. Delete and re-record periodically or when the API schema changes.

---

## Review Questions

1. What is the difference between `create`, `build`, `build_stubbed`, and `attributes_for` in FactoryBot? When should each be used?
2. Explain the difference between `allow(obj).to receive(:method)` and `expect(obj).to receive(:method)`. What happens if the expected call doesn't occur?
3. Why use `instance_double` instead of `double`? Give a scenario where `double` passes but the code is still broken.
4. What does `DatabaseCleaner` do and why is it needed when using RSpec with a real database? What is the difference between `:transaction` and `:truncation` strategies?

---

#Ruby #Rails
