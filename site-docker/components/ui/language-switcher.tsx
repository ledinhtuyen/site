"use client";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent, // For SubMenu
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react";
import { VN, GB, JP, CN } from 'country-flag-icons/react/3x2'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';

export function LanguageSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const handleLocaleChange = (locale) => {
        Cookies.set('NEXT_LOCALE', locale, { expires: 365 });
        const newPath = pathname.replace(/^\/(en|jp|vi|cn)/, `/${locale}`);
        router.push(newPath);
    };

    return (
        <TooltipProvider>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full w-8 h-8 bg-background cursor-pointer"
                                asChild
                            >
                                <div>
                                    <Languages />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        Change Language
                    </TooltipContent>
                </Tooltip>
                <DropdownMenuContent className="w-40">
                    <DropdownMenuLabel>Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => handleLocaleChange('en')}
                                >
                                    <GB />
                                    <span>English</span>
                                </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                English
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => handleLocaleChange('ja')}
                                >
                                    <JP />
                                    <span>Japanese</span>
                                </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                Japanese
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => handleLocaleChange('vi')}
                                >
                                    <VN />
                                    <span>Vietnamese</span>
                                </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                Vietnamese
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => handleLocaleChange('cn')}
                                >
                                    <CN />
                                    <span>Chinese</span>
                                </DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent>
                                Chinese
                            </TooltipContent>
                        </Tooltip>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    )
}
