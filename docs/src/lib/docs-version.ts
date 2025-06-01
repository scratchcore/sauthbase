import docsConfig from "../../docs.config";

export function getDocsVersionSpace(before?: string, after?: string) {
  const space =
    docsConfig.version === "latest"
      ? ""
      : `${before || ""}${docsConfig.version || ""}${after || ""}`;
  return space;
}
