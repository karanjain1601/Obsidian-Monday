---
title: Scala Build Tools
aliases: [sbt, Scala build tool, Mill Scala, Scala CLI, Scala ecosystem libraries]
tags: [Scala, sbt, Mill, ScalaCLI, BuildTools, Ecosystem]
domain: Scala
difficulty: Beginner
created: 2026-07-29
related: []
status: complete
---

# Scala Build Tools

> [!abstract] TL;DR
> `sbt` (Simple Build Tool) is the standard Scala build tool with a DSL-based `build.sbt`, incremental compilation, and a rich plugin ecosystem. `Mill` is a faster, simpler alternative with a pure-Scala build definition. `Scala CLI` is ideal for scripts and single-file programs. The wider ecosystem includes Cats/Cats-Effect, ZIO, http4s, Circe, Doobie, and Tapir as the primary FP-style library stack.

---

## Intuition

sbt can feel like magic — it loads your code as a project, cross-compiles to multiple Scala versions, and manages incremental compilation. The DSL uses ``:=`` for setting values and ``++=`` for appending to sequences. Once you understand the `build.sbt` structure and know the key plugins, most projects follow the same pattern.

---

## How It Works

### sbt — build.sbt Structure

```scala
// build.sbt — at project root

// Global settings
ThisBuild / scalaVersion     := "3.4.2"
ThisBuild / organization     := "com.example"
ThisBuild / organizationName := "Example Corp"

// Project settings
lazy val root = (project in file("."))
  .settings(
    name    := "my-app",
    version := "0.1.0-SNAPSHOT",
    
    // Dependencies
    libraryDependencies ++= Seq(
      "org.typelevel"  %% "cats-core"        % "2.12.0",
      "org.typelevel"  %% "cats-effect"      % "3.5.4",
      "io.circe"       %% "circe-core"       % "0.14.9",
      "io.circe"       %% "circe-generic"    % "0.14.9",
      "io.circe"       %% "circe-parser"     % "0.14.9",
      "org.http4s"     %% "http4s-ember-server" % "0.23.27",
      "org.http4s"     %% "http4s-circe"        % "0.23.27",
      "org.scalatest"  %% "scalatest"        % "3.2.18"  % Test,
      "org.scalamock"  %% "scalamock"        % "6.0.0"   % Test
    ),

    // Compiler options — strict mode
    scalacOptions ++= Seq(
      "-deprecation",
      "-feature",
      "-Xfatal-warnings",
      "-Yexplicit-nulls"         // Scala 3: make null explicit
    )
  )
```

### sbt — Key Commands

```bash
# Development workflow
sbt compile          # incremental compile
sbt test             # run all tests
sbt run              # run main class
sbt console          # REPL with all dependencies loaded

# Continuous mode — rerun on file change
sbt ~compile
sbt ~test
sbt "~testOnly *MySpec"

# Cross-compilation for multiple Scala versions
sbt +compile
sbt +publish

# Package and publish
sbt package          # produce JAR
sbt publishLocal     # publish to ~/.ivy2 local cache
sbt assembly         # fat JAR (requires sbt-assembly plugin)

# Task inspection
sbt "show libraryDependencies"
sbt dependencyTree   # (requires sbt-dependency-tree plugin)
```

### sbt Multi-Project Build

```scala
// Multiple modules in one repository
lazy val core = (project in file("core"))
  .settings(
    name := "my-app-core",
    libraryDependencies ++= coreDeps
  )

lazy val api = (project in file("api"))
  .dependsOn(core)
  .settings(
    name := "my-app-api",
    libraryDependencies ++= apiDeps
  )

lazy val root = (project in file("."))
  .aggregate(core, api)    // build both when building root
  .settings(publish / skip := true)
```

### project/plugins.sbt — Common Plugins

```scala
// project/plugins.sbt
addSbtPlugin("com.eed3si9n"  % "sbt-assembly"      % "2.2.0")  // fat JAR
addSbtPlugin("org.scalameta" % "sbt-scalafmt"       % "2.5.2")  // auto-format
addSbtPlugin("io.spray"      % "sbt-revolver"       % "0.10.0") // sbt reStart/reStop
addSbtPlugin("com.github.sbt" % "sbt-native-packager" % "1.10.0") // Docker image
addSbtPlugin("org.scoverage" % "sbt-scoverage"      % "2.1.0")  // code coverage
```

### Mill — Simpler Alternative

```scala
// build.sc (Mill uses pure Scala, not DSL)
import mill._, scalalib._

object app extends ScalaModule:
  def scalaVersion = "3.4.2"

  def ivyDeps = Agg(
    ivy"org.typelevel::cats-core:2.12.0",
    ivy"io.circe::circe-core:0.14.9"
  )

  object test extends ScalaTests:
    def ivyDeps   = Agg(ivy"org.scalatest::scalatest:3.2.18")
    def testFramework = "org.scalatest.tools.Framework"
```

```bash
# Mill commands
mill app.compile
mill app.test
mill app.run
mill --watch app.compile   # continuous mode
```

### Scala CLI — Scripts and Experiments

```scala
// hello.scala — run directly with: scala-cli hello.scala
//> using scala "3.4.2"
//> using dep "org.typelevel::cats-core:2.12.0"

import cats.implicits.*

@main def hello(): Unit =
  val result = List(1, 2, 3).foldMap(identity)
  println(s"Sum: $result")
```

### Key Ecosystem Libraries

| Category | Library | Purpose |
|---|---|---|
| FP Core | `cats-core` | Typeclasses (Functor, Monad, Semigroup) |
| Effects | `cats-effect` | Pure async IO, fibers, Resource |
| Effects | `zio` | ZIO[R, E, A] — FP effects with DI |
| HTTP | `http4s` | Pure FP HTTP server/client |
| HTTP | `tapir` | API-first type-safe endpoints |
| JSON | `circe` | JSON codec derivation |
| Database | `doobie` | Pure functional JDBC |
| Database | `skunk` | Postgres-native FP client |
| Streaming | `fs2` | Functional streams (Cats Effect) |
| Lenses | `monocle` | Immutable nested data updates |
| Config | `pureconfig` | Type-safe config loading |
| Testing | `munit` | Lightweight test framework |
| Serialisation | `magnolia` | Auto typeclass derivation |

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | `%%` vs `%` in dependencies — `%%` appends Scala version suffix automatically | Use `%%` for Scala libraries; `%` for Java libraries |
| 2 | sbt loads slowly — JVM startup overhead | Use `sbt` shell and stay inside (not a new process per command) |
| 3 | `project/` folder also needs Scala 2.12 — can't use Scala 3 syntax there | Keep `project/` files in Scala 2 syntax even on Scala 3 projects |
| 4 | Dependency conflict — two versions of same library | Use `dependencyOverrides += "org" %% "lib" % "version"` to force a version |
| 5 | `assembly` mergeStrategy conflicts — duplicate files in fat JAR | Add `assemblyMergeStrategy` rules in `build.sbt` |

## Review Questions

1. What does `%%` do in a sbt dependency declaration, and why is it needed?
2. How does `sbt ~test` differ from `sbt test`?
3. What is the main architectural difference between sbt and Mill build definitions?

---

Related: [[Scala_Overview]] | [[Scala_Testing]] | [[Cats_and_ZIO_Overview]] | [[Play_Framework]]

#Scala
