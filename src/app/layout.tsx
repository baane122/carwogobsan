import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/language-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppFAB } from "@/components/whatsapp-fab";

export const metadata: Metadata = {
  title: "CARWO GOBSAN | Premium E-Commerce in Hargeisa",
  description:
    "Shop the best electronics, home appliances, and lifestyle products in Hargeisa. Free delivery, quality guaranteed, cash on delivery.",
  keywords: [
    "Hargeisa",
    "Somaliland",
    "electronics",
    "shopping",
    "e-commerce",
    "CARWO GOBSAN",
  ],
  openGraph: {
    title: "CARWO GOBSAN",
    description: "Premium E-Commerce in Hargeisa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-sans">
        <LanguageProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFAB />
        </LanguageProvider>
      </body>
    </html>
  );
}