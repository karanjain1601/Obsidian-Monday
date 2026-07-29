---
title: Scala Testing
aliases: [ScalaTest, ScalaCheck, munit, Scala property based testing, Mockito Scala]
tags: [Scala, Testing, ScalaTest, ScalaCheck, PropertyTesting, munit]
domain: Scala
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# Scala Testing

> [!abstract] TL;DR
> Scala's testing ecosystem includes ScalaTest (multiple styles: FunSpec, FlatSpec, WordSpec), munit (lightweight, fast), ScalaCheck for property-based testing (generates random inputs to find edge cases), and Mockito-Scala for mocking. Async testing with `Future` and Cats Effect IO are first-class. Property-based testing is Scala's distinctive edge over Java testing approaches.

---

## Intuition

Unit tests check specific cases you thought of. **Property-based testing** (ScalaCheck) checks *invariants that must hold for all inputs* — you describe the property, and ScalaCheck generates hundreds of random cases trying to falsify it. When it finds a failure, it shrinks to the minimal failing case. This discovers edge cases humans miss: empty strings, negative numbers, Unicode characters, `Int.MaxValue`.

---

## How It Works

### ScalaTest — Multiple Styles

```scala
// FunSpec — BDD describe/it style (most popular for Scala)
import org.scalatest.funspec.AnyFunSpec
import org.scalatest.matchers.should.Matchers

class UserServiceSpec extends AnyFunSpec with Matchers:

  describe("UserService"):
    describe("validateEmail"):
      it("accepts a valid email"):
        UserService.validateEmail("alice@example.com") shouldBe Right("alice@example.com")

      it("rejects email without @"):
        UserService.validateEmail("notanemail") shouldBe a[Left[?, ?]]

      it("rejects empty string"):
        val result = UserService.validateEmail("")
        result.isLeft shouldBe true
        result.left.get should include("empty")

    describe("createUser"):
      it("returns a user with the given name"):
        val user = UserService.createUser("Bob", "bob@example.com")
        user.name shouldBe "Bob"
        user.email shouldBe "bob@example.com"
        user.id should be > 0L
```

### ScalaTest Matchers Cheat Sheet

```scala
// Value matchers
result shouldBe 42
result should equal(42)
result should not equal 0

// String matchers
str should startWith("Hello")
str should endWith("World")
str should include("Scala")
str should fullyMatch regex "[A-Z]+"

// Collection matchers
list should have size 3
list should contain(42)
list should contain allOf(1, 2, 3)
list shouldBe empty
list should not be empty

// Option matchers
opt shouldBe Some(5)
opt shouldBe defined
opt shouldBe None

// Exception matchers
a[IllegalArgumentException] should be thrownBy { badFunction() }
the[RuntimeException] thrownBy { throw RuntimeException("msg") } should have message "msg"
```

### Async Testing with Future

```scala
import org.scalatest.funspec.AsyncFunSpec

class AsyncServiceSpec extends AsyncFunSpec:

  describe("fetchUser"):
    it("returns a user for valid ID"):
      val futureUser = userRepository.findById(1L)
      futureUser.map: user =>
        user.isDefined shouldBe true
        user.get.id shouldBe 1L

    it("returns None for missing user"):
      userRepository.findById(999L).map: user =>
        user shouldBe None
```

### munit — Lightweight Alternative

```scala
import munit.FunSuite

class CalculatorSuite extends FunSuite:
  test("add two numbers"):
    assertEquals(Calculator.add(2, 3), 5)

  test("divide returns None for zero divisor"):
    assertEquals(Calculator.divide(10, 0), None)
    assertEquals(Calculator.divide(10, 2), Some(5.0))

  // Async test with cats-effect
  import cats.effect.IO
  import munit.CatsEffectSuite

class IOSuite extends CatsEffectSuite:
  test("IO computation succeeds"):
    val io: IO[Int] = IO(42)
    assertIO(io, 42)
```

### ScalaCheck — Property-Based Testing

```scala
import org.scalacheck.{Gen, Prop, Properties}
import org.scalacheck.Prop.{forAll, propBoolean}

// Define properties that must hold for ALL inputs
object StringProperties extends Properties("StringUtils"):

  // Property: reverse of reverse is identity
  property("reverse.reverse == identity") = forAll: (s: String) =>
    s.reverse.reverse == s

  // Property: sorted list is non-decreasing
  property("sort is non-decreasing") = forAll(Gen.listOf(Gen.int)): lst =>
    val sorted = lst.sorted
    sorted.zip(sorted.tail).forall((a, b) => a <= b) || sorted.length <= 1

  // Custom generator
  val positiveInt: Gen[Int] = Gen.posNum[Int]
  val nonEmptyStr: Gen[String] = Gen.alphaStr.suchThat(_.nonEmpty)

  property("splitAndJoin round-trip") = forAll(nonEmptyStr, positiveInt): (s, n) =>
    // Example: chunking and re-joining a string
    val chunks = s.grouped(n).toList
    chunks.mkString == s
```

### ScalaCheck Generators

```scala
import org.scalacheck.Gen

// Primitive generators
val intGen:    Gen[Int]    = Gen.chooseNum(-100, 100)
val strGen:    Gen[String] = Gen.alphaStr
val boolGen:   Gen[Boolean] = Gen.oneOf(true, false)

// Derived generators from case classes
case class User(name: String, age: Int, email: String)

val userGen: Gen[User] = for
  name  <- Gen.alphaStr.suchThat(_.nonEmpty)
  age   <- Gen.chooseNum(0, 120)
  email <- Gen.alphaStr.map(n => s"$n@example.com")
yield User(name, age, email)

// ScalaTest integration via ScalaCheckPropertyChecks
import org.scalatest.prop.ScalaCheckPropertyChecks

class UserValidationSpec extends AnyFunSpec with ScalaCheckPropertyChecks with Matchers:
  it("validateAge always returns Right for valid ages"):
    forAll(Gen.chooseNum(0, 150)): (age: Int) =>
      UserService.validateAge(age).isRight shouldBe true

  it("validateAge rejects negative"):
    forAll(Gen.negNum[Int]): (age: Int) =>
      UserService.validateAge(age).isLeft shouldBe true
```

### Mockito-Scala

```scala
import org.mockito.Mockito.*
import org.mockito.ArgumentMatchers.*
import org.scalatestplus.mockito.MockitoSugar

class OrderServiceSpec extends AnyFunSpec with MockitoSugar with Matchers:

  it("creates order when user exists"):
    val userRepo  = mock[UserRepository]
    val orderRepo = mock[OrderRepository]
    val service   = OrderService(userRepo, orderRepo)

    when(userRepo.findById(1L)).thenReturn(Some(User(1L, "Alice", "alice@ex.com", true)))
    when(orderRepo.save(any[Order])).thenAnswer(inv => inv.getArgument[Order](0))

    val result = service.createOrder(1L, List(Item("Widget", 9.99)))
    result.isRight shouldBe true
    verify(orderRepo, times(1)).save(any[Order])
```

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | Using `AnyFunSpec` for async tests — `Future` assertions resolve after test | Use `AsyncFunSpec` or `CatsEffectSuite` for async code |
| 2 | ScalaCheck test passes vacuously — condition in `forAll` always filters out cases | Use `Gen.suchThat` on generators, not `==>` implication operator |
| 3 | Mocking `final` classes with Mockito — runtime error | Use `@open` (Scala 3) or create a trait; alternatively use ScalaMock |
| 4 | Test state leaking between ScalaCheck runs — mutable shared state | Make generators and SUT stateless; use `BeforeAndAfterEach` for cleanup |
| 5 | Not shrinking on ScalaCheck failure — large input hard to debug | ScalaCheck auto-shrinks by default; ensure your generator supports shrinking |

## Review Questions

1. What is the key difference between example-based testing and property-based testing? When does PBT find bugs that examples miss?
2. How does `AsyncFunSpec` handle `Future`-returning tests differently from `AnyFunSpec`?
3. What does ScalaCheck do when it finds a failing test case?

---

Related: [[Scala_Build_Tools]] | [[Scala_Error_Handling_FP]] | [[Scala_Style_Guide]] | [[Cats_and_ZIO_Overview]]

#Scala
