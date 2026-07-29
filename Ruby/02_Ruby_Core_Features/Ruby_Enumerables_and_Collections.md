---
title: Ruby Enumerables and Collections
aliases:
  - Ruby Arrays
  - Ruby Hashes
  - Ruby Enumerable
  - Ruby Lazy Enumerator
tags: [Ruby, Rails, collections, enumerable, arrays, hashes]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Ruby_Methods_and_Blocks]]"
  - "[[Ruby_Modules_and_Mixins]]"
  - "[[Ruby_Strings_and_Regex]]"
status: complete
---

# Ruby Enumerables and Collections

> [!abstract] TL;DR
> Ruby's `Array` and `Hash` are rich data structures powered by the `Enumerable` module. Core methods like `map`, `select`, `reject`, `reduce`, `flat_map`, `group_by`, `tally`, and `chunk` cover virtually every collection transformation. Lazy enumerators (`lazy.select.first`) allow infinite or expensive sequences to be processed without materializing all elements first.

---

## Intuition

**Analogy:** Ruby's collection API is like having a Swiss Army knife where every tool composes with every other. `map` transforms, `select` filters, `reduce` collapses, `group_by` partitions — and they chain together naturally because they all return Enumerables. The lazy variant is like processing a conveyor belt one item at a time instead of loading everything onto the belt before starting.

The `Enumerable` module is what makes this uniform. Any class that defines `each` gets all 50+ Enumerable methods for free.

---

## Array Methods

```ruby
nums = [1, 2, 3, 4, 5, 6]

# Transformation
nums.map  { |n| n * 2 }         # => [2, 4, 6, 8, 10, 12]
nums.flat_map { |n| [n, -n] }   # => [1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6]

# Filtering
nums.select { |n| n.even? }     # => [2, 4, 6]
nums.reject { |n| n.even? }     # => [1, 3, 5]
nums.find   { |n| n > 3 }       # => 4 (first match)

# Aggregation
nums.reduce(0) { |sum, n| sum + n }   # => 21
nums.reduce(:+)                        # => 21 (symbol shorthand)
nums.sum                               # => 21
nums.min   # => 1
nums.max   # => 6

# Partitioning and grouping
nums.partition { |n| n.even? }   # => [[2, 4, 6], [1, 3, 5]]
nums.group_by { |n| n % 3 }      # => {1=>[1, 4], 2=>[2, 5], 0=>[3, 6]}
nums.each_slice(2).to_a          # => [[1, 2], [3, 4], [5, 6]]
nums.each_cons(3).to_a           # => [[1,2,3], [2,3,4], [3,4,5], [4,5,6]]
nums.tally                        # counts occurrences: {1=>1, 2=>1, ...}

# Iteration with index
nums.each_with_index { |n, i| puts "#{i}: #{n}" }
nums.each_with_object([]) { |n, arr| arr << n * 2 }  # => [2, 4, 6, 8, 10, 12]
nums.map.with_index { |n, i| "#{i}:#{n}" }

# Combination
[1, 2].product([3, 4])       # => [[1,3], [1,4], [2,3], [2,4]]
[1, 2, 3].combination(2).to_a  # => [[1,2], [1,3], [2,3]]
[1, 2, 3].permutation(2).to_a  # => [[1,2], [1,3], [2,1], [2,3], [3,1], [3,2]]
[1, 2].zip([3, 4], [5, 6])    # => [[1,3,5], [2,4,6]]

# Sorting
%w[banana apple cherry].sort            # => ["apple", "banana", "cherry"]
%w[banana apple cherry].sort_by(&:length)  # by length
people.sort_by { |p| [-p.age, p.name] }   # descending age, then name

# Flattening
[[1, [2]], [3, [4]]].flatten     # => [1, 2, 3, 4]
[[1, [2]], [3, [4]]].flatten(1)  # => [1, [2], 3, [4]] (1 level only)

# chunking
[1, 1, 2, 2, 3, 1, 1].chunk_while { |a, b| a == b }.to_a
# => [[1, 1], [2, 2], [3], [1, 1]]
```

---

## Hash Methods

```ruby
user = { name: "Alice", age: 30, role: "admin" }

# Transformation
user.transform_values { |v| v.to_s }     # => {name:"Alice", age:"30", role:"admin"}
user.transform_keys   { |k| k.to_s }     # => {"name"=>"Alice", ...}

# Filtering
user.select { |k, v| v.is_a?(String) }   # => {name:"Alice", role:"admin"}
user.reject { |k, _v| k == :age }        # => {name:"Alice", role:"admin"}
user.filter_map { |k, v| "#{k}=#{v}" if v.is_a?(String) }

# Merging
defaults = { role: "user", active: true }
defaults.merge(user)            # user values win
defaults.merge(user) { |key, old, new| old }   # defaults win

# Iteration
user.each { |key, value| puts "#{key}: #{value}" }
user.each_with_object([]) { |(k, v), arr| arr << "#{k}=#{v}" }
user.map { |k, v| [k, v.to_s] }.to_h    # transform to new hash

# Querying
user.key?(:name)         # => true
user.value?("Alice")     # => true
user.any? { |_, v| v.is_a?(Integer) }   # => true
user.all? { |_, v| !v.nil? }            # => true
user.count { |_, v| v.is_a?(String) }  # => 2

# Digging nested hashes
config = { db: { host: "localhost", port: 5432 } }
config.dig(:db, :host)      # => "localhost" (safe navigation)
config.fetch(:db)           # => {host:"localhost", port:5432}
config.fetch(:missing, {})  # => {} (default on missing key)
```

---

## Enumerator and Lazy Evaluation

```ruby
# Enumerator — makes any method enumerable
enum = [1, 2, 3].each             # returns Enumerator if no block given
enum.next   # => 1
enum.next   # => 2

# External iteration
counter = Enumerator.new do |yielder|
  n = 0
  loop { yielder << (n += 1) }    # infinite sequence
end
counter.take(5)   # => [1, 2, 3, 4, 5]

# Lazy — processes one element at a time, stops early
# Without lazy — generates ALL even squares, then takes first 5:
(1..Float::INFINITY).select(&:even?).map { |n| n ** 2 }.first(5)  # hangs!

# With lazy — computes only what's needed:
(1..Float::INFINITY).lazy.select(&:even?).map { |n| n ** 2 }.first(5)
# => [4, 16, 36, 64, 100]

# Lazy with complex pipeline
result = (1..Float::INFINITY)
  .lazy
  .select { |n| n % 3 == 0 }
  .map    { |n| n * n }
  .reject { |n| n.to_s.include?("9") }
  .first(3)
# => [36, 225, 576]  — computed on demand

# zip and chain
[1, 2, 3].lazy.zip([4, 5, 6]).map { |a, b| a + b }.to_a
# => [5, 7, 9]
```

---

## Common Collection Patterns

```ruby
# Word frequency count
words = %w[apple banana apple cherry banana apple]
words.tally                    # => {"apple"=>3, "banana"=>2, "cherry"=>1}
words.group_by(&:itself).transform_values(&:count)  # equivalent

# Pivot / invert hash
scores = { alice: 90, bob: 85, carol: 90 }
scores.group_by { |_, v| v }.transform_values { |arr| arr.map(&:first) }
# => {90=>[:alice, :carol], 85=>[:bob]}

# Deep flatten and transform
nested = [[1, 2], [3, [4, 5]]]
nested.flatten.map { |n| n * 2 }.sum   # => 30

# Safe chaining with then/yield_self
user_id = params[:id]
  .then { |id| Integer(id) rescue nil }
  .then { |id| User.find_by(id: id) }
```

---

## Common Pitfalls

- **`map` vs `each`** — `each` returns the original array; `map` returns a new array of transformed values. Using `each` when you want a transformation result is a common mistake.
- **`flat_map` vs `map.flatten`** — `flat_map` is equivalent to `map(...).flatten(1)` — it only flattens one level. `flatten` (no argument) goes arbitrarily deep.
- **`find` vs `select`** — `find` returns the first matching element; `select` returns all matches as an array. Using `find` when you need all results silently drops data.
- **Hash `merge` vs `merge!`** — `merge` returns a new hash; `merge!` (or `update`) mutates in place. Unexpected in-place mutation in methods that receive hash arguments is a common bug.
- **Lazy chain must be terminated** — a lazy enumerator is not evaluated until terminated by `to_a`, `first`, `take`, `force`, etc. Forgetting the terminal causes silent non-execution.

---

## Review Questions

1. What is the difference between `map`, `flat_map`, and `each_with_object`? Give a scenario where each is the right choice.
2. Explain lazy evaluation. Why does `(1..Float::INFINITY).select(&:even?).first(5)` hang but the lazy version doesn't?
3. Given a flat array of user hashes `[{name: "Alice", dept: "Eng"}, ...]`, write a one-liner that groups users by department and counts how many are in each.
4. How does `each_with_object` differ from `reduce`/`inject`? When is each preferred?

---

#Ruby #Rails
