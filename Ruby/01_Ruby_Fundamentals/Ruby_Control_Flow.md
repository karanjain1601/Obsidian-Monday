---
title: Ruby Control Flow
aliases:
  - Ruby Conditionals
  - Ruby Loops
  - Ruby Exceptions
tags: [Ruby, Rails, control-flow, exceptions, loops]
domain: Ruby
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Ruby_Types_and_Variables]]"
  - "[[Ruby_Methods_and_Blocks]]"
  - "[[Ruby_Error_Handling]]"
status: complete
---

# Ruby Control Flow

> [!abstract] TL;DR
> Ruby's control flow is expressive and flexible — conditionals can be written as postfix modifiers (`return if done`), case/when uses `===` for powerful pattern matching, and iterators (`times`, `each`, `upto`) replace most loops. Exception handling uses `begin`/`rescue`/`ensure`/`raise` with a clean hierarchy rooted at `StandardError`.

---

## Intuition

**Analogy:** Ruby control flow is designed to read like intent, not mechanical instruction. Instead of `for (int i = 0; i < 5; i++)`, you write `5.times do ... end`. Instead of `if (!condition)`, you write `unless condition`. This isn't syntactic sugar — it reflects a philosophy: code should communicate *what* you want, not *how* the machine loops.

The postfix form (`do_thing if condition`) is idiomatic for guards. The `case` statement is powerful because it uses `===` — which each class can define — so you can match on types, ranges, regexes, and custom objects.

---

## Conditionals

```ruby
# Standard if/elsif/else
status = "active"
if status == "active"
  puts "User is online"
elsif status == "suspended"
  puts "Account suspended"
else
  puts "Unknown status"
end

# unless — reads as "do this unless condition is true"
puts "No errors found" unless errors.any?

# Postfix (one-liner) — idiomatic for guards
return if user.nil?
raise "Invalid age" unless age.positive?
puts "Admin" if user.admin?

# Ternary
label = user.admin? ? "Admin" : "User"

# if as expression — returns the last evaluated value
message = if score >= 90
            "Excellent"
          elsif score >= 70
            "Good"
          else
            "Needs improvement"
          end
```

---

## Case / When

`case` uses the `===` operator, not `==`. Each class implements `===` differently — this makes `case` far more powerful than a switch statement:

```ruby
# Matching on value (String#=== → ==)
case language
when "ruby"    then puts "Elegant"
when "python"  then puts "Readable"
when "java"    then puts "Verbose"
else                puts "Unknown"
end

# Matching on type (Class#=== → is_a?)
case value
when Integer  then puts "It's a number: #{value}"
when String   then puts "It's a string: #{value}"
when Array    then puts "It's an array with #{value.length} items"
when NilClass then puts "It's nil"
end

# Matching on range (Range#=== → cover?)
case age
when 0..12   then "Child"
when 13..17  then "Teen"
when 18..64  then "Adult"
when 65..    then "Senior"
end

# Matching on regex (Regexp#=== → match?)
case email
when /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i then "Valid email"
else "Invalid email"
end
```

---

## Loops and Iterators

Ruby discourages `for` and `while` in favor of iterator methods — they are more expressive and return values:

```ruby
# times — most common counter loop
5.times { |i| print "#{i} " }   # 0 1 2 3 4

# upto / downto / step
1.upto(5)    { |i| print "#{i} " }   # 1 2 3 4 5
10.downto(1) { |i| print "#{i} " }   # 10 9 8 7 6 5 4 3 2 1
1.step(10, 2){ |i| print "#{i} " }   # 1 3 5 7 9

# each on collections
[1, 2, 3].each { |n| puts n * 2 }
{ name: "Alice", age: 30 }.each { |k, v| puts "#{k}: #{v}" }

# while / until — use when count is unknown
i = 0
while i < 5
  i += 1
end

i = 5
until i.zero?
  i -= 1
end

# loop — infinite loop with break
loop do
  input = gets.chomp
  break if input == "quit"
  puts "You said: #{input}"
end

# for-in (rarely used — doesn't create new scope)
for item in [1, 2, 3]
  puts item
end
```

---

## Loop Control Keywords

```ruby
# next — skip to next iteration (like continue)
[1, 2, 3, 4, 5].each do |n|
  next if n.even?
  puts n              # prints 1, 3, 5
end

# break — exit the loop, optionally return a value
result = [1, 2, 3, 4, 5].each do |n|
  break n * 10 if n == 3    # exits with 30
end
puts result   # => 30

# redo — restart current iteration without re-evaluating condition
attempts = 0
3.times do |i|
  attempts += 1
  redo if attempts == 2 && i == 0   # restart iteration 0 once
end

# retry — retry a begin/rescue block
attempts = 0
begin
  attempts += 1
  raise "Connection failed" if attempts < 3
  puts "Connected after #{attempts} attempts"
rescue RuntimeError => e
  retry if attempts < 3
  puts "Giving up: #{e.message}"
end
```

---

## Exception Handling

```ruby
# Basic structure
begin
  result = 10 / 0
rescue ZeroDivisionError => e
  puts "Math error: #{e.message}"
rescue TypeError, ArgumentError => e
  puts "Type problem: #{e.message}"
rescue StandardError => e
  puts "Something went wrong: #{e.message}"
else
  puts "No error! Result: #{result}"   # only runs if no exception was raised
ensure
  puts "Always runs (cleanup here)"    # like finally in Java
end

# rescue in a method — no begin needed
def parse_config(path)
  JSON.parse(File.read(path))
rescue Errno::ENOENT
  {}      # file not found → return empty hash
rescue JSON::ParserError => e
  raise "Invalid config at #{path}: #{e.message}"
end

# raise / fail (synonyms)
def divide(a, b)
  raise ArgumentError, "Divisor cannot be zero" if b.zero?
  a / b
end

# Custom exceptions
class InsufficientFundsError < StandardError
  def initialize(amount, balance)
    super("Cannot withdraw #{amount}, balance is #{balance}")
    @amount  = amount
    @balance = balance
  end
  attr_reader :amount, :balance
end

# Using custom exception
def withdraw(amount)
  raise InsufficientFundsError.new(amount, @balance) if amount > @balance
  @balance -= amount
end
```

---

## Common Pitfalls

- **Rescuing `Exception` instead of `StandardError`** — `Exception` is the root and includes `SignalException`, `Interrupt`, `NoMemoryError`. Rescuing it prevents Ctrl+C from working and masks fatal errors. Always rescue `StandardError` or its subclasses.
- **`retry` without a counter** — `retry` without limiting attempts creates an infinite loop. Always track attempt count or use a backoff strategy.
- **`ensure` always runs** — even after a `return` inside `rescue`. Side effects in `ensure` (like closing a connection) always execute; this is the intended use. But returning a value from `ensure` silently discards the rescued value.
- **Swallowing exceptions silently** — `rescue; nil` hides bugs. At minimum, log the error. In production, use Sentry/Honeybadger to record rescued exceptions.
- **`for` loop variable leakage** — unlike `each`, a `for` loop does not create a new scope. The iteration variable persists after the loop ends, which can cause subtle bugs.

---

## Review Questions

1. Why does `case age when 18..64 then "Adult"` work without calling `.include?`? Explain the `===` operator's role.
2. What is the difference between `retry` and `redo`? Give a realistic use case for each.
3. Explain why `rescue Exception` is dangerous. What is the correct ancestor class to rescue from for normal error handling?
4. Write a method that retries an HTTP request up to 3 times with exponential backoff, raising the last error if all attempts fail.

---

#Ruby #Rails
