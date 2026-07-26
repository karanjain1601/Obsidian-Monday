---
title: Django Fundamentals
aliases:
  - Django
  - Django ORM
  - Django MVT
  - Django Web Framework
tags:
  - python
  - django
  - backend
  - web
  - orm
  - mvt
domain: AI-ML
difficulty: Intermediate
created: 2026-07-26
related:
  - "[[Python_for_ML]]"
  - "[[Decorators_and_Metaprogramming]]"
  - "[[Context_Managers]]"
  - "[[FastAPI_for_ML]]"
  - "[[SQL_for_ML]]"
  - "[[Type_Hints_and_Static_Analysis]]"
  - "[[Docker_for_ML]]"
status: complete
---

# Django Fundamentals

> [!abstract] TL;DR
> Django is a batteries-included Python web framework built around the MVT pattern — it gives you an ORM, admin interface, auth system, form handling, and migration engine out of the box, so you spend time on business logic rather than plumbing.

---

## Intuition

**Analogy:** Django is a fully-furnished apartment. Everything you need is already there — kitchen (ORM), security system (auth + CSRF), mail slot (URL router), and a building manager who keeps a log of every structural change (migrations). Moving in is fast; you furnish the rooms to your taste (apps and models), but you never have to pour the foundation yourself.

FastAPI, by contrast, is an empty loft with excellent bones. You get the frame and plumbing, then you choose every appliance. Faster for specialists; slower for teams that want predictable conventions.

The key constraint that makes Django coherent: every feature is designed around the idea that your data has a **schema first**. You define `models.py`, Django generates the SQL, and every other layer — admin, forms, REST serializers — derives from that schema automatically.

---

## How It Works

### Core Mechanics

Django's request lifecycle follows **Model → View → Template (MVT)**:

1. A browser sends an HTTP request to the server.
2. Django's URL dispatcher (`urls.py`) matches the path to a view using `path()` or `re_path()` patterns.
3. The **View** (`views.py`) — a function or class — receives the `HttpRequest` object, applies business logic, and queries the database via the **ORM** if needed.
4. The ORM translates Python method chains into SQL, hits the database, and returns Python objects.
5. The view either renders an HTML **Template** (via `render(request, 'template.html', context)`) or returns a `JsonResponse` for API endpoints.
6. Django returns the `HttpResponse` to the browser.

The `manage.py` CLI drives the development cycle:

| Command | Effect |
|---|---|
| `runserver` | Starts the dev server (single-threaded, auto-reload) |
| `makemigrations` | Generates migration files from model changes |
| `migrate` | Applies pending migrations to the database |
| `shell` | Opens an interactive Python shell with Django loaded |
| `createsuperuser` | Creates an admin user |
| `collectstatic` | Gathers static files into `STATIC_ROOT` for deployment |
| `showmigrations` | Lists all migrations and their applied status |
| `sqlmigrate app 0003` | Prints the raw SQL a migration would execute |
| `squashmigrations app 0001 0010` | Consolidates migrations 1–10 into one |

### Flow / Architecture

**MVT Request Cycle:**

```mermaid
graph LR
    Req[HTTP_Request] --> URL[urls.py_dispatcher]
    URL -->|path_match| View[views.py_View]
    URL -->|no_match| E404[404_Response]
    View --> ORM[Model_ORM_query]
    ORM --> DB[(Database)]
    DB --> ORM
    ORM --> View
    View -->|HTML| Tmpl[Template_Engine]
    Tmpl --> Resp[HTTP_Response_HTML]
    View -->|API| JsonR[JsonResponse]
    JsonR --> Resp2[HTTP_Response_JSON]
```

**Django Project and App Structure:**

```mermaid
graph TD
    Proj[Django_Project] --> SettingsPy[settings.py]
    Proj --> ManagePy[manage.py]
    Proj --> RootURLs[project_urls.py]
    Proj --> WSGI[wsgi.py_asgi.py]
    RootURLs -->|include| AppURLs[app_urls.py]
    App[Django_App] --> ModelsPy[models.py]
    App --> ViewsPy[views.py]
    App --> AdminPy[admin.py]
    App --> AppURLs
    App --> Migrations[migrations/]
    App --> Templates[templates/]
    App --> StaticDir[static/]
```

---

## Project and App Structure

### Settings Architecture

`settings.py` controls the entire project. Production deployments use `django-environ` or `python-decouple` to keep secrets out of version control:

```python
# pip install django-environ
import environ

env = environ.Env(DEBUG=(bool, False))
environ.Env.read_env(".env")          # reads .env file in project root

SECRET_KEY  = env("SECRET_KEY")       # mandatory — no default
DEBUG       = env("DEBUG")            # False unless .env sets it
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["localhost"])

DATABASES = {
    "default": env.db("DATABASE_URL", default="sqlite:///db.sqlite3")
    # DATABASE_URL=postgres://user:pass@localhost:5432/mydb
}

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    # Local apps
    "blog",
    "accounts",
]

STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"    # collectstatic destination
MEDIA_URL   = "/media/"
MEDIA_ROOT  = BASE_DIR / "media"          # user-uploaded files
```

---

## ORM and Models

### Defining Models

Every model is a `models.Model` subclass. Each class attribute maps to a database column.

```python
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()   # resolves to AUTH_USER_MODEL — always use this, not User directly


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Article(models.Model):
    title       = models.CharField(max_length=255)
    body        = models.TextField()
    excerpt     = models.TextField(blank=True)
    author      = models.ForeignKey(User, on_delete=models.CASCADE, related_name="articles")
    tags        = models.ManyToManyField(Tag, blank=True, related_name="articles")
    is_published = models.BooleanField(default=False)
    is_deleted  = models.BooleanField(default=False)
    view_count  = models.PositiveIntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)   # set once on creation
    updated_at  = models.DateTimeField(auto_now=True)        # updated on every save()

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "article"
        verbose_name_plural = "articles"
        indexes = [
            models.Index(fields=["is_published", "created_at"]),
            models.Index(fields=["author", "is_published"]),
        ]
        constraints = [
            models.UniqueConstraint(fields=["author", "title"], name="unique_author_title"),
        ]

    def __str__(self):
        return self.title
```

**Common field types:**

| Field | Use case |
|---|---|
| `CharField(max_length=N)` | Short strings; requires `max_length` |
| `TextField()` | Unlimited text |
| `IntegerField()` / `FloatField()` | Numbers |
| `BooleanField()` | True/False |
| `DateTimeField(auto_now_add=True)` | Timestamp on creation |
| `DateTimeField(auto_now=True)` | Timestamp on every save |
| `SlugField()` | URL-safe slugs |
| `ForeignKey(Model, on_delete=CASCADE)` | Many-to-one; adds `_id` column |
| `ManyToManyField(Model)` | Many-to-many; creates junction table |
| `OneToOneField(Model)` | One-to-one (like profile extending User) |
| `JSONField()` | Semi-structured data (PostgreSQL/SQLite 3.9+) |

---

## QuerySet API

QuerySets are **lazy** — no SQL executes until the queryset is evaluated (iterated, sliced, or passed to `list()`/`bool()`). This lets you chain `.filter()` calls without hitting the database multiple times.

```python
from django.db.models import Count, Sum, Avg, Q, F

# Basic filtering — all lazy until evaluated
active = Article.objects.filter(is_published=True, is_deleted=False)
recent = active.order_by("-created_at")[:10]          # SQL: LIMIT 10

# get() raises DoesNotExist if 0 results, MultipleObjectsReturned if >1
article = Article.objects.get(pk=42)                  # dangerous without try/except

# Safer alternatives
article = Article.objects.filter(pk=42).first()       # returns None if not found
# or
from django.shortcuts import get_object_or_404
article = get_object_or_404(Article, pk=42)           # returns 404 response on miss

# Annotations — add computed fields to each row
from django.db.models import Count
articles_with_counts = Article.objects.annotate(
    comment_count=Count("comments"),                  # SQL: LEFT JOIN + GROUP BY
)
# Now each article object has .comment_count attribute

# Aggregations — collapse queryset to single values
stats = Article.objects.aggregate(
    total=Count("id"),
    avg_views=Avg("view_count"),
    total_views=Sum("view_count"),
)
# Returns dict: {"total": 42, "avg_views": 310.5, "total_views": 13041}

# Q objects for OR / NOT logic
results = Article.objects.filter(
    Q(title__icontains="python") | Q(tags__name="django"),
    is_published=True,
)

# F expressions — database-level arithmetic, avoids race conditions
Article.objects.filter(pk=42).update(view_count=F("view_count") + 1)
# Executes: UPDATE article SET view_count = view_count + 1 WHERE id = 42
# Safe for concurrent requests — no read-modify-write at Python level

# Reducing N+1 queries
articles = Article.objects.select_related("author")           # JOIN for ForeignKey
articles = Article.objects.prefetch_related("tags", "comments")  # separate queries for M2M

# Partial loading — only fetch needed columns
articles = Article.objects.only("title", "created_at")    # fetches only those columns
articles = Article.objects.defer("body")                   # fetches everything except body

# Bulk operations
Article.objects.bulk_create([Article(title=f"Post {i}") for i in range(100)])
Article.objects.filter(is_deleted=True).update(is_published=False)  # single UPDATE
```

**`select_related` vs `prefetch_related`:**

| | `select_related` | `prefetch_related` |
|---|---|---|
| Mechanism | SQL JOIN (single query) | Separate queries + Python join |
| Works on | `ForeignKey`, `OneToOneField` | `ManyToManyField`, reverse `ForeignKey` |
| Number of queries | 1 | 2 (one per prefetch) |
| When to use | Always for FK fields in loops | M2M and reverse relations |

---

## Migrations

Migrations track database schema changes as Python files that can be committed, reviewed, and rolled back.

```
makemigrations  →  generates 0001_initial.py, 0002_add_slug.py, …
migrate         →  applies pending migrations (records in django_migrations table)
migrate app 0003 →  migrates to a specific version (forward or backward)
migrate app zero →  reverts all migrations for that app
```

**Data migration with `RunPython`** — runs arbitrary Python inside a migration to transform existing rows:

```python
# blog/migrations/0005_populate_slugs.py
from django.db import migrations
from django.utils.text import slugify


def populate_slugs(apps, schema_editor):
    # Always use apps.get_model — never import models directly in migrations.
    # Direct imports reflect the current model state, not the state at migration time.
    Article = apps.get_model("blog", "Article")
    db_alias = schema_editor.connection.alias
    for article in Article.objects.using(db_alias).filter(slug=""):
        article.slug = slugify(article.title)
        article.save(update_fields=["slug"])


def reverse_populate_slugs(apps, schema_editor):
    Article = apps.get_model("blog", "Article")
    Article.objects.using(schema_editor.connection.alias).update(slug="")


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0004_article_slug"),    # slug column must already exist
    ]

    operations = [
        migrations.RunPython(populate_slugs, reverse_populate_slugs),
    ]
```

**Rules for safe migrations in production:**
- Always commit migration files to version control — they are your schema history.
- Run `makemigrations --check` in CI to catch uncommitted model changes.
- Use `--fake` only to sync the migration table when you applied SQL manually.
- Avoid `RunPython` on tables with millions of rows — use chunked batching or a background job instead.

---

## Views

### Function-Based Views (FBV)

```python
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required


@login_required
@require_http_methods(["GET"])
def article_detail(request, pk):
    article = get_object_or_404(
        Article.objects.select_related("author").prefetch_related("tags"),
        pk=pk, is_published=True,
    )
    return render(request, "blog/article_detail.html", {"article": article})


@login_required
@require_http_methods(["GET"])
def article_list_api(request):
    articles = (
        Article.objects.active()
        .select_related("author")
        .values("id", "title", "author__username", "created_at")
    )
    return JsonResponse({"articles": list(articles)})
```

### Class-Based Views (CBV)

```python
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.urls import reverse_lazy
from django.db.models import Q, Count


class ArticleListView(LoginRequiredMixin, ListView):
    model = Article
    template_name = "blog/article_list.html"
    context_object_name = "articles"
    paginate_by = 20

    def get_queryset(self):
        # Override to add filtering, search, and eager loading
        qs = (
            Article.objects.active()
            .select_related("author")
            .prefetch_related("tags")
            .annotate(comment_count=Count("comments"))
        )
        tag = self.request.GET.get("tag")
        if tag:
            qs = qs.filter(tags__slug=tag)
        q = self.request.GET.get("q")
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(body__icontains=q))
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["search_query"] = self.request.GET.get("q", "")
        return context


class ArticleCreateView(LoginRequiredMixin, CreateView):
    model = Article
    fields = ["title", "body", "tags", "is_published"]
    template_name = "blog/article_form.html"
    success_url = reverse_lazy("blog:article-list")

    def form_valid(self, form):
        form.instance.author = self.request.user   # set author before saving
        return super().form_valid(form)
```

---

## URL Routing

```python
# blog/urls.py
from django.urls import path, re_path
from . import views

app_name = "blog"    # namespace — enables {% url 'blog:article-list' %}

urlpatterns = [
    path("",                          views.ArticleListView.as_view(),   name="article-list"),
    path("<int:pk>/",                 views.ArticleDetailView.as_view(), name="article-detail"),
    path("<int:pk>/edit/",            views.ArticleUpdateView.as_view(), name="article-edit"),
    path("<slug:slug>/",              views.article_by_slug,             name="article-by-slug"),
    # re_path for complex patterns
    re_path(r"^archive/(?P<year>[0-9]{4})/$", views.archive, name="archive"),
]

# project/urls.py (root)
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/",    admin.site.urls),
    path("blog/",     include("blog.urls")),
    path("api/v1/",   include("api.urls")),
    path("accounts/", include("django.contrib.auth.urls")),
]
```

In templates and views, use `reverse()` / `{% url %}` instead of hardcoding paths:
```python
from django.urls import reverse
url = reverse("blog:article-detail", kwargs={"pk": article.pk})
```

---

## Templates

Django Template Language (DTL) is intentionally limited — it discourages logic in templates.

```html
{# templates/blog/article_list.html #}
{% extends "base.html" %}
{% load static %}

{% block title %}Blog — {{ block.super }}{% endblock %}

{% block content %}
  <form method="get">
    <input name="q" value="{{ search_query|default:'' }}" placeholder="Search…">
    <button type="submit">Search</button>
  </form>

  {% for article in articles %}
    <article>
      <h2>
        <a href="{% url 'blog:article-detail' article.pk %}">
          {{ article.title|truncatewords:10 }}
        </a>
      </h2>
      <p>By {{ article.author.username }} on {{ article.created_at|date:"M d, Y" }}</p>
      <p>{{ article.comment_count }} comment{{ article.comment_count|pluralize }}</p>
    </article>
  {% empty %}
    <p>No articles found.</p>
  {% endfor %}

  {# Pagination #}
  {% if page_obj.has_previous %}
    <a href="?page={{ page_obj.previous_page_number }}">Previous</a>
  {% endif %}
  {% if page_obj.has_next %}
    <a href="?page={{ page_obj.next_page_number }}">Next</a>
  {% endif %}
{% endblock %}
```

```html
{# templates/base.html #}
{% load static %}
<!DOCTYPE html>
<html>
<head>
  <title>{% block title %}My Site{% endblock %}</title>
  <link rel="stylesheet" href="{% static 'css/app.css' %}">
</head>
<body>
  {% block content %}{% endblock %}
  <script src="{% static 'js/app.js' %}"></script>
</body>
</html>
```

**Key DTL notes:**
- `{{ value|safe }}` disables auto-escaping — only use on HTML you control; never on user input.
- `{% include 'partials/card.html' with article=article %}` renders sub-templates with scoped context.
- Template fragment caching: `{% load cache %}{% cache 600 article_list %}...{% endcache %}`.
- Jinja2 (via `TEMPLATES[0]['BACKEND'] = 'django.template.backends.jinja2.Jinja2'`) is a faster alternative with Python-like syntax; not the default because it allows arbitrary Python, making template logic harder to audit.

---

## Admin Interface

```python
# blog/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Article, Tag


class TagInline(admin.TabularInline):
    model = Article.tags.through   # M2M through table
    extra = 1                      # show 1 blank inline row
    verbose_name = "tag"
    verbose_name_plural = "tags"


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display   = ["title", "author", "status_badge", "comment_count_col", "created_at"]
    list_filter    = ["is_published", "created_at", "author"]
    search_fields  = ["title", "body", "author__username"]
    readonly_fields = ["created_at", "updated_at", "view_count"]
    raw_id_fields  = ["author"]     # search widget instead of dropdown — critical for large User tables
    inlines        = [TagInline]
    actions        = ["publish_selected", "unpublish_selected"]
    date_hierarchy = "created_at"
    ordering       = ["-created_at"]

    # Custom column: rendered HTML
    @admin.display(description="Status", ordering="is_published")
    def status_badge(self, obj):
        color = "green" if obj.is_published else "red"
        label = "Published" if obj.is_published else "Draft"
        return format_html('<span style="color:{}">{}</span>', color, label)

    # Custom column: derived value
    @admin.display(description="Comments")
    def comment_count_col(self, obj):
        return obj.comments.count()

    # Custom bulk action
    @admin.action(description="Publish selected articles")
    def publish_selected(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"{updated} article(s) published.")

    @admin.action(description="Unpublish selected articles")
    def unpublish_selected(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"{updated} article(s) unpublished.")


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display  = ["name", "slug"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ("name",)}   # auto-fills slug from name in the form
```

---

## Authentication and Sessions

```python
# Using the built-in auth system
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.forms import AuthenticationForm
from django.shortcuts import redirect, render


def login_view(request):
    if request.method == "POST":
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)     # writes user.pk to session
            return redirect("blog:article-list")
    else:
        form = AuthenticationForm()
    return render(request, "accounts/login.html", {"form": form})


# Extending the User model — must be set BEFORE first migrate
# accounts/models.py
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    bio         = models.TextField(blank=True)
    avatar      = models.ImageField(upload_to="avatars/", blank=True)
    is_verified = models.BooleanField(default=False)

# settings.py
AUTH_USER_MODEL = "accounts.CustomUser"    # must be set before any migration


# Permission checks
@permission_required("blog.delete_article", raise_exception=True)
def delete_article(request, pk):
    article = get_object_or_404(Article, pk=pk, author=request.user)
    article.delete()
    return redirect("blog:article-list")


# CBV permission check
class ArticleDeleteView(PermissionRequiredMixin, DeleteView):
    model = Article
    permission_required = "blog.delete_article"
    success_url = reverse_lazy("blog:article-list")
```

**CSRF protection:** Every `POST`/`PUT`/`DELETE` form must include `{% csrf_token %}` in the template. For AJAX requests, add the `X-CSRFToken` header by reading `document.cookie`:
```javascript
// AJAX CSRF — read token from cookie, add as header
const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
fetch("/api/articles/", {
    method: "POST",
    headers: {"Content-Type": "application/json", "X-CSRFToken": csrfToken},
    body: JSON.stringify(data),
});
```

---

## Middleware and Signals

### Custom Middleware

```python
# middleware.py
import time
import logging

logger = logging.getLogger(__name__)


class RequestTimingMiddleware:
    """Logs the time taken for each request."""

    def __init__(self, get_response):
        self.get_response = get_response   # called once at server startup

    def __call__(self, request):
        t0 = time.perf_counter()
        response = self.get_response(request)   # calls the next middleware / view
        elapsed_ms = (time.perf_counter() - t0) * 1000
        logger.info(
            "%(method)s %(path)s %(status)s %(ms).1fms",
            {"method": request.method, "path": request.path,
             "status": response.status_code, "ms": elapsed_ms},
        )
        return response

# settings.py — ORDER MATTERS: each middleware wraps all middleware below it
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",      # first — handles HSTS, SSL redirect
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "blog.middleware.RequestTimingMiddleware",             # custom — near the bottom
]
```

### Signals

```python
# blog/signals.py
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import Article


@receiver(post_save, sender=Article)
def notify_on_publish(sender, instance, created, **kwargs):
    """Send notification email when an article is first published."""
    if not created and instance.is_published:
        # Check if is_published just changed to True by comparing to DB
        try:
            old = Article.objects.get(pk=instance.pk)
        except Article.DoesNotExist:
            return
        # Note: this is a simplified pattern — use django-model-utils for production
        send_mail(
            subject=f"New article: {instance.title}",
            message=f"Published by {instance.author}",
            from_email="noreply@example.com",
            recipient_list=["editors@example.com"],
        )


# blog/apps.py — wire up signals via AppConfig.ready()
from django.apps import AppConfig

class BlogConfig(AppConfig):
    name = "blog"

    def ready(self):
        import blog.signals  # noqa: F401 — importing registers the receivers
```

**Signal vs overriding `save()`:**

| | Signal (`post_save`) | Override `save()` |
|---|---|---|
| Triggered by `bulk_update` | No | No |
| Triggered by `queryset.update()` | No | No |
| Decoupled from model | Yes — lives in `signals.py` | No — mixed into model |
| Testable in isolation | Easier | Harder |
| Risk of double-call | If multiple receivers respond | Not applicable |
| Best for | Side effects (email, cache invalidation) | Derived field computation |

---

## Caching and Performance

```python
# settings.py — Redis cache backend
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "TIMEOUT": 300,    # default 5 minutes
    }
}

# views.py — per-view cache (caches full HTML response)
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)   # 15 minutes
def homepage(request):
    articles = Article.objects.active().select_related("author")[:10]
    return render(request, "homepage.html", {"articles": articles})


# Low-level cache API — cache any value
from django.core.cache import cache

def get_popular_tags():
    tags = cache.get("popular_tags")
    if tags is None:
        tags = list(Tag.objects.annotate(n=Count("articles")).order_by("-n")[:20])
        cache.set("popular_tags", tags, timeout=600)
    return tags


# Template fragment caching — only cache part of a page
# {% load cache %}
# {% cache 600 article_sidebar user.pk %}
#   ... expensive sidebar rendering ...
# {% endcache %}
```

**N+1 query prevention checklist:**
1. Install `django-debug-toolbar` in development — it shows all SQL queries per request.
2. Audit any view that iterates over a queryset and accesses related objects.
3. Add `select_related("fk_field")` for `ForeignKey` / `OneToOneField` access in loops.
4. Add `prefetch_related("m2m_field")` for `ManyToManyField` and reverse FK access in loops.
5. Use `only("id", "title")` / `defer("body")` when fetching large text columns you do not need.
6. Use `values()` or `values_list()` when you only need raw data, not model instances.

---

## Code Demo

### 1. Custom Manager with Annotation

```python
# blog/models.py
from django.db import models
from django.db.models import Count, Q


class ArticleQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_published=True, is_deleted=False)

    def by_author(self, user):
        return self.filter(author=user)

    def with_counts(self):
        return self.annotate(
            comment_count=Count("comments", distinct=True),
            tag_count=Count("tags", distinct=True),
        )

    def popular(self, min_comments=5):
        return self.with_counts().filter(comment_count__gte=min_comments)

    def search(self, query):
        return self.filter(
            Q(title__icontains=query) | Q(body__icontains=query)
        )


class ArticleManager(models.Manager):
    def get_queryset(self):
        # Base queryset excludes soft-deleted rows globally
        return ArticleQuerySet(self.model, using=self._db).filter(is_deleted=False)

    def active(self):
        return self.get_queryset().active()

    def popular(self, min_comments=5):
        return self.get_queryset().popular(min_comments)


class Article(models.Model):
    title        = models.CharField(max_length=255)
    body         = models.TextField()
    author       = models.ForeignKey("auth.User", on_delete=models.CASCADE, related_name="articles")
    tags         = models.ManyToManyField("Tag", blank=True, related_name="articles")
    is_published = models.BooleanField(default=False)
    is_deleted   = models.BooleanField(default=False)
    created_at   = models.DateTimeField(auto_now_add=True)

    objects = ArticleManager()   # replaces the default manager

    class Meta:
        ordering = ["-created_at"]
        indexes  = [models.Index(fields=["is_published", "is_deleted", "created_at"])]

    def __str__(self):
        return self.title


# Usage — chaining works because ArticleManager returns ArticleQuerySet
trending = (
    Article.objects.popular(min_comments=10)
    .search("machine learning")
    .select_related("author")
    .order_by("-created_at")
)
# Single SQL: SELECT ... WHERE is_published AND NOT is_deleted AND comment_count >= 10
#             AND (title ILIKE '%machine learning%' OR body ILIKE '%machine learning%')
#             JOIN auth_user ON author_id
#             ORDER BY created_at DESC
```

---

### 2. CBV ListView with Custom get_queryset and Filtering

```python
# blog/views.py
from django.views.generic import ListView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.urls import reverse_lazy
from django.db.models import Count


class ArticleListView(LoginRequiredMixin, ListView):
    model            = Article
    template_name    = "blog/article_list.html"
    context_object_name = "articles"
    paginate_by      = 20

    def get_queryset(self):
        qs = (
            Article.objects.active()
            .select_related("author")
            .prefetch_related("tags")
            .with_counts()
        )
        # Filter by tag slug from query param ?tag=python
        tag_slug = self.request.GET.get("tag")
        if tag_slug:
            qs = qs.filter(tags__slug=tag_slug)
        # Full-text search from query param ?q=django
        query = self.request.GET.get("q", "").strip()
        if query:
            qs = qs.search(query)
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["search_query"]   = self.request.GET.get("q", "")
        context["active_tag"]     = self.request.GET.get("tag", "")
        context["popular_tags"]   = Tag.objects.annotate(n=Count("articles")).order_by("-n")[:10]
        return context


class ArticleCreateView(LoginRequiredMixin, CreateView):
    model         = Article
    fields        = ["title", "body", "tags", "is_published"]
    template_name = "blog/article_form.html"
    success_url   = reverse_lazy("blog:article-list")

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)
```

---

### 3. Data Migration with RunPython

```python
# blog/migrations/0007_backfill_view_counts.py
from django.db import migrations


def backfill_view_counts(apps, schema_editor):
    """
    Populate view_count from the legacy analytics_event table.
    Always use apps.get_model inside RunPython — direct imports use the
    current model state, not the state at migration time.
    """
    Article = apps.get_model("blog", "Article")
    AnalyticsEvent = apps.get_model("analytics", "AnalyticsEvent")
    db = schema_editor.connection.alias

    # Batch to avoid loading all rows into memory
    BATCH_SIZE = 500
    offset = 0
    while True:
        articles = list(Article.objects.using(db)[offset : offset + BATCH_SIZE])
        if not articles:
            break
        for article in articles:
            count = AnalyticsEvent.objects.using(db).filter(
                object_type="article", object_id=article.pk, event_type="view"
            ).count()
            article.view_count = count
        Article.objects.using(db).bulk_update(articles, fields=["view_count"])
        offset += BATCH_SIZE


def reverse_backfill(apps, schema_editor):
    Article = apps.get_model("blog", "Article")
    Article.objects.using(schema_editor.connection.alias).update(view_count=0)


class Migration(migrations.Migration):
    dependencies = [
        ("blog", "0006_article_view_count"),
        ("analytics", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(backfill_view_counts, reverse_backfill),
    ]
```

---

### 4. Admin ModelAdmin with Inline and Custom Action

```python
# blog/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count
from .models import Article, Tag


class TagInline(admin.TabularInline):
    """Inline tag editor on the Article change page."""
    model       = Article.tags.through
    extra       = 1
    verbose_name = "Tag"
    verbose_name_plural = "Tags"


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display    = ["title", "author", "status_badge", "comment_count_col", "created_at"]
    list_filter     = ["is_published", "created_at"]
    search_fields   = ["title", "body", "author__username"]
    readonly_fields = ["created_at", "updated_at", "view_count"]
    raw_id_fields   = ["author"]              # search widget — avoids full User dropdown
    inlines         = [TagInline]
    actions         = ["publish_selected", "unpublish_selected"]
    date_hierarchy  = "created_at"
    list_per_page   = 50

    def get_queryset(self, request):
        # Annotate in admin to avoid N+1 on comment_count_col
        return super().get_queryset(request).annotate(
            _comment_count=Count("comments", distinct=True)
        )

    @admin.display(description="Status", ordering="is_published", boolean=False)
    def status_badge(self, obj):
        color = "#28a745" if obj.is_published else "#dc3545"
        label = "Published" if obj.is_published else "Draft"
        return format_html('<b style="color:{}">{}</b>', color, label)

    @admin.display(description="Comments", ordering="_comment_count")
    def comment_count_col(self, obj):
        return obj._comment_count   # uses annotated value — no extra query per row

    @admin.action(description="Publish selected articles")
    def publish_selected(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"{updated} article(s) published successfully.")

    @admin.action(description="Move to draft")
    def unpublish_selected(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"{updated} article(s) moved to draft.")
```

---

## Real-World Example

> **Example:** Instagram (early architecture) was built on Django. The ORM-driven admin panel let the small engineering team manage users, media, and reports without building separate tooling. The migration system tracked every schema change as the product evolved from MVP to 1M users, giving the team a reliable rollback path. The auth system (`AbstractUser` extension) provided session management out of the box. As scale demands grew, they added Cassandra for feeds and kept Django for CRUD surfaces — the "batteries-included" core remained untouched. Today, the Django admin panel pattern is a standard in ML platform teams: data scientists manage label queues, model cards, and feature flags through a zero-maintenance Django admin interface backed by Postgres.

---

## Trade-offs

| Aspect | Django | FastAPI |
|---|---|---|
| Setup time | High — full project scaffold | Low — single file |
| Admin interface | Built-in, powerful | None (build from scratch) |
| Async support | ASGI support (3.1+), but ORM is sync | Native async, built on Starlette |
| Throughput | ~2,000 RPS (sync workers) | ~5,000+ RPS (async) |
| ORM | Full-featured, batteries-included | None (bring SQLAlchemy/Tortoise) |
| Auth + sessions | Built-in | None (build or use Auth0) |
| Learning curve | Steep (many conventions) | Gentle (explicit, minimal) |
| Best for | Full web apps, admin dashboards, ML platforms | Microservices, pure REST APIs, ML model serving |

| Aspect | FBV (Function-Based View) | CBV (Class-Based View) |
|---|---|---|
| Readability | Explicit, easy to follow | Requires knowing Django's MRO |
| Reusability | Low — copy-paste | High — `LoginRequiredMixin`, `PermissionRequiredMixin` |
| Override points | Manual conditionals | Clean override of `get_queryset`, `form_valid`, etc. |
| Best for | One-off views, complex custom logic | CRUD operations, list/detail patterns |

| Aspect | `select_related` | `prefetch_related` |
|---|---|---|
| SQL mechanism | JOIN — single query | Separate SELECT — Python join |
| Works on | `ForeignKey`, `OneToOneField` | `ManyToManyField`, reverse FK |
| Query count | 1 | 2 (or more) |
| Memory | Higher (cartesian product risk on M2M) | Lower, predictable |
| Best for | Always for FK in loops | M2M and reverse relations |

---

## When to Use vs Avoid

**Use Django when:**
- Building a full-stack web application with admin, auth, and form handling
- Team needs consistent conventions and a batteries-included ecosystem
- You want the migration system to track schema evolution from day one
- Rapid prototyping with an admin dashboard (ML label management, experiment tracking UI)
- Project has many CRUD surfaces and relational data

**Avoid Django (prefer FastAPI) when:**
- Building a pure async API with no HTML rendering
- Maximum throughput is the primary requirement (>5k RPS)
- You need fine-grained control over every dependency
- The application has no need for admin, sessions, or form handling
- Microservice with a single endpoint and strict startup-time constraints

---

## Common Pitfalls

- **N+1 query problem** — iterating over a queryset and accessing a related field (e.g., `article.author.username`) without `select_related` fires one SQL query per row. Always verify with `django-debug-toolbar` in development; a page rendering 20 articles can silently fire 21+ queries.

- **`get()` raises `DoesNotExist`** — `Article.objects.get(pk=99)` raises `Article.DoesNotExist` if the row is missing, crashing the view with a 500. Use `filter().first()` which returns `None`, or `get_object_or_404()` which returns a proper 404 response.

- **Migrations not committed to version control** — running `makemigrations` locally without committing the file causes `migrate` to fail in CI/production. Add `python manage.py makemigrations --check` to your CI pipeline to catch this.

- **`DEBUG=True` in production** — Django's debug page renders environment variables, settings values, and full tracebacks in the browser. Always set `DEBUG=False` and `ALLOWED_HOSTS` correctly before deploying. Use `django-environ` to make this impossible to misconfigure.

- **CSRF token missing in AJAX** — `fetch()` and `XMLHttpRequest` calls do not automatically include the CSRF cookie. The server responds with `403 Forbidden`. Read the token from `document.cookie` and attach it as the `X-CSRFToken` request header, or use `@csrf_exempt` only for API endpoints protected by token authentication instead.

- **Importing models directly in migrations** — `from blog.models import Article` inside a `RunPython` function reflects the current model state, not the model's state at migration time. Always use `apps.get_model("blog", "Article")` inside `RunPython` callables.

- **Applying signals to `bulk_update` / `queryset.update()`** — `post_save` signals are not fired by ORM bulk operations. If your signal logic must always run, override `save()` instead; if it only needs to run in the common path (single-object saves), signals are fine.

---

## Related Concepts

- [[Python_for_ML]] — Python patterns (decorators, context managers, type hints) that underpin Django's internals and your application code
- [[Decorators_and_Metaprogramming]] — Django's `@login_required`, `@admin.register`, and `@receiver` are all function/class decorators; `ModelBase` metaclass drives Django's ORM field discovery
- [[Context_Managers]] — `transaction.atomic()` is a context manager that wraps a database transaction; `TestCase.assertRaisesRegex` follows the same pattern in Django testing
- [[FastAPI_for_ML]] — the primary alternative for pure API services; share trade-offs in the comparison table above
- [[SQL_for_ML]] — the SQL that Django's ORM generates; understanding raw SQL is essential for diagnosing slow queries identified by `django-debug-toolbar`
- [[Type_Hints_and_Static_Analysis]] — Django stubs (`django-stubs`) enable `mypy` type checking on models, views, and querysets; critical for larger codebases
- [[Docker_for_ML]] — containerizing a Django app with Gunicorn/uvicorn + Nginx + Postgres; the standard production deployment pattern

---

## Review Questions

1. **N+1 and eager loading:** You have a view that renders a list of 50 articles, each showing the author's username and all associated tag names. Walk through the exact SQL queries that would fire without any eager loading, then show the `select_related` and `prefetch_related` calls you would add and explain why you use each one for its specific relation.

2. **Data vs schema migrations:** Your `Article` model gains a new `slug = models.SlugField(unique=True)` field. You need to (a) add the column and (b) populate it from the existing `title` field. Why can these not both be done in a single migration operation? Describe the exact sequence of `makemigrations`, `RunPython`, and `migrate` steps required and why `apps.get_model()` must be used inside `RunPython` instead of a direct model import.

3. **CBV `get_queryset` override:** A `ListView` is rendering articles but a junior engineer hardcodes the queryset as a class attribute: `queryset = Article.objects.active()`. This evaluates the queryset at class-definition time (server startup), not per-request. What is the consequence? Describe how overriding `get_queryset(self)` as a method fixes this, and add per-user filtering (show only the current user's articles) that would be impossible with a class-attribute queryset.

4. **Signal vs `save()` override tradeoffs:** You need to invalidate a Redis cache entry whenever an `Article` is updated. A colleague suggests overriding `Article.save()`; you suggest a `post_save` signal. Give two scenarios where the signal approach silently fails and the cache is not invalidated. Then explain one scenario where overriding `save()` also fails. What is the only approach that handles all scenarios correctly for cache invalidation?

---

## Sources

- [Django Documentation — The Model Layer](https://docs.djangoproject.com/en/5.2/topics/db/)
- [Django Documentation — QuerySet API Reference](https://docs.djangoproject.com/en/5.2/ref/models/querysets/)
- [Django Documentation — Class-Based Views](https://docs.djangoproject.com/en/5.2/topics/class-based-views/)
- [Django Documentation — Writing and running migrations](https://docs.djangoproject.com/en/5.2/topics/migrations/)
- [Django Documentation — The admin site](https://docs.djangoproject.com/en/5.2/ref/contrib/admin/)
- [Django Documentation — Signals](https://docs.djangoproject.com/en/5.2/topics/signals/)
- [Two Scoops of Django 3.x — Feldroy (2021)](https://www.feldroy.com/books/two-scoops-of-django-3-x)
- [django-debug-toolbar](https://django-debug-toolbar.readthedocs.io/)

---

#python #django #backend #web #orm #mvt
