---
title: Ruby Types and Variables
aliases:
  - Ruby Variables
  - Ruby Data Types
  - Ruby Symbols
tags: [Ruby, Rails, types, variables, symbols]
domain: Ruby
difficulty: Beginner
created: 2026-07-29
related:
  - "[[Ruby_Overview]]"
  - "[[Ruby_Control_Flow]]"
  - "[[Ruby_OOP]]"
status: complete
---

# Ruby Types and Variables

> [!abstract] TL;DR
> In Ruby, everything is an object — even `nil`, `true`, `false`, and integers carry methods. Variables are dynamically typed and scoped by naming convention (lowercase, `@instance`, `@@class`, `$global`, `CONSTANT`). Symbols are immutable, interned identifiers that differ fundamentally from strings — a critical distinction for hashes, method names, and memory efficiency.

---

## Intuition

**Analogy:** Think of Ruby's type system as a world where even the number `0` has a personality — it knows how to `times`, `upto`, `downto`, and `to_s`. There are no primitive ints sitting outside the object system. The consequence is elegant: you can call methods on literals, extend any object, and mix in behavior uniformly.

The symbol vs string distinction trips up newcomers: `"name"` is a mutable, heap-allocated object. `:name` is an immutable, interned atom — created once and reused everywhere. Use symbols for identifiers (hash keys, method names); use strings for text that changes or comes from user input.

---

## Everything is an Object

```ruby
# Even literals are objects
42.class          # => Integer
3.14.class        # => Float
"hello".class     # => String
:symbol.class     # => Symbol
true.class        # => TrueClass
false.class       # => FalseClass
nil.class         # => NilClass
[].class          # => Array
{}.class          # => Hash

# Calling methods on literals
-5.abs            # => 5
42.to_s           # => "42"
2 ** 10           # => 1024 (Integer#** method, not operator magic)
"hello".frozen?   # => false
nil.nil?          # => true
```

---

## Variable Scoping Conventions

Ruby uses naming convention — not keywords — to determine variable scope:

| Prefix | Scope | Example |
|---|---|---|
| lowercase / `_` | local (current scope) | `count = 0` |
| `@` | instance variable (object) | `@name = "Alice"` |
| `@@` | class variable (shared across class + subclasses) | `@@total = 0` |
| `$` | global variable (entire program) | `$VERBOSE = nil` |
| `UPPER_SNAKE` | constant | `MAX_RETRIES = 3` |

```ruby
MAX_RETRIES = 3           # Constant — warning if reassigned

class Counter
  @@count = 0             # Class variable — shared across all instances

  def initialize(name)
    @name = name          # Instance variable — per-object
    @@count += 1
  end

  def self.count          # Class method
    @@count
  end
end

# Local variables — block-scoped
total = 0
[1, 2, 3].each do |n|
  subtotal = n * 2        # subtotal dies after the block
  total += subtotal       # total persists (captured from outer scope)
end
puts total                # => 12
# puts subtotal           # => NameError: undefined local variable
```

---

## Symbols vs Strings

```ruby
# Symbols: immutable, interned — same object_id every time
:name.object_id == :name.object_id   # => true (always the same object)
"name".object_id == "name".object_id # => false (new string each time)

# Common uses of symbols
user = { name: "Alice", age: 30 }    # hash keys (symbol shorthand)
attr_accessor :email                  # method names
respond_to?(:save)                    # introspection

# Converting
:hello.to_s     # => "hello"
"hello".to_sym  # => :hello

# When to use which
# Symbol — for identifiers, hash keys, method names (identity matters)
# String — for text content, user input, output (value matters)

# Frozen string literal (Ruby 2.3+ pragma — makes strings symbol-like)
# frozen_string_literal: true
str = "immutable"
str.frozen?  # => true (with pragma)
```

---

## Truthy and Falsy Values

**Only `nil` and `false` are falsy in Ruby.** Everything else — including `0`, `""`, `[]` — is truthy. This differs sharply from JavaScript, Python, and many other languages:

```ruby
# Falsy — only these two
if nil;   puts "falsy"; end   # prints
if false; puts "falsy"; end   # prints

# Truthy — these all pass the if check
if 0;     puts "truthy"; end  # prints (0 is truthy in Ruby!)
if "";    puts "truthy"; end  # prints (empty string is truthy!)
if [];    puts "truthy"; end  # prints (empty array is truthy!)
if 0.0;   puts "truthy"; end  # prints

# Practical consequence
user = nil
puts user.name if user        # safe — short-circuit nil check
puts user&.name               # safe navigation operator (Ruby 2.3+)
```

---

## Type Coercion

Ruby is strongly typed — it does not silently coerce. Use explicit conversion methods:

```ruby
# Lenient conversion — returns nil or 0 on failure
"42".to_i        # => 42
"3.14".to_f      # => 3.14
"abc".to_i       # => 0    (no error, but silent failure)
nil.to_i         # => 0
nil.to_s         # => ""
nil.to_a         # => []

# Strict conversion — raises ArgumentError on failure
Integer("42")    # => 42
Integer("abc")   # ArgumentError: invalid value for Integer(): "abc"
Float("3.14")    # => 3.14
Float("abc")     # ArgumentError

# String conversion
42.to_s          # => "42"
42.to_s(2)       # => "101010" (binary)
42.to_s(16)      # => "2a" (hex)

# Array conversion
Array(nil)       # => []
Array([1,2])     # => [1, 2]
Array({a: 1})    # => [[:a, 1]]
```

---

## Flow Diagram: Variable Lookup

```mermaid
graph TD
    VarRef[Variable Reference] --> Local{Local scope?}
    Local -->|yes| UseLocal[Use local variable]
    Local -->|no| Ivar{@instance var?}
    Ivar -->|yes| UseIvar[Use instance variable]
    Ivar -->|no| Cvar{@@class var?}
    Cvar -->|yes| UseCvar[Walk class hierarchy]
    Cvar -->|no| Const{CONSTANT?}
    Const -->|yes| UseConst[Look up in nesting/ancestors]
    Const -->|no| Error[NameError]
```

---

## Common Pitfalls

- **`0` is truthy** — `if count` passes when `count == 0`. Use `if count > 0` or `if count.positive?` for numeric guards.
- **String mutation** — `str = "hello"; str2 = str; str << " world"` mutates `str2` too (same object). Use `str.dup` or `str.clone` to copy. With frozen strings, mutation raises `FrozenError`.
- **`@@class` variables leak through subclasses** — `@@count` in a parent class is shared with all subclasses. Usually prefer class-level instance variables (`@count` on the class itself) for cleaner inheritance.
- **`nil` vs `false` in conditionals** — `find` returns `nil` when nothing matches; do not use `false` as a sentinel to mean "not found." Both nil and false are falsy, but they are different objects.
- **Constants are not truly constant** — Ruby warns but allows reassignment of constants. Use `freeze` for true immutability: `DEFAULTS = { timeout: 30 }.freeze`.

---

## Review Questions

1. Why is `0` truthy in Ruby but falsy in Python and JavaScript? What Ruby-specific bugs can this cause?
2. Explain why `:name.object_id == :name.object_id` is always true but `"name".object_id == "name".object_id` is always false. What memory implication does this have for using strings vs symbols as hash keys?
3. What is the difference between `"abc".to_i` and `Integer("abc")`? When should you use each?
4. A class variable `@@total` is defined in `Animal`. `Dog < Animal` and `Cat < Animal` both increment `@@total`. After creating 2 dogs and 3 cats, what does `Animal.total` return? What is the common fix?

---

#Ruby #Rails
