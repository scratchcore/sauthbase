import { execSync } from "child_process";

const type = process.argv[2];
if (!type) {
  console.error("タイプを選択してください");
  process.exit(1);
}
if (type === "dist-tag") {
  const subcommand = process.argv[3]; // 例: "add"
  const pkg = process.argv[4]; // 例: "sauthbase@0.0.1-alpha.1"
  const tag = process.argv[5]; // 例: "alpha"

  if (!subcommand || !pkg || !tag) {
    console.error("使用方法: dist-tag add <package>@<version> <tag>");
    process.exit(1);
  }

  const command = `npm dist-tag ${subcommand} ${pkg} ${tag}`;
  console.log(`実行中: ${command}`);
  execSync(command, { stdio: "inherit" });
  process.exit(0);
}