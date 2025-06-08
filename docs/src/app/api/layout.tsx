import "../globals.css";

export const metadata = {
  title: "SAuthBase API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="false">
        {children}
      </body>
    </html>
  );
}
