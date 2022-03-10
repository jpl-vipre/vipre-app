import create from "zustand";
import constants from "./constants";

export type GraphConfig = {
  type: string;
  xAxis: string;
  yAxis: string;
  color?: string;
};

export type VizTab = {
  id: number;
  label: string;
  topRow: GraphConfig[];
  bottomRow: GraphConfig[];
};

export type FilterItem = {
  label: string;
  type: string;
  options?: any[];
  value?: any;
  defaultValue?: any;
  units?: string;
  step?: number;
  min?: number;
  max?: number;
  hidden?: boolean;
};

export type Store = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  tabs: VizTab[];
  setTabs: (tabs: VizTab[]) => void;
  setTab: (tab: VizTab) => void;
  filterList: FilterItem[];
  setFilterList: (filterList: FilterItem[]) => void;
  setFilter: (filter: FilterItem) => void;
};

const useStore = create<Store>(
  (set, get): Store => ({
    activeTab: 0,
    setActiveTab: (activeTab: number) => set(() => ({ activeTab })),
    tabs: constants.DEFAULT_TABS,
    setTabs: (tabs: VizTab[]) => set({ tabs }),
    setTab: (tab: VizTab) => {
      let tabs = get().tabs;
      let tabIndex = tabs.findIndex((existingTab) => existingTab.id === tab.id);
      if (tabIndex === -1) {
        set({ tabs: [...tabs, tab] });
      } else {
        set({ tabs: [...tabs.slice(0, tabIndex), tab, ...tabs.slice(tabIndex + 1)] });
      }
    },
    filterList: constants.FILTERS,
    setFilterList: (filterList: FilterItem[]) => set({ filterList }),
    setFilter: (filter: FilterItem) => {
      let filterList = get().filterList;
      let filterIndex = filterList.findIndex((existingFilter) => existingFilter.label === filter.label);
      if (filterIndex === -1) {
        set({ filterList: [...filterList, filter] });
      } else {
        set({ filterList: [...filterList.slice(0, filterIndex), filter, ...filterList.slice(filterIndex + 1)] });
      }
    },
  })
);

export default useStore;
