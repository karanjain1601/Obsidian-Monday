---
title: PHP Testing
aliases:
  - PHPUnit
  - Pest PHP
  - PHP Unit Testing
  - PHP Test Coverage
  - Xdebug Coverage
tags: [PHP, Laravel, testing, PHPUnit, Pest]
domain: PHP
difficulty: Intermediate
created: 2026-07-29
related:
  - Laravel_Jobs_Testing_Deployment
  - PHP_Error_Handling
  - Composer_and_Packages
  - PHP_API_Development
status: complete
---

# PHP Testing

> [!abstract] TL;DR
> PHP testing has two tiers: PHPUnit (the industry standard, class-based) and Pest (modern, function-based DSL built on PHPUnit). Laravel ships with both, adding test helpers for HTTP, database, mocks, and fake facades. Faker generates realistic fake data. Xdebug measures code coverage. Pest's dataset feature replaces PHPUnit's `@dataProvider` with a cleaner API.

---

## PHPUnit — Foundation

### Test Class Structure

```php
// tests/Unit/MoneyTest.php
namespace Tests\Unit;

use App\Domain\Money;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\DataProvider;

class MoneyTest extends TestCase {
    // Test methods must start with 'test' OR use #[Test] attribute
    public function test_can_add_same_currency(): void {
        $a = new Money(100, 'USD');
        $b = new Money(50, 'USD');

        $result = $a->add($b);

        $this->assertSame(150, $result->amount());
        $this->assertSame('USD', $result->currency());
    }

    #[Test]
    public function it_throws_on_currency_mismatch(): void {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Currency mismatch');

        $usd = new Money(100, 'USD');
        $eur = new Money(50, 'EUR');
        $usd->add($eur);  // must throw
    }

    // Data providers
    #[DataProvider('conversionProvider')]
    public function test_currency_conversion(float $amount, string $from, string $to, float $expected): void {
        $money  = new Money($amount, $from);
        $result = $money->convertTo($to);
        $this->assertEqualsWithDelta($expected, $result->amount(), delta: 0.01);
    }

    public static function conversionProvider(): array {
        return [
            'USD to EUR' => [100.0, 'USD', 'EUR', 92.0],
            'EUR to GBP' => [100.0, 'EUR', 'GBP', 86.0],
            'GBP to USD' => [100.0, 'GBP', 'USD', 128.0],
        ];
    }
}
```

### Common Assertions

```php
// Equality
$this->assertEquals($expected, $actual);     // loose (==) comparison
$this->assertSame($expected, $actual);        // strict (===) comparison
$this->assertNotSame($expected, $actual);

// Truthiness
$this->assertTrue($value);
$this->assertFalse($value);
$this->assertNull($value);
$this->assertNotNull($value);

// Arrays/collections
$this->assertCount(3, $collection);
$this->assertContains('php', $array);
$this->assertArrayHasKey('name', $array);
$this->assertEmpty($array);

// Strings
$this->assertStringContainsString('hello', $str);
$this->assertMatchesRegularExpression('/^\d{4}$/', $str);

// Numbers
$this->assertGreaterThan(0, $count);
$this->assertEqualsWithDelta(3.14, $pi, delta: 0.01);

// Exceptions
$this->expectException(\RuntimeException::class);
$this->expectExceptionCode(404);
$this->expectExceptionMessage('Not found');

// Output
$this->expectOutputString("Hello World\n");
```

---

## Pest — Modern PHP Testing

Pest wraps PHPUnit with a function-based API that reads like English:

```php
// tests/Unit/MoneyTest.php (Pest style)
use App\Domain\Money;

test('can add same currency', function () {
    $result = (new Money(100, 'USD'))->add(new Money(50, 'USD'));

    expect($result->amount())->toBe(150)
        ->and($result->currency())->toBe('USD');
});

it('throws on currency mismatch', function () {
    expect(fn() => (new Money(100, 'USD'))->add(new Money(50, 'EUR')))
        ->toThrow(\InvalidArgumentException::class, 'Currency mismatch');
});

// Datasets (data providers)
dataset('conversions', [
    'USD to EUR' => [100.0, 'USD', 'EUR', 92.0],
    'EUR to GBP' => [100.0, 'EUR', 'GBP', 86.0],
]);

test('currency conversion', function (float $amount, string $from, string $to, float $expected) {
    $result = (new Money($amount, $from))->convertTo($to);
    expect($result->amount())->toBeCloseTo($expected, precision: 1);
})->with('conversions');
```

### Pest Expect API

```php
// Chained fluent assertions
expect($user)
    ->toBeInstanceOf(User::class)
    ->toHaveProperty('email')
    ->and($user->email)->toMatch('/^.+@.+\..+$/');

expect($response->json())
    ->toHaveKey('data')
    ->and($response->json('data'))->toBeArray()->toHaveCount(3);

expect($price)->toBeFloat()->toBeGreaterThan(0)->toBeLessThan(1000);

// Higher-order expectations
$users = collect([
    ['name' => 'Alice', 'age' => 30],
    ['name' => 'Bob',   'age' => 25],
]);
expect($users)->each->toHaveKey('name');
```

---

## Laravel Test Helpers

### HTTP Testing

```php
// tests/Feature/PostApiTest.php
use App\Models\{User, Post};
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('can list published posts', function () {
    Post::factory(3)->published()->create();
    Post::factory(2)->draft()->create();

    $this->actingAs($this->user)
         ->getJson('/api/v1/posts')
         ->assertOk()
         ->assertJsonCount(3, 'data')
         ->assertJsonStructure([
             'data'  => [['id', 'title', 'publishedAt']],
             'meta'  => ['total', 'per_page'],
             'links' => ['first', 'last', 'next', 'prev'],
         ]);
});

test('returns 422 for missing title', function () {
    $this->actingAs($this->user)
         ->postJson('/api/v1/posts', ['body' => 'Body without title'])
         ->assertUnprocessable()
         ->assertJsonValidationErrors(['title']);
});
```

### Database Assertions

```php
$this->assertDatabaseHas('posts', [
    'title'   => 'Hello World',
    'user_id' => $this->user->id,
]);

$this->assertDatabaseMissing('posts', ['title' => 'Deleted Post']);
$this->assertDatabaseCount('posts', 5);
$this->assertSoftDeleted('posts', ['id' => $post->id]);
```

---

## Mock Objects

```php
use PHPUnit\Framework\MockObject\MockObject;

class PaymentServiceTest extends TestCase {
    public function test_charge_succeeds(): void {
        // Create a mock of the external gateway
        /** @var MockObject&PaymentGateway $gateway */
        $gateway = $this->createMock(PaymentGateway::class);

        // Expect 'charge' to be called once with specific args
        $gateway->expects($this->once())
                ->method('charge')
                ->with($this->equalTo(99.99), $this->equalTo('USD'))
                ->willReturn(new Receipt('ch_test_123'));

        $service  = new PaymentService($gateway);
        $receipt  = $service->processOrder(order: $this->makeOrder(99.99));

        $this->assertSame('ch_test_123', $receipt->transactionId());
    }
}

// Pest equivalent using Mockery
use Mockery;

test('payment service charges correct amount', function () {
    $gateway = Mockery::mock(PaymentGateway::class);
    $gateway->shouldReceive('charge')
            ->once()
            ->with(99.99, 'USD')
            ->andReturn(new Receipt('ch_test_123'));

    $service = new PaymentService($gateway);
    $receipt = $service->processOrder($this->makeOrder(99.99));

    expect($receipt->transactionId())->toBe('ch_test_123');
});
```

---

## Faker for Test Data

```php
use Faker\Factory as FakerFactory;

$faker = FakerFactory::create('en_US');

// Basic
$faker->name();              // 'Dr. John Smith'
$faker->firstName();         // 'Jane'
$faker->lastName();          // 'Doe'
$faker->email();             // 'john.smith@example.org'
$faker->safeEmail();         // 'user@example.com' (safe domain)
$faker->password(8, 20);     // random password 8-20 chars
$faker->phoneNumber();       // '555-123-4567'

// Dates
$faker->dateTimeBetween('-1 year', 'now');    // random DateTime
$faker->dateTimeThisMonth();
$faker->date('Y-m-d');       // '2026-03-15'

// Internet
$faker->url();               // 'https://example.com/path'
$faker->ipv4();              // '192.168.1.1'
$faker->userAgent();

// Text
$faker->sentence(6);         // 'The quick brown fox.'
$faker->paragraph(3);        // multi-sentence paragraph
$faker->slug();              // 'lorem-ipsum-dolor'

// Numbers
$faker->numberBetween(1, 100);
$faker->randomFloat(2, 0, 999);  // 0.00–999.00

// Laravel Factory uses $this->faker automatically
public function definition(): array {
    return [
        'title' => $this->faker->sentence(4),
        'body'  => $this->faker->paragraphs(3, asText: true),
        'views' => $this->faker->numberBetween(0, 50000),
    ];
}
```

---

## Code Coverage with Xdebug

```bash
# Install Xdebug
pecl install xdebug

# php.ini
zend_extension=xdebug.so
xdebug.mode=coverage

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
./vendor/bin/pest --coverage --coverage-html=coverage/

# Coverage thresholds (pest.php)
```

```php
// phpunit.xml
<coverage>
    <include>
        <directory suffix=".php">./app</directory>
    </include>
    <report>
        <html outputDirectory="coverage"/>
        <text outputFile="php://stdout" showUncoveredFiles="true"/>
    </report>
</coverage>

// pest.php — fail if coverage drops below threshold
->coverage(min: 80)
```

---

## Common Pitfalls

- **`assertEquals` vs `assertSame`** — `assertEquals(0, false)` passes (loose ==). `assertSame(0, false)` fails (strict ===). Always prefer `assertSame` for values you care about type-matching.
- **Tests that depend on each other** — each test must be fully independent. If test B depends on data created by test A, it fails when run in isolation. Use `setUp()` / `beforeEach()` or factories to set up state independently.
- **`RefreshDatabase` on every feature test** — it wraps each test in a transaction, but for large test suites this adds milliseconds per test. Use `:memory:` SQLite for fast in-process isolation, and keep Dockerized MySQL for integration tests.
- **Mockery not being closed** — in PHPUnit, Mockery expectations are verified in `tearDown()`. If you don't call `Mockery::close()` or use `use Mockery;` with Pest's auto-closing, unmet expectations silently pass.

---

## Review Questions

1. What is the difference between `assertEquals` and `assertSame` in PHPUnit? Give an example where one passes but the other fails.
2. How does `@dataProvider` in PHPUnit compare to `->with()` datasets in Pest? Show the equivalent of the same test in both.
3. When is a mock object appropriate vs a real object in a test? Give an example of code you would mock and explain why.
4. What does `RefreshDatabase` actually do at the database level between tests?

---

## Sources

- [PHPUnit Documentation](https://phpunit.de/documentation.html)
- [Pest PHP Documentation](https://pestphp.com/)
- [Faker Documentation](https://fakerphp.github.io/)
- [Laravel Testing Documentation](https://laravel.com/docs/11.x/testing)
- [Xdebug Code Coverage](https://xdebug.org/docs/code_coverage)

---

#PHP #Laravel
