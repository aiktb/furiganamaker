import { createContext } from "react";

interface Links {
  chrome: string;
  github: string;
}

export const LinksContext = createContext<Links | null>(null);
