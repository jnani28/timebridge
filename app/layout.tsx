import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timebridge — Global Meeting Planner",
  description: "Live world clocks and a daylight-saving-aware offshore meeting planner.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
