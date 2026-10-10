import "./globals.css";

export const metadata = {
  title: "Apar Paudel",
  description:
    "Computer Engineering student and frontend developer. AI, machine learning and security-minded design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}