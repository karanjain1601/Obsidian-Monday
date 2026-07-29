---
title: "Selenium and WebDriver"
aliases: ["Selenium WebDriver", "Selenium 4", "Page Object Model"]
tags: [QA, Testing, UITesting, Selenium, WebDriver, POM]
domain: QA Testing
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# Selenium and WebDriver

> [!abstract] TL;DR
> Selenium WebDriver controls browsers via the W3C WebDriver protocol — the browser driver translates WebDriver commands to browser-native actions. Selenium 4 adds relative locators, CDP integration, and improved BiDi. The Page Object Model (POM) separates test logic from page interaction code, making tests maintainable at scale. Always prefer explicit waits over implicit waits; never use `Thread.sleep`. WebDriverManager automates driver binary management. Selenium Grid parallelises execution across browsers and OS combinations.

---

## Architecture

```mermaid
graph LR
    TEST["Test Code\n(Java/Python/JS)"] -->|WebDriver API calls| DRIVER["Browser Driver\n(ChromeDriver, GeckoDriver)"]
    DRIVER -->|W3C WebDriver Protocol\n(HTTP/JSON)| BROWSER["Browser\n(Chrome/Firefox/Edge)"]
    BROWSER -->|DOM events| PAGE["Web Page"]

    subgraph Grid["Selenium Grid (parallel)"]
        HUB["Grid Hub / Router"] --> NODE1["Node: Win + Chrome"]
        HUB --> NODE2["Node: Mac + Safari"]
        HUB --> NODE3["Node: Linux + Firefox"]
    end

    TEST -->|remote driver| HUB

    classDef test fill:#1d4ed8,color:#fff
    classDef driver fill:#065f46,color:#fff
    classDef browser fill:#92400e,color:#fff
    class TEST test
    class DRIVER,HUB driver
    class BROWSER,NODE1,NODE2,NODE3 browser
```

---

## Setup with WebDriverManager

```xml
<!-- Maven dependency -->
<dependency>
    <groupId>io.github.bonigarcia</groupId>
    <artifactId>webdrivermanager</artifactId>
    <version>5.8.0</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>org.seleniumhq.selenium</groupId>
    <artifactId>selenium-java</artifactId>
    <version>4.20.0</version>
    <scope>test</scope>
</dependency>
```

```java
@BeforeAll
static void setupDriver() {
    WebDriverManager.chromedriver().setup();  // downloads correct driver version automatically
}

@BeforeEach
void openBrowser() {
    ChromeOptions options = new ChromeOptions();
    options.addArguments("--headless=new");   // headless for CI
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--window-size=1920,1080");
    driver = new ChromeDriver(options);
    driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
}

@AfterEach
void closeBrowser() {
    if (driver != null) driver.quit();  // quit (not close) to release all windows + driver process
}
```

---

## Locator Strategies — Priority Order

Use the most stable, semantic locator available:

```java
// 1. ID — fastest, most stable (if IDs are stable and unique)
driver.findElement(By.id("submit-button"));

// 2. Name attribute
driver.findElement(By.name("username"));

// 3. CSS Selector — fast, readable, flexible
driver.findElement(By.cssSelector("#checkout-form .submit-btn"));
driver.findElement(By.cssSelector("[data-testid='checkout-submit']")); // data attributes preferred
driver.findElement(By.cssSelector("button[type='submit']"));

// 4. XPath — use only when CSS cannot express it
// AVOID: brittle structural XPath
driver.findElement(By.xpath("/html/body/div[3]/form/div[2]/button")); // BAD

// BETTER: attribute-based XPath
driver.findElement(By.xpath("//button[@data-testid='checkout-submit']")); // OK
driver.findElement(By.xpath("//button[text()='Place Order']"));           // OK

// 5. Selenium 4 Relative Locators
import static org.openqa.selenium.support.locators.RelativeLocator.*;
WebElement submitBtn = driver.findElement(with(By.tagName("button"))
    .below(By.id("payment-form"))
    .toRightOf(By.id("cancel-btn")));
```

**data-testid attributes** — work with your dev team to add `data-testid` attributes to key elements. They're invisible to users, stable across refactors, and the best locator strategy:
```html
<button data-testid="checkout-submit" type="submit">Place Order</button>
```

---

## Page Object Model (POM)

POM separates the "how to interact with a page" from "what to test":

```java
// Page Object — encapsulates all interactions with LoginPage
public class LoginPage {
    private final WebDriver driver;

    // Locators defined once per page
    private final By emailField = By.cssSelector("[data-testid='email-input']");
    private final By passwordField = By.cssSelector("[data-testid='password-input']");
    private final By submitButton = By.cssSelector("[data-testid='login-submit']");
    private final By errorMessage = By.cssSelector("[data-testid='error-message']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        // PageFactory alternative: PageFactory.initElements(driver, this);
    }

    public LoginPage navigate() {
        driver.get(baseUrl + "/login");
        return this;
    }

    public DashboardPage loginWith(String email, String password) {
        driver.findElement(emailField).clear();
        driver.findElement(emailField).sendKeys(email);
        driver.findElement(passwordField).sendKeys(password);
        driver.findElement(submitButton).click();
        return new DashboardPage(driver);  // fluent navigation
    }

    public String getErrorMessage() {
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
        return wait.until(ExpectedConditions.visibilityOfElementLocated(errorMessage)).getText();
    }

    public boolean isLoginButtonEnabled() {
        return driver.findElement(submitButton).isEnabled();
    }
}

// Test — clean, readable, no Selenium details
@Test
void invalidLogin_showsErrorMessage() {
    new LoginPage(driver)
        .navigate()
        .loginWith("wrong@example.com", "badpassword");

    assertThat(new LoginPage(driver).getErrorMessage())
        .contains("Invalid credentials");
}

@Test
void validLogin_redirectsToDashboard() {
    DashboardPage dashboard = new LoginPage(driver)
        .navigate()
        .loginWith("alice@example.com", "correctpassword");

    assertThat(dashboard.getWelcomeMessage()).contains("Alice");
}
```

---

## Explicit vs Implicit Waits

```java
// NEVER do this — hard-coded sleep is fragile and slow
Thread.sleep(3000);  // BAD: always waits 3s, may still fail

// NEVER use implicit waits — they interact poorly with explicit waits
driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));  // AVOID

// ALWAYS use explicit waits with ExpectedConditions
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

// Wait for element to be visible
WebElement element = wait.until(
    ExpectedConditions.visibilityOfElementLocated(By.id("success-message")));

// Wait for element to be clickable (visible + enabled)
wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("[data-testid='submit']")))
    .click();

// Wait for URL to contain a path
wait.until(ExpectedConditions.urlContains("/dashboard"));

// Wait for text to appear
wait.until(ExpectedConditions.textToBePresentInElementLocated(
    By.id("status"), "CONFIRMED"));

// Custom wait condition
wait.until(driver -> {
    String text = driver.findElement(By.id("counter")).getText();
    return Integer.parseInt(text) > 5;
});

// Fluent wait — polling interval + ignored exceptions
Wait<WebDriver> fluentWait = new FluentWait<>(driver)
    .withTimeout(Duration.ofSeconds(30))
    .pollingEvery(Duration.ofMillis(500))
    .ignoring(NoSuchElementException.class);

WebElement result = fluentWait.until(
    d -> d.findElement(By.id("async-result")));
```

---

## Selenium 4 New Features

```java
// 1. Chrome DevTools Protocol (CDP) — intercept network, override geolocation, etc.
ChromeDriver chromeDriver = (ChromeDriver) driver;
DevTools devTools = chromeDriver.getDevTools();
devTools.createSession();

// Block all image requests
devTools.send(Network.enable(Optional.empty(), Optional.empty(), Optional.empty()));
devTools.send(Network.setBlockedURLs(List.of("*.png", "*.jpg", "*.gif")));

// Override geolocation
devTools.send(Emulation.setGeolocationOverride(
    Optional.of(51.5), Optional.of(-0.12), Optional.of(10)));

// 2. Screenshot of a specific element (not full page)
WebElement orderTable = driver.findElement(By.id("order-table"));
File screenshot = orderTable.getScreenshotAs(OutputType.FILE);

// 3. Print page as PDF
PrintOptions printOptions = new PrintOptions();
printOptions.setOrientation(PrintOptions.Orientation.PORTRAIT);
Pdf pdf = ((PrintsPage) driver).print(printOptions);
```

---

## Selenium Grid — Parallel Execution

```java
// Remote WebDriver for Grid
DesiredCapabilities capabilities = new DesiredCapabilities();
capabilities.setBrowserName("chrome");
capabilities.setPlatform(Platform.LINUX);

WebDriver driver = new RemoteWebDriver(
    new URL("http://selenium-hub:4444/wd/hub"),
    capabilities
);
```

**Docker Compose for local Grid**:
```yaml
version: "3"
services:
  selenium-hub:
    image: selenium/hub:4.20.0
    ports: ["4444:4444"]

  chrome:
    image: selenium/node-chrome:4.20.0
    shm_size: "2gb"
    environment:
      - SE_EVENT_BUS_HOST=selenium-hub
      - SE_EVENT_BUS_PUBLISH_PORT=4442
      - SE_EVENT_BUS_SUBSCRIBE_PORT=4443
      - SE_NODE_MAX_SESSIONS=4
    depends_on: [selenium-hub]
    scale: 3  # 3 Chrome nodes = up to 12 parallel sessions
```

---

## Common Pitfalls

1. **`Thread.sleep` everywhere** — the biggest cause of slow, flaky tests; replace every sleep with an explicit wait targeting the actual condition
2. **Structural XPath** — `/html/body/div[3]/...` breaks on any UI change; always use attributes (`@id`, `@data-testid`, `text()`)
3. **Missing `driver.quit()` in teardown** — `close()` closes the current window; `quit()` shuts down the entire driver process and all windows; always use `quit()` in `@AfterEach`
4. **Page Objects returning `void`** — fluent page objects that return the next page (`return new DashboardPage(driver)`) enable readable chained tests; `void` methods force tests to instantiate pages manually
5. **Mixing implicit and explicit waits** — Selenium's implicit wait timeout interacts unpredictably with explicit waits; use only explicit waits

---

## Review Questions

1. Explain the Selenium WebDriver architecture: what role does the browser driver play?
2. Why is `By.cssSelector("[data-testid='submit']")` preferred over `By.xpath("/html/body/div[2]/button")`?
3. What is the Page Object Model, and how does it improve test maintainability?
4. What is the difference between `WebDriver.close()` and `WebDriver.quit()`?

---

## Related Notes

- [[_MOC_QA_Testing_Master|↑ QA Testing MOC]]
- [[Playwright_Testing]]
- [[Cypress_Testing]]
- [[CI_CD_Testing_Integration]]
- [[_MOC_Java_Testing|Java Testing MOC]]

---

#QA #Testing #Selenium #WebDriver #POM #UITesting
