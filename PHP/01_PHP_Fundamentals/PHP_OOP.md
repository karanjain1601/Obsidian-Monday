---
title: PHP OOP
aliases:
  - PHP Classes
  - PHP Traits
  - PHP Enums
  - PHP Constructor Promotion
  - PHP Interfaces
tags: [PHP, Laravel, OOP, classes]
domain: PHP
difficulty: Intermediate
created: 2026-07-29
related:
  - PHP_Types_and_Variables
  - PHP_Control_Flow_and_Functions
  - PHP_Error_Handling
  - Laravel_Overview
status: complete
---

# PHP OOP

> [!abstract] TL;DR
> PHP 8.x delivers a complete OOP model: classes with constructor property promotion, readonly properties, enums (pure and backed), traits for horizontal code reuse, interfaces for contracts, abstract classes for template methods, and late static binding (`static::`) for correct polymorphism. PHP magic methods (`__construct`, `__toString`, `__get`, `__set`, `__call`) provide metaprogramming hooks that Laravel heavily exploits.

---

## Classes and Access Modifiers

```php
<?php declare(strict_types=1);

class BankAccount {
    private float $balance;
    protected string $currency;
    public string $owner;

    public function __construct(string $owner, float $initialBalance = 0.0) {
        $this->owner   = $owner;
        $this->balance = $initialBalance;
        $this->currency = 'USD';
    }

    public function deposit(float $amount): void {
        if ($amount <= 0) throw new \InvalidArgumentException("Amount must be positive");
        $this->balance += $amount;
    }

    public function getBalance(): float { return $this->balance; }

    // Static factory method
    public static function openWith(string $owner, float $amount): static {
        $account = new static($owner);
        $account->deposit($amount);
        return $account;
    }

    public function __toString(): string {
        return "{$this->owner}: {$this->currency} {$this->balance}";
    }
}

$acc = BankAccount::openWith('Alice', 1000.0);
echo $acc;  // "Alice: USD 1000"
```

---

## Constructor Property Promotion (PHP 8.0)

Eliminates the verbose repetition of declaring properties, adding constructor parameters, and assigning them:

```php
// Old (PHP 7.x) — 3 declarations per property
class User {
    private string $name;
    private string $email;
    private int $age;

    public function __construct(string $name, string $email, int $age) {
        $this->name  = $name;
        $this->email = $email;
        $this->age   = $age;
    }
}

// PHP 8.0+ — single declaration, promotion does the rest
class User {
    public function __construct(
        private string $name,
        private string $email,
        private int $age = 18,
        public readonly string $id = '',  // readonly + promoted (8.1)
    ) {}

    public function getName(): string { return $this->name; }
}
```

---

## Interfaces and Abstract Classes

```php
// Interface — pure contract, all methods must be implemented
interface Payable {
    public function charge(float $amount): Receipt;
    public function refund(string $transactionId): bool;
}

interface Notifiable {
    public function notify(string $message): void;
}

// Abstract class — partial implementation, forces subclasses to complete it
abstract class BasePaymentProcessor implements Payable {
    protected string $apiKey;

    public function __construct(string $apiKey) {
        $this->apiKey = $apiKey;
    }

    // Concrete method — shared implementation
    protected function validateAmount(float $amount): void {
        if ($amount <= 0) throw new \InvalidArgumentException("Invalid amount");
    }

    // Abstract — subclasses must implement
    abstract public function charge(float $amount): Receipt;
    abstract public function refund(string $transactionId): bool;
}

// Implement multiple interfaces
class StripeProcessor extends BasePaymentProcessor implements Notifiable {
    public function charge(float $amount): Receipt {
        $this->validateAmount($amount);
        // ... Stripe API call
        return new Receipt(uniqid('stripe_'));
    }

    public function refund(string $transactionId): bool { /* ... */ return true; }
    public function notify(string $message): void { /* ... */ }
}
```

---

## Traits — Horizontal Code Reuse

Traits solve the "diamond problem" by allowing horizontal composition:

```php
trait Timestampable {
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;

    public function initTimestamps(): void {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function touch(): void {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}

trait SoftDeletable {
    private ?\DateTimeImmutable $deletedAt = null;

    public function softDelete(): void {
        $this->deletedAt = new \DateTimeImmutable();
    }

    public function isDeleted(): bool { return $this->deletedAt !== null; }
}

class Article {
    use Timestampable, SoftDeletable;  // compose multiple traits

    public function __construct(
        private string $title,
        private string $body,
    ) {
        $this->initTimestamps();
    }
}

$article = new Article('Hello', 'World');
$article->touch();
$article->softDelete();
```

### Trait Conflict Resolution

```php
trait A { public function hello(): string { return "A"; } }
trait B { public function hello(): string { return "B"; } }

class C {
    use A, B {
        A::hello insteadof B;   // prefer A's hello
        B::hello as helloFromB; // alias B's version
    }
}
```

---

## Enums (PHP 8.1)

```php
// Pure enum — no backing value, ideal for named states
enum Status {
    case Active;
    case Inactive;
    case Pending;

    public function label(): string {
        return match($this) {
            Status::Active   => 'Active',
            Status::Inactive => 'Deactivated',
            Status::Pending  => 'Awaiting Review',
        };
    }
}

$s = Status::Active;
echo $s->label();  // 'Active'

// Backed enum — each case has a scalar value (string or int)
enum Color: string {
    case Red   = 'red';
    case Green = 'green';
    case Blue  = 'blue';
}

$c = Color::from('red');       // Color::Red — throws ValueError if invalid
$c = Color::tryFrom('black');  // null — safe version
echo $c->value;                // 'red'

// Enums implement interfaces
interface HasLabel {
    public function label(): string;
}

enum Priority: int implements HasLabel {
    case Low    = 1;
    case Medium = 5;
    case High   = 10;

    public function label(): string { return $this->name; }
}
```

---

## Late Static Binding

```php
class Base {
    protected static string $name = 'Base';

    public static function create(): static {    // static:: not self::
        return new static();                     // creates the actual subclass
    }

    public static function getName(): string {
        return static::$name;   // resolves to called class, not Base
    }
}

class Child extends Base {
    protected static string $name = 'Child';
}

$obj = Child::create();         // returns Child instance (not Base)
echo Child::getName();          // 'Child' — correct with static::
echo Base::getName();           // 'Base'
```

---

## Magic Methods

PHP's magic methods are called implicitly by the engine:

```php
class MagicBox {
    private array $data = [];

    // Property access overloading
    public function __get(string $name): mixed {
        return $this->data[$name] ?? null;
    }
    public function __set(string $name, mixed $value): void {
        $this->data[$name] = $value;
    }
    public function __isset(string $name): bool {
        return isset($this->data[$name]);
    }
    public function __unset(string $name): void {
        unset($this->data[$name]);
    }

    // Method call overloading
    public function __call(string $name, array $args): mixed {
        // Called when instance method doesn't exist
        if (str_starts_with($name, 'get')) {
            $key = lcfirst(substr($name, 3));
            return $this->data[$key] ?? null;
        }
        throw new \BadMethodCallException("Method $name not found");
    }

    public static function __callStatic(string $name, array $args): mixed {
        // Called when static method doesn't exist
        return null;
    }

    public function __toString(): string { return json_encode($this->data); }
    public function __invoke(string $key): mixed { return $this->data[$key]; }
    public function __clone(): void { $this->data = array_map(fn($v) => clone_if_object($v), $this->data); }
}

$box = new MagicBox();
$box->color = 'red';        // triggers __set
echo $box->color;           // triggers __get → 'red'
echo $box->getColor();      // triggers __call → 'red'
echo $box;                  // triggers __toString
echo $box('color');         // triggers __invoke → 'red'
```

---

## Common Pitfalls

- **`self::` vs `static::` in inheritance** — `self::` always refers to the class where the method is **defined**, not where it is called. Use `static::` (late static binding) when the method needs to work polymorphically with subclasses.
- **Traits don't establish "is-a" relationships** — `$obj instanceof SoftDeletable` is `false` even if the class `use`s the trait. Use interfaces for type contracts; use traits for code reuse.
- **Enum cases are not instances of their backing type** — `Color::Red` is a `Color` instance, not a `string`. Use `Color::Red->value` to get `'red'`. Passing an enum where a string is expected throws a `TypeError`.
- **Magic `__get`/`__set` bypass type declarations** — properties accessed via magic methods do not enforce PHP typed property rules. If you use `__get`/`__set` as a dynamic property bag, you lose static analysis guarantees.

---

## Review Questions

1. What is constructor property promotion and what three things does it replace in pre-PHP 8.0 code?
2. When would you use a Trait vs an Interface vs an Abstract Class? Give a concrete use case for each.
3. Explain the difference between `self::create()` and `static::create()` when `create()` is defined on a base class and called from a subclass.
4. PHP 8.1 backed enums have `from()` and `tryFrom()`. What is the difference in behavior when the input value has no matching enum case?

---

## Sources

- [PHP Manual: Classes and Objects](https://www.php.net/manual/en/language.oop5.php)
- [PHP 8.0 Constructor Promotion RFC](https://wiki.php.net/rfc/constructor_promotion)
- [PHP 8.1 Enumerations RFC](https://wiki.php.net/rfc/enumerations)
- [PHP Manual: Traits](https://www.php.net/manual/en/language.oop5.traits.php)

---

#PHP #Laravel
