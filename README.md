# ⚒️ Forge

**Forge** is a stack-aware developer CLI for scaffolding projects and installing reusable development boilerplates.

Instead of repeatedly setting up the same project structure, components, libraries, and common patterns, Forge provides a centralized workflow for creating projects and adding reusable features.

```bash
forge new
forge add ui-states
forge info
```

> Forge is currently under active development.

---

## Why Forge?

Starting a new project often involves repeating the same work:

* Creating the base application
* Installing common dependencies
* Configuring libraries
* Recreating loading, error, and empty states
* Setting up authentication
* Creating API/service layers
* Configuring state management
* Rebuilding familiar project structures

Forge aims to make those steps reusable.

The goal is to separate project setup into two responsibilities:

```text
Forge
├── Deterministic setup
│   ├── Project generation
│   ├── Dependency installation
│   ├── Configuration
│   └── Boilerplate installation
│
└── AI-assisted development
    ├── Feature adaptation
    ├── Business logic
    ├── UI/UX implementation
    └── Project-specific decisions
```

Forge handles predictable setup while developers and coding agents focus on application-specific work.

---

# Features

## Project Scaffolding

Create a new project through an interactive CLI.

```bash
forge new
```

Currently supported project types include:

| Stack                            | Status      |
| -------------------------------- | ----------- |
| React + Vite + TypeScript        | ✅ Supported |
| React + Vite + JavaScript        | ✅ Supported |
| React Native + Expo + TypeScript | ✅ Supported |
| Laravel                          | 🚧 Planned  |

Forge uses official project generators whenever possible rather than maintaining complete framework copies.

---

## Reusable Boilerplates

Install reusable components and features into an existing project.

```bash
forge add
```

Or install one directly:

```bash
forge add ui-states
```

Example:

```text
⚒ Forge Feature Installer

Detected stack: react-vite-ts

? What would you like to add?

❯ UI States — Loading, error, and empty states.
```

Forge then installs the appropriate files into the project.

---

## Project Detection

Forge can inspect the current project and identify its environment.

```bash
forge info
```

Example:

```text
⚒ Forge Project Info

Project: my-app
Framework: react-vite
Language: typescript
Styling: css
Package Manager: npm
```

Project detection currently supports identifying:

* React
* Vite
* Expo
* TypeScript
* JavaScript
* Laravel
* Tailwind CSS
* NativeWind
* npm
* pnpm
* Yarn
* Bun
* Composer

---

## Stack-Aware Boilerplates

Boilerplates can declare which project environments they support.

Example:

```json
{
  "id": "ui-states",
  "name": "UI States",
  "category": "ui",
  "frameworks": [
    "react-vite-ts"
  ]
}
```

Forge compares this metadata against the detected project before installation.

```text
Current Project
      │
      ▼
React + Vite + TypeScript
      │
      ▼
react-vite-ts
      │
      ▼
Boilerplate Compatibility
      │
   ┌──┴──┐
   │     │
   ▼     ▼
Compatible   Incompatible
   │
   ▼
Install
```

This helps prevent framework-specific boilerplates from being installed into incompatible projects.

---

# Global Forge Workspace

Forge uses a global workspace for reusable resources.

On Windows:

```text
C:\Users\<username>\.forge\
```

Example structure:

```text
.forge/
└── boilerplates/
    ├── stacks/
    ├── features/
    ├── ui/
    │   └── states/
    └── patterns/
```

This allows Forge to be used across projects stored in different locations.

For example:

```text
Desktop/
└── Projects/
    └── my-app/

Documents/
└── experiments/
    └── another-app/

D:/
└── Clients/
    └── client-project/
```

Each project can access the same reusable Forge boilerplate library.

---

# Boilerplate Architecture

Forge does not treat every reusable resource as a complete application.

Boilerplates are organized by purpose.

```text
boilerplates/
│
├── stacks/
│   └── Complete stack configurations
│
├── features/
│   └── Functional capabilities
│
├── ui/
│   └── Reusable UI components
│
└── patterns/
    └── Reference implementations
```

### Stacks

Complete or foundational project configurations.

Examples:

```text
React + Vite
Expo
Laravel
```

### Features

Reusable application functionality.

Planned examples:

```text
Supabase Auth
TanStack Query
Zustand
API services
```

### UI

Reusable interface components.

Current example:

```text
ui/
└── states/
    ├── LoadingState.tsx
    ├── ErrorState.tsx
    └── EmptyState.tsx
```

### Patterns

Reference implementations intended primarily for developers and coding agents.

Examples:

```text
API service patterns
Form patterns
Error handling patterns
Data fetching patterns
```

---

# Boilerplate Manifest

Each installable boilerplate can contain a `template.json`.

Example:

```json
{
  "id": "ui-states",
  "name": "UI States",
  "description": "Reusable loading, error, empty and retry states.",
  "category": "ui",

  "frameworks": [
    "react-vite-ts"
  ],

  "dependencies": [],

  "files": {
    "source": "./files",
    "destination": "./src/components/states"
  }
}
```

The manifest allows Forge to understand:

* Boilerplate identity
* Supported frameworks
* Required dependencies
* Source files
* Installation destination

Future versions will extend the manifest system for more complex installations.

---

# AI Agent Integration

One of Forge's long-term goals is to make reusable development patterns understandable by AI coding agents.

Boilerplates can include:

```text
AGENT.md
```

Example:

```text
ui/states/
├── template.json
├── README.md
├── AGENT.md
└── files/
```

`AGENT.md` can describe how coding agents should use or adapt the boilerplate.

For example:

```text
Use these components for asynchronous UI states.

Expected states:

- loading
- error
- empty
- success/content

Adapt styling to the application's design system.

Connect retry handlers to the appropriate data refetch function.
```

The goal is for Forge to provide reusable implementation knowledge in addition to reusable code.

---

# CLI Commands

### Create a project

```bash
forge new
```

Interactive project creation.

---

### Add a boilerplate

```bash
forge add
```

Shows boilerplates compatible with the current project.

A specific boilerplate can also be installed directly:

```bash
forge add ui-states
```

---

### Inspect the current project

```bash
forge info
```

Displays detected framework, language, styling system, package manager, and Forge configuration.

---

### CLI Help

```bash
forge --help
```

---

### Version

```bash
forge --version
```

---

# Development

Forge is written in TypeScript and runs on Node.js.

## Requirements

* Node.js
* npm
* Git

Additional tools may be required depending on the generated stack.

For example, future Laravel support will require PHP and Composer.

---

## Clone

```bash
git clone <repository-url>
cd forge
```

Install dependencies:

```bash
npm install
```

Build:

```bash
npm run build
```

---

## Local CLI Development

Forge can be registered locally as a global command using:

```bash
npm link
```

You can then run:

```bash
forge --help
```

from your terminal.

After changing Forge's TypeScript source:

```bash
npm run build
```

Then test the CLI normally:

```bash
forge info
```

---

# Current Project Structure

```text
forge/
│
├── bin/
│   └── forge.js
│
├── src/
│   ├── boilerplates/
│   │   ├── compatibility.ts
│   │   ├── installer.ts
│   │   └── registry.ts
│   │
│   ├── commands/
│   │   ├── add.ts
│   │   ├── info.ts
│   │   └── new.ts
│   │
│   ├── config/
│   │   ├── forge.ts
│   │   └── stacks.ts
│   │
│   ├── generators/
│   │   ├── expo.ts
│   │   └── react.ts
│   │
│   ├── project/
│   │   └── detector.ts
│   │
│   └── index.ts
│
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

# Roadmap

Forge is still experimental and will continue evolving.

Planned features include:

* [x] Interactive project creation
* [x] React + Vite project generation
* [x] Expo project generation
* [x] Reusable boilerplate installer
* [x] Project environment detection
* [x] Stack compatibility checks
* [x] Global Forge boilerplate directory
* [ ] Tailwind CSS setup
* [ ] NativeWind setup
* [ ] Laravel project generator
* [ ] Supabase integration
* [ ] Supabase authentication boilerplate
* [ ] TanStack Query integration
* [ ] Zustand integration
* [ ] Dependency-aware boilerplate installation
* [ ] Environment variable handling
* [ ] Configurable Forge home directory
* [ ] Boilerplate validation
* [ ] `forge doctor`
* [ ] `forge templates`
* [ ] AI agent project instructions
* [ ] Project-level `AGENTS.md`
* [ ] Boilerplate dependency/conflict detection
* [ ] Improved installation rollback and safety

---

# Vision

Forge aims to become a personal development toolkit that sits between project generators, reusable boilerplates, and AI coding agents.

Instead of telling an AI agent:

```text
Build authentication.
Create loading states.
Set up TanStack Query.
Configure Supabase.
Create the API service layer.
```

the workflow becomes closer to:

```bash
forge new
forge add supabase-auth
forge add tanstack-query
forge add ui-states
```

The resulting project already contains known structures, dependencies, conventions, and reference implementations.

AI agents can then focus on adapting those foundations to the actual application rather than recreating them from scratch.

---

## Status

🚧 **Forge is currently under active development.**

The CLI and boilerplate architecture are functional, but APIs, manifests, commands, and project structures may change as development continues.

---

## License

A license has not yet been selected.
