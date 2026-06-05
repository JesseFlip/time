import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quadrant | Eisenhower Matrix PWA",
  description: "Frictionless capture and reliable sync for your Eisenhower Matrix.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quadrant",
  },
  openGraph: {
    title: "Quadrant | Eisenhower Matrix PWA",
    description: "Frictionless capture and reliable sync for your Eisenhower Matrix.",
    url: "https://quadrant.example.com",
    siteName: "Quadrant",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quadrant | Eisenhower Matrix PWA",
    description: "Frictionless capture and reliable sync for your Eisenhower Matrix.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Quadrant",
  url: "https://quadrant.example.com",
  description: "Frictionless capture and reliable sync for your Eisenhower Matrix.",
  applicationCategory: "Productivity",
  operatingSystem: "All",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
