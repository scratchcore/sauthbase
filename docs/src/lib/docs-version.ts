import docsConfig from "../../docs.config";

export function getDocsVersionSpace(before?: string, after?: string) {
  const space =
    docsConfig.version === "latest"
      ? "main"
      : `${before || ""}${docsConfig.version || ""}${after || ""}`;
  return `/${space}`;
}
