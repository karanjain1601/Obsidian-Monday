---
title: Ruby File IO and Stdlib
aliases:
  - Ruby File
  - Ruby IO
  - Ruby CSV
  - Ruby JSON YAML
tags: [Ruby, Rails, file-io, stdlib, json, csv, yaml]
domain: Ruby
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Ruby_Error_Handling]]"
  - "[[Ruby_Strings_and_Regex]]"
  - "[[Ruby_Overview]]"
status: complete
---

# Ruby File IO and Stdlib

> [!abstract] TL;DR
> Ruby's stdlib covers file I/O (`File`, `IO`, `Pathname`), structured data (`CSV`, `JSON`, `YAML`), templating (`ERB`), HTTP (`Net::HTTP`), temporary files (`Tempfile`), and directory operations (`Dir`). The `File.open(...) { |f| }` block pattern auto-closes file handles. `__FILE__`, `__dir__`, and `__method__` are magic keywords for file-relative path resolution and debugging.

---

## Intuition

**Analogy:** Ruby's stdlib is a well-stocked toolbox that ships with the language. You don't need gems for reading CSVs, templating HTML, making HTTP requests, or working with JSON. The block-based file API (`File.open` with a block) follows the same "resource auto-release" pattern as Python's `with` statement — the file closes even if an exception is raised.

---

## File Operations

```ruby
# Reading entire file
content = File.read("data.txt")              # string
lines   = File.readlines("data.txt")         # array of lines (with \n)
lines   = File.readlines("data.txt", chomp: true)  # strips \n

# Block form — file automatically closed when block exits
File.open("data.txt", "r") do |file|
  file.each_line do |line|
    puts line.chomp
  end
end

# Writing
File.write("output.txt", "Hello, World!\n")   # overwrites

File.open("log.txt", "a") do |f|    # "a" = append mode
  f.puts "New log entry: #{Time.now}"
end

# File metadata
File.exist?("config.yml")    # => true/false
File.size("data.txt")        # => bytes
File.mtime("data.txt")       # => Time object (modification time)
File.basename("/path/to/file.rb")   # => "file.rb"
File.extname("/path/to/file.rb")    # => ".rb"
File.dirname("/path/to/file.rb")    # => "/path/to"
File.expand_path("../config", __FILE__)  # absolute path relative to current file

# Pathname — OO wrapper around file paths
require "pathname"
path = Pathname.new("/var/log/app.log")
path.exist?          # => true/false
path.read            # => file content
path.each_line { |l| puts l }
path.parent          # => Pathname("/var/log")
path.basename        # => Pathname("app.log")
path.extname         # => ".log"

# Relative paths using __dir__ (directory of current file)
config_path = File.join(__dir__, "..", "config", "settings.yml")
```

---

## CSV

```ruby
require "csv"

# Reading
CSV.foreach("users.csv", headers: true) do |row|
  puts "#{row["name"]} — #{row["email"]}"
end

# Read into array of hashes
users = CSV.read("users.csv", headers: true, header_converters: :symbol)
users.first[:name]    # => "Alice"

# Writing
CSV.open("output.csv", "w") do |csv|
  csv << ["name", "age", "email"]         # header row
  csv << ["Alice", 30, "alice@example.com"]
  csv << ["Bob", 25, "bob@example.com"]
end

# From array
data = [["Alice", 30], ["Bob", 25]]
csv_string = CSV.generate(headers: ["name", "age"], write_headers: true) do |csv|
  data.each { |row| csv << row }
end
```

---

## JSON

```ruby
require "json"

# Parsing (string → Ruby object)
json_str = '{"name":"Alice","age":30,"tags":["ruby","rails"]}'
obj = JSON.parse(json_str)
obj["name"]   # => "Alice"
obj["tags"]   # => ["ruby", "rails"]

# Symbolized keys
obj = JSON.parse(json_str, symbolize_names: true)
obj[:name]    # => "Alice"

# Generating (Ruby object → string)
user = { name: "Alice", age: 30, tags: ["ruby", "rails"] }
JSON.generate(user)          # => '{"name":"Alice","age":30,...}'
user.to_json                 # same
JSON.pretty_generate(user)   # indented, readable

# Custom to_json
class User
  def initialize(name, age)
    @name = name
    @age  = age
  end

  def to_json(*args)
    { name: @name, age: @age }.to_json(*args)
  end

  def self.from_json(str)
    data = JSON.parse(str, symbolize_names: true)
    new(data[:name], data[:age])
  end
end
```

---

## YAML

```ruby
require "yaml"

# Parse YAML string
config_str = <<~YAML
  database:
    host: localhost
    port: 5432
    name: myapp_development
  cache:
    ttl: 300
YAML
config = YAML.safe_load(config_str)    # use safe_load (not load!) to avoid code injection
config["database"]["host"]             # => "localhost"

# Load from file
config = YAML.load_file("config/database.yml")

# Dump Ruby object to YAML
data = { users: ["Alice", "Bob"], count: 2 }
puts data.to_yaml
# => ---
#    :users:
#    - Alice
#    - Bob
#    :count: 2
```

---

## ERB Templating

```ruby
require "erb"

template = ERB.new(<<~ERB)
  Hello, <%= name %>!
  <% items.each do |item| %>
    - <%= item.upcase %>
  <% end %>
  Total: <%= items.count %> items
ERB

name  = "Alice"
items = ["apple", "banana", "cherry"]
puts template.result(binding)
# Hello, Alice!
#   - APPLE
#   - BANANA
#   - CHERRY
# Total: 3 items

# ERB tags:
# <%= expr %>  — output (HTML-escaped in Rails)
# <% code %>   — execute (no output)
# <%- code %>  — execute, suppress trailing newline
# <%# comment %> — comment (not output)
```

---

## Net::HTTP and Tempfile

```ruby
require "net/http"
require "uri"
require "json"

# Simple GET
uri = URI("https://api.github.com/users/rails")
response = Net::HTTP.get_response(uri)
data = JSON.parse(response.body) if response.is_a?(Net::HTTPSuccess)

# POST with JSON body
uri = URI("https://httpbin.org/post")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true
request = Net::HTTP::Post.new(uri.path, "Content-Type" => "application/json")
request.body = { name: "Alice" }.to_json
response = http.request(request)

# Tempfile — auto-deleted when garbage collected or explicitly closed/unlinked
require "tempfile"
Tempfile.create("upload_") do |tmpfile|
  tmpfile.write("temporary content")
  tmpfile.flush
  process_file(tmpfile.path)
end   # auto-deleted when block exits
```

---

## Magic Keywords

```ruby
__FILE__      # => current file path (relative)
__dir__       # => directory of current file (absolute)
__method__    # => current method name as symbol
__LINE__      # => current line number

# Common uses
CONFIG_PATH = File.join(__dir__, "..", "config", "settings.yml")

def debug_info
  "Called #{__method__} in #{__FILE__}:#{__LINE__}"
end

# Kernel#pp — pretty print for debugging (better than p for nested objects)
pp({ users: [{ name: "Alice", tags: [:admin] }] })
# {:users=>[{:name=>"Alice", :tags=>[:admin]}]}
```

---

## Common Pitfalls

- **`YAML.load` vs `YAML.safe_load`** — `YAML.load` can instantiate arbitrary Ruby objects (code injection risk with untrusted input). Always use `YAML.safe_load` for config files and external data.
- **Not closing file handles** — opening files without a block (`f = File.open(...)`) requires `f.close` explicitly. A block form (`File.open(...) { |f| }`) auto-closes even on exception.
- **Large file memory** — `File.read` loads the entire file into memory. For large files (logs, CSVs), use `File.foreach` or `each_line` to stream line by line.
- **`Net::HTTP` and SSL** — `Net::HTTP.get` does not verify SSL certificates by default before Ruby 2.7. Always set `http.verify_mode = OpenSSL::SSL::VERIFY_PEER` or use the Faraday/HTTParty gems for production HTTP.
- **`__FILE__` is relative** — `__FILE__` returns a path relative to where the script was invoked. Use `__dir__` (absolute) for building reliable relative paths to config files.

---

## Review Questions

1. Why is `YAML.safe_load` preferred over `YAML.load`? Give an example of how `YAML.load` could be exploited.
2. What is the difference between using `File.open` with a block vs without one? What resource management problem does the block form solve?
3. Explain the difference between `__FILE__` and `__dir__`. When would using `__FILE__` to build a config path produce an unexpected path?
4. You need to process a 2GB log file line by line without loading it all into memory. Write the Ruby code using the most memory-efficient approach.

---

#Ruby #Rails
