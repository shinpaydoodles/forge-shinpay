export interface Boilerplate {
  id: string;
  name: string;
  description: string;
  path: string;
  frameworks: string[];
}

export const boilerplates: Boilerplate[] = [
  {
    id: "ui-states",
    name: "UI States",
    description: "Loading, error, and empty states.",
    path: "ui/states",
    frameworks: ["react-vite-ts"],
  },
  {
    id: "supabase",
    name: "Supabase",
    description:
      "Supabase client and environment configuration.",
    path: "features/supabase",
    frameworks: ["react-vite-ts", "react-vite-js"],
  },
  {
    id: "supabase-auth",
    name: "Supabase Auth",
    description:
      "Authentication service, provider, and hooks.",
    path: "features/supabase-auth",
    frameworks: ["react-vite-ts"],
  },
];

export function getBoilerplate(id: string) {
  return boilerplates.find((boilerplate) => boilerplate.id === id);
}