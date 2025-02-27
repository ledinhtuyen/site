import React from 'react'
import {
  IconArrowRightDashed,
  IconDeviceLaptop,
  IconMoon,
  IconSun,
} from '@tabler/icons-react'

import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

import { ScrollArea } from '@/components/ui/scroll-area'
import { useSearch } from '@/hooks/use-search'
import { getMenuList } from '@/lib/menu-list'

export function CommandMenu() {
  const { setTheme } = useTheme()
  const { isOpen, setOpen } = useSearch()
  const menuList = getMenuList()

  const runCommand = React.useCallback(
    (command) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder='Type a command or search...' />
      <CommandList>
        <ScrollArea type='hover' className='h-72 pr-1'>
          <CommandEmpty>No results found.</CommandEmpty>
          {menuList.map((group, groupIndex) => (
            <CommandGroup
              key={groupIndex}
              heading={group.groupLabel}
              >
              {group.menus.map((menu, menuIndex) => (
                menu.submenus && menu.submenus.length > 0 ? (
                  menu.submenus.map((submenu, submenuIndex) => (
                    <CommandItem
                      key={submenuIndex}
                      value={submenu.label}
                      onSelect={() => runCommand(() => window.location.href = submenu.href)}
                      className="cursor-pointer pl-6"
                    >
                      <div className='flex h-4 w-4 items-center justify-center'>
                        <IconArrowRightDashed />
                      </div>
                      {submenu.label}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem
                    key={menuIndex}
                    value={menu.label}
                    onSelect={() => runCommand(() => window.location.href = menu.href)}
                    className="cursor-pointer"
                  >
                    <div className='flex h-4 w-4 items-center justify-center'>
                      <IconArrowRightDashed />
                    </div>
                    {menu.label}
                  </CommandItem>
                )
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup heading='Theme'>
            <CommandItem 
              onSelect={() => runCommand(() => setTheme('light'))}
              className="cursor-pointer"
            >
              <IconSun /> <span>Light</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme('dark'))}
              className="cursor-pointer"
            >
              <IconMoon className='scale-90' />
              <span>Dark</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => setTheme('system'))}
              className="cursor-pointer"
            >
              <IconDeviceLaptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
