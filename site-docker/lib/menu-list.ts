import {
  Tag,
  Bot,
  SquareChevronRight,
  List,
  LayoutGrid,
  BadgePlus,
  Database,
  ReceiptText,
  FilePlus,
  BookUser,
  Github,
  Sparkles,
  BookOpen,
  Book
} from "lucide-react";

export function getMenuList() {
  return [
    // {
    //   groupLabel: "",
    //   menus: [
    //     {
    //       href: "/dashboard",
    //       label: "Dashboard",
    //       icon: LayoutGrid,
    //       submenus: []
    //     }
    //   ]
    // },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/prompt",
          label: "Prompt",
          icon: SquareChevronRight,
          submenus: []
        },
        {
          href: "/#",
          label: "How to Use",
          icon: Book,
          submenus: []
        },
        // {
        //   href: "/data-sources",
        //   label: "Data Sources",
        //   icon: Database,
        //   submenus: [
        //     {
        //       href: "/data-sources/all",
        //       label: "All",
        //       icon: ReceiptText,
        //     },
        //     {
        //       href: "/data-sources/new",
        //       label: "New",
        //       icon: FilePlus,
        //     }
        //   ]
        // },
        // {
        //   href: "/tags",
        //   label: "Tags",
        //   icon: Tag,
        //   submenus: [
        //     {
        //       href: "/tags/all",
        //       label: "All Tags"
        //     },
        //     {
        //       href: "/tags/new",
        //       label: "New Tag"
        //     }
        //   ]
        // }
      ]
    },
    {
      groupLabel: "Tools",
      menus: [
        {
          href: "https://ebara-genaiplatform.com",
          label: "AI Chat",
          icon: Bot
        },
        {
          href: "https://copilot.cloud.microsoft",
          label: "Copilot",
          icon: Github
        },
        {
          href: "https://gemini.google.com",
          label: "Gemini",
          icon: Sparkles
        },
        {
          href: "https://notebooklm.google.com",
          label: "NotebookLM",
          icon: BookOpen
        }
      ]
    },
  ];
}
