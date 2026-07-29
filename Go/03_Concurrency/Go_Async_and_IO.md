---
title: Go Async and IO
aliases: [Go net/http, Go io.Reader io.Writer, Go bufio, Go file operations]
tags: [Go, Golang, IO, HTTP, bufio, FileIO, Concurrency]
domain: Go
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Go_HTTP_Server]]"
  - "[[Interfaces_in_Go]]"
  - "[[Go_Async_and_IO]]"
  - "[[Goroutines_and_Scheduler]]"
status: complete
---

# Go Async and IO

> [!abstract] TL;DR
> Go's I/O model is built on the `io.Reader`/`io.Writer` interfaces — composable, streamable, and goroutine-safe when used with distinct instances. `net/http` handles every connection in a goroutine. `bufio` adds buffering to any reader or writer. File operations use `os.File` which also satisfies `io.Reader`/`io.Writer`. The `io`, `bufio`, and `filepath` packages are the core of Go I/O.

---

## io.Reader and io.Writer

The `io.Reader` interface is the foundation of all readable data in Go:

```go
type Reader interface {
    Read(p []byte) (n int, err error)
}
// Returns: bytes read, io.EOF when exhausted, or an error

type Writer interface {
    Write(p []byte) (n int, err error)
}
```

Key utility functions that work with any Reader/Writer:

```go
import "io"

// Read all bytes from a Reader into a slice
data, err := io.ReadAll(r)          // reads until EOF or error

// Copy from Reader to Writer
n, err := io.Copy(dst, src)         // efficient chunked copy
n, err := io.CopyN(dst, src, 1024)  // copy at most N bytes

// Read exactly N bytes
buf := make([]byte, 4096)
n, err := io.ReadFull(r, buf)       // error if fewer than len(buf) bytes available

// Limit bytes read
limited := io.LimitReader(r, 1<<20)  // cap at 1MB — prevent DoS

// Discard bytes (benchmark sink, drain a response body)
io.Copy(io.Discard, resp.Body)

// Multi-reader — reads sequentially from multiple readers
r = io.MultiReader(r1, r2, r3)

// Tee — reads from src, writes a copy to w
r = io.TeeReader(src, w)            // useful for logging request bodies
```

---

## bufio — Buffered I/O

Raw `Read` calls are expensive (syscall per call). `bufio` batches reads/writes:

```go
import "bufio"

// Buffered reader — reads large chunks, serves small reads from buffer
br := bufio.NewReader(r)            // default 4096 byte buffer
br := bufio.NewReaderSize(r, 64*1024) // custom buffer size

// Line reading
for {
    line, err := br.ReadString('\n')   // reads until delimiter
    if err != nil {
        if err == io.EOF {
            process(line)   // last line may not end with \n
        }
        break
    }
    process(line)
}

// Scanner — cleaner line-by-line reading
scanner := bufio.NewScanner(r)
scanner.Buffer(make([]byte, 1024*1024), 1024*1024)  // increase default 64KB limit
for scanner.Scan() {
    line := scanner.Text()   // current line, stripped of newline
    process(line)
}
if err := scanner.Err(); err != nil {
    log.Fatal(err)
}

// Buffered writer — batches writes
bw := bufio.NewWriter(w)
fmt.Fprintf(bw, "hello %s\n", name)
bw.Flush()   // IMPORTANT: flush buffer to underlying writer
```

---

## File Operations

```go
import "os"

// Read entire file
data, err := os.ReadFile("config.json")

// Write entire file (creates or truncates)
err = os.WriteFile("output.txt", data, 0644)

// Open for reading
f, err := os.Open("input.txt")       // read-only
defer f.Close()

// Open for writing/reading with flags
f, err := os.OpenFile("app.log",
    os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
defer f.Close()

// Stat
info, err := os.Stat("file.txt")
fmt.Println(info.Size(), info.ModTime(), info.IsDir())

// Directory operations
entries, err := os.ReadDir(".")
for _, e := range entries {
    fmt.Printf("%s %v\n", e.Name(), e.IsDir())
}

err = os.MkdirAll("a/b/c", 0755)   // mkdir -p
err = os.Remove("file.txt")
err = os.RemoveAll("dir/")          // rm -rf
```

---

## filepath Package

```go
import "path/filepath"

// Cross-platform path construction
p := filepath.Join("a", "b", "c.txt")   // a/b/c.txt or a\b\c.txt

filepath.Dir("/a/b/c.txt")   // /a/b
filepath.Base("/a/b/c.txt")  // c.txt
filepath.Ext("file.tar.gz")  // .gz

// Walk a directory tree
err = filepath.WalkDir(".", func(path string, d fs.DirEntry, err error) error {
    if err != nil {
        return err   // permission error — continue or abort
    }
    if d.IsDir() {
        return nil
    }
    fmt.Println(path)
    return nil
})
```

---

## net/http Basic Server

Every HTTP request is handled in its own goroutine by `net/http`:

```go
import "net/http"

func handler(w http.ResponseWriter, r *http.Request) {
    ctx := r.Context()   // carries client deadline + cancel

    // Read request body (limit to prevent DoS)
    body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
    defer r.Body.Close()

    // Parse query params
    q := r.URL.Query().Get("name")

    // Write response
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"hello": q})
    _ = ctx   // use context for downstream calls
}

mux := http.NewServeMux()
mux.HandleFunc("GET /hello", handler)
mux.HandleFunc("POST /api/users", createUser)

srv := &http.Server{
    Addr:         ":8080",
    Handler:      mux,
    ReadTimeout:  10 * time.Second,
    WriteTimeout: 10 * time.Second,
    IdleTimeout:  120 * time.Second,
}
log.Fatal(srv.ListenAndServe())
```

---

## Implementation Example

```go
package main

import (
    "bufio"
    "fmt"
    "os"
    "strings"
)

func countWordsInFile(path string) (map[string]int, error) {
    f, err := os.Open(path)
    if err != nil {
        return nil, fmt.Errorf("open %s: %w", path, err)
    }
    defer f.Close()

    freq := make(map[string]int)
    scanner := bufio.NewScanner(f)

    for scanner.Scan() {
        for _, word := range strings.Fields(scanner.Text()) {
            freq[strings.ToLower(strings.Trim(word, ".,!?;:"))]++
        }
    }

    return freq, scanner.Err()
}

func writeFrequency(w *os.File, freq map[string]int) error {
    bw := bufio.NewWriter(w)
    for word, count := range freq {
        if _, err := fmt.Fprintf(bw, "%s: %d\n", word, count); err != nil {
            return err
        }
    }
    return bw.Flush()   // don't forget to flush!
}

func main() {
    // Read from stdin using a Scanner
    scanner := bufio.NewScanner(os.Stdin)
    var lines []string
    for scanner.Scan() {
        lines = append(lines, scanner.Text())
    }
    fmt.Printf("read %d lines\n", len(lines))

    // io.Reader composition
    combined := strings.NewReader("hello\nworld\n")
    s2 := bufio.NewScanner(combined)
    for s2.Scan() {
        fmt.Println(s2.Text())
    }
}
```

---

## Common Pitfalls

- **Forgetting `bw.Flush()`**: A buffered writer holds data in memory. If you don't flush, the last chunk is silently dropped when the function returns.
- **Not closing `r.Body`**: HTTP response bodies must be fully read AND closed, otherwise the underlying TCP connection is not returned to the pool.
- **Scanner default 64KB limit**: `bufio.Scanner` returns `bufio.ErrTooLong` for lines exceeding 64KB. Use `scanner.Buffer` to increase the limit.
- **`os.Open` is read-only**: For write access, use `os.OpenFile` with the appropriate flags.

---

## Review Questions

1. Why does `io.Copy` use chunked reads internally rather than `io.ReadAll` + write?
2. What happens if you write to a `bufio.Writer` and exit the function without calling `Flush()`?
3. Explain why `io.LimitReader` is important when reading HTTP request bodies.
4. How does `net/http` handle 10,000 simultaneous connections? What goroutine/thread model does it use?

---

#Go #Golang #IO #HTTP #bufio #FileIO #ioReader #ioWriter
