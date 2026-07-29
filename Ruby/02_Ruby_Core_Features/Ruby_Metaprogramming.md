---
title: Ruby Metaprogramming
aliases:
  - Ruby open classes
  - Ruby monkey patching
  - Ruby define_method
  - Ruby DSL
tags: [Ruby, Rails, metaprogramming, DSL, open-classes]
domain: Ruby
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Ruby_OOP]]"
  - "[[Ruby_Modules_and_Mixins]]"
  - "[[Ruby_Methods_and_Blocks]]"
status: complete
---

# Ruby Metaprogramming

> [!abstract] TL;DR
> Ruby metaprogramming is writing code that writes code — defining methods dynamically with `define_method`, dispatching through `send`, intercepting unknown calls with `method_missing`, and evaluating code in class/instance contexts with `class_eval`/`instance_eval`. Rails' entire DSL (`has_many`, `validates`, `before_action`) is built on these primitives. Power comes with responsibility: misuse creates unmaintainable, hard-to-debug code.

---

## Intuition

**Analogy:** Normal code is like building with pre-cut lumber. Metaprogramming is operating the sawmill — you shape the code itself. Rails uses this to let you write `has_many :posts` (a single method call that generates 15+ methods: `posts`, `posts=`, `posts.build`, `posts.create`, `posts.find`, etc.) without you writing any of those methods. The sawmill runs at class load time; the lumber is ready by runtime.

The key insight: in Ruby, a class is not a closed declaration. It's a live object you can poke at any time.

---

## Open Classes (Monkey Patching)

```ruby
# Ruby classes are always open — you can add methods to ANY class
class Integer
  def factorial
    return 1 if self <= 1
    self * (self - 1).factorial
  end

  def times_do_with_index
    i = 0
    while i < self
      yield i
      i += 1
    end
  end
end

5.factorial   # => 120
3.times_do_with_index { |i| puts i }

# Adding to String (Rails does this extensively)
class String
  def palindrome?
    self == self.reverse
  end

  def word_count
    split.size
  end
end

"racecar".palindrome?          # => true
"hello world ruby".word_count  # => 3

# Safe monkey patching with Refinements (Ruby 2.0+)
# Refinements scope monkey patches to specific files/modules
module StringExtensions
  refine String do
    def palindrome?
      self == self.reverse
    end
  end
end

# Only active where explicitly activated:
using StringExtensions
"racecar".palindrome?   # => true
# (In other files without 'using', String is unmodified)
```

---

## define_method

```ruby
# Generate methods dynamically — avoids repetitive def blocks
class User
  ROLES = %w[admin moderator editor viewer].freeze

  ROLES.each do |role|
    define_method("#{role}?") do
      @role == role
    end

    define_method("make_#{role}!") do
      @role = role
      self
    end
  end

  def initialize(name, role = "viewer")
    @name = name
    @role = role
  end
end

user = User.new("Alice", "admin")
user.admin?       # => true
user.moderator?   # => false
user.make_editor!
user.editor?      # => true
```

---

## send

```ruby
# send — call any method by name (bypasses private visibility)
class Calculator
  def add(a, b) = a + b
  private
  def secret_compute(n) = n * 42
end

calc = Calculator.new
calc.send(:add, 3, 4)            # => 7  (same as calc.add(3, 4))
calc.send(:secret_compute, 2)    # => 84 (bypasses private!)
calc.public_send(:add, 3, 4)     # => 7  (public_send respects visibility)
# calc.public_send(:secret_compute, 2)  # NoMethodError

# Dynamic dispatch — call a method based on runtime data
def process(model, action, *args)
  model.send(action, *args)
end
process(user, :activate!)
process(post, :publish!, Time.now)
```

---

## method_missing and respond_to_missing?

```ruby
class DynamicFinder
  def initialize(records)
    @records = records
  end

  # Intercepts calls like find_by_name, find_by_email, find_all_by_role
  def method_missing(name, *args)
    match = name.to_s.match(/\Afind_(all_)?by_(\w+)\z/)
    return super unless match

    find_all  = match[1] == "all_"
    attribute = match[2]

    results = @records.select { |r| r[attribute.to_sym] == args.first }
    find_all ? results : results.first
  end

  def respond_to_missing?(name, include_private = false)
    name.to_s.match?(/\Afind_(all_)?by_\w+\z/) || super
  end
end

users = [
  { name: "Alice", role: "admin" },
  { name: "Bob",   role: "user" },
  { name: "Carol", role: "admin" }
]
finder = DynamicFinder.new(users)
finder.find_by_name("Alice")         # => {name: "Alice", role: "admin"}
finder.find_all_by_role("admin")     # => [{name: "Alice",...}, {name: "Carol",...}]
finder.respond_to?(:find_by_email)   # => true (via respond_to_missing?)
```

---

## class_eval and instance_eval

```ruby
# class_eval (also module_eval) — evaluate code in the context of a class
# Useful for adding methods to a class from outside it
String.class_eval do
  def shout
    upcase + "!!!"
  end
end
"hello".shout   # => "HELLO!!!"

# With a string (dynamic method name)
method_name = "say_hello"
String.class_eval(<<~RUBY, __FILE__, __LINE__ + 1)
  def #{method_name}
    "Hello from \#{self}"
  end
RUBY
"world".say_hello   # => "Hello from world"

# instance_eval — evaluate in context of a specific object
# Used heavily in DSL design
class Config
  def initialize(&block)
    instance_eval(&block) if block_given?
  end

  def host(value = nil)
    value ? @host = value : @host
  end

  def port(value = nil)
    value ? @port = value : @port
  end

  def to_h
    { host: @host, port: @port }
  end
end

config = Config.new do
  host "localhost"
  port 5432
end
config.to_h   # => { host: "localhost", port: 5432 }
```

---

## DSLs with Blocks

Rails, RSpec, and Sinatra are all built on the DSL pattern:

```ruby
# Building a simple validation DSL
module Validatable
  def self.included(base)
    base.extend(ClassMethods)
    base.instance_variable_set(:@validations, [])
  end

  module ClassMethods
    def validate(method_name = nil, &block)
      if block_given?
        @validations << block
      else
        @validations << method_name
      end
    end

    def validations
      @validations
    end
  end

  def valid?
    self.class.validations.all? do |v|
      v.is_a?(Symbol) ? send(v) : instance_eval(&v)
    end
  end
end

class User
  include Validatable

  attr_accessor :name, :age

  validate { !name.nil? && !name.empty? }
  validate { age.is_a?(Integer) && age >= 0 }

  def initialize(name, age)
    @name = name
    @age  = age
  end
end

User.new("Alice", 30).valid?   # => true
User.new("", -1).valid?        # => false
```

---

## ObjectSpace and Introspection

```ruby
# List all instances of a class
ObjectSpace.each_object(String) { |s| puts s if s.frozen? }
ObjectSpace.count_objects[:T_STRING]  # count of string objects

# Introspection methods
String.instance_methods(false)  # methods defined on String (not inherited)
"hello".methods.sort            # all methods on this instance
User.ancestors                  # inheritance + mixin chain
User.instance_method(:greet)    # returns UnboundMethod

# const_get / const_set
Object.const_get("String")      # => String (dynamic class lookup)
module_name = "Enumerable"
Object.const_get(module_name).instance_methods.count  # => 59
```

---

## Common Pitfalls

- **Monkey patching breaks gems** — if you add `String#size` and a gem also monkey patches it, one silently wins. Use refinements to scope patches, or compose behavior through inheritance/decoration instead.
- **`method_missing` performance** — Ruby walks the entire ancestor chain before calling `method_missing`. Heavy use with no caching is slow. Cache generated methods with `define_method` after first call.
- **`send` bypasses private** — use `public_send` when calling untrusted or user-provided method names to enforce visibility.
- **`class_eval` with string arguments** — dynamically evaluated strings are security vulnerabilities if they contain user input (code injection). Always prefer block form or sanitize inputs.
- **`instance_eval` changes `self`** — inside `instance_eval`, `self` is the receiver object. Helper methods defined in the outer scope become unavailable unless they're methods on the receiver.

---

## Review Questions

1. What is the difference between `class_eval` and `instance_eval`? What is `self` inside each?
2. Why should `respond_to_missing?` always accompany `method_missing`? What frameworks or utilities break without it?
3. A colleague uses `define_method` in a loop to generate 100 methods dynamically. Compare this approach to `method_missing` in terms of memory use, call speed, and maintainability.
4. What are refinements and why were they introduced? Give a scenario where a refinement is safer than open-class monkey patching.

---

#Ruby #Rails
