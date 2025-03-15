import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { produce } from "immer";

interface SidebarSettings {
  disabled: boolean;
  isHoverOpen: boolean;
}

interface SidebarState {
  isOpen: boolean;
  isHover: boolean;
  settings: SidebarSettings;
  toggleOpen: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsHover: (isHover: boolean) => void;
  getOpenState: () => boolean;
  setSettings: (settings: Partial<SidebarSettings>) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isHover: false,
      settings: { disabled: false, isHoverOpen: true },
      toggleOpen: () => {
        set({ isOpen: !get().isOpen });
      },
      setIsOpen: (isOpen) => {
        set({ isOpen });
      },
      setIsHover: (isHover) => {
        set({ isHover });
      },
      getOpenState: () => {
        const state = get();
        return state.isOpen || (state.settings.isHoverOpen && state.isHover);
      },
      setSettings: (settings) => {
        set(
          produce((state: SidebarState) => {
            state.settings = { ...state.settings, ...settings };
          })
        );
      }
    }),
    {
      name: "sidebar",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
