---
title: "Text Blocks and Switch Expressions"
aliases: [Java Text Blocks, Java 15 text block, switch expression Java 14, yield keyword, arrow case]
tags: [Java, Modern_Java, TextBlocks, SwitchExpression, StringFormatting, Java14, Java15]
domain: Java
difficulty: Beginner
created: 2026-07-27
related:
  - Pattern_Matching
  - Records_and_Sealed_Classes
  - Modern_Language_Features
status: complete
---

# 🔀 Text Blocks and Switch Expressions

> [!abstract] TL;DR
> **Text blocks** (Java 15 stable) let you embed multi-line strings — JSON, SQL, HTML, YAML — between `"""` triple quotes without escape sequences or concatenation noise; the compiler strips incidental leading whitespace automatically based on the closing `"""` position. **Switch expressions** (Java 14 stable) make `switch` return a value, eliminate fall-through bugs with arrow labels (`case A -> expr`), and require exhaustiveness — no silent do-nothing branches. Together with `yield` for multi-statement cases and multiple labels per case (`case A, B ->`), switch expressions replace most traditional `switch` statements and eliminate the notorious fall-through footgun.

---

## Intuition

A classic Java string with embedded JSON is like trying to read a letter through a window covered in tape (backslashes, `\n`, `\"`, `+` concatenation) — technically readable but exhausting. A text block is the same letter lying flat on a desk in its natural shape. Switch statements are like a leaky faucet that keeps dripping (fall-through) if you forget to turn the handle (break) — switch expressions replace each handle with a self-closing valve (arrow label) that never drips.

---

## How It Works

### Text Blocks and Switch Expressions

```mermaid
graph TD
    TB["Text Blocks\n(Java 15)"]:::feat
    SE["Switch Expressions\n(Java 14)"]:::feat

    TB --> TQ["Triple-quote delimiter\n\"\"\"...\"\"\""]
    TB --> WS["Whitespace stripping\nincidental indent removed\nby closing delimiter position"]
    TB --> ESC["Escape sequences\n\\n = newline in string\n\\ = line continuation\n\\s = force trailing space"]
    TB --> FMT["String.formatted()\nfor interpolation"]

    SE --> ARR["Arrow labels\ncase A -> expr\n(no fall-through)"]
    SE --> YIELD["yield statement\nfor multi-line case blocks"]
    SE --> MULTI["Multiple labels\ncase A, B, C -> expr"]
    SE --> EXHS["Exhaustiveness\nrequired by compiler"]
    SE --> TRAD["Traditional colon cases\ncase A: ... break;\n(still allowed, fall-through intact)"]

    classDef feat fill:#FF6B35,stroke:#CC4400,color:#fff,font-weight:bold
```

---

## Key Concepts

### 1. Text Block Basics

```java
// ── BEFORE: Classic string literals ─────────────────────────────────────
String json = "{\n" +
              "  \"name\": \"Alice\",\n" +
              "  \"age\": 30,\n" +
              "  \"active\": true\n" +
              "}";

// ── AFTER: Text block (Java 15+) ────────────────────────────────────────
String json = """
        {
          "name": "Alice",
          "age": 30,
          "active": true
        }
        """;
// The closing """ determines the baseline for incidental whitespace stripping.
// 8 spaces of indentation above → all stripped → content has 0 leading spaces.
// Trailing newline IS included (closing """ is on its own line).

// To suppress trailing newline, put closing """ on same line as last content:
String noTrailing = """
        last line""";   // no trailing \n

// Multiline SQL
String sql = """
        SELECT u.id, u.name, o.total
        FROM   users u
        JOIN   orders o ON o.user_id = u.id
        WHERE  u.active = TRUE
          AND  o.total > :minAmount
        ORDER  BY o.total DESC
        """;

// Multiline HTML
String html = """
        <html>
          <body>
            <h1>Hello</h1>
          </body>
        </html>
        """;
```

### 2. Whitespace Stripping Algorithm

```java
// The compiler determines "incidental" whitespace as the shortest common
// leading whitespace across all non-empty content lines AND the closing """.

// Example — closing """ at column 8 (8 spaces indent):
String a = """
        line one        <- 8 spaces stripped
        line two        <- 8 spaces stripped
        """;
// Result: "line one\nline two\n"

// Closing """ at column 0 — nothing stripped:
String b = """
        line one
        line two
""";   // closing """ at column 0
// Result: "        line one\n        line two\n" (8 spaces retained!)

// Re-indent method for runtime adjustment:
String s = """
    text with 4-space indent
    """;
System.out.println(s.stripIndent()); // removes common leading whitespace at runtime
```

### 3. Text Block Escape Sequences

```java
// Standard escapes work as normal inside text blocks
String path = """
        C:\\Users\\alice\\Documents
        """;
// Result: C:\Users\alice\Documents

// NEW: Line terminator suppression with \ at end of line
// Useful for breaking long lines in source without introducing \n in the string
String longLine = """
        This is a very long line that \
        we broke for readability \
        but it should be one line.
        """;
// Result: "This is a very long line that we broke for readability but it should be one line.\n"

// NEW: Force trailing space with \s
// Text blocks strip trailing whitespace by default — \s prevents that
String padded = """
        one  \s
        two   \s
        three \s
        """;
// Keeps trailing spaces (useful for fixed-width formats)

// Interpolation: no native string interpolation in Java — use formatted()
String name = "Alice";
int    age  = 30;
String msg = """
        Dear %s,
        You are %d years old.
        """.formatted(name, age);
// or: String.format(template, args) — same result
```

### 4. Switch Expressions — The Basics

```java
// ── Switch STATEMENT (old) — fall-through footgun ────────────────────────
String result;
switch (day) {
    case MONDAY:
    case TUESDAY:
        result = "Early week";  // fall-through from MONDAY to TUESDAY intentional
        break;
    case WEDNESDAY:
        result = "Midweek";
        break;
    // Forgot THURSDAY, FRIDAY, SATURDAY, SUNDAY — result is uninitialized!
    default:
        result = "Other";
}

// ── Switch EXPRESSION (Java 14+) — no fall-through, must be exhaustive ───
String result2 = switch (day) {
    case MONDAY, TUESDAY                -> "Early week";      // multi-label arrow
    case WEDNESDAY                      -> "Midweek";
    case THURSDAY, FRIDAY               -> "Late week";
    case SATURDAY, SUNDAY               -> "Weekend";
    // No default — DayOfWeek is an enum with 7 values; all covered → exhaustive
};  // semicolon required (it's an expression/statement)

// Arrow cases are single expressions — no break, no fall-through
// Assigning to variable or using in larger expression:
int numLetters = switch (day) {
    case MONDAY, FRIDAY, SUNDAY    -> 6;
    case TUESDAY                   -> 7;
    case THURSDAY, SATURDAY        -> 8;
    case WEDNESDAY                 -> 9;
};
```

### 5. yield — Multi-Statement Case Blocks

```java
// When a case needs multiple statements, use a block with yield
String classify(int score) {
    return switch (score / 10) {
        case 10, 9 -> "A";
        case 8 -> "B";
        case 7 -> {
            System.out.println("Borderline C, was: " + score); // side effect
            yield "C";    // yield provides the value; replaces return in switch context
        }
        case 6 -> {
            var grade = "D";
            System.out.println("Barely passing: " + grade);
            yield grade;
        }
        default -> {
            if (score < 0) throw new IllegalArgumentException("Negative score: " + score);
            yield "F";
        }
    };
}

// yield vs return:
// - yield: exits the switch expression with a value (not the enclosing method)
// - return: exits the enclosing method; cannot be used to provide a switch-expression value

// Switch expression as a statement (value discarded — unusual but valid)
switch (command) {
    case "START"  -> server.start();
    case "STOP"   -> server.stop();
    case "RELOAD" -> server.reload();
    default       -> logger.warn("Unknown command: " + command);
};
```

### 6. Switch Expressions with Strings, Integers, Enums

```java
// ── String switch (works since Java 7, expressions since Java 14) ─────────
String httpPhrase(int code) {
    return switch (code) {
        case 200 -> "OK";
        case 201 -> "Created";
        case 400 -> "Bad Request";
        case 401 -> "Unauthorized";
        case 404 -> "Not Found";
        case 500 -> "Internal Server Error";
        default  -> "Unknown (" + code + ")";
    };
}

// ── Enum switch — exhaustive without default when all values covered ──────
enum Season { SPRING, SUMMER, AUTUMN, WINTER }

double uvIndex(Season s) {
    return switch (s) {
        case SPRING -> 4.5;
        case SUMMER -> 8.0;
        case AUTUMN -> 3.0;
        case WINTER -> 1.5;
    }; // no default — all 4 enum constants covered
}

// ── Real-world: mapping status codes to domain states ────────────────────
enum OrderStatus { PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED }

String uiLabel(OrderStatus status) {
    return switch (status) {
        case PENDING                   -> "Awaiting confirmation";
        case CONFIRMED                 -> "Order confirmed";
        case SHIPPED                   -> "On the way";
        case DELIVERED                 -> "Delivered";
        case CANCELLED                 -> "Cancelled";
    };
}
```

### 7. Combining Text Blocks with Switch Expressions

```java
// Dynamic SQL generation with text block + switch
String buildQuery(String reportType) {
    String selectClause = switch (reportType) {
        case "SUMMARY"  -> "SELECT category, SUM(amount) AS total";
        case "DETAIL"   -> "SELECT id, category, amount, created_at";
        case "PIVOT"    -> "SELECT * FROM crosstab(...)";
        default         -> throw new IllegalArgumentException("Unknown report: " + reportType);
    };

    return """
            %s
            FROM   transactions
            WHERE  created_at >= :startDate
              AND  created_at <  :endDate
            ORDER  BY category
            """.formatted(selectClause);
}

// JSON template selection
String template(String type) {
    return switch (type) {
        case "error" -> """
                {"status": "error", "message": "%s", "code": %d}
                """;
        case "ok" -> """
                {"status": "ok", "data": %s}
                """;
        default -> throw new IllegalArgumentException(type);
    };
}
```

---

## Real-World Notes

- **GraphQL / SQL in Spring**: Text blocks are idiomatic for multi-line `@Query` annotations in Spring Data — `@Query(""" SELECT u FROM User u WHERE u.active = true """)` is far more readable than concatenated strings.
- **Test fixtures**: Inline expected JSON in unit tests using text blocks — `assertThat(response).isEqualTo("""{"id":1,"name":"Alice"}""")` — instead of loading from classpath files.
- **Code generation**: When generating Java source or configuration files programmatically, text blocks with `.formatted()` replace `StringBuilder` templates cleanly.
- **Switch in streams**: Switch expressions work inside lambdas — `list.stream().map(x -> switch(x) { case A -> 1; default -> 0; })` — enabling clean, readable transformations.

---

## Common Pitfalls

| Pitfall | Consequence | Fix |
|---------|-------------|-----|
| Opening `"""` on same line as content | First line is not stripped, leading to extra blank line | Always put content on the NEXT line after the opening `"""` |
| Closing `"""` at column 0 when text is indented | Incidental whitespace is NOT stripped; leading spaces appear in string | Move closing `"""` to match the indentation of the content |
| `yield` used in switch statement (not expression) | Compile error — `yield` is only valid in switch expressions | Use `break` in switch statements; `yield` only in expressions |
| Missing `default` in switch expression over non-sealed type | Compile error — exhaustiveness cannot be proven | Add `default` or cover all possible values |
| Fall-through with arrow labels | Arrow cases never fall through — `case A, B -> expr` is multi-label, not fall-through | Use `case A, B ->` for grouping, not `:` style for fall-through |
| Trailing spaces stripped from text block lines | Fixed-width format output looks wrong | Use `\s` escape at end of line to preserve intentional trailing spaces |

---

## Related Notes

- [[_MOC_Modern_Java|↑ Section MOC — Modern Java]]
- [[Pattern_Matching]] — switch pattern matching (Java 21) builds on switch expressions
- [[Records_and_Sealed_Classes]] — sealed types enable exhaustive switch expressions
- [[Modern_Language_Features]] — overview of Java 14-21 features

---

## Review Questions

1. A text block is indented 12 spaces in the source file, and the closing `"""` is on its own line at 4 spaces of indentation. How much leading whitespace does each content line have after compilation, and why?

2. A colleague writes a switch expression but gets a compile error: "the switch expression does not cover all possible input values." The switch is over a `String` type with 5 `case` values and no `default`. Explain why this is an error for `String` but would not be an error for a 5-value enum with all 5 cases present.

3. Refactor this switch statement to a switch expression, eliminating the fall-through and the local variable assignment pattern: `String tier; switch(points) { case 0: case 1: case 2: tier = "Bronze"; break; case 3: case 4: tier = "Silver"; break; default: tier = "Gold"; }`.

---

#Java #Modern_Java #TextBlocks #SwitchExpression #yield #Java14 #Java15 #Beginner
