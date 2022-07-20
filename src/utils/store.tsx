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
  source?: string;
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

export type TargetBodyInfo = {
  "id": number;
  "name": string;
  "radius": number;
  "mu": number;
  "period": number;
  "pole_vec_x": number;
  "pole_vec_y": number;
  "pole_vec_z": number;
}

export type Trajectory = {
  id: number;
  body_id: number;
  architecture_id: number;
  t_launch: number;
  t_arr: number;
  v_inf_arr_x: number;
  v_inf_arr_y: number;
  v_inf_arr_z: number;
  c3: number;
  dv_total: number;
  pos_earth_arr_x: number;
  pos_earth_arr_y: number;
  pos_earth_arr_z: number;
  pos_sc_arr_x: number;
  pos_sc_arr_y: number;
  pos_sc_arr_z: number;
  pos_target_arr_x: number;
  pos_target_arr_y: number;
  pos_target_arr_z: number;
  target_body?: TargetBodyInfo;
}

export type Entry = {
  id: number;
}

const TARGET_BODIES = Object.keys(constants.TARGET_BODIES);
export type TargetBodyName = typeof TARGET_BODIES[number];

export type TargetBody = {
  icon?: string;
  map?: string;
  value: string | number;
}

export type TargetBodies = Record<TargetBodyName, TargetBody>;

export type Coordinate = {
  lat: number;
  lng: number;
  size?: number;
  color?: string;
}

export type SchemaField = {
  computable: string;
  datatype_range: string;
  description: string;
  example_value: string;
  field_name: string;
  filtering: string;
  foreign_key: string;
  indexed: boolean;
  key: string;
  nullable: boolean;
  primary_key: boolean;
  short_name: string;
  sql_datatype: string;
  units: string;
  schemaName?: string;
}

export type Store = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  editingTab: number | null;
  setEditingTab: (editingTab: number | null) => void;
  tabs: VizTab[];
  setTabs: (tabs: VizTab[]) => void;
  setTab: (tab: VizTab) => void;
  configPathHistory: string[];
  setConfigPathHistory: (paths: string[]) => void;
  filterList: FilterItem[];
  targetBodies: TargetBodies;
  targetBody: TargetBodyName;
  setTargetBody: (targetBody: TargetBodyName) => void;
  setFilterList: (filterList: FilterItem[]) => void;
  setFilter: (filter: FilterItem) => void;
  trajectoryFilters: FilterField[];
  entryFilters: FilterField[];
  fetchFilterFields: () => void;
  trajectoryFields: string[];
  entryFields: string[];
  fetchFields: () => void;
  trajectories: Trajectory[];
  setTrajectories: (trajectories: Trajectory[]) => void;
  entries: Entry[];
  fetchEntries: () => void;
  selectedTrajectory: Trajectory | null;
  setSelectedTrajectory: (trajectory: Trajectory | null, refetch?: boolean) => void;
  confirmedSelectedTrajectory: boolean;
  setConfirmedSelectedTrajectory: (confirmedSelectedTrajectory: boolean) => void;
  searchTrajectories: () => void;
  fetchSelectedTrajectory: () => void;
  arcs: Coordinate[];
  fetchArcs: () => void;
  schemas: Record<string, SchemaField>;
  fetchSchemas: () => void;
};

const useStore = create<Store>(
  persist(
    {
      key: "vipre-app",
      allowlist: ["activeTab", "tabs", "filterList", "configPathHistory"],
    },
    (set, get): Store => ({
      activeTab: 0,
      setActiveTab: (activeTab: number) => set(() => ({ activeTab })),
      editingTab: null,
      setEditingTab: (editingTab) => set(() => ({ editingTab })),
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
      configPathHistory: [],
      setConfigPathHistory: (configPathHistory) => set({ configPathHistory }),
      filterList: constants.FILTERS.map((filter, i) => ({ ...filter, id: i })),
      setFilterList: (filterList: FilterItem[]) => set({ filterList }),
      targetBodies: constants.TARGET_BODIES,
      targetBody: constants.DEFAULT_TARGET_BODY as TargetBodyName,
      setTargetBody: (targetBody) => set({ targetBody }),
      setFilter: (filter: FilterItem) => {
        let filterList = get().filterList;
        let filterIndex = filterList.findIndex((existingFilter) => existingFilter.label === filter.label);
        if (filterIndex === -1) {
          set({ filterList: [...filterList, filter] });
        } else {
          set({ filterList: [...filterList.slice(0, filterIndex), filter, ...filterList.slice(filterIndex + 1)] });
        }
      },
      trajectoryFilters: [],
      entryFilters: [],
      fetchFilterFields: () => {
        axios.get(`${constants.API}/filters`).then((response) => {
          set({
            trajectoryFilters: response.data.TrajectoryFilters,
            entryFilters: response.data.EntryFilters,
          });
        }).catch(() => {
          setTimeout(() => {
            axios.get(`${constants.API}/filters`).then((res) => {
              set({
                trajectoryFilters: res.data.TrajectoryFilters,
                entryFilters: res.data.EntryFilters,
              });
              get().searchTrajectories();
            }).catch(() => {
              set({
                trajectoryFilters: [],
                entryFilters: [],
              })
            })
          }, 5000)
        });
      },
      trajectoryFields: [],
      entryFields: [],
      fetchFields: () => {
        axios.get(`${constants.API}/fields`).then((response) => {
          set({
            trajectoryFields: response.data.TrajectoryFields,
            entryFields: response.data.EntryFields,
          });
        }).catch(() => {
          setTimeout(() => {
            axios.get(`${constants.API}/fields`).then((res) => {
              set({
                trajectoryFields: res.data.TrajectoryFields,
                entryFields: res.data.EntryFields,
              });
              get().searchTrajectories();
            }).catch(() => {
              set({
                trajectoryFields: [],
                entryFields: [],
              })
            })
          }, 5000)
        });
      },
      selectedTrajectory: null,
      setSelectedTrajectory: (selectedTrajectory, refetch = false) => {
        set({ selectedTrajectory, entries: [] })
        if (refetch) {
          get().fetchSelectedTrajectory();
        }
      },
      confirmedSelectedTrajectory: false,
      setConfirmedSelectedTrajectory: (confirmedSelectedTrajectory) => set({ confirmedSelectedTrajectory }),
      trajectories: [],
      setTrajectories: (trajectories) => set({ trajectories }),
      searchTrajectories: () => {
        const filterList = get().filterList;
        let query = {
          filters: filterList
            .filter(
              (filterItem) =>
                (!Array.isArray(filterItem.value) && filterItem.value !== undefined) ||
                (Array.isArray(filterItem.value) && filterItem.value.length > 0 && filterItem.dataField.includes("trajectory."))
            )
            .map((filter) => {
              if (Array.isArray(filter.value)) {
                const [lower, upper] = filter.value;
                return { field_name: filter.dataField.replace(/^trajectory./, ""), category: "slider", lower, upper };
              } else {
                return { field_name: filter.dataField.replace(/^trajectory./, ""), category: "value", value: filter.value };
              }
            }),
          fields: filterList.map((filter) => filter.dataField),
        };

        let targetID = get().targetBodies[get().targetBody].value;

        axios
          .post(`${constants.API}/visualizations/trajectory_selection/${targetID}`, query)
          .then((response) => {
            let filteredData = response.data.filter((trajectory: any) => {
              let isInRange = true;
              filterList.forEach((filterItem) => {
                if (filterItem.dataField.includes("trajectory.")) {
                  let dataField = filterItem.dataField.replace(/^trajectory./, "");
                  if (Array.isArray(filterItem.value)) {
                    const [lower, upper] = filterItem.value;
                    isInRange = isInRange && lower <= trajectory[dataField] && trajectory[dataField] <= upper;
                  } else {
                    isInRange = isInRange && trajectory[dataField] === filterItem.value;
                  }
                }
              })

              return isInRange;
            })
            set({ trajectories: filteredData })
          })
          .catch((err) => {
            console.error(err, query);
          });
      },
      fetchSelectedTrajectory: () => {
        let selectedTrajectory = get().selectedTrajectory;
        if (!selectedTrajectory || !selectedTrajectory.id) {
          return;
        }

        axios
          .get(`${constants.API}/trajectories/${selectedTrajectory.id}`)
          .then((response) => {
            console.log(response)
            set({ selectedTrajectory: response.data })
          })
          .catch((err) => {
            console.error(err);
          });
      },
      entries: [],
      fetchEntries: () => {
        let selectedTrajectory = get().selectedTrajectory;
        if (selectedTrajectory === null || !selectedTrajectory.id) {
          return;
        }

        axios
          .get(`${constants.API}/trajectories/${selectedTrajectory.id}/entries`)
          .then((response) => {
            const filterList = get().filterList;
            let filteredData = response.data.filter((trajectory: any) => {
              let isInRange = true;
              filterList.forEach((filterItem) => {
                if (filterItem.dataField.includes("entry.")) {
                  let dataField = filterItem.dataField.replace(/^entry./, "");
                  if (Array.isArray(filterItem.value)) {
                    const [lower, upper] = filterItem.value;
                    isInRange = isInRange && lower <= trajectory[dataField] && trajectory[dataField] <= upper;
                  } else {
                    isInRange = isInRange && trajectory[dataField] === filterItem.value;
                  }
                }
              })

              return isInRange;
            })

            console.log(response.data, filteredData)
            set({ entries: filteredData })
            // Fetch arcs on successful fetch of entries
            get().fetchArcs();
          })
          .catch((err) => {
            console.error(err);
          });
      },
      arcs: [],
      fetchArcs: () => {
        // let selectedTrajectory = get().selectedTrajectory;
        // console.log(selectedTrajectory)

        // const entries = get().entries;

        // const gData = entries.map(() => ({
        //   startLat: (Math.random() - 0.5) * 180,
        //   startLng: (Math.random() - 0.5) * 360,
        //   endLat: (Math.random() - 0.5) * 180,
        //   endLng: (Math.random() - 0.5) * 360,
        //   label: `Arc Label`,
        //   color: [['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]]
        // }));
        // // @ts-ignore
        // const gData = entries.map(() => ({
        //   lat: (Math.random() - 0.5) * 180,
        //   lng: (Math.random() - 0.5) * 360,
        //   size: 0.3,
        //   color: "white"
        // }));

        set({ arcs: [] });

        return;

        // axios
        //   .get(`${constants.API}/visualizations/${(selectedTrajectory || {}).id}/arcs`)
        //   .then((response) => {
        //     set({ arcs: response.data })
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //   });
      },
      schemas: {},
      fetchSchemas: () => {
        let schemas: Record<string, SchemaField> = {};
        constants.SCHEMA_NAMES.forEach((schemaName) => {
          let schema = require(`../../vipre-schemas/models/vipre_schema-${schemaName}.json`);
          if (schema && schema.fields) {
            schema.fields.forEach((field: SchemaField) => {
              schemas[`${schemaName}.${field["field_name"]}`] = {
                ...field,
                schemaName
              }
            })
          }
        })

        set({ schemas })
      }
    })
  )
);

export default useStore;
