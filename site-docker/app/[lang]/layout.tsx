import PanelLayout from "@/components/panel/panel-layout";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/styles/globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner"
import { i18n, type Locale } from "@/i18n/config";

export const metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "EBARA AI Community",
  description:
    "Community Web shares the latest news, prompts, ... about GenAI within Ebara Group.",
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: "/assets/icons/favicon.svg"
  },
  openGraph: {
    url: "/",
    title: "EBARA AI Community",
    description:
      "Community Web shares the latest news, prompts, ... about GenAI within Ebara Group.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "EBARA AI Community",
    description:
      "Community Web shares the latest news, prompts, ... about GenAI within Ebara Group."
  }
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PanelLayout>
            <TooltipProvider>
              <NuqsAdapter>
                {children}
                <Toaster />
              </NuqsAdapter>
            </TooltipProvider>
          </PanelLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
