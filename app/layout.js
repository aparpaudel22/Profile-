import "./globals.css";

export const metadata = {
  title: "Apar Paudel | Computer Engineering Portfolio",
  description:
    "Computer Engineering student and frontend developer in Pokhara, Nepal. AI, machine learning and security-minded design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}