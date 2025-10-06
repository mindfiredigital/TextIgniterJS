# Cypress E2E Testing Setup

This document describes the Cypress setup for testing the TextIgniter monorepo packages.

## Prerequisites: Serving Static Files

Before running any Cypress tests for any package, you **must** start the static server:

```bash
pnpm serve:packages
```

This serves all demo/test harnesses at http://localhost:5173 for Cypress to access.

### Web Component Development

If you are developing or testing the web-component package, you must also run its dev server separately:

```bash
pnpm dev:web-component
```

This is required for live development and for E2E tests that interact with the web-component package.

---

## Structure

```
cypress/
├── e2e/
│   └── packages/
│       ├── web-component/
│       │   └── text-igniter-component.cy.ts  ✅ Active tests
│       ├── angular/
│       │   └── angular-component.cy.ts       📝 Placeholder
│       ├── react/
│       │   └── react-component.cy.ts         📝 Placeholder
│       └── core/
│           └── core-functionality.cy.ts      📝 Placeholder
├── support/
│   ├── commands.ts                           🔧 Custom commands
│   └── e2e.ts                               🔧 Support file
└── cypress.config.js                        ⚙️ Configuration
```

## Available Commands

### Run all tests

```bash
pnpm cypress:run
```

### Open Cypress UI

```bash
pnpm cypress:open
```

### Run tests for specific packages

```bash
# Web Component tests (currently active)
pnpm cypress:run:web-component

# Angular tests (placeholder)
pnpm cypress:run:angular

# React tests (placeholder)
pnpm cypress:run:react

# Core tests (placeholder)
pnpm cypress:run:core
```

### Start dev servers

```bash
# Start web-component dev server
pnpm dev:web-component
```

## Current Test Status

### ✅ Web Component Package

- **Status**: 6/6 tests passing
- **Server**: http://localhost:5173 (Vite)
- **Tests**:
  - Component loading
  - Configuration parsing
  - Editor initialization
  - Attribute changes
  - DOM structure validation

### 📝 Other Packages (Angular, React, Core)

- **Status**: Placeholder tests created
- **Action Needed**: Configure dev servers and implement specific tests

## Adding Tests for New Packages

1. **Create test directory**: `cypress/e2e/packages/{package-name}/`
2. **Add test file**: `{package-name}.cy.ts`
3. **Configure dev server** for the package
4. **Add npm script** in root `package.json`:
   ```json
   "cypress:run:{package-name}": "cypress run --spec 'cypress/e2e/packages/{package-name}/**/*'"
   ```

## Configuration

- **Base URL**: http://localhost:5173 (configured for web-component)
- **Viewport**: 1280x720
- **Timeouts**: 10s for commands/requests/responses
- **Screenshots**: On failure only
- **Video**: Disabled

## Custom Commands

Located in `cypress/support/commands.ts`:

- `cy.dataCy(value)`: Select by data-cy attribute
- `cy.waitForTextIgniter()`: Wait for TextIgniter component initialization

## Notes

- Tests run in headless mode by default
- Screenshots are captured on test failures
- The web-component tests verify the TextIgniterComponent initialization and basic functionality
- All packages use separate test folders for better organization and isolation
