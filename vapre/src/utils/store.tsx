import create from "zustand";
import { configurePersist } from "zustand-persist";

import axios from "axios";

import constants from "./constants";

const { persist } = configurePersist({
  storage: localStorage,
  rootKey: "vipre-app",
});

export type GraphConfig = {
  type: string;
  xAxis: string;
  xUnits?: string;
  yAxis: string;
  yUnits?: string;
  color?: string;
  colorUnits?: string;
};

export type VizTab = {
  id: number;
  label: string;
  topRow: GraphConfig[];
  bottomRow: GraphConfig[];
};

export type FilterItem = {
  id: number;
  label: string;
  dataField: string;
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

export type FilterField = {
  display_name: string;
  field_name: string;
  category: string;
  units?: string;
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
  trajectoryFields: FilterField[];
  entryFields: FilterField[];
  fetchFilterFields: () => void;
  searchTrajectories: () => void;
};

const useStore = create<Store>(
  persist(
    {
      key: "vipre-app",
      allowlist: ["activeTab", "tabs"],
    },
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
      filterList: constants.FILTERS.map((filter, i) => ({ ...filter, id: i })),
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
      trajectoryFields: [],
      entryFields: [],
      fetchFilterFields: () => {
        axios.get(`${constants.API}/filters`).then((response) => {
          set({
            trajectoryFields: response.data.TrajectoryFilters,
            entryFields: response.data.EntryFilters,
          });
        });
      },
      searchTrajectories: () => {
        const filterList = get().filterList;
        let query = {
          filters: filterList
            .filter(
              (filterItem) =>
                (!Array.isArray(filterItem.value) && filterItem.value !== undefined) ||
                (Array.isArray(filterItem.value) && filterItem.value.length > 0)
            )
            .map((filter) => {
              if (Array.isArray(filter.value)) {
                const [lower, upper] = filter.value;
                return { field_name: filter.dataField, category: "slider", lower, upper };
              } else {
                return { field_name: filter.dataField, category: "value", value: filter.value };
              }
            }),
          fields: filterList.map((filter) => filter.dataField),
        };

        axios
          .post(`${constants.API}/trajectories`, query)
          .then((response) => {
            console.log(response, query);
          })
          .catch((err) => {
            console.error(err, query);
          });
      },
    })
  )
);

export default useStore;
