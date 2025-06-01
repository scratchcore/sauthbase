import { useMDXComponents as getThemeComponents } from "nextra-theme-docs"; // nextra-theme-blog or your custom theme
import { MDXComponents } from "nextra/mdx-components";
import { Popup } from "nextra/components";

// Get the default MDX components
const themeComponents = getThemeComponents();

// Merge components
export function useMDXComponents(components?: Readonly<MDXComponents>) {
  return {
    ...themeComponents,
    ...components,
    Popup,
  };
}
