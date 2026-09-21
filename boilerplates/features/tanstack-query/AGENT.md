# TanStack Query Agent Instructions

This boilerplate provides TanStack Query for server-state management.

## Rules

- Use TanStack Query for remote and asynchronous server data.
- Reuse the QueryClient from `src/query/queryClient.ts`.
- Do not create additional QueryClient instances unnecessarily.
- Use query keys consistently.
- Keep query functions separate from UI components when practical.
- Handle loading, error, empty, and success states.
- Use mutations for create, update, and delete operations.
- Invalidate or update relevant queries after successful mutations.

## State responsibilities

Use TanStack Query for:

- API responses
- Supabase queries
- remote records
- caching
- refetching
- pagination
- server synchronization

Use Zustand for shared client-side state.

Use React state for local component state.

## Provider

The application must be wrapped with:

`QueryProvider`

from:

`src/query/QueryProvider.tsx`

Do not automatically rewrite application entry files without checking the existing project structure.