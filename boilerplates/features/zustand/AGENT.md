# Zustand Agent Instructions

This boilerplate provides Zustand for client-side application state.

## Rules

- Use Zustand for shared client-side state.
- Do not use Zustand as a replacement for server-state libraries.
- Keep stores focused on a specific domain.
- Avoid creating one large global store.
- Prefer local React state when state does not need to be shared.
- Prefer TanStack Query for remote/server data.

## Store location

Create stores inside:

`src/store`

## Example

`exampleStore.ts` demonstrates the expected store structure.

Rename or replace the example store when implementing real application state.