import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MajorMate | 전공 커뮤니티와 스터디 매칭",
  description: "컴퓨터공학과 학생을 위한 전공 커뮤니티 및 스터디 매칭 데모",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
