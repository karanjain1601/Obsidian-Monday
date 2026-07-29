---
title: Go Toolchain
aliases: [go vet, golangci-lint, go generate, go build tags, cross-compilation]
tags: [Go, Golang, Toolchain, Linting, BuildTags, CrossCompile, govet]
domain: Go
difficulty: Intermediate
created: 2026-07-29
related:
  - "[[Go_Overview]]"
  - "[[Go_Packages_and_Modules]]"
  - "[[Go_Performance]]"
  - "[[Go_Production_Patterns]]"
status: complete
---

# Go Toolchain

> [!abstract] TL;DR
> The `go` command is a unified toolchain: `go build`, `go test`, `go fmt`, `go vet`, `go generate`, `go mod`. `golangci-lint` runs 50+ linters in one pass. Build tags conditionally include files. Cross-compilation is first-class: set `GOOS`/`GOARCH` and `go build` produces a native binary for the target platform. CGo calls C libraries but breaks cross-compilation.

---

## Core go Commands

```bash
# Compilation
go build ./...              # build all packages
go build -o bin/app ./cmd/app  # build with output name
go run ./cmd/app            # compile and run (no artifact)
go install ./...            # build and install to $GOPATH/bin

# Testing
go test ./...               # run all tests
go test -v -run TestXxx ./pkg/... # verbose, filter by name
go test -race ./...         # race detector
go test -bench=. -benchmem ./... # benchmarks with allocation stats
go test -cover ./...        # coverage report
go test -coverprofile=cover.out ./...
go tool cover -html=cover.out  # HTML coverage view

# Code quality
go fmt ./...                # format all files (use gofmt or goimports)
go vet ./...                # static analysis built into the toolchain
go doc net/http Server      # show documentation for a type

# Module management
go mod init github.com/org/repo
go mod tidy
go mod download
go list -m all              # list all module dependencies
go get github.com/pkg@v1.2.3
go get -u ./...             # upgrade all direct dependencies to latest minor

# Tooling
go env                      # show all Go environment variables
go version                  # Go version in use
go clean -cache             # clear build cache
```

---

## go vet

`go vet` catches common programming mistakes that compile but are semantically wrong:

```bash
go vet ./...
```

Catches:
- `printf` format/argument mismatches: `fmt.Printf("%s", 42)` 
- Unreachable code
- Copying mutexes: `var m sync.Mutex; m2 := m` (struct copy)
- Incorrect struct tags: `json: "name"` (space after colon)
- Misuse of `sync/atomic`
- Context passed after cancellation

---

## golangci-lint

`golangci-lint` runs many linters concurrently in one pass — much faster than running them individually:

```bash
# Install
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Run
golangci-lint run ./...
golangci-lint run --fix ./...   # auto-fix where possible
```

```yaml
# .golangci.yml
linters:
  enable:
    - errcheck        # check all error return values are handled
    - gosimple        # simplify code
    - staticcheck     # advanced static analysis (SA/S/ST rules)
    - unused          # report unused code
    - govet           # shadow variable detection, etc.
    - revive          # opinionated linting rules
    - gofmt           # format check
    - misspell        # spelling errors in comments
    - exhaustive      # ensure all switch arms covered for enums
    - bodyclose       # check http response bodies are closed
    - noctx           # find HTTP requests without context

linters-settings:
  errcheck:
    check-type-assertions: true
```

---

## Build Tags

Build tags conditionally include or exclude files from compilation:

```go
//go:build linux && amd64
// +build linux,amd64    (old style, still supported)

package myapp

// This file is only compiled on Linux AMD64
func platformSpecific() string { return "linux-amd64" }
```

```bash
# Build with a custom tag
go build -tags production ./...

# In code
//go:build production
package config

const Endpoint = "https://api.example.com"
```

**Common built-in constraints:**

| Tag | When active |
|---|---|
| `linux`, `darwin`, `windows` | GOOS = linux/darwin/windows |
| `amd64`, `arm64`, `386` | GOARCH |
| `cgo` | CGo is enabled |
| `integration` | custom tag for integration tests |

---

## Cross-Compilation

Set `GOOS` and `GOARCH` — no additional tools needed:

```bash
# Linux AMD64 (most common for Docker)
GOOS=linux GOARCH=amd64 go build -o app-linux-amd64 ./cmd/app

# macOS ARM (Apple Silicon)
GOOS=darwin GOARCH=arm64 go build -o app-darwin-arm64 ./cmd/app

# Windows
GOOS=windows GOARCH=amd64 go build -o app-windows-amd64.exe ./cmd/app

# Common GOOS values: linux, darwin, windows, freebsd
# Common GOARCH values: amd64, arm64, 386, arm

# Makefile pattern
.PHONY: build-all
build-all:
	GOOS=linux  GOARCH=amd64 go build -o bin/app-linux  ./cmd/app
	GOOS=darwin GOARCH=arm64 go build -o bin/app-darwin ./cmd/app
```

> [!warning] Cross-compilation does NOT work when `cgo` is enabled (which is the default for some packages). Disable with `CGO_ENABLED=0 go build`.

---

## go generate

`go generate` runs commands before compilation — used for code generation:

```go
// In a Go source file
//go:generate protoc --go_out=. user.proto
//go:generate mockery --name=UserStore --output=./mocks
//go:generate stringer -type=Status
```

```bash
go generate ./...   # runs all //go:generate directives
```

Common uses:
- Generate gRPC code from proto files
- Generate mock implementations
- Generate `String()` methods for enums via `stringer`
- Embed assets: `//go:generate go run github.com/kevinburke/go-bindata/go-bindata`

---

## go:embed

Embed files into the binary at compile time:

```go
import _ "embed"
import "embed"

//go:embed config/default.yaml
var defaultConfig []byte

//go:embed web/static
var staticFiles embed.FS

// Use in HTTP server
http.Handle("/static/", http.FileServerFS(staticFiles))
```

---

## Makefile Pattern

```makefile
VERSION := $(shell git describe --tags --always --dirty)
LDFLAGS := -ldflags "-X main.Version=$(VERSION) -s -w"

.PHONY: build test lint

build:
	CGO_ENABLED=0 go build $(LDFLAGS) -o bin/app ./cmd/app

test:
	go test -race -count=1 ./...

lint:
	golangci-lint run ./...

cover:
	go test -coverprofile=cover.out ./...
	go tool cover -html=cover.out

docker:
	docker build -t myapp:$(VERSION) .
```

---

## Common Pitfalls

- **`gofmt` vs `goimports`**: `gofmt` formats code; `goimports` also adds/removes import statements. Use `goimports` in CI.
- **CGo and cross-compilation**: `import "C"` requires a C compiler for the target. Disable CGo with `CGO_ENABLED=0` for pure Go cross-compilation.
- **Build cache invalidation**: The build cache is keyed by source + flags. Adding `-race` or `-tags` creates separate cached artifacts.
- **`go generate` is manual**: It does NOT run automatically during `go build`. You must run it explicitly and commit the generated files, or run it in CI before build.

---

## Review Questions

1. What is the difference between `go vet` and `golangci-lint`?
2. Write a build tag that includes a file only on Linux and macOS but not Windows.
3. Why does cross-compilation break with CGo, and what environment variable disables it?
4. What does `go mod tidy` do that `go get` does not?

---

#Go #Golang #Toolchain #Linting #BuildTags #CrossCompile #govet #golangcilint
