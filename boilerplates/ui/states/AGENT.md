# UI States Agent Instructions

This directory contains reference implementations for standard
application states.

## Rules

Reuse these patterns when implementing asynchronous UI.

Prefer these states instead of creating one-off loading and error
components.

Adapt styling to the current application's design system.

Do not blindly copy Tailwind classes if the target application uses
a different styling system.

Expected states:

- loading
- error
- empty
- success/content

When retry behavior is available, connect ErrorState.onRetry to the
appropriate data refetch function.