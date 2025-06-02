import { rm } from "fs/promises";

try {
  await rm("dist", { recursive: true, force: true });
  console.log("🧹 dist/ フォルダを削除しました");
} catch (err) {
  console.error("❌ dist 削除中にエラーが発生:", err);
}