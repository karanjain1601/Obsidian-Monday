---
title: Ruby Strings and Regex
aliases:
  - Ruby String Methods
  - Ruby Regular Expressions
  - Ruby Regex
tags: [Ruby, Rails, strings, regex, interpolation]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Ruby_Types_and_Variables]]"
  - "[[Ruby_Enumerables_and_Collections]]"
  - "[[Ruby_File_IO_and_Stdlib]]"
status: complete
---

# Ruby Strings and Regex

> [!abstract] TL;DR
> Ruby strings support powerful interpolation (`"#{expr}"`), heredocs for multiline content, and a rich set of transformation methods (`gsub`, `scan`, `split`, `strip`, `chomp`, `chars`). Regular expressions use the `Regexp` class with `=~`, `match`, `scan`, and `gsub` as primary operators. Named captures (`(?<name>...)`) produce readable MatchData objects. The `# frozen_string_literal: true` magic comment immutability pragma is recommended for performance.

---

## Intuition

**Analogy:** Ruby strings are live objects — not inert sequences of bytes. Calling `.gsub` on a string is like asking a professional editor to find all instances of a pattern and replace them. The regex engine is deeply integrated: `=~` sets `$~`, `$1`, `$2` global variables automatically, and `match` returns a rich `MatchData` object you can query by name.

The frozen string literal pragma is a performance optimization: without it, every string literal creates a new object on each evaluation. With it, identical literals share a single frozen object.

---

## String Creation and Interpolation

```ruby
# Double-quoted: interpolation and escape sequences
name = "Alice"
greeting = "Hello, #{name}!"          # => "Hello, Alice!"
result   = "2 + 2 = #{2 + 2}"         # => "2 + 2 = 4"
path     = "#{Dir.home}/.config"       # any expression works

# Single-quoted: literal, no interpolation, no escape sequences (except \\ and \')
literal  = 'No #{interpolation} here'  # literal $
escaped  = 'It\'s a test'              # only \' and \\ work

# Heredoc — multiline strings
sql = <<~SQL
  SELECT users.id, users.name
  FROM users
  WHERE users.active = true
  ORDER BY users.created_at DESC
SQL
# <<~SQL strips leading indentation (squiggly heredoc, Ruby 2.3+)
# <<SQL (no ~) preserves all leading whitespace

# String multiplication
"ha" * 3          # => "hahaha"
"-" * 40          # => "----------------------------------------"

# Frozen string literal pragma (add to top of file)
# frozen_string_literal: true
# All string literals become frozen — safe for concurrent use, better memory
```

---

## Key String Methods

```ruby
str = "  Hello, Ruby World!  "

# Whitespace
str.strip       # => "Hello, Ruby World!"  (both ends)
str.lstrip      # => "Hello, Ruby World!  " (left only)
str.rstrip      # => "  Hello, Ruby World!" (right only)
str.chomp       # removes trailing newline (\n, \r\n, \r)
str.chop        # removes last character unconditionally

# Case
"hello".upcase      # => "HELLO"
"HELLO".downcase    # => "hello"
"hello world".capitalize  # => "Hello world"
"hello world".swapcase    # => "HELLO WORLD"

# Search and test
"hello".include?("ell")  # => true
"hello".start_with?("he")  # => true
"hello".end_with?("lo")    # => true
"hello".index("l")         # => 2 (first occurrence)

# Transformation
"hello world".gsub("l", "r")    # => "herro worrd" (all occurrences)
"hello world".sub("l", "r")     # => "herlo world" (first only)
"hello".tr("aeiou", "*")        # => "h*ll*" (character transliteration)
"hello\n".chomp                 # => "hello"
"  hello  ".squeeze(" ")        # => " hello " (collapse runs)

# Splitting
"a,b,c".split(",")    # => ["a", "b", "c"]
"hello".chars         # => ["h", "e", "l", "l", "o"]
"hello".bytes         # => [104, 101, 108, 108, 111]
"hello".each_char { |c| print c.upcase }

# Formatting
"hello".center(11, "-")  # => "---hello---"
"hello".ljust(10, ".")   # => "hello....."
"hello".rjust(10, ".")   # => ".....hello"
"%s is %d years old" % ["Alice", 30]  # => "Alice is 30 years old"
```

---

## Regular Expressions

```ruby
# Regexp literal: /pattern/flags
email_pattern = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

# =~ operator — returns match index, sets $~ global
if "user@example.com" =~ email_pattern
  puts "Valid email at position #{$~.begin(0)}"
end

# match — returns MatchData or nil
if md = "2026-07-29".match(/(\d{4})-(\d{2})-(\d{2})/)
  md[0]    # => "2026-07-29" (full match)
  md[1]    # => "2026" (first capture group)
  md[2]    # => "07"
  md[3]    # => "29"
end

# Named captures — recommended for readability
md = "John Doe, age 30".match(/(?<name>[\w ]+), age (?<age>\d+)/)
md[:name]   # => "John Doe"
md[:age]    # => "30"
md.named_captures  # => {"name"=>"John Doe", "age"=>"30"}

# scan — find ALL matches
"one 1, two 2, three 3".scan(/\d+/)   # => ["1", "2", "3"]
"cat bat hat".scan(/([bch])at/)        # => [["c"], ["b"], ["h"]]

# gsub with regex — replacement
"hello world".gsub(/[aeiou]/, "*")    # => "h*ll* w*rld"
"hello world".gsub(/(\w+)/) { |m| m.capitalize }  # => "Hello World"
"2026-07-29".gsub(/(\d{4})-(\d{2})-(\d{2})/, '\3/\2/\1')  # => "29/07/2026"

# gsub with hash — multi-replacement
"aeiou".gsub(/[aeiou]/, "a" => "1", "e" => "2", "i" => "3", "o" => "4", "u" => "5")
# => "12345"

# Anchors
# \A — start of string  (prefer over ^ which matches start of line)
# \z — end of string    (prefer over $ which matches end of line)
# \b — word boundary
"hello world" =~ /\bhello\b/   # => 0

# Common flags
/pattern/i   # case-insensitive
/pattern/m   # multiline (. matches \n)
/pattern/x   # extended (allow whitespace and comments in pattern)

phone_re = /
  \A        # start of string
  (\+1)?    # optional country code
  \s*       # optional whitespace
  \(?       # optional opening paren
  (\d{3})   # area code
  \)?       # optional closing paren
  [-.\s]?   # optional separator
  (\d{3})   # exchange
  [-.\s]?   # optional separator
  (\d{4})   # subscriber
  \z        # end of string
/x
```

---

## String Encoding and Frozen

```ruby
# Encoding
"hello".encoding           # => #<Encoding:UTF-8>
"hello".encode("ASCII")    # => "hello" (if all ASCII)

# Frozen strings (performance)
str = "hello".freeze
str.frozen?   # => true
# str << " world"  # FrozenError!

# String deduplication
str1 = "hello".freeze
str2 = "hello".freeze
str1.equal?(str2)   # true if Ruby reuses same frozen object (interned)

# freeze vs dup
original = "hello".freeze
copy = original.dup     # unfrozen copy
copy << " world"        # works
copy.frozen?            # => false
```

---

## Common Pitfalls

- **`^` and `$` vs `\A` and `\z`** — in Ruby, `^` and `$` match the start and end of a *line*, not the whole string. For validating an entire string (e.g., email), always use `\A` and `\z` to prevent multi-line injection attacks.
- **`gsub` vs `gsub!`** — `gsub` returns a new string; `gsub!` mutates in place and returns `nil` if no substitution was made. Using `if str.gsub!(...)` breaks when there's no match.
- **String mutation and shared references** — `a = "hello"; b = a; b << " world"` mutates `a` too. Use `b = a.dup` to get an independent copy.
- **`chomp` vs `chop`** — `chomp` removes a trailing newline (safe); `chop` removes the last character unconditionally (can remove meaningful characters).
- **Backslash in replacement strings** — in `gsub` replacement strings, `\1` refers to the first capture group. Literal backslashes need doubling: `"\\1"`.

---

## Review Questions

1. What is the difference between `=~`, `match`, and `scan`? When would you use each?
2. Why should you use `\A` and `\z` instead of `^` and `$` in validation regexes? Give an attack example where `^` fails.
3. Explain what `gsub(/(\w+)/) { |m| m.capitalize }` does step by step. What is `m` bound to inside the block?
4. What does `# frozen_string_literal: true` do and why does it improve performance in Rails applications?

---

#Ruby #Rails
