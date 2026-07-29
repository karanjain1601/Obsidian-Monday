---
title: "Test Automation Architecture"
aliases: ["Automation Framework Design", "POM Architecture", "Screenplay Pattern"]
tags: [QA, Testing, Automation, Architecture, POM, Screenplay, Allure]
domain: QA Testing
difficulty: Advanced
created: 2026-07-29
related: []
status: complete
---

# Test Automation Architecture

> [!abstract] TL;DR
> A well-designed automation framework prioritises **maintainability over raw coverage** — a suite that takes a day to update after every UI change provides no value. Page Object Model (POM) abstracts UI interaction behind typed classes; the Screenplay Pattern further separates *who* (actor), *what* (task), and *what to ask* (question). Data-driven testing decouples test logic from test data. Flaky tests are the #1 enemy — quarantine immediately, fix root cause, never ignore. Allure and ExtentReports turn JUnit XML into rich, shareable reports.

---

## Framework Design Principles

```
Automation Framework Design Hierarchy
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Maintainability   > Coverage
   (A 50-test suite you maintain > a 500-test suite nobody touches)

2. Independence      > Speed
   (Each test must be self-sufficient; shared state causes flakiness)

3. Clarity           > Cleverness
   (A new QA should understand a test without asking for help)

4. Fast feedback     > Completeness
   (Unit tests first, E2E only for critical flows)
```

---

## Page Object Model — Deep Dive

POM's single rule: **never put a CSS/XPath selector in a test class**. All locator knowledge lives in page objects.

```java
// Base page — shared utilities
public abstract class BasePage {
    protected final WebDriver driver;
    protected final WebDriverWait wait;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    protected WebElement waitForVisible(By locator) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    protected void click(By locator) {
        wait.until(ExpectedConditions.elementToBeClickable(locator)).click();
    }

    protected void type(By locator, String text) {
        WebElement el = waitForVisible(locator);
        el.clear();
        el.sendKeys(text);
    }

    protected String getText(By locator) {
        return waitForVisible(locator).getText();
    }
}

// Checkout Page — specific interactions
public class CheckoutPage extends BasePage {
    private final By firstNameField = By.cssSelector("[data-testid='first-name']");
    private final By lastNameField = By.cssSelector("[data-testid='last-name']");
    private final By cardNumberField = By.cssSelector("[data-testid='card-number']");
    private final By placeOrderButton = By.cssSelector("[data-testid='place-order']");
    private final By orderConfirmation = By.cssSelector("[data-testid='order-id']");
    private final By errorMessage = By.cssSelector("[data-testid='payment-error']");

    public CheckoutPage(WebDriver driver) { super(driver); }

    public CheckoutPage fillBillingInfo(String firstName, String lastName) {
        type(firstNameField, firstName);
        type(lastNameField, lastName);
        return this;
    }

    public CheckoutPage enterCard(String cardNumber, String expiry, String cvv) {
        type(cardNumberField, cardNumber);
        // ... more fields
        return this;    // fluent chaining
    }

    public OrderConfirmationPage placeOrder() {
        click(placeOrderButton);
        return new OrderConfirmationPage(driver);
    }

    public String getPaymentError() {
        return getText(errorMessage);
    }
}

// Test — reads like a business scenario
@Test
void successfulCheckout_displaysOrderConfirmation() {
    OrderConfirmationPage confirmation = new CheckoutPage(driver)
        .fillBillingInfo("Alice", "Smith")
        .enterCard("4111111111111111", "12/28", "123")
        .placeOrder();

    assertThat(confirmation.getOrderId()).matches("[A-Z]{2}-\\d{8}");
    assertThat(confirmation.getStatus()).isEqualTo("CONFIRMED");
}
```

---

## Screenplay Pattern

Screenplay improves on POM by explicitly modelling: **who** (Actor), **what they do** (Task), **what they observe** (Question).

```java
// Actor — the who
Actor alice = Actor.named("Alice").whoCan(BrowseTheWeb.with(driver));

// Task — reusable business action
public class CheckOut implements Task {
    private final String card;

    public static CheckOut withCard(String card) {
        return new CheckOut(card);
    }

    @Override
    public <T extends Actor> void performAs(T actor) {
        actor.attemptsTo(
            Fill.in(CheckoutPage.cardNumber()).with(card),
            Click.on(CheckoutPage.placeOrderButton())
        );
    }
}

// Question — observable outcome
public class OrderStatus implements Question<String> {
    @Override
    public String answeredBy(Actor actor) {
        return Text.of(ConfirmationPage.orderStatus()).answeredBy(actor);
    }
}

// Test — pure business language
@Test
void alice_checks_out_successfully() {
    alice.attemptsTo(
        NavigateTo.checkoutPage(),
        CheckOut.withCard("4111111111111111")
    );

    assertThat(alice.asksAboutThe(new OrderStatus()))
        .isEqualTo("CONFIRMED");
}
```

**POM vs Screenplay**:
| Aspect | POM | Screenplay |
|--------|-----|-----------|
| Abstraction level | Page (UI) | Business action |
| Reuse | Page classes | Tasks composable across scenarios |
| Actor concept | No | Yes — multi-user scenarios natural |
| Learning curve | Low | High |
| Best for | Simple to medium suites | Complex, multi-actor scenarios |

---

## Data-Driven Testing

```java
// CSV-driven test
@ParameterizedTest
@CsvFileSource(resources = "/test-data/login-scenarios.csv", numLinesToSkip = 1)
@DisplayName("Login scenarios from CSV")
void login_datadriven(String email, String password, String expectedOutcome, String expectedMessage) {
    LoginPage login = new LoginPage(driver).navigate();
    login.enterCredentials(email, password).submit();

    if ("SUCCESS".equals(expectedOutcome)) {
        assertThat(new DashboardPage(driver).isVisible()).isTrue();
    } else {
        assertThat(login.getErrorMessage()).contains(expectedMessage);
    }
}
```

```csv
// /test-data/login-scenarios.csv
email,password,expectedOutcome,expectedMessage
alice@example.com,correct123,SUCCESS,
alice@example.com,wrongpass,FAILURE,Invalid credentials
notanemail,anypass,FAILURE,Enter a valid email
alice@example.com,,FAILURE,Password is required
```

**JSON-driven for complex structures**:
```java
@ParameterizedTest
@MethodSource("checkoutScenarios")
void checkout_withVariousCards(CheckoutScenario scenario) {
    // ...
}

static Stream<CheckoutScenario> checkoutScenarios() throws IOException {
    return objectMapper.readValue(
        Paths.get("src/test/resources/checkout-scenarios.json").toFile(),
        new TypeReference<List<CheckoutScenario>>() {}
    ).stream();
}
```

---

## Flaky Test Management

**Flaky test**: a test that alternates between pass and fail without code changes — the #1 enemy of CI reliability.

**Root causes and fixes**:

| Root Cause | Example | Fix |
|-----------|---------|-----|
| Timing/async | Element not yet visible | Use explicit wait instead of sleep |
| Shared test data | Two parallel tests use same user | Isolate test data per test |
| Order dependency | Test B requires Test A's data | Each test creates its own data |
| Network instability | External API call fails | Mock external dependencies |
| Browser rendering | CSS animation not complete | Wait for animation class to be removed |
| Date/time | Test assumes specific date | Mock `Clock`/`Date.now()` |

**Quarantine process**:
```yaml
# Mark flaky test for quarantine (JUnit 5 + custom tag)
@Test
@Tag("quarantined")
@Disabled("Flaky - tracked in JIRA QA-445")
void checkoutWithSlowNetwork_handlesTimeout() { ... }

# Exclude quarantined tests from main CI run
mvn test -Dgroups='!quarantined'

# Run quarantined tests separately (weekly, with retry)
mvn test -Dgroups='quarantined' -Dsurefire.rerunFailingTestsCount=3
```

**Target**: quarantined tests should be fixed within 1 sprint. A growing quarantine pool is a quality signal.

---

## Test Pyramid Implementation

```
Unit Tests (70%): fast, no I/O
  - Every function with logic
  - Edge cases and boundary values
  - Mocked dependencies

Integration Tests (20%): moderate speed
  - Service layer with real database (Testcontainers)
  - API endpoints with MockMvc
  - Repository layer with H2

E2E Tests (10%): slow, full stack
  - Critical user journeys only
  - Login → key feature → sign out
  - Payment happy path
  - NOT: every edge case (covered at lower levels)
```

```java
// Testcontainers for real-DB integration tests
@SpringBootTest
@Testcontainers
class OrderRepositoryTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("testdb")
        .withUsername("test")
        .withPassword("test");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired OrderRepository repo;

    @Test
    void findByStatus_returnsPendingOrders() {
        repo.save(OrderFactory.pendingOrder());
        repo.save(OrderFactory.confirmedOrder());

        List<Order> pending = repo.findByStatus(OrderStatus.PENDING);
        assertThat(pending).hasSize(1);
    }
}
```

---

## Parallel Test Execution

```xml
<!-- Maven Surefire parallel execution -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <parallel>classes</parallel>
        <useUnlimitedThreads>false</useUnlimitedThreads>
        <threadCount>4</threadCount>
        <!-- Or use all available CPUs -->
        <forkCount>1C</forkCount>  <!-- 1x CPU count -->
        <reuseForks>true</reuseForks>
    </configuration>
</plugin>
```

```java
// JUnit 5 parallel config: src/test/resources/junit-platform.properties
junit.jupiter.execution.parallel.enabled=true
junit.jupiter.execution.parallel.mode.default=concurrent
junit.jupiter.execution.parallel.mode.classes.default=concurrent
junit.jupiter.execution.parallel.config.strategy=fixed
junit.jupiter.execution.parallel.config.fixed.parallelism=4
```

**Thread-safety requirements for parallel tests**:
- Each test must have its own `WebDriver` instance (ThreadLocal)
- Test data must be unique per test (UUID-based)
- No shared static mutable state

---

## Allure Report Generation

```xml
<!-- pom.xml -->
<dependency>
    <groupId>io.qameta.allure</groupId>
    <artifactId>allure-junit5</artifactId>
    <version>2.24.0</version>
    <scope>test</scope>
</dependency>
```

```java
// Annotate tests for rich Allure reports
@Feature("Checkout")
@Story("Payment with credit card")
@Severity(SeverityLevel.CRITICAL)
@Owner("QA Team")
@Test
@DisplayName("Successful checkout with Visa card")
void checkout_withVisa_succeeds() {
    Allure.step("Navigate to checkout", () -> {
        new CartPage(driver).proceedToCheckout();
    });
    Allure.step("Enter payment details", () -> {
        new CheckoutPage(driver).enterCard("4111111111111111", "12/28", "123");
    });
    Allure.step("Place order", () -> {
        new CheckoutPage(driver).placeOrder();
    });
    Allure.step("Verify confirmation", () -> {
        assertThat(new ConfirmationPage(driver).getOrderId()).isNotNull();
    });

    // Attach screenshot on pass (for documentation)
    Allure.addAttachment("Confirmation Screenshot",
        new ByteArrayInputStream(((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES)));
}
```

```bash
# Generate and serve Allure report
mvn test
allure serve target/allure-results

# Generate static report
allure generate target/allure-results -o target/allure-report --clean
```

---

## Common Pitfalls

1. **Page Objects with too much business logic** — page objects model *how* to interact with a page, not *why*; business rules belong in the test or a task layer
2. **Static shared `WebDriver`** — parallel tests sharing a single driver instance will race condition; use `ThreadLocal<WebDriver>` or JUnit 5 `@ExtendWith` injection
3. **Growing quarantine pool** — if quarantined tests are never fixed, the suite's reliability signal degrades; treat each quarantine entry as a sprint-level priority
4. **Skipping teardown on failure** — if `@AfterEach` only runs when tests pass, failed tests leave polluted state; always run teardown with `try/finally` or JUnit's `@AfterEach` (which always runs)
5. **No test tagging strategy** — without `@Tag("smoke")`, `@Tag("regression")`, `@Tag("integration")`, you can't selectively run subsets; define a tagging convention early

---

## Review Questions

1. What is the difference between POM and the Screenplay Pattern? When would Screenplay be worth the extra complexity?
2. What are the five most common root causes of flaky tests, and how do you fix each?
3. How does parallel test execution affect test data management requirements?
4. How would you implement a data-driven test for login scenarios using a CSV file with JUnit 5?

---

## Related Notes

- [[_MOC_QA_Testing_Master|↑ QA Testing MOC]]
- [[Selenium_and_WebDriver]]
- [[CI_CD_Testing_Integration]]
- [[_MOC_Java_Testing|Java Testing MOC]]

---

#QA #Testing #Automation #Architecture #POM #Screenplay #Allure
