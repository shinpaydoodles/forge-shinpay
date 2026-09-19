export type StackId =
  | "react-vite-ts"
  | "react-vite-js"
  | "expo-ts"
  | "laravel";

export interface Stack {
  id: StackId;
  name: string;
  type: "web" | "mobile" | "laravel";
}

export const stacks: Stack[] = [
  {
    id: "react-vite-ts",
    name: "React + Vite + TypeScript",
    type: "web",
  },
  {
    id: "react-vite-js",
    name: "React + Vite + JavaScript",
    type: "web",
  },
  {
    id: "expo-ts",
    name: "React Native + Expo + TypeScript",
    type: "mobile",
  },
  {
    id: "laravel",
    name: "Laravel",
    type: "laravel",
  },
];