import "./globals.css";

export const metadata = {
  title: "Apar Paudel",
  description:
    "Computer Engineering student and frontend developer. AI, machine learning and security-minded design.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}