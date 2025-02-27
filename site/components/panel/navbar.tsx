import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserNav } from "@/components/panel/user-nav";
import { SheetMenu } from "@/components/panel/sheet-menu";
import { LanguageSwitcher } from "../ui/language-switcher";
import { Search } from "./search";

export function Navbar({ title }) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-2">
          {/* <Search /> */}
          <LanguageSwitcher />
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
