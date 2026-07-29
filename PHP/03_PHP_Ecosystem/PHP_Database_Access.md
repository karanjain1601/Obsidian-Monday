---
title: PHP Database Access
aliases:
  - PHP PDO
  - PHP Prepared Statements
  - PHP Migrations
  - Doctrine vs Eloquent
tags: [PHP, Laravel, database, PDO, ORM, migrations]
domain: PHP
difficulty: Intermediate
created: 2026-07-29
related:
  - Laravel_Eloquent_ORM
  - PHP_Overview
  - PHP_Error_Handling
  - PHP_API_Development
status: complete
---

# PHP Database Access

> [!abstract] TL;DR
> PHP database access has three tiers: raw PDO (low-level, any database), Eloquent ORM (Laravel's Active Record), and Doctrine ORM (Data Mapper pattern used by Symfony). PDO prevents SQL injection via prepared statements. Laravel migrations version-control the schema. For testing, SQLite in-memory provides fast, isolated test databases without a real server.

---

## PDO — PHP Data Objects

PDO is the standard PHP database extension — it provides a consistent API across MySQL, PostgreSQL, SQLite, and more:

```php
<?php declare(strict_types=1);

// Connect
$pdo = new \PDO(
    dsn:      'mysql:host=127.0.0.1;dbname=myapp;charset=utf8mb4',
    username: 'root',
    password: 'secret',
    options: [
        \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,  // throw PDOException
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        \PDO::ATTR_EMULATE_PREPARES   => false,   // use real prepared statements
        \PDO::ATTR_PERSISTENT         => false,   // no persistent connections (FPM)
    ]
);
```

### Prepared Statements (SQL Injection Prevention)

```php
// NEVER do this — vulnerable to SQL injection
$name = $_GET['name'];
$stmt = $pdo->query("SELECT * FROM users WHERE name = '$name'");  // DANGEROUS

// ALWAYS use prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE name = ? AND active = ?");
$stmt->execute([$name, true]);
$users = $stmt->fetchAll();  // returns array of rows

// Named placeholders (more readable)
$stmt = $pdo->prepare("
    SELECT id, name, email FROM users
    WHERE email = :email AND role = :role
    LIMIT :limit
");
$stmt->execute([
    ':email' => $email,
    ':role'  => 'admin',
    ':limit' => 10,
]);
$admins = $stmt->fetchAll(\PDO::FETCH_ASSOC);

// Bind types explicitly (important for LIMIT/OFFSET which need int)
$stmt = $pdo->prepare("SELECT * FROM posts LIMIT :limit OFFSET :offset");
$stmt->bindValue(':limit',  $limit,  \PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
$stmt->execute();
```

### Transactions

```php
try {
    $pdo->beginTransaction();

    $pdo->prepare("UPDATE accounts SET balance = balance - ? WHERE id = ?")
        ->execute([$amount, $fromId]);

    $pdo->prepare("UPDATE accounts SET balance = balance + ? WHERE id = ?")
        ->execute([$amount, $toId]);

    $pdo->commit();
} catch (\PDOException $e) {
    $pdo->rollBack();
    throw new \RuntimeException("Transfer failed: " . $e->getMessage(), previous: $e);
}
```

### CRUD Pattern

```php
// Insert and get last inserted ID
$stmt = $pdo->prepare("INSERT INTO users (name, email, created_at) VALUES (?, ?, NOW())");
$stmt->execute([$name, $email]);
$newId = (int) $pdo->lastInsertId();

// Fetch single row
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();       // \PDO::FETCH_ASSOC (from ATTR_DEFAULT_FETCH_MODE)
// $user is false if not found

// Fetch objects
$stmt->setFetchMode(\PDO::FETCH_CLASS, User::class);
$user = $stmt->fetch();       // User object with properties set

// Count
$count = (int) $pdo->query("SELECT COUNT(*) FROM users WHERE active = 1")->fetchColumn();
```

---

## Laravel Query Builder (Raw + Fluent)

```php
use Illuminate\Support\Facades\DB;

// Raw query (use sparingly)
$users = DB::select("SELECT * FROM users WHERE active = ?", [1]);

// Fluent query builder (safe, chainable)
$users = DB::table('users')
    ->select('id', 'name', 'email')
    ->where('active', true)
    ->whereIn('role', ['admin', 'editor'])
    ->orderBy('created_at', 'desc')
    ->limit(20)
    ->get();

// Insert
DB::table('activity_log')->insert([
    'user_id'    => $userId,
    'action'     => 'login',
    'created_at' => now(),
]);

// Update
DB::table('users')
    ->where('id', $userId)
    ->update(['last_login' => now(), 'login_count' => DB::raw('login_count + 1')]);

// Transactions
DB::transaction(function () use ($from, $to, $amount) {
    DB::table('accounts')->where('id', $from)->decrement('balance', $amount);
    DB::table('accounts')->where('id', $to)->increment('balance', $amount);
});
```

---

## Migrations

Migrations version-control your database schema:

```php
// database/migrations/2026_07_29_000001_create_posts_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();                              // BIGINT AUTO_INCREMENT PK
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('body');
            $table->boolean('published')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();                      // created_at, updated_at
            $table->softDeletes();                     // deleted_at

            $table->index(['published', 'published_at']);  // composite index
        });
    }

    public function down(): void {
        Schema::dropIfExists('posts');
    }
};
```

```bash
php artisan make:migration create_posts_table     # new table
php artisan make:migration add_views_to_posts     # alter table
php artisan migrate                               # run pending
php artisan migrate:rollback                      # rollback last batch
php artisan migrate:status                        # show migration status
php artisan migrate:fresh                         # drop all, re-run all (dev only!)
```

### Alter Existing Table

```php
return new class extends Migration {
    public function up(): void {
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedInteger('views')->default(0)->after('body');
            $table->dropColumn('old_column');
            $table->string('title', 500)->change();  // change column type/size
        });
    }

    public function down(): void {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('views');
            $table->string('old_column')->nullable();
            $table->string('title', 255)->change();
        });
    }
};
```

---

## Doctrine ORM vs Eloquent

| Aspect | Eloquent (Active Record) | Doctrine (Data Mapper) |
|--------|-------------------------|------------------------|
| Pattern | Active Record — model IS the table row | Data Mapper — entity separate from DB |
| Coupling | Model tied to DB (find, save on model) | Entity is a plain PHP object (POPO) |
| Laravel | Native, first-party | Via doctrine/orm package |
| Symfony | Via eloquent-orm package | Native, first-party |
| Queries | Fluent builder on model | DQL (Doctrine Query Language) |
| Complexity | Simple, great for CRUD | Complex, great for domain-rich apps |
| Lazy loading | Default (N+1 risk) | Configurable, explicit |
| Testing | `RefreshDatabase` / `DatabaseTransactions` | Unit-testable entities without DB |

```php
// Eloquent (Active Record) — model and DB access combined
$post = Post::find(1);
$post->title = 'Updated';
$post->save();               // "post knows how to save itself"

// Doctrine (Data Mapper) — entity is a plain object
$post = $em->find(Post::class, 1);
$post->setTitle('Updated');
$em->flush();                // "entity manager handles persistence"
```

---

## Database Seeding

```php
// database/seeders/UserSeeder.php
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder {
    public function run(): void {
        // Factory-based seeding (uses Faker internally)
        User::factory(50)->create();

        // Factory with state
        User::factory()->admin()->count(3)->create();

        // Explicit seeding
        User::firstOrCreate(['email' => 'admin@example.com'], [
            'name'     => 'Admin',
            'password' => bcrypt('secret'),
        ]);
    }
}

// Model factory
class UserFactory extends Factory {
    public function definition(): array {
        return [
            'name'     => fake()->name(),
            'email'    => fake()->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'role'     => fake()->randomElement(['user', 'editor']),
        ];
    }

    public function admin(): static {
        return $this->state(fn() => ['role' => 'admin']);
    }
}
```

---

## Testing with SQLite In-Memory

```php
// phpunit.xml — use SQLite for tests (fast, no real DB needed)
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

```php
// tests/TestCase.php
class TestCase extends \Illuminate\Foundation\Testing\TestCase {
    use RefreshDatabase;  // runs migrations against :memory: SQLite before each test
}

// Now tests run entirely in memory — no network, no external DB
```

---

## Common Pitfalls

- **Forgetting `PDO::ERRMODE_EXCEPTION`** — without this, PDO errors silently return `false` instead of throwing exceptions. Always set this option on construction.
- **Using `DB::raw()` with user input** — `DB::raw("SELECT * WHERE name = '$name'")` is SQL injection. Use `DB::raw('column_name')` only for column names/expressions — never for values. Use `?` or named bindings for values.
- **Migration `down()` out of sync** — `down()` must exactly reverse `up()`. Missing or incorrect rollback logic breaks `migrate:rollback` and `migrate:fresh`. Always test rollbacks.
- **SQLite incompatibilities in tests** — some MySQL/PostgreSQL features (foreign key enforcement, JSON functions, full-text search) behave differently in SQLite. Use `DB_CONNECTION=mysql` with a Docker test database for integration tests, and SQLite only for unit/feature tests.

---

## Review Questions

1. What is a prepared statement in PDO and how does it prevent SQL injection? Why can't you use it for column names/table names?
2. What is the difference between the Active Record and Data Mapper patterns? Give a practical example of when you'd choose Doctrine over Eloquent.
3. What does `$table->foreignId('user_id')->constrained()->cascadeOnDelete()` generate in SQL?
4. Why is SQLite `":memory:"` used for tests and what are its limitations compared to a real MySQL database?

---

## Sources

- [PHP Manual: PDO](https://www.php.net/manual/en/book.pdo.php)
- [Laravel Documentation: Database](https://laravel.com/docs/11.x/database)
- [Laravel Documentation: Migrations](https://laravel.com/docs/11.x/migrations)
- [Doctrine ORM Documentation](https://www.doctrine-project.org/projects/orm.html)

---

#PHP #Laravel
