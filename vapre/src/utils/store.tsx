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

export type Store = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  tabs: VizTab[];
  setTabs: (tabs: VizTab[]) => void;
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
    setTabs: (tabs: VizTab[]) => set(() => ({ tabs })),
  })
);

export default useStore;
