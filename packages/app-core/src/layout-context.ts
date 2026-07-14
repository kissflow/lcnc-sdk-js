import { createContext } from "react";

export interface PageTitleState {
  title: string;
  setTitle: (title: string) => void;
}

export const PageTitleContext = createContext<PageTitleState>({
  title: "",
  setTitle: () => {},
});
