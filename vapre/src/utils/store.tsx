import create from "zustand";

export type GraphConfig = {
  type: string;
  xAxis: string;
  yAxis: string;
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
    tabs: [
      {
        id: 0,
        label: "Dashboard",
        topRow: [],
        bottomRow: [],
      },
    ],
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
    filterList: [
      {
        label: "Entry Altitude",
        type: "select",
        options: [700, 750, 800],
        defaultValue: 700,
        units: "km",
      },
      {
        label: "Entry Latitude",
        type: "select",
        options: [60, 70, 80],
        defaultValue: 60,
        units: "deg",
      },
      {
        label: "Flyby Architecture",
        type: "multi-select",
        options: ["A", "B", "C"],
      },
      {
        label: "Launch Date Range",
        type: "date-range",
        defaultValue: [new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1))],
      },
      {
        label: "Flight Path Angle",
        type: "slider-range",
        min: 0,
        max: 360,
        step: 1,
        defaultValue: [0, 360],
        units: "deg",
      },
      {
        label: "Entry Speed",
        type: "slider-range",
        min: 0,
        max: 10000,
        step: 1,
        defaultValue: [0, 10000],
        units: "km/s",
      },
      {
        label: "Time visible from Earth",
        type: "slider-range",
        min: 0,
        max: 10000,
        step: 1,
        defaultValue: [0, 10000],
        units: "mins",
      },
    ],
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
