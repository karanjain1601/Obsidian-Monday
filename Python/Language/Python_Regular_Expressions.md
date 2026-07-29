---
title: Python Regular Expressions
aliases: [Python Regex, re module, Python Pattern Matching, Regular Expressions Python]
tags: [Python, Regex, RegularExpressions, StringProcessing, re]
domain: Python
difficulty: Intermediate
created: 2026-07-29
related: [Python_OOP, Generators_and_Iterators, Python_Collections]
status: complete
---

# Python Regular Expressions

> [!abstract] TL;DR
> Python's `re` module provides Perl-compatible regular expressions. The key functions are `re.match` (anchored at start), `re.search` (anywhere in string), `re.findall` (all non-overlapping matches), `re.sub` (replace), and `re.compile` (precompile for reuse). Prefer raw strings (`r"..."`) for patterns to avoid double-escaping backslashes.

---

## Core Syntax Reference

| Pattern | Matches |
|---------|---------|
| `.` | Any char except newline |
| `^` / `$` | Start / end of string |
| `\d` / `\D` | Digit / non-digit |
| `\w` / `\W` | Word char `[a-zA-Z0-9_]` / non-word |
| `\s` / `\S` | Whitespace / non-whitespace |
| `\b` / `\B` | Word boundary / non-boundary |
| `[abc]` | Character class — a, b, or c |
| `[^abc]` | Negated class — not a, b, or c |
| `[a-z]` | Range — any lowercase letter |
| `a*` / `a+` / `a?` | 0+, 1+, 0 or 1 repetitions |
| `a{3}` / `a{2,5}` | Exactly 3 / 2 to 5 repetitions |
| `a*?` / `a+?` | Non-greedy (lazy) versions |
| `(abc)` | Capturing group |
| `(?:abc)` | Non-capturing group |
| `(?P<name>...)` | Named capturing group |
| `a\|b` | Alternation — a or b |
| `(?=...)` / `(?!...)` | Positive / negative lookahead |
| `(?<=...)` / `(?<!...)` | Positive / negative lookbehind |

---

## The Five Key Functions

```python
import re

text = "Contact us at support@example.com or sales@example.org"

# re.search — find FIRST match anywhere in string
m = re.search(r'\w+@\w+\.\w+', text)
m.group()      # 'support@example.com'
m.start()      # 14
m.end()        # 34

# re.match — match only at the START of string
re.match(r'Contact', text)     # Match object
re.match(r'support', text)     # None (not at start)

# re.fullmatch — entire string must match
re.fullmatch(r'\w+', "hello")  # Match
re.fullmatch(r'\w+', "hi!")    # None

# re.findall — returns list of all non-overlapping matches
emails = re.findall(r'\w+@\w+\.\w+', text)
# ['support@example.com', 'sales@example.org']

# re.finditer — returns iterator of Match objects (memory-efficient)
for m in re.finditer(r'\w+@\w+\.\w+', text):
    print(m.group(), m.span())

# re.sub — replace matches
result = re.sub(r'\w+@\w+\.\w+', '[REDACTED]', text)
# 'Contact us at [REDACTED] or [REDACTED]'

# re.split — split on pattern
parts = re.split(r'[\s,;]+', "one two,three;;four")
# ['one', 'two', 'three', 'four']
```

---

## Groups and Named Groups

```python
log_line = "2024-01-15 ERROR user_service: connection timeout"

# Named groups make matches self-documenting
pattern = r'(?P<date>\d{4}-\d{2}-\d{2})\s+(?P<level>\w+)\s+(?P<component>\w+):\s+(?P<msg>.*)'
m = re.match(pattern, log_line)

m.group('date')       # '2024-01-15'
m.group('level')      # 'ERROR'
m.groupdict()         # {'date': '2024-01-15', 'level': 'ERROR', ...}

# Backreferences — match same text as a group
re.search(r'(\w+) \1', "hello hello")   # matches "hello hello"
re.search(r'(?P<word>\w+) (?P=word)', "hello hello")  # named backreference
```

---

## Compiled Patterns (Use for Loops)

```python
# Compiling upfront saves repeated parsing overhead
EMAIL_RE = re.compile(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    re.IGNORECASE
)

def is_valid_email(s: str) -> bool:
    return bool(EMAIL_RE.fullmatch(s))

# Compiled patterns support the same methods
EMAIL_RE.match(email)
EMAIL_RE.findall(text)
EMAIL_RE.sub('[REDACTED]', text)
```

---

## Flags

| Flag | Short | Effect |
|------|-------|--------|
| `re.IGNORECASE` | `re.I` | Case-insensitive matching |
| `re.MULTILINE` | `re.M` | `^`/`$` match start/end of each line |
| `re.DOTALL` | `re.S` | `.` matches newline too |
| `re.VERBOSE` | `re.X` | Allow whitespace and comments in pattern |

```python
# VERBOSE mode for complex patterns
date_pattern = re.compile(r"""
    (?P<year>  \d{4})   # four-digit year
    -
    (?P<month> \d{2})   # two-digit month
    -
    (?P<day>   \d{2})   # two-digit day
""", re.VERBOSE)
```

---

## `re.sub` with a Function

```python
def double_number(m):
    return str(int(m.group()) * 2)

re.sub(r'\d+', double_number, "I have 3 cats and 10 dogs")
# "I have 6 cats and 20 dogs"
```

---

## Lookaheads and Lookbehinds

```python
# Positive lookahead — "price followed by a number"
re.findall(r'price(?=\s*\d)', "price 100, tax 10, price 200")
# ['price', 'price']  (positions before the number)

# Negative lookahead — words NOT followed by "ing"
re.findall(r'\b\w+\b(?!ing)', "running jumping cats dogs")

# Positive lookbehind — digits preceded by $
re.findall(r'(?<=\$)\d+', "costs $100 and $200")
# ['100', '200']
```

---

## Common Pitfalls

1. **Not using raw strings** — `"\d"` is `d` (backslash eaten by Python string parser). Use `r"\d"` instead.
2. **Greedy vs lazy** — `.*` greedily matches as much as possible. Use `.*?` for the minimal match between delimiters.
3. **`re.match` vs `re.search`** — `match` anchors at position 0; use `search` when the match can appear anywhere.
4. **Catastrophic backtracking** — nested quantifiers like `(a+)+b` on a non-matching string can cause exponential time. Use atomic groups or possessive quantifiers (Python 3.11+ `re` or `regex` library).
5. **Not compiling in loops** — calling `re.search(pattern, ...)` inside a loop recompiles each time. Cache with `re.compile()`.

---

## Alternatives to `re`

- **`re.fullmatch`** — cleaner than anchoring with `^...$`
- **`fnmatch`** — simpler glob-style matching for filenames (`*.py`, `data_*.csv`)
- **`glob`** — file path matching
- **`regex` library (PyPI)** — supports Unicode property escapes, atomic groups, possessive quantifiers, overlapping matches

---

## Related Concepts

- [[Python_Collections]] — string methods that handle simple cases without regex
- [[Generators_and_Iterators]] — `re.finditer` returns an iterator
- [[Python_OOP]] — Match objects are instances of `re.Match`

---

## Review Questions

1. **What is the difference between `re.match`, `re.search`, and `re.fullmatch`?**
   *Answer: `match` anchors at position 0. `search` finds the first match anywhere. `fullmatch` requires the entire string to match the pattern.*

2. **Why does `.*` often match too much and how do you fix it?**
   *Answer: `.*` is greedy — it matches as many characters as possible, so `<.*>` on `<a>text</a>` matches the whole string including the content. Use `.*?` (lazy) to match the minimum, or `[^>]*` to exclude the delimiter character.*

3. **When should you use `re.compile()` instead of module-level functions?**
   *Answer: Whenever the same pattern is used more than once, especially in a loop. Compiled patterns avoid re-parsing on every call. Also useful for readability: name the compiled pattern with a descriptive variable.*

#Python #Regex #StringProcessing #re
