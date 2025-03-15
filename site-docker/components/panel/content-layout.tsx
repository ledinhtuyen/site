import { Navbar } from "@/components/panel/navbar";

interface ContentLayoutProps {
  title: string
  children: React.ReactNode
  showBackButton?: boolean
  backUrl?: string
}

export function ContentLayout({
  title,
  children,
  showBackButton = false,
  backUrl
}: ContentLayoutProps) {
  return (
    <>
      <Navbar
        title={title}
        showBackButton={showBackButton}
        backUrl={backUrl}
      />
      {children}
    </>
  );
}
