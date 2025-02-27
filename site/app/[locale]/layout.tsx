import PanelLayout from "@/components/panel/panel-layout";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "@/styles/globals.css";

export const metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
        : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Community",
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
    title: "Community",
    description:
      "Community Web shares the latest news, prompts, ... about GenAI within Ebara Group.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Community",
    description:
      "Community Web shares the latest news, prompts, ... about GenAI within Ebara Group."
  }
};

export default function RootLayout({
  children
} : {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PanelLayout>
            {children}
          </PanelLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
