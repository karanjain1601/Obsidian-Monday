---
title: SAST — Static Application Security Testing
aliases: [Static Analysis, SAST, Semgrep, SonarQube]
tags: [DevSecOps, Security, SAST, StaticAnalysis, Semgrep, SonarQube]
domain: DevSecOps
difficulty: Intermediate
created: 2026-07-29
related: [DAST_Dynamic_Analysis, SCA_Dependency_Scanning, Security_in_CICD_Pipeline, OWASP_Top_10]
status: complete
---

# SAST — Static Application Security Testing

> [!abstract] TL;DR
> SAST analyzes source code, bytecode, or binaries without executing the application. It finds vulnerabilities at development time — SQL injection patterns, hardcoded secrets, insecure API usage — and can run on every commit. The main challenge is false positives; the key is choosing the right tool for your language and tuning rules.

---

## How SAST Works

SAST tools parse source code into an **Abstract Syntax Tree (AST)** or build a **Control Flow Graph (CFG)** / **Data Flow Graph (DFG)**, then apply rules (patterns) to find vulnerabilities:

```
Source Code → Parser → AST/CFG/DFG → Rule Engine → Findings
                                          │
                                    Pattern matching:
                                    - Taint tracking (user input → sink)
                                    - Regex on code structure
                                    - Semantic analysis
```

**Taint analysis** (the most powerful technique): tracks user-controlled data from **sources** (HTTP parameters, form inputs) to **sinks** (SQL queries, shell commands, HTML output) without passing through a **sanitizer**.

```
source: request.getParameter("id")    ← user input (tainted)
         ↓
         passed to
         ↓
sink:   "SELECT * FROM users WHERE id = " + id  ← SQL injection!
```

---

## Tool Landscape

### Semgrep — Fast, Customizable Rules

```bash
# Install
pip install semgrep

# Scan with OWASP Top 10 ruleset
semgrep --config p/owasp-top-ten .

# Scan with multiple rulesets
semgrep --config p/security-audit --config p/secrets .

# Run specific rule
semgrep --config p/sql-injection src/

# Output as SARIF (for GitHub Security tab)
semgrep --config p/owasp-top-ten --sarif -o results.sarif .
```

Custom Semgrep rule:
```yaml
# .semgrep/rules/no-hardcoded-secrets.yml
rules:
  - id: no-hardcoded-api-key
    patterns:
      - pattern: |
          $VAR = "..."
      - metavariable-regex:
          metavariable: $VAR
          regex: '(?i)(api_key|secret|password|token|credential)'
    message: |
      Potential hardcoded secret in variable $VAR.
      Use environment variables or a secrets manager instead.
    severity: ERROR
    languages: [python, javascript, java, go]
```

### SonarQube — Quality + Security

SonarQube combines code quality metrics (code smells, duplication, complexity) with security analysis (Security Hotspots, Vulnerabilities):

```yaml
# sonar-project.properties
sonar.projectKey=my-project
sonar.projectName=My Project
sonar.sources=src
sonar.java.binaries=target/classes
sonar.qualitygate.wait=true   # fail the build if Quality Gate fails
```

```yaml
# GitHub Actions — SonarQube scan
- name: SonarQube Scan
  uses: SonarSource/sonarqube-scan-action@master
  env:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
```

SonarQube Quality Gate can be configured to fail a build if:
- Any blocker/critical security vulnerabilities are introduced
- Security hotspots are left unreviewed
- Coverage drops below threshold

### Language-Specific Tools

| Language | Tool | Key strength |
|----------|------|-------------|
| Python | Bandit | Simple, fast, covers common Python security issues |
| JavaScript/TypeScript | eslint-plugin-security | Integrates with existing ESLint setup |
| Java | SpotBugs + FindSecBugs | Bytecode analysis, catches Java-specific issues |
| Go | gosec | Go-native, checks for race conditions + security |
| PHP | Psalm, PHPCS Security Audit | Taint analysis for PHP |
| .NET | Security Code Scan | NuGet package, MSBuild integration |

```bash
# Bandit — Python SAST
pip install bandit
bandit -r src/ -f json -o bandit-report.json
bandit -r src/ -l  # low severity and above
bandit -r src/ -ll # medium and above (common for CI gate)

# gosec — Go security scanner
go install github.com/securecodewarrior/gosec/v2/cmd/gosec@latest
gosec -fmt sarif -out gosec-results.sarif ./...

# SpotBugs + FindSecBugs (Maven)
mvn spotbugs:check -Dspotbugs.plugins=com.h3xstream.findsecbugs:findsecbugs-plugin:1.12.0
```

---

## SARIF — Standard Output Format

Security Analysis Results Interchange Format (SARIF) is the standard for interoperability between SAST tools and platforms like GitHub:

```json
{
  "version": "2.1.0",
  "runs": [{
    "tool": { "driver": { "name": "Semgrep" } },
    "results": [{
      "ruleId": "python.lang.security.audit.sqli",
      "message": { "text": "SQL injection vulnerability" },
      "locations": [{
        "physicalLocation": {
          "artifactLocation": { "uri": "src/db.py" },
          "region": { "startLine": 42, "startColumn": 15 }
        }
      }],
      "level": "error"
    }]
  }]
}
```

GitHub automatically ingests SARIF files and shows findings in the **Security → Code Scanning** tab:

```yaml
# Upload SARIF to GitHub Security tab
- name: Upload SARIF
  uses: github/codeql-action/upload-sarif@v3
  with:
    sarif_file: results.sarif
```

---

## False Positive Management

High false positive rates are the biggest reason SAST adoption fails:

**Strategies**:
1. **Start permissive, tighten gradually**: begin with warn-only, tune rules before adding hard gates
2. **Use inline suppressions** (with justification comments):
   ```python
   password = "hardcoded"  # nosec B105 -- test fixture, not production
   ```
3. **Configure baseline** — Semgrep and SonarQube both support baselines that only flag new issues (existing issues don't block PRs)
4. **Measure false positive rate** — track SAST findings that are closed as "not a vulnerability" vs. true positives

**Target**: < 20% false positive rate before adding SAST as a build-breaking gate.

---

## SAST in CI Pipeline — Fail Behavior

```yaml
# GitHub Actions — SAST with appropriate fail behavior
jobs:
  sast:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Phase 1: Critical/High issues block the PR
      - name: Semgrep — block on critical
        uses: semgrep/semgrep-action@v1
        with:
          config: p/owasp-top-ten
          generateSarif: true
        env:
          SEMGREP_APP_TOKEN: ${{ secrets.SEMGREP_APP_TOKEN }}

      # Phase 2: Upload findings (medium/low — informational)
      - name: Upload SARIF
        if: always()
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: semgrep.sarif
```

**Severity-based gate policy**:
- **Critical/High**: fail the build (block merge)
- **Medium**: report as warning, allow merge, create tracking issue
- **Low/Info**: report only, no action required

---

## IDE Integration

Catch issues before they are committed:

- **VS Code**: Semgrep extension, SonarLint
- **IntelliJ IDEA**: SonarLint plugin (connects to SonarQube server for org-wide rules)
- **Pre-commit hook**: run lightweight SAST before `git commit`

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/returntocorp/semgrep
    rev: v1.50.0
    hooks:
      - id: semgrep
        args: ["--config", "p/security-audit", "--error"]
```

---

## Common Pitfalls

- **Running SAST only at release**: SAST must run on every PR — late discovery requires expensive rework
- **Ignoring all findings as "noise"**: high false positive rate is a tuning problem, not a reason to disable SAST
- **Using only one tool**: SAST tools have different rule coverage — pair Semgrep (pattern-based) with a taint-analysis tool for better coverage
- **Not enforcing rules on new code**: SonarQube's "New Code" baseline feature prevents legacy-issue overload

---

## Review Questions

1. What is taint analysis, and how does it detect SQL injection vulnerabilities in SAST?
2. Write a Semgrep rule that detects the use of `shell=True` in Python `subprocess` calls.
3. What is SARIF, and why is it important for CI/CD integration?
4. At what severity level should SAST fail a build, and why?
5. What is the tradeoff between a comprehensive SAST scan and developer experience?

---

#DevSecOps #SAST #StaticAnalysis #Semgrep #SonarQube #Bandit #Security
