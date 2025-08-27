import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

export const metadata = {
  title: "Webbuilder",
  description: "A playful pastel web builder",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen gradient-bg text-[hsl(var(--fg))] antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
