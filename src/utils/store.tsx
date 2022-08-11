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
  globeType?: string;
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

export type PosEntryLatLonHeight = {
  latitude: number;
  longitude: number;
  height: number;
}

export type Entry = {
  id: number;
  target_body: TargetBodyInfo;
  bvec_theta: number;
  bvec_mag: number;
  safe: boolean;
  t_entry: number;
  relay_volume: number;
  pos_entry_x: number;
  pos_entry_y: number;
  pos_entry_z: number;
  pos_entry_mag: number;
  vel_entry_x: number;
  vel_entry_y: number;
  vel_entry_z: number;
  vel_entry_mag: number;
  pos_entry_lat_long_h: PosEntryLatLonHeight;
}

const TARGET_BODIES = Object.keys(constants.TARGET_BODIES);
export type TargetBodyName = typeof TARGET_BODIES[number];

export type TargetBody = {
  id?: number;
  name?: string;
  radius?: number;
  ringInnerRadius?: number;
  ringOuterRadius?: number;
  mu?: number;
  period?: number;
  pole_vec_x?: number;
  pole_vec_y?: number;
  pole_vec_z?: number;
  icon?: string;
  map?: string;
  ringTexture?: string;
  value: string | number;
}

export type TargetBodies = Record<TargetBodyName, TargetBody>;

export type Coordinate = {
  entryID: number;
  latitude: number;
  longitude: number;
  height?: number;
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

export type LaunchVehicle = {
  name: string;
  polynomial: (c3: number) => number;
}

export type Store = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  editingTab: number | null;
  setEditingTab: (editingTab: number | null) => void;
  tabs: VizTab[];
  setTabs: (tabs: VizTab[]) => void;
  setTab: (tab: VizTab) => void;
  relayVolumeScale: number;
  setRelayVolumeScale: (relayVolumeScale: number) => void;
  configPathHistory: string[];
  setConfigPathHistory: (paths: string[]) => void;
  filterList: FilterItem[];
  targetBodies: TargetBodies;
  fetchBodies: () => void;
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
  selectedEntries: Entry[];
  setSelectedEntries: (selectedEntries: Entry[]) => void;
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
  getLaunchVehicle: () => LaunchVehicle;
  launchVehicleName: string;
  setLaunchVehicle: (launchVehicleName: string) => void;
};

const useStore = create<Store>(
  persist(
    {
      key: "vipre-app",
      allowlist: ["activeTab", "tabs", "filterList", "configPathHistory", "launchVehicleName"],
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
      relayVolumeScale: 1,
      setRelayVolumeScale: (relayVolumeScale) => set({ relayVolumeScale }),
      configPathHistory: [],
      setConfigPathHistory: (configPathHistory) => set({ configPathHistory }),
      filterList: constants.FILTERS.map((filter, i) => ({ ...filter, id: i })),
      setFilterList: (filterList: FilterItem[]) => set({ filterList }),
      targetBodies: constants.TARGET_BODIES,
      fetchBodies: () => {
        let targetBodies = get().targetBodies;
        axios.get(`${constants.API}/bodies`).then((response) => {
          response.data.forEach((body: TargetBody) => {
            // @ts-ignore
            let existingBody: TargetBody = constants.TARGET_BODIES[body.name] as any || {};
            // @ts-ignore
            targetBodies[body.name] = { ...existingBody, ...body };
          })

          set({ targetBodies });
        }).catch((err) => {
          console.error(err)
        })
      },
      targetBody: constants.DEFAULT_TARGET_BODY as TargetBodyName,
      setTargetBody: (targetBody) => set({ targetBody, trajectories: [], entries: [], arcs: [], selectedTrajectory: null }),
      setFilter: (filter: FilterItem) => {
        let filterList = get().filterList;
        let filterIndex = filterList.findIndex((existingFilter) => existingFilter.id === filter.id);
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
      setConfirmedSelectedTrajectory: (confirmedSelectedTrajectory) => set({ confirmedSelectedTrajectory, selectedEntries: [], arcs: [] }),
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

        // 
        axios
          .get(`${constants.API}/trajectories/${selectedTrajectory.id}/entries`)
          .then((response) => {
            const filterList = get().filterList;
            const relayVolumeScale = get().relayVolumeScale;
            let filteredData = response.data.filter((trajectory: any) => {
              trajectory["relay_volume"] = trajectory["relay_volume"] ? trajectory["relay_volume"] * relayVolumeScale : 0;
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

            set({ entries: filteredData })
            // Fetch arcs on successful fetch of entries
            get().fetchArcs();
          })
          .catch((err) => {
            console.error(err);
          });
      },
      selectedEntries: [],
      setSelectedEntries: (selectedEntries) => {
        set({ selectedEntries });
        get().fetchArcs();
      },
      arcs: [],
      fetchArcs: () => {
        let selectedEntries = get().selectedEntries;

        let arcs = get().arcs;
        arcs = arcs.filter((arc) => selectedEntries.findIndex((entry) => entry.id === arc.entryID) >= 0);
        set({ arcs });

        selectedEntries.forEach((selectedEntry, i) => {
          if (arcs.findIndex((arc) => arc.entryID === selectedEntry.id) < 0) {
            axios
              .post(`${constants.API}/visualizations/get_entry_arc/${selectedEntry.id}`, {
                "ta_step": 50
              })
              .then((response) => {
                let arc: Coordinate[] = response.data.map((point: any) => {
                  // @ts-ignore
                  let altitude = (point.height / selectedEntry.target_body.radius) - 1;

                  return {
                    ...point,
                    entryID: selectedEntry.id,
                    altitude,
                    color: constants.TRAJECTORY_COLORS[i % constants.TRAJECTORY_COLORS.length],
                    label: `Entry ID: ${selectedEntry.id}<br/>Lat: ${point.latitude},<br/>Lon: ${point.longitude},<br/>Alt: ${point.height}`
                  }
                });
                set({ arcs: [...arcs, ...arc] });
              })
              .catch((err) => {
                console.error(err);
              });
          }
        })
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
      },
      // @ts-ignore
      getLaunchVehicle: () => constants.LAUNCH_VEHICLES[get().launchVehicleName],
      launchVehicleName: "Falcon Heavy",
      setLaunchVehicle: (launchVehicleName) => {
        // @ts-ignore
        if (constants.LAUNCH_VEHICLES[launchVehicleName]) {
          set({ launchVehicleName: launchVehicleName })
        }
      }
    })
  )
);

export default useStore;
