export default interface docsConfigType {
  version: "latest" | string;
  github: {
    name: string;
    repo: string;
  };
  url: string
}
