# ACV Configuration Portal UI - Developer Onboarding Guide

**Last Updated:** April 3, 2026

---

## Welcome to ACV Configuration Portal UI! 🎉

This guide will help you set up your development environment and become productive with the Configuration Portal UI codebase within 1-2 hours.

---

## Prerequisites

Before starting, ensure you have the following installed on your machine:

### Required Tools

| Tool | Version | Purpose | Download |
|------|---------|---------|----------|
| **Node.js** | 18+ LTS | JavaScript runtime | https://nodejs.org/ |
| **npm** | 10+ | Package manager | Included with Node.js |
| **Git** | 2.30+ | Version control | https://git-scm.com/ |
| **Visual Studio Code** | Latest | Code editor | https://code.visualstudio.com/ |

### Verify Installation

```bash
# Check Node.js version
node --version
# Expected output: v18.x.x or higher

# Check npm version
npm --version
# Expected output: 10.x.x or higher

# Check Git version
git --version
# Expected output: git version 2.30.x or higher
```

---

## Step 1: IDE Setup (15 minutes)

### 1.1 Install Visual Studio Code Extensions

**Recommended Extensions for Angular Development:**

1. **Angular Language Service**
   - Publisher: Angular
   - ID: Angular.ng-template
   - Purpose: Template syntax highlighting, intellisense

2. **Error Lens**
   - Publisher: Alexander
   - Purpose: Show errors inline

3. **prettier - Code formatter**
   - Publisher: Prettier
   - Purpose: Code formatting consistency

4. **Thunder Client** (or Postman)
   - Purpose: Test API endpoints

5. **GitLens**
   - Purpose: Git history and blame

**Installation:**
```bash
# Or install via VS Code Extensions marketplace (Cmd+Shift+X)
code --install-extension Angular.ng-template
code --install-extension usernamehw.errorlens
code --install-extension esbenp.prettier-vscode
code --install-extension rangav.vscode-thunder-client
code --install-extension eamodio.gitlens
```

---

### 1.2 Configure VS Code Settings

**Create/Update `./.vscode/settings.json`:**

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.angular": true
  }
}
```

---

## Step 2: Repository Setup (10 minutes)

### 2.1 Clone Repository

```bash
# Navigate to your workspace directory
cd c:\Users\YourUsername\Code

# Clone repository
git clone https://github.com/your-org/eai-3540813-configuration-portal-ui.git

# Navigate into project
cd eai-3540813-configuration-portal-ui
```

### 2.2 Install Dependencies

```bash
# Install npm dependencies
npm install

# Pre-commit hook setup (optional but recommended)
npm install husky --save-dev
npx husky install
```

**Troubleshooting `npm install` errors:**

```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install

# If you have .npmrc issues:
cat .npmrc  # Check for any private registry configs
```

---

### 2.3 Verify Installation

```bash
# Check Angular CLI version
ng version

# Expected output:
# Angular CLI: 19.2.15
# Node: 18.x.x
# Package Manager: npm 10.x.x
```

---

## Step 3: Okta Configuration (15 minutes)

The application uses Okta for OAuth 2.0 authentication. You need to configure Okta to run locally.

### 3.1 Get Okta Credentials

Ask your team lead for:
- Okta domain (e.g., `your-org.okta.com`)
- Client ID
- Client secret (if needed for backend-to-backend)

### 3.2 Update Okta Configuration

**File:** `src/okta.config.ts`

```typescript
import { OktaAuth } from '@okta/okta-auth-js';

export const oktaAuth = new OktaAuth({
  issuer: 'https://your-org.okta.com/oauth2/default',  // Ask team lead
  clientId: 'YOUR_CLIENT_ID_HERE',                      // Ask team lead
  redirectUri: window.location.origin + '/authorization-code/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true  // Recommended for SPAs
});
```

### 3.3 Update Environment Configuration

**File:** `src/environments/environment.ts` (local development)

```typescript
export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080/api'  // Update based on your setup
};
```

---

## Step 4: Start Development Server (5 minutes)

### 4.1 Run Development Server

```bash
# Start Angular development server
npm start
# or: ng serve --configuration=local

# Expected output:
# ✔ Compiled successfully.
# ⠙ Building...
# ✔ Compiled successfully.
# 
# Application bundle generated successfully.
# Watch mode enabled. Application will auto reload on file changes.
# ⠙ Building...
# 
# Angular Live Development Server is listening on localhost:4200 ...
```

### 4.2 Open Application

1. Open browser to **http://localhost:4200/**
2. You should be redirected to Okta login
3. Enter your credentials
4. You'll be redirected back to http://localhost:4200/authorization-code/callback
5. You should see the Configuration Portal dashboard

---

## Step 5: Run Tests (5 minutes)

### 5.1 Unit Tests

```bash
# Run all unit tests
npm test
# or: ng test

# Run tests in headless mode (CI environment)
ng test --watch=false --code-coverage

# Watch specific test file
ng test --include='**/configuration.component.spec.ts'
```

### 5.2 Code Coverage

```bash
# Generate coverage report
ng test --no-watch --code-coverage

# Open coverage report in browser
open coverage/index.html

# Look for acceptance criteria:
# - Line coverage: >80%
# - Branch coverage: >75%
# - Function coverage: >80%
```

---

## Step 6: Code Linting (5 minutes)

### 6.1 Run Linter

```bash
# Check code for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

### 6.2 Common Linting Rules

- ✅ Use `const` by default, `let` when needed
- ✅ Prefer arrow functions
- ✅ Use strict equality (`===`, not `==`)
- ❌ No `console.log` in production code
- ❌ No unused variables

---

## Step 7: Build for Deployment (10 minutes)

### 7.1 Production Build

```bash
# Create production build
npm run build:prod

# Expected output:
# ✔ Compiled successfully.
# ✔ Browser bundle generated successfully. (3.2MB)
# ✔ Server bundle generated successfully. (2.1MB)
# Build at: 2026-04-03T14:30:00.000Z - Hash: abc123def
# Time: 45.23s
```

### 7.2 Build Artifacts

```bash
# Built files are in dist/ directory
ls -la dist/configuration-portal/

# You should see:
# - main.[hash].js
# - styles.[hash].css
# - index.html
# - assets/
# - etc.
```

---

## Architecture Walkthrough (30 minutes)

### Guided Tour: Follow This Path

1. **Entry Point** → Open `src/main.ts`
   - Shows `bootstrapApplication(AppComponent)`

2. **Root Component** → Open `src/app/app.component.ts`
   - Initializes authentication
   - Sets up language

3. **Root Module** → Open `src/app/app.module.ts`
   - Shows all providers (AcvApiService, Okta, Material, etc.)

4. **Routing** → Open `src/app/app-routing.module.ts`
   - Shows all application routes
   - Notice lazy-loading pattern

5. **Layout Shell** → Open `src/app/layout/layout.component.ts`
   - Shows header, navbar, footer, router-outlet

6. **Configuration Feature** → Open `src/app/core/configuration/`
   - Main feature module with tabs
   - Sub-components for each tab

7. **Shared Services** → Open `src/app/shared/services/`
   - `acv-api.service.ts` — HTTP client
   - `authService.ts` — Authentication
   - `loading.service.ts` — Global loading state

8. **API Communication** → Open `src/app/core/configuration/configuration.component.ts`
   - See how forkJoin orchestrates multiple APIs
   - Notice Observable pattern

---

## Common Development Tasks

### Task 1: Add a New Page/Feature

```bash
# 1. Generate new component
ng generate component core/new-feature/new-feature

# 2. Create feature module
ng generate module core/new-feature/new-feature --routing

# 3. Update app-routing.module.ts to lazy-load
{
  path: 'new-feature',
  component: NewFeatureComponent,
  canActivate: [OktaAuthGuard],
  children: [{
    path: '',
    loadChildren: () => import('./core/new-feature/new-feature.module')
      .then(m => m.NewFeatureModule)
  }]
}

# 4. Update navbar configuration in app-config.ts
menuItems: [
  //...
  {
    navItem: 'ACV_MENU.NEW_FEATURE',
    icon: 'fa fa-star',
    route: '/new-feature'
  }
]

# 5. Test: ng serve, navigate to new route
```

---

### Task 2: Add an API Call

```typescript
// 1. In your component
constructor(private acvApiService: AcvApiService) {}

ngOnInit(): void {
  this.acvApiService.post('data-service', 'newEndpoint', { param1: 'value' })
    .subscribe(
      (result) => {
        this.data = result;
        console.log('Data received:', result);
      },
      (error) => {
        console.error('API error:', error);
        this.errorMessage = 'Failed to load data';
      }
    );
}

// 2. In template
<div *ngIf="data">
  <p>{{ data.propertyName }}</p>
</div>

// 3. Test: Check Network tab in DevTools
// - Filter by 'data-service'
// - Verify request payload
// - Verify response structure
```

---

### Task 3: Add/Update Translations

```typescript
// 1. Add key to translation file
// src/assets/i18n/en.json
{
  "HEADER.APPLICATION_TITLE": "ACV Configuration Portal",
  "MENU.NEW_FEATURE": "New Feature"
}

// 2. Use in template
<h1>{{ 'HEADER.APPLICATION_TITLE' | translate }}</h1>

// 3. Use in component
constructor(private translate: TranslateService) {}
ngOnInit(): void {
  this.translate.get('MENU.NEW_FEATURE').subscribe(translated => {
    console.log(translated);
  });
}

// 4. Switch language
switchLanguage(langCode: string): void {
  this.translate.use(langCode);
}
```

---

### Task 4: Run a Specific Test

```bash
# Test single component
ng test --include='**/configuration.component.spec.ts'

# Test with specific pattern
ng test --include='**/*.service.spec.ts'

# Run tests then exit (CI mode)
ng test --watch=false --browsers=Chrome
```

---

### Task 5: Debug in Browser

```typescript
// 1. Add breakpoint in VS Code
// - Click line number or press F9
// - Run `ng serve` with debugging
ng serve --poll=2000 --source-map

// 2. Open Chrome DevTools (F12)
// - Go to Sources tab
// - Find your .ts file
// - Set breakpoints in DevTools

// 3. Use browser console
// In Chrome console:
// - Inspect component: ng.probe($0).componentInstance
// - Access service: ng.probe($0).injector.get(AcvApiService)
// - Make API calls manually
```

---

### Task 6: Format Code

```bash
# Format all files
prettier --write "src/**/*.{ts,html,css}"

# Format specific file
prettier --write src/app/core/configuration/configuration.component.ts

# Or right-click in VS Code → Format Document (Shift+Alt+F)
```

---

## Common Issues & Troubleshooting

### Issue 1: Okta Login Not Working

**Symptom:** Page redirects to Okta but login fails

**Solutions:**
```bash
# 1. Check Okta config
cat src/okta.config.ts
# Verify: issuer, clientId, redirectUri

# 2. Check browser console for CORS errors
# Open DevTools (F12) → Console tab

# 3. Verify Okta configuration in admin panel
# Log in to https://your-org.okta.com/admin/
# Check: Applications → Your App → Sign-on URIs

# 4. Clear browser localStorage
# DevTools → Application → Local Storage → Clear All
```

---

### Issue 2: API Calls Returning 401 Unauthorized

**Symptom:** API calls fail with 401 error

**Solutions:**
```typescript
// 1. Check if AuthInterceptor is injecting token
// In src/app/shared/interceptors/auth.interceptor.ts
// Verify it's imported in app.module.ts

// 2. Check token validity
// In browser console:
localStorage.getItem('okta-token-storage');
// Should show a valid JWT token

// 3. Check backend is validating with correct Okta issuer
// Token issued by: https://your-org.okta.com
// Backend should accept from same issuer
```

---

### Issue 3: Port 4200 Already in Use

**Symptom:** `Error: Port 4200 is already in use`

**Solutions:**
```bash
# Find process using port 4200
# macOS/Linux:
lsof -i :4200
kill -9 <PID>

# Windows:
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Or use different port:
ng serve --port 4201
```

---

### Issue 4: Dependencies Not Installing

**Symptom:** `npm ERR!` or `Error: Cannot find module`

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# If still failing, check your .npmrc file
cat .npmrc
# Look for private registry entries
```

---

### Issue 5: Tests Failing with Module Not Found

**Symptom:** `Error: Can't resolve '@angular/core'`

**Solutions:**
```bash
# Make sure you're in the project directory
cd eai-3540813-configuration-portal-ui

# Reinstall dependencies
npm install

# Clear Angular cache
rm -rf .angular

# Run tests again
npm test
```

---

## Branch Strategy & Git Workflow

### Creating a Feature Branch

```bash
# 1. Update main branch
git checkout main
git pull origin main

# 2. Create feature branch
# Branch naming: feature/JIRA-123-short-description
git checkout -b feature/JIRA-123-add-new-config-tab

# 3. Make changes and commit
git add src/app/core/new-feature/
git commit -m "feat: add new configuration tab

- Implement tab component
- Add API integration
- Add unit tests

JIRA-123"

# 4. Push to remote
git push -u origin feature/JIRA-123-add-new-config-tab

# 5. Create Pull Request on GitHub
# - Add description
# - Request reviewers
# - Link JIRA ticket
```

### Commit Message Convention

```
# Format: <type>(<scope>): <subject>
# Types: feat, fix, docs, style, refactor, test, chore
# Scope: component/service affected
# Subject: short description (imperative mood)

feat(configuration): add categories tab
fix(auth): correct token injection in interceptor
docs(readme): update setup instructions
test(dashboard): add unit tests for metrics
```

---

## Code Review Checklist

Before submitting a Pull Request, verify:

- ✅ All tests pass: `npm test`
- ✅ No linting errors: `npm run lint`
- ✅ Code formatted: `prettier --write src/`  
- ✅ No breaking changes to APIs
- ✅ Updated documentation (if needed)
- ✅ No console.log statements left
- ✅ Component/service has unit tests
- ✅ Naming follows conventions
- ✅ No unused imports or variables

---

## Useful Commands Reference

```bash
# Development
npm start                      # Start dev server
ng serve --open               # Start + open browser
ng serve --port 4201          # Different port

# Building
npm run build:dev             # Dev build
npm run build:test            # Test build
npm run build:prod            # Production build

# Testing
npm test                       # Run all tests
npm test -- --watch=false    # Run once
npm test -- --code-coverage  # With coverage

# Linting
npm run lint                   # Check code style
npm run lint -- --fix        # Auto-fix issues

# Git
git status                     # Show uncommitted changes
git log --oneline -10         # Show recent commits
git diff src/                  # Show changes since last commit
```

---

## Online Resources

### Documentation & Guides

- 📖 [Angular Official Docs](https://angular.io/)
- 📖 [RxJS Documentation](https://rxjs.dev/)
- 📖 [Angular Material](https://material.angular.io/)
- 📖 [Okta Angular SDK](https://developer.okta.com/docs/guides/sign-into-spa/angular/)
- 📖 [AG Grid Angular](https://www.ag-grid.com/angular-data-grid/)
- 📖 [ngx-translate Documentation](https://github.com/ngx-translate/core)

### Community

- Stack Overflow: Tag your question with `angular`, `typescript`, `okta`
- GitHub Discussions: Check existing issues/discussions in repository
- Team Slack: #acv-platform-dev channel

---

## Next Steps

After completing onboarding:

1. **Review Architecture** → Read [HLD.md](HLD.md)
2. **Explore Code** → Follow [Code Mapping](code-mapping.md)
3. **Understand APIs** → Read [Services.md](services.md)
4. **Pick a Task** → Look for `good-first-issue` label in GitHub Issues
5. **Make a Change** → Create a feature branch and submit PR

---

## Getting Help

### Who to Contact

| Question | Contact | Channel |
|----------|---------|---------|
| Angular/TypeScript help | @frontend-team | Slack #acv-dev |
| API/backend issues | @backend-team | Slack #acv-backend |
| DevOps/deployment | @devops-team | Slack #acv-devops |
| ACV domain questions | @compliance-team | Slack #acv-compliance |

### Useful Slack Channels

- `#acv-platform-dev` — Development team
- `#acv-announcements` — Important updates
- `#acv-documentation` — Doc questions
- `#acv-help` — General questions

---

## Learning Paths (Recommended)

### Path A: Frontend Developer (4 weeks)

Week 1:
- Angular fundamentals
- TypeScript basics
- Component lifecycle

Week 2:
- Services and Dependency Injection
- RxJS Observables
- HTTP communication

Week 3:
- Routing and modules
- Testing (Jasmine/Karma)
- Forms and validation

Week 4:
- ACV portal-specific features
- Okta integration
- Deployment

### Path B: Full-Stack Developer (8 weeks)

Weeks 1-4: Same as Path A (Frontend)

Weeks 5-6:
- Backend service exploration
- API design patterns
- Database schemas

Weeks 7-8:
- End-to-end flows
- Performance optimization
- Production troubleshooting

---

## Success Metrics

You've successfully completed onboarding when you can:

✅ Start development server without errors  
✅ Log in via Okta  
✅ Navigate between application pages  
✅ Run all tests with >90% passing  
✅ Build application for production  
✅ Make a simple code change and submit PR  
✅ Understand Application architecture (HLD)  
✅ Find any code in the repository (Code Mapping)  
✅ Understand what each API endpoint does (Services)  
✅ Explain authentication flow  

---

## Congratulations! 🎉

You're now ready to contribute to the ACV Configuration Portal UI. Welcome to the team!

For questions, check the documentation or reach out to your team lead in Slack.

**Happy coding!**

---

**Document Version:** 1.0  
**Last Updated:** April 3, 2026
