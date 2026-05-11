import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import "../globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hosamine SARL — Expert en Solutions Environnementales et Agricoles",
  description:
    "Hygiène publique, traitements phytosanitaires et assainissement pour les entreprises et institutions du Cameroun. Agréé MINADER, MINSANTE, Port Autonome de Douala.",
  openGraph: {
    title: "Hosamine SARL",
    description: "Expert en Solutions Environnementales et Agricoles",
    url: "https://hosamine.net",
    siteName: "Hosamine SARL",
    locale: "fr_FR",
    type: "website",
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${sora.variable} ${inter.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
