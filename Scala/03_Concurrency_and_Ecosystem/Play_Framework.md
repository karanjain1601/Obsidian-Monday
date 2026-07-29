---
title: Play Framework
aliases: [Play Scala, Play Framework MVC, Play routes, Play JSON]
tags: [Scala, PlayFramework, WebDevelopment, MVC, REST, Async]
domain: Scala
difficulty: Intermediate
created: 2026-07-29
related: []
status: complete
---

# Play Framework

> [!abstract] TL;DR
> Play Framework is a reactive web framework for Scala (and Java) built on Akka. It uses a declarative `routes` file for URL mapping, type-safe `Action` blocks for controllers, Play JSON for serialisation, and returns `Future[Result]` for async responses. Play is opinionated (MVC structure, `conf/routes`, `application.conf`) but productive for REST APIs and full-stack web apps.

---

## Intuition

Play treats HTTP as a **functional transformation**: a request comes in, a controller function maps it to a `Result`, async work happens via `Future`. Unlike Spring's annotation-heavy style, Play uses a routing DSL file and pure Scala functions — no reflection, no XML, no servlet containers. The development mode hot-reloads instantly on save.

---

## How It Works

### Project Structure

```
myapp/
  app/
    controllers/UsersController.scala
    models/User.scala
    views/               (Twirl templates — optional for REST)
  conf/
    application.conf     (database, secret, modules)
    routes               (URL → controller mapping)
  build.sbt
```

### routes File — URL Routing DSL

```
# conf/routes
# METHOD  PATH                       CONTROLLER#METHOD

GET    /                              controllers.HomeController.index()
GET    /users                         controllers.UsersController.list()
GET    /users/:id                     controllers.UsersController.get(id: Long)
POST   /users                         controllers.UsersController.create()
PUT    /users/:id                     controllers.UsersController.update(id: Long)
DELETE /users/:id                     controllers.UsersController.delete(id: Long)

# Query parameters — optional
GET    /search                        controllers.SearchController.search(q: String, page: Int ?= 1)
```

### Controller — Action Blocks

```scala
// app/controllers/UsersController.scala
package controllers

import javax.inject.*
import play.api.mvc.*
import play.api.libs.json.*
import scala.concurrent.{ExecutionContext, Future}
import models.{User, UserService}

@Singleton
class UsersController @Inject()(
  cc:          ControllerComponents,
  userService: UserService
)(using ec: ExecutionContext) extends AbstractController(cc):

  // Sync action — for simple responses
  def index(): Action[AnyContent] = Action:
    Ok("Play Framework is running")

  // Async action — returns Future[Result]
  def list(): Action[AnyContent] = Action.async:
    userService.findAll().map: users =>
      Ok(Json.toJson(users))

  // With path parameter
  def get(id: Long): Action[AnyContent] = Action.async:
    userService.findById(id).map:
      case Some(user) => Ok(Json.toJson(user))
      case None       => NotFound(Json.obj("error" -> s"User $id not found"))

  // Parse JSON body
  def create(): Action[JsValue] = Action.async(parse.json): request =>
    request.body.validate[CreateUserRequest] match
      case JsSuccess(req, _) =>
        userService.create(req).map(user => Created(Json.toJson(user)))
      case JsError(errors) =>
        Future.successful(BadRequest(Json.obj("errors" -> JsError.toJson(errors))))
```

### Play JSON — Serialisation

```scala
// app/models/User.scala
package models

import play.api.libs.json.*
import play.api.libs.functional.syntax.*

case class User(id: Long, name: String, email: String, active: Boolean)
case class CreateUserRequest(name: String, email: String)

object User:
  // Automatic derivation — macro-generated
  given Reads[User]  = Json.reads[User]
  given Writes[User] = Json.writes[User]
  given Format[User] = Json.format[User]   // both reads and writes

object CreateUserRequest:
  // Custom reads with validation
  given Reads[CreateUserRequest] = (
    (__ \ "name").read[String](Reads.minLength(1)) and
    (__ \ "email").read[String](Reads.email)
  )(CreateUserRequest.apply)

// Usage in controller:
val json: JsValue = Json.toJson(User(1, "Alice", "alice@example.com", true))
// {"id":1,"name":"Alice","email":"alice@example.com","active":true}

val result: JsResult[User] = json.validate[User]
```

### Application Configuration

```hocon
# conf/application.conf  (HOCON format)
play.http.secret.key = "changeme-in-production"
play.http.secret.key = ${?APPLICATION_SECRET}   # env override

db.default.driver   = org.postgresql.Driver
db.default.url      = "jdbc:postgresql://localhost/myapp"
db.default.username = "postgres"
db.default.password = ${?DB_PASSWORD}

play.evolutions.db.default.autoApply = true    # run DB migrations on start

# Custom config
app.maxUploadSize = 10m
app.featureFlags.newDashboard = true
```

### Slick Integration for Database Access

```scala
import slick.jdbc.PostgresProfile.api.*
import play.api.db.slick.DatabaseConfigProvider
import slick.jdbc.JdbcProfile

@Singleton
class UserRepository @Inject()(dbConfigProvider: DatabaseConfigProvider)
    (using ec: ExecutionContext):

  private val dbConfig = dbConfigProvider.get[JdbcProfile]
  import dbConfig.*
  import profile.api.*

  class UserTable(tag: Tag) extends Table[User](tag, "users"):
    def id     = column[Long]("id", O.PrimaryKey, O.AutoInc)
    def name   = column[String]("name")
    def email  = column[String]("email")
    def active = column[Boolean]("active")
    def *      = (id, name, email, active).mapTo[User]

  private val users = TableQuery[UserTable]

  def findAll(): Future[Seq[User]] =
    db.run(users.result)

  def findById(id: Long): Future[Option[User]] =
    db.run(users.filter(_.id === id).result.headOption)

  def create(name: String, email: String): Future[User] =
    val insert = (users.map(u => (u.name, u.email)) returning users.map(_.id)
      into ((fields, id) => User(id, fields._1, fields._2, active = true)))
    db.run(insert += (name, email))
```

### Testing Play Controllers

```scala
import play.api.test.*
import play.api.test.Helpers.*

class UsersControllerSpec extends PlaySpec with GuiceOneAppPerTest:

  "UsersController" should:
    "return 200 for GET /users" in:
      val request = FakeRequest(GET, "/users")
      val result  = route(app, request).get

      status(result)      mustBe OK
      contentType(result) mustBe Some("application/json")

    "return 404 for unknown user" in:
      val result = route(app, FakeRequest(GET, "/users/9999")).get
      status(result) mustBe NOT_FOUND
```

## Common Pitfalls

| # | Pitfall | Fix |
|---|---------|-----|
| 1 | Blocking inside `Action` — blocks Akka dispatcher thread | Use `Action.async` and `Future`; never `Await.result` in a controller |
| 2 | Missing `ExecutionContext` import — futures don't compile | Inject `ExecutionContext` via DI and use `given ec: ExecutionContext` |
| 3 | `application.conf` secret in version control | Use `${?ENV_VAR}` substitution and `.gitignore` local config |
| 4 | JSON `validate` failure ignored — always uses `JsSuccess` path | Always pattern match on `JsSuccess` / `JsError` or use `as[T]` with care |
| 5 | Slick queries run on default EC — blocks Play's thread pool | Use `db.run` which runs on Slick's own thread pool |

## Review Questions

1. What is the difference between `Action` and `Action.async`? Why does it matter?
2. How does Play JSON's `Reads[T]` relate to type safety? What happens when validation fails?
3. How does the `routes` file route `/users/:id` — what type does `id` have in the controller?

---

Related: [[Akka_Actors_Intro]] | [[Scala_Futures_and_Promises]] | [[Scala_Build_Tools]] | [[Scala_Testing]]

#Scala
