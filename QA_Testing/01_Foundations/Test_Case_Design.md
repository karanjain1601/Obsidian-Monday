---
title: "Test Case Design"
aliases: ["Test Case Writing", "BDD Gherkin", "Traceability Matrix"]
tags: [QA, Testing, Foundations, TestCases, BDD, Gherkin]
domain: QA Testing
difficulty: Beginner
created: 2026-07-29
related: []
status: complete
---

# Test Case Design

> [!abstract] TL;DR
> A well-designed test case is **atomic** (tests one thing), **independent** (no ordering dependency), and **repeatable** (same result every run). BDD Gherkin (Given/When/Then) turns acceptance criteria into executable specifications. Test data must be isolated per test — shared mutable state is the leading cause of intermittent ("flaky") test failures. Coverage types range from statement coverage (weakest) through branch, condition, and MC/DC (strongest, required for safety-critical systems).

---

## Anatomy of a Test Case

```
┌─────────────────────────────────────────────────────────────────┐
│ TC-ID: TC-0042                                                  │
│ Title: Checkout with expired credit card returns 402 error      │
│ Module: Payment Service                                         │
│ Priority: High  │  Severity: Critical  │  Type: Negative        │
├─────────────────────────────────────────────────────────────────┤
│ Preconditions:                                                  │
│  - User is logged in (valid session token)                      │
│  - Cart contains ≥1 item                                        │
│  - Test card: 4000 0000 0000 0002 (Stripe test: card_declined)  │
├─────────────────────────────────────────────────────────────────┤
│ Steps:                                                          │
│  1. POST /api/checkout  { "card_token": "tok_expired" }         │
│  2. Check response status code                                  │
│  3. Check response body                                         │
├─────────────────────────────────────────────────────────────────┤
│ Expected Result:                                                │
│  - HTTP 402 Payment Required                                    │
│  - Body: { "error": "CARD_EXPIRED", "message": "..." }          │
│  - Cart remains intact (not cleared)                            │
├─────────────────────────────────────────────────────────────────┤
│ Actual Result: [populated on execution]                         │
│ Status: Pass / Fail / Blocked / Skipped                         │
│ Notes: [screenshots, logs]                                      │
└─────────────────────────────────────────────────────────────────┘
```

**Key fields**:
- **TC-ID**: unique, immutable identifier — do not reuse IDs
- **Preconditions**: system state required *before* step 1 — if not met, mark Blocked
- **Steps**: numbered, imperative, unambiguous — "click the Submit button" not "submit"
- **Expected result**: specific and verifiable — never "should work correctly"
- **Actual result**: filled in at execution time, never pre-populated

---

## Test Case Writing Best Practices

| Principle | Good | Bad |
|-----------|------|-----|
| **Atomic** | One assertion per test case | "Test the entire checkout flow" |
| **Independent** | Each test creates its own user/data | Test 2 requires Test 1 to have run first |
| **Repeatable** | Same result on any machine, any time | "Works on my machine" — uses localhost |
| **Self-documenting** | Title reads as a sentence: "Expired card returns 402" | "Test 42" |
| **Traceable** | Links to requirement REQ-117 | Orphan test with no parent requirement |

**INVEST** principle adapted for test cases: Independent, No-side-effects, Verifiable, Explicit, Self-contained, Traceable.

---

## BDD with Gherkin (Given/When/Then)

Gherkin is a structured language that bridges business requirements and automated tests. Written *before* coding begins — the three amigos (Dev + QA + BA) write scenarios together.

### Syntax

```gherkin
Feature: User Authentication
  As a registered user
  I want to log in to my account
  So that I can access my dashboard

  Background:
    Given the application is running
    And the database has been seeded with test users

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter username "alice@example.com" and password "SecurePass123"
    And I click the "Sign In" button
    Then I should be redirected to "/dashboard"
    And I should see "Welcome, Alice" in the header
    And a session cookie should be set with HttpOnly and Secure flags

  Scenario: Login fails with incorrect password
    Given I am on the login page
    When I enter username "alice@example.com" and password "wrongpassword"
    And I click the "Sign In" button
    Then I should remain on the login page
    And I should see the error message "Invalid credentials"
    And no session cookie should be set

  Scenario Outline: Login fails with invalid email formats
    Given I am on the login page
    When I enter username "<email>" and password "anypassword"
    Then the email field should show validation error "<error>"

    Examples:
      | email          | error                    |
      | notanemail     | "Enter a valid email"    |
      | @missing.com   | "Enter a valid email"    |
      | test@          | "Enter a valid email"    |
```

**Step definitions** (Java + Cucumber):

```java
@Given("I am on the login page")
public void iAmOnTheLoginPage() {
    driver.get(baseUrl + "/login");
    assertThat(driver.getTitle()).contains("Login");
}

@When("I enter username {string} and password {string}")
public void iEnterCredentials(String username, String password) {
    driver.findElement(By.id("email")).sendKeys(username);
    driver.findElement(By.id("password")).sendKeys(password);
}

@Then("I should be redirected to {string}")
public void iShouldBeRedirectedTo(String path) {
    assertThat(driver.getCurrentUrl()).endsWith(path);
}
```

---

## Test Data Management

**Core rule**: every test must own its data — create it in `@BeforeEach`, clean up in `@AfterEach`. Shared mutable test data causes order-dependent, intermittent failures.

```java
@BeforeEach
void createTestUser() {
    testUser = userFactory.create()
        .withEmail("test-" + UUID.randomUUID() + "@example.com")
        .withRole(Role.CUSTOMER)
        .build();
}

@AfterEach
void deleteTestUser() {
    userRepository.delete(testUser.getId());
}
```

**Data factories** (using test-data-supplier or custom builders):

```java
public class OrderFactory {
    public static Order pendingOrder() {
        return Order.builder()
            .id(UUID.randomUUID().toString())
            .status(OrderStatus.PENDING)
            .items(List.of(OrderItem.of("SKU-001", 2, BigDecimal.valueOf(29.99))))
            .createdAt(Instant.now())
            .build();
    }
}
```

**Avoid**:
- Hard-coded user IDs ("user 123 must exist in DB")
- Shared test database with production data
- Tests that depend on time of day or external API state

---

## Test Coverage Types

| Type | What It Measures | Formula | Safety Level |
|------|-----------------|---------|--------------|
| **Statement** | Each line executed | Executed statements ÷ Total | Lowest |
| **Branch** | Each if/else arm taken | Executed branches ÷ Total | Medium |
| **Condition** | Each boolean sub-expression | True + false per condition | High |
| **MC/DC** | Modified Condition/Decision Coverage | Each condition independently affects outcome | Required for DO-178C (avionics), ISO 26262 (automotive) |

```java
// Statement coverage: execute line 2
// Branch coverage: test both branches of the if
// Condition coverage: test age<18 true AND false; role==ADMIN true AND false
// MC/DC: show each condition independently influences the output

public boolean canAccess(int age, Role role) {
    if (age >= 18 && role == Role.ADMIN) {   // decision
        return true;
    }
    return false;
}
```

MC/DC test cases for `age >= 18 && role == Role.ADMIN`:
1. age=20, role=ADMIN → true (baseline)
2. age=16, role=ADMIN → false (age independently flips outcome)
3. age=20, role=USER → false (role independently flips outcome)

---

## Traceability Matrix

Links requirements to test cases, ensuring complete coverage and enabling impact analysis.

| Requirement | TC-001 | TC-002 | TC-003 | TC-004 | Coverage |
|-------------|--------|--------|--------|--------|----------|
| REQ-001: User can login | ✓ | ✓ | | | 100% |
| REQ-002: Invalid login shows error | | ✓ | ✓ | | 100% |
| REQ-003: Session expires after 30min | | | | ✓ | 100% |
| REQ-004: Admin can delete users | | | | | **0% — GAP** |

A gap in the matrix (REQ-004) means a requirement has no tests — a release risk that must be addressed.

---

## Common Pitfalls

1. **Over-specifying test steps** — "right-click the logo then hover over..." instead of "navigate to homepage" — brittle tests break on every UI change
2. **Shared test data** — the #1 cause of intermittent failures; always isolate data per test
3. **Missing negative test cases** — most teams write only happy paths; negative cases (expired tokens, malformed input, network timeouts) catch the majority of production bugs
4. **Gherkin becoming an implementation guide** — "Click the button with id='submit'" belongs in step definitions, not in the scenario; keep scenarios at business level
5. **100% statement coverage ≠ tested** — you can have 100% statement coverage with zero assertions; assertions are what make tests meaningful

---

## Review Questions

1. What are the five elements every test case must have? Why is "expected result" defined before execution?
2. Rewrite this poor scenario in proper Given/When/Then: "Test that users can register and then log in."
3. What is the difference between branch coverage and condition coverage? Write a code example where they diverge.
4. Why is shared test data the primary cause of intermittent test failures?

---

## Related Notes

- [[_MOC_QA_Testing_Master|↑ QA Testing MOC]]
- [[QA_Overview]]
- [[Test_Types_and_Strategies]]
- [[Testing_in_Agile]]
- [[_MOC_Java_Testing|Java Testing MOC]]

---

#QA #Testing #TestCases #BDD #Gherkin
