import {
  Tag,
  Bot,
  Eye,
  SquareChevronRight,
  List,
  LayoutGrid,
  Speech,
  BadgePlus,
  Database,
  ReceiptText,
  FilePlus,
  BookUser
} from "lucide-react";

export function getMenuList(pathname : string) {
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
          href: "https://extractor.ebara-genaiplatform.com",
          label: "Extractor",
          icon: Eye
        },
        {
          href: "https://editor.ebara-genaiplatform.com",
          label: "Speech to Text",
          icon: Speech
        }
      ]
    },
  ];
}
