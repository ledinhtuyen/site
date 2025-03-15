import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserNav } from "@/components/panel/user-nav";
import { SheetMenu } from "@/components/panel/sheet-menu";
import { LanguageSwitcher } from "../ui/language-switcher";
import { BackButton } from "../ui/back-button";

interface NavbarProps {
  title: string
  showBackButton?: boolean
  backUrl?: string
}

export function Navbar({
  title,
  showBackButton = false,
  backUrl
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center">
          <SheetMenu />
          {showBackButton && (
            // <div className="ml-2">
              <BackButton href={backUrl} />
            // </div>
          )}
          {!showBackButton && 
            <h1 className="ml-3 font-bold">{title}</h1>
          }
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-2">
          <LanguageSwitcher />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
