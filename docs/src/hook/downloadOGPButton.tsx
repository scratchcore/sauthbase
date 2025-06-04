"use client";

import React from "react";
import html2canvas from "html2canvas";

export function DownloadOGPButton({ id }: { id: string }) {
  const handleDownload = async () => {
    const element = document.getElementById(id);
    if (!element) return alert("要素が見つかりません");

    const canvas = await html2canvas(element, {
      backgroundColor: null, // 透明背景維持
      scale: 2, // 解像度を上げる（必要に応じて調整）
    });

    const dataURL = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "ogp-image.png";
    link.click();
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        padding: "8px 16px",
        backgroundColor: "#1c1917",
        color: "white",
        fontSize: "16px",
        borderRadius: "4px",
        margin: "16px",
      }}
    >
      OGP画像をダウンロード
    </button>
  );
}
