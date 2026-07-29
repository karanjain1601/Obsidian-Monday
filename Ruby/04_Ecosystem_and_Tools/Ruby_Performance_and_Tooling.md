---
title: Ruby Performance and Tooling
aliases:
  - RuboCop
  - Ruby Profiling
  - Ractors
  - Ruby Fibers
  - Ruby GC
tags: [Ruby, Rails, performance, rubocop, profiling, ractors, fibers]
domain: Ruby
difficulty: Advanced
created: 2026-07-29
related:
  - "[[Ruby_Overview]]"
  - "[[Bundler_and_Gems]]"
  - "[[Ruby_Modules_and_Mixins]]"
status: complete
---

# Ruby Performance and Tooling

> [!abstract] TL;DR
> Ruby performance tooling covers linting (`rubocop`/`standardrb`), CPU profiling (`stackprof`), memory profiling (`memory_profiler`), benchmarking (`benchmark-ips`), and GC tuning. Ruby 3.0+ introduced **Ractors** for true parallelism (no GIL) and enhanced **Fibers** with non-blocking I/O scheduling. The `concurrent-ruby` gem provides thread-safe utilities that work across Ruby implementations.

---

## Intuition

**Analogy:** Profiling Ruby is like diagnosing an engine — you need to know if you're burning CPU (hot methods), leaking oil (memory growth), or just idling too long waiting for external calls (I/O bound). `stackprof` takes CPU samples to show hot methods; `memory_profiler` shows which objects are allocated and not collected; `benchmark-ips` compares alternative implementations.

Ractors are like separate engines — each Ractor is isolated (no shared mutable state), so multiple Ractors can run Ruby code in parallel on multiple CPU cores, bypassing the GIL entirely.

---

## RuboCop Linting

```ruby
# Gemfile (development group)
gem "rubocop",              require: false
gem "rubocop-rails",        require: false
gem "rubocop-rspec",        require: false
gem "rubocop-performance",  require: false

# .rubocop.yml
require:
  - rubocop-rails
  - rubocop-rspec
  - rubocop-performance

AllCops:
  NewCops: enable
  TargetRubyVersion: 3.3
  Exclude:
    - "db/schema.rb"
    - "bin/**/*"
    - "vendor/**/*"

Style/StringLiterals:
  Enabled: true
  EnforcedStyle: double_quotes

Metrics/MethodLength:
  Max: 15

Metrics/ClassLength:
  Max: 150

Layout/LineLength:
  Max: 120
```

```bash
rubocop                    # check all files
rubocop --autocorrect      # auto-fix safe offenses (alias: -A)
rubocop app/models/        # check specific directory
rubocop --only Style/      # run only Style cops

# StandardRB — rubocop with zero config (like gofmt for Go)
gem "standardrb"
standardrb                 # no .rubocop.yml needed
standardrb --fix
```

---

## Benchmarking with benchmark-ips

```ruby
require "benchmark/ips"

data = (1..10_000).to_a

Benchmark.ips do |x|
  x.config(time: 5, warmup: 2)

  x.report("select + first") do
    data.select { |n| n.even? }.first
  end

  x.report("find") do
    data.find { |n| n.even? }
  end

  x.report("lazy select") do
    data.lazy.select { |n| n.even? }.first
  end

  x.compare!
end

# Sample output:
# Calculating -------------------------------------
#      select + first:    2.137k ips
#                find:   12.234k ips   (6x faster — stops at first match)
#         lazy select:    4.891k ips

# Benchmark for memory-sensitive comparison
require "benchmark/memory"
Benchmark.memory do |x|
  x.report("Array#map")      { (1..1000).map { |n| n * 2 } }
  x.report("Array#flat_map") { (1..1000).flat_map { |n| [n, n * 2] } }
  x.compare!
end
```

---

## CPU Profiling with stackprof

```ruby
require "stackprof"

# Profile a block
StackProf.run(mode: :cpu, out: "stackprof-cpu.dump", interval: 1000) do
  1000.times { MyApp::HeavyService.new.process }
end

# Analyze
StackProf::Report.new(Marshal.load(File.read("stackprof-cpu.dump")))
  .print_text(false, 15)   # show top 15 frames

# Flamegraph (install stackprof-webnav or use speedscope)
StackProf.run(mode: :wall, raw: true, out: "stackprof-raw.dump") { run_code }
# Upload dump to https://speedscope.app for interactive flamegraph

# In Rails — middleware for request profiling
# config/environments/development.rb
# config.middleware.use StackProf::Middleware, enabled: true, mode: :cpu
```

---

## Memory Profiling

```ruby
require "memory_profiler"

report = MemoryProfiler.report do
  1000.times { "hello" + " world" }   # allocates 1000 strings
end

report.pretty_print(
  to_file: "memory_report.txt",
  scale_bytes: true,       # show in KB/MB
  retained_strings: 10     # show top retained strings
)

# Key metrics to watch:
# - Total allocated: total objects created during profiling
# - Total retained: objects still alive after profiling (memory leaks)
# - Top allocations: which code paths create most objects

# ObjectSpace for quick checks
require "objspace"
ObjectSpace.count_objects          # hash of object type counts
ObjectSpace.memsize_of("hello")    # bytes consumed by one object
ObjectSpace.allocation_sourcefile(obj)  # where was this object created
```

---

## GC Tuning

```ruby
# GC.stat — current GC state
GC.stat
# => { :count=>35, :heap_allocated_pages=>83, :heap_live_slots=>48231, ... }

# Environment variables for GC tuning
RUBY_GC_HEAP_INIT_SLOTS=500000     # initial heap slots
RUBY_GC_HEAP_FREE_SLOTS=300000     # slots to keep free after GC
RUBY_GC_HEAP_GROWTH_FACTOR=1.5     # heap grows by 1.5x when full
RUBY_GC_MALLOC_LIMIT=67108864      # GC triggers after 64MB malloc

# Disable GC during critical sections (use sparingly)
GC.disable
do_critical_work
GC.enable
GC.start   # force a GC cycle

# In Rails — tuned GC settings reduce GC pauses
# Heroku recommended Ruby GC env vars:
MALLOC_ARENA_MAX=2                  # reduces memory fragmentation on Linux
```

---

## Ractors (Ruby 3.0+ True Parallelism)

```ruby
# Ractors run in true parallel threads (no GIL between Ractors)
# Each Ractor has its own GIL — Ractors communicate via message passing

# Simple parallel computation
ractors = 4.times.map do |i|
  Ractor.new(i) do |id|
    # Each Ractor computes independently
    (1..1_000_000).select { |n| n % (id + 2) == 0 }.sum
  end
end

results = ractors.map(&:take)   # wait for all results
puts results.sum

# Ractor pipeline — producer/consumer
producer = Ractor.new do
  (1..10).each { |i| Ractor.yield i }
  "done"
end

consumer = Ractor.new(producer) do |prod|
  loop do
    value = prod.take
    Ractor.yield value * 2
  end
end

# RESTRICTIONS: Ractors cannot share mutable objects
# Only frozen objects, integers, symbols can be shared
MULTIPLIER = 2.freeze   # OK — frozen constant shared
# SharedMutableState = []  # Not OK — would need to be moved

# Ractor.make_shareable — deep-freeze an object for sharing
shareable_config = Ractor.make_shareable({ host: "localhost", port: 5432 })
```

---

## Fibers and Non-blocking I/O (Ruby 3.0+)

```ruby
# Fiber — cooperative concurrency (not parallel, but non-blocking I/O)
fiber = Fiber.new do
  puts "Start"
  Fiber.yield "pause"
  puts "Resume"
  "done"
end

fiber.resume   # "Start" → returns "pause"
fiber.resume   # "Resume" → returns "done"

# Ruby 3.0+ Fiber Scheduler — non-blocking I/O
# Use Async gem or built-in scheduler hooks for non-blocking fibers
require "async"

Async do
  10.times do |i|
    Async do
      # These run concurrently — each Fiber yields during I/O
      response = Async::HTTP::Internet.new.get("https://httpbin.org/delay/1")
      puts "Response #{i}: #{response.status}"
    end
  end
end
# All 10 requests start concurrently — total ~1s instead of 10s
```

---

## concurrent-ruby Gem

```ruby
gem "concurrent-ruby"

require "concurrent"

# Thread-safe data structures
counter = Concurrent::AtomicFixnum.new(0)
threads = 100.times.map { Thread.new { counter.increment } }
threads.each(&:join)
counter.value   # => 100 (not corrupted by race conditions)

# Future — async computation
future = Concurrent::Future.execute { expensive_computation }
# ... do other work ...
result = future.value   # blocks until complete

# Promise chaining
Concurrent::Promise
  .execute { fetch_user(1) }
  .then    { |user| fetch_posts(user.id) }
  .then    { |posts| posts.map(&:title) }
  .value   # waits for the chain
```

---

## Common Pitfalls

- **Premature optimization** — profile before optimizing. Most Ruby performance bottlenecks are in database queries or network calls, not Ruby code itself. Fix SQL first.
- **GC pressure from string allocation** — string interpolation in tight loops creates many short-lived objects. Use `<<` (append in place) or `StringIO` for building strings in loops.
- **Ractor sharing frozen vs live objects** — passing a non-frozen object to a Ractor *moves* it (the original becomes invalid). Pass a copy or freeze the object first.
- **`rubocop --autocorrect` in CI** — auto-correct in CI modifies files and then the commit fails because files changed. Run rubocop in check mode (`--no-autocorrect`) in CI.
- **Thread safety in Rails** — Rails is thread-safe, but gems and your code may not be. Shared mutable class variables, global state, and non-atomic operations cause data corruption under Puma's multi-thread mode.

---

## Review Questions

1. What is the GIL (Global Interpreter Lock) in MRI Ruby? How do Ractors bypass it, and what restrictions come with that bypass?
2. A Rails app is slow. Describe your profiling workflow: what tools would you use, in what order, and what are you looking for at each step?
3. What is the difference between a Ractor and a Fiber? When would you use each?
4. Why does string interpolation in a tight loop cause GC pressure? Show two ways to rewrite a loop that builds a large string to minimize allocations.

---

#Ruby #Rails
