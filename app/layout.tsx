import type { Metadata } from "next";
import "../src/styles.css";

export const metadata: Metadata = {
  title: "Методология премиальных программ",
  description:
    "Онлайн-мастер-класс Александры Горевой-Куртышевой о премиальных программах, консалтинге и агентствах в реалиях 2026 года.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
