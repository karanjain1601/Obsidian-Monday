---
title: Ruby Methods and Blocks
aliases:
  - Ruby Blocks
  - Ruby Procs
  - Ruby Lambdas
  - Ruby Methods
tags: [Ruby, Rails, methods, blocks, procs, lambdas]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Ruby_Control_Flow]]"
  - "[[Ruby_OOP]]"
  - "[[Ruby_Enumerables_and_Collections]]"
status: complete
---

# Ruby Methods and Blocks

> [!abstract] TL;DR
> Ruby methods support default arguments, keyword arguments, and splat operators (`*args`, `**kwargs`). Blocks are anonymous closures passed to methods via `do...end` or `{...}`; the receiving method calls them with `yield`. Procs and lambdas are first-class block objects — they differ critically in how they handle `return` and arity enforcement. Understanding these is key to writing idiomatic Ruby.

---

## Intuition

**Analogy:** A Ruby block is like handing someone a recipe card while asking them to cook dinner. The method decides *when* and *how many times* to use the recipe (`yield`). A Proc is the same recipe stored in a variable so you can hand it to multiple cooks. A lambda is a stricter recipe that refuses to start unless you provide exactly the right ingredients.

The block/yield pattern is what makes Ruby's collection methods (`map`, `each`, `select`) so elegant — you pass behavior as data, and the method handles the iteration details.

---

## Method Definition

```ruby
# Basic method
def greet(name)
  "Hello, #{name}!"   # implicit return — last expression is returned
end

# Default arguments
def connect(host, port = 5432, timeout = 30)
  "#{host}:#{port} (timeout: #{timeout}s)"
end
connect("localhost")            # => "localhost:5432 (timeout: 30s)"
connect("db.prod.com", 3306)    # => "db.prod.com:3306 (timeout: 30s)"

# Keyword arguments (Ruby 2.0+)
def create_user(name:, age:, role: "user")
  { name: name, age: age, role: role }
end
create_user(name: "Alice", age: 30)
create_user(age: 25, name: "Bob", role: "admin")  # order doesn't matter

# Splat operators
def log(level, *messages)          # *args collects extra positional args
  messages.each { |msg| puts "[#{level}] #{msg}" }
end
log("INFO", "Server started", "Listening on port 3000")

def configure(**options)            # **kwargs collects keyword args
  options.each { |k, v| puts "#{k} = #{v}" }
end
configure(host: "localhost", port: 5432)

# Combined
def build(type, *args, debug: false, **opts)
  # type: String, args: Array, debug: Boolean, opts: Hash
end
```

---

## Method Visibility

```ruby
class BankAccount
  def initialize(balance)
    @balance = balance
  end

  def deposit(amount)
    validate_amount!(amount)     # can call private method from public
    @balance += amount
  end

  def balance
    @balance
  end

  protected

  def transfer_to(other_account, amount)
    # accessible from subclasses and same-class instances
    @balance -= amount
    other_account.receive(amount)
  end

  private

  def validate_amount!(amount)
    raise ArgumentError, "Amount must be positive" unless amount.positive?
  end

  # private method shorthand (Ruby 2.7+)
  private def secret_pin
    1234
  end
end

account = BankAccount.new(100)
account.deposit(50)           # works
# account.validate_amount!(10) # NoMethodError: private method called
```

---

## Blocks

```ruby
# Block with do...end (multi-line)
[1, 2, 3].each do |n|
  doubled = n * 2
  puts doubled
end

# Block with {} (single-line, higher precedence)
[1, 2, 3].map { |n| n ** 2 }   # => [1, 4, 9]

# yield — calls the block from inside a method
def repeat(n)
  n.times { yield }
end
repeat(3) { puts "Hello!" }   # prints "Hello!" 3 times

# yield with arguments
def transform(value)
  yield(value) if block_given?
end
transform(5) { |n| n * 10 }   # => 50
transform(5)                   # => nil (block_given? guards yield)

# Capturing the block as an explicit parameter
def run_with_logging(&block)
  puts "Starting..."
  result = block.call
  puts "Done. Result: #{result}"
  result
end
run_with_logging { 42 }
```

---

## Procs vs Lambdas

Both are Proc objects, but lambdas enforce arity and have different `return` semantics:

```ruby
# Proc
doubler = Proc.new { |n| n * 2 }
doubler = proc { |n| n * 2 }   # shorthand
doubler.call(5)   # => 10
doubler.(5)       # => 10  (alternative call syntax)
doubler[5]        # => 10  (bracket call syntax)

# Lambda
square = lambda { |n| n ** 2 }
square = ->(n) { n ** 2 }       # stabby lambda (modern syntax)
square.call(4)    # => 16

# KEY DIFFERENCE 1: Arity enforcement
lenient = proc  { |a, b| [a, b] }
strict  = lambda { |a, b| [a, b] }
lenient.call(1)           # => [1, nil]  (missing args become nil)
# strict.call(1)          # ArgumentError: wrong number of arguments

# KEY DIFFERENCE 2: return behavior
def proc_return
  p = Proc.new { return "from proc" }
  p.call                            # returns FROM the METHOD
  "never reached"
end

def lambda_return
  l = lambda { return "from lambda" }
  l.call                            # returns from the lambda only
  "this IS reached"                 # => "this IS reached"
end

# Method objects
[1, -2, 3, -4].select(&method(:positive?))  # won't work, but:
[-1, 2, -3].map(&method(:puts))              # passes method as block

# Converting method to proc
[1, 2, 3].map(&method(:puts))    # calls puts for each element
["1", "2", "3"].map(&method(:Integer))  # converts strings to integers
```

---

## The `&` Operator

```ruby
# & on a symbol calls .to_proc → creates a method-call block
["hello", "world"].map(&:upcase)
# equivalent to: ["hello", "world"].map { |s| s.upcase }

# & on a Proc/Lambda converts it to a block
multiply = ->(n) { n * 3 }
[1, 2, 3].map(&multiply)   # => [3, 6, 9]

# & on a method reference
[1, -2, 3].select(&method(:positive?)) # needs to be a defined method

# Practical: passing blocks between methods
def apply_twice(value, &block)
  block.call(block.call(value))
end
apply_twice(2) { |n| n * 3 }   # => 18
```

---

## Common Pitfalls

- **`return` inside a Proc** — `return` from a Proc returns from the *enclosing method*, not just the Proc. This can cause `LocalJumpError` if the method has already returned. Use lambdas when you need contained returns.
- **Block vs Proc inconsistency** — `[1,2,3].map(&method(:puts))` returns `[nil, nil, nil]` because `puts` returns `nil`. Check what the block's return value actually is.
- **Forgetting `block_given?`** — calling `yield` when no block is passed raises `LocalJumpError`. Guard with `yield if block_given?` or define a default with `&block = proc {}`.
- **Keyword vs positional argument ambiguity** — in Ruby 2.7, passing a hash as the last argument to a keyword-arg method emits a deprecation warning. In Ruby 3.0, it's an error. Use `**options` explicitly.

---

## Review Questions

1. A method calls `yield(value)` twice. When is this useful? Give an example with `Enumerator` or a custom iterator.
2. Explain the exact difference between `return` in a lambda vs a Proc. What error can a Proc's `return` cause and when?
3. What does `&:upcase` actually do? Trace the steps from `Symbol#to_proc` to the final block call.
4. Write a method `memoize` that takes a Proc and returns a new Proc that caches results by argument using a hash.

---

#Ruby #Rails
