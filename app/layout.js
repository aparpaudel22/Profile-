import "./globals.css";

export const metadata = {
  title: "Apar Paudel | Computer Engineering Portfolio",
  description:
    "Computer Engineering student and frontend developer in Pokhara, Nepal. AI, machine learning and security-minded design.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: [{ url: "/apple-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}