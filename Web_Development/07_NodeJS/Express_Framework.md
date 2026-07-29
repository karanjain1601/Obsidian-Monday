---
title: "Express Framework"
aliases: ["Express.js", "Express Router", "Express Middleware", "express-validator"]
tags: [WebDevelopment, NodeJS, express]
domain: Web_Development
difficulty: Intermediate
created: 2026-07-29
related: ["[[NodeJS_HTTP_and_REST]]", "[[NodeJS_Database_and_Production]]", "[[NodeJS_Fundamentals]]"]
status: complete
---

# 🚀 Express Framework

> [!abstract] TL;DR
> Express.js is a minimal, unopinionated web framework for Node.js that wraps the built-in `http` module with a routing system and chainable middleware pipeline. Every request flows through middleware functions in order of registration — each can read/modify `req`/`res` or call `next()` to pass control forward. The `Router` class creates modular route handlers. Error-handling middleware (4-argument: `err, req, res, next`) must be registered last to catch all errors.

## Intuition — analogy FIRST

Express middleware is like an airport security checkpoint with multiple stations — each passenger (request) passes through each station (middleware) in order. Each station can approve the passenger and pass them on (`next()`), reject them outright (`res.status(401).end()`), or flag a problem (`next(new Error(...))`). The final gate agent (route handler) handles passengers that pass all checks. An emergency lane (error-handling middleware) is always at the end to handle flagged passengers.

---

## How It Works

```mermaid
flowchart LR
    Req["Incoming Request\nGET /api/users/42"] --> Logger["Logger\nmiddleware"]
    Logger -->|next| CORS["CORS\nmiddleware"]
    CORS -->|next| Auth["Auth\nmiddleware\n(verify JWT)"]
    Auth -->|next| Router["Express Router\n/api/users/:id"]
    Router --> Handler["Route Handler\nfetch user from DB"]
    Handler --> Res["Response\n200 {user}"]

    Auth -->|next(err)| ErrMW["Error Handler\n4-arg middleware"]
    ErrMW --> ErrRes["Response\n401 Unauthorized"]

    style Auth fill:#d97706,color:#fff
    style ErrMW fill:#dc2626,color:#fff
    style Handler fill:#059669,color:#fff
```

---

## Key Concepts / Details

### Express Application Setup

```javascript
const express = require('express');
const app = express();

// Built-in middleware
app.use(express.json({ limit: '10mb' }));              // parse JSON bodies
app.use(express.urlencoded({ extended: true }));        // parse form bodies
app.use(express.static('public'));                      // serve static files

// Third-party middleware
const cors = require('cors');
const helmet = require('helmet');                       // security headers
const compression = require('compression');             // gzip responses
const morgan = require('morgan');                       // HTTP request logging

app.use(helmet());
app.use(compression());
app.use(morgan('combined'));  // Apache-style access log
app.use(cors({
  origin: ['https://myapp.com', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Custom middleware
app.use((req, res, next) => {
  req.requestId = crypto.randomUUID(); // attach request ID for tracing
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// Route mounting
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// 404 handler — must come AFTER all routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.url} not found` });
});

// Error handler — must be LAST and have exactly 4 args
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.expose ? err.message : 'Internal Server Error';
  console.error(`[${req.requestId}] Error:`, err);
  res.status(status).json({ error: message, requestId: req.requestId });
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Server on port ${server.address().port}`);
});
```

### Routing with Express Router

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const { body, param, query, validationResult } = require('express-validator');

// GET /api/users?page=1&limit=20
router.get('/',
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { page = 1, limit = 20 } = req.query;
      const users = await UserService.findAll({ page, limit });
      res.json({ data: users, page, limit });
    } catch (err) {
      next(err); // pass to error handler
    }
  }
);

// GET /api/users/:id
router.get('/:id',
  param('id').isUUID(),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await UserService.findById(req.params.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/users
router.post('/',
  body('email').isEmail().normalizeEmail(),
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('password').isLength({ min: 8 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      if (err.code === '23505') { // postgres unique violation
        return res.status(409).json({ error: 'Email already exists' });
      }
      next(err);
    }
  }
);

// PUT /api/users/:id
router.put('/:id', authenticate, authorize('admin', 'self'), async (req, res, next) => {
  // authenticate and authorize are custom middleware
  try {
    const user = await UserService.update(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/users/:id
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    await UserService.delete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
```

### Custom Middleware Patterns

```javascript
// Authentication middleware — attach user to req
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    const err = new Error('Missing token');
    err.status = 401;
    err.expose = true;
    return next(err);
  }

  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    const authErr = new Error('Invalid token');
    authErr.status = 401;
    authErr.expose = true;
    next(authErr);
  }
}

// Authorization middleware — factory that takes allowed roles
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(Object.assign(new Error('Unauthorized'), { status: 401 }));
    if (roles.includes('self') && req.params.id === req.user.id) return next();
    if (!roles.some(r => req.user.roles.includes(r))) {
      return next(Object.assign(new Error('Forbidden'), { status: 403, expose: true }));
    }
    next();
  };
}

// Rate limiting middleware (using express-rate-limit)
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // max 100 requests per window
  standardHeaders: true,      // include RateLimit-* headers
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests, please try again later.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // stricter limit for login endpoint
  skipSuccessfulRequests: true,
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
```

### Template Engines

```javascript
// EJS — embedded JavaScript templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// views/users/list.ejs:
// <ul>
//   <% users.forEach(user => { %>
//     <li><%= user.name %> — <%- user.bio %></li>  <!-- = escapes, - is raw HTML -->
//   <% }) %>
// </ul>

router.get('/users', async (req, res) => {
  const users = await UserService.findAll();
  res.render('users/list', {
    title: 'Users',
    users,
    currentUser: req.user,
  });
});

// Pug — indentation-based templates (formerly Jade)
app.set('view engine', 'pug');
// views/users/list.pug:
// ul
//   each user in users
//     li #{user.name} — !{user.bio}
```

### Error Handling Patterns

```javascript
// Custom error classes for structured error handling
class AppError extends Error {
  constructor(message, statusCode = 500, expose = false) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
    this.expose = expose; // if true, send message to client
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, true);
  }
}

class ValidationError extends AppError {
  constructor(message, fields) {
    super(message, 400, true);
    this.fields = fields;
  }
}

// Async error wrapper — avoids try/catch in every handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Clean route handler using asyncHandler
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await UserService.findById(req.params.id);
  if (!user) throw new NotFoundError('User');
  res.json(user);
}));

// Global error handler
app.use((err, req, res, next) => {
  // Operational errors: expose message; programming errors: hide it
  const status = err.status || 500;
  const body = {
    error: err.expose ? err.message : 'Internal Server Error',
    ...(err.fields && { fields: err.fields }),
  };

  if (status >= 500) {
    console.error(`[${req.requestId}]`, err); // log stack for 5xx only
  }

  res.status(status).json(body);
});
```

---

## Real-World Notes

- **Register error-handling middleware last** — Express identifies error handlers by their 4-parameter signature `(err, req, res, next)`. If you register it before routes, it won't catch route errors.
- **Always call `next(err)` in async route handlers** — unhandled rejections in async handlers do NOT automatically flow to the error middleware in Express 4. Use `asyncHandler` or upgrade to Express 5 (which wraps async automatically).
- **`express.json()` has a default 100kb limit** — increase it with `{ limit: '10mb' }` for file uploads, but consider streaming `multipart/form-data` with `multer` instead.
- **`router.param()` for DRY param validation** — if every route uses `:userId`, define the validation once with `router.param('userId', handler)` instead of repeating it.

---

## Common Pitfalls

1. **Forgetting to call `next()` in middleware** — if a middleware neither calls `next()` nor sends a response, the request hangs indefinitely. Always end with one or the other.
2. **Registering the 404 handler before routes** — Express matches routes in registration order. A 404 catch-all before your actual routes will intercept everything.
3. **Using `res.send()` after `res.json()`** — both call `res.end()`. Calling both throws "Cannot set headers after they are sent."
4. **Not sanitizing inputs with express-validator** — validation alone (`isEmail`) doesn't strip dangerous characters. Use `.normalizeEmail()`, `.trim()`, `.escape()` sanitizer chains.
5. **Mounting the router at the wrong path** — if you mount at `/api/users` and define `router.get('/users')`, the actual URL becomes `/api/users/users`. Define `router.get('/')` for the base route.

---

## Related Concepts

- [[_MOC_NodeJS|↑ Section MOC]]
- [[NodeJS_HTTP_and_REST]] — Express wraps the built-in http module
- [[NodeJS_Database_and_Production]] — Database queries inside route handlers
- [[NodeJS_Async_and_Streams]] — async/await patterns in Express handlers

---

## Review Questions

1. What is the signature difference between regular middleware and error-handling middleware in Express? Why must error handlers have exactly 4 arguments?
2. What happens if an async route handler throws an error in Express 4? How do you fix it?
3. Explain how `express.Router()` helps organize a large application. How do you mount it in the main app?
4. What is the difference between `res.send()`, `res.json()`, and `res.end()`?
5. In what order are these registered middleware/routes executed, and why does order matter?

---

## Sources

- Express.js documentation — https://expressjs.com/en/4x/api.html
- express-validator docs — https://express-validator.github.io/docs/
- express-rate-limit docs — https://github.com/express-rate-limit/express-rate-limit
- Helmet.js docs — https://helmetjs.github.io/

#WebDevelopment #NodeJS #express #routing #middleware #rest-api
