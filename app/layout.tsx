import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/toast";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: { default: "Aurum Estates | Luxury Real Estate & Premium Property Tours", template: "%s | Aurum Estates" },
  description: "Cinematic luxury real estate platform for premium homes, verified owners, property maps, reviews, and private showing inquiries.",
  applicationName: "Aurum Estates",
  authors: [{ name: "Aurum Estates" }],
  creator: "Aurum Estates",
  publisher: "Aurum Estates",
  keywords: [
    "Aurum Estates",
    "luxury real estate",
    "premium homes",
    "luxury apartments",
    "villas for sale",
    "verified real estate owners",
    "private property viewing",
    "real estate lead generation"
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Aurum Estates | Luxury Real Estate",
    description: "Find premium homes through cinematic galleries, verified owners, reviews, maps, and private showings.",
    type: "website",
    siteName: "Aurum Estates"
  },
  twitter: {
    card: "summary_large_image",
    title: "Aurum Estates | Luxury Real Estate",
    description: "Premium homes, verified owners, private property tours, and cinematic discovery."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
