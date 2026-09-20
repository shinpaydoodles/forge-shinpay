# Supabase Agent Instructions

This boilerplate provides the base Supabase client for the application.

## Rules

- Reuse the existing client from `src/lib/supabase.ts`.
- Do not create additional Supabase clients unless required.
- Never hardcode Supabase credentials.
- Read credentials from Vite environment variables.
- Never expose service-role keys in frontend code.
- Keep `.env` out of version control.
- Use `.env.example` only as a variable template.

## Client

Import the existing client with:

`import { supabase } from "@/lib/supabase";`

Adjust the import path if the project does not use the `@` alias.