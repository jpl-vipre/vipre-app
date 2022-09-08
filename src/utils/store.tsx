import create from "zustand";
import { configurePersist } from "zustand-persist";

import axios from "axios";

import * as math from "mathjs";

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
  v_inf_arr_mag: number;
  c3: number;
  dv_total: number;
  interplanetary_dv: number;
  pos_earth_arr_x: number;
  pos_earth_arr_y: number;
  pos_earth_arr_z: number;
  pos_earth_arr_mag: number;
  pos_earth_arr_lat: number;
  pos_earth_arr_lon: number;
  pos_sun_arr_lat: number;
  pos_sun_arr_lon: number;
  pos_sc_arr_x: number;
  pos_sc_arr_y: number;
  pos_sc_arr_z: number;
  pos_target_arr_x: number;
  pos_target_arr_y: number;
  pos_target_arr_z: number;
  pos_target_arr_mag: number;
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
  pos_entry_lat: number;
  pos_entry_lon: number;
  flight_path_angle: number;
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
  pointType: string;
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

export type DatabaseMetadata = {
  database: string;
  tables: string[];
  schema_version: string;
}

export type DataRate = {
  id: number;
  entry_id: number;
  order: number;
  time: number;
  rate: number
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
  filtersInitialized: boolean;
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
  requestedEntryPointCount: number;
  setRequestedEntryPointCount: (requestedEntryPointCount: number) => void;
  apiVersion: string | null;
  databaseMetadata: DatabaseMetadata;
  loadingAPI: boolean;
  fetchAPIVersion: (retryCounter?: number, callback?: () => void) => void;
  resetData: () => void;
  activeDatabase: string;
  setActiveDatabase: (activeDatabase: string) => void;
  databaseHistory: string[];
  setDatabaseHistory: (databaseHistory: string[]) => void;
  dataRates: DataRate[];
  fetchDataRates: (entryID: number) => void;
};

const useStore = create<Store>(
  persist(
    {
      key: "vipre-app",
      allowlist: ["activeTab", "tabs", "filterList", "configPathHistory", "launchVehicleName", "requestedEntryPointCount", "activeDatabase", "databaseHistory", "relayVolumeScale"],
    },
    (set, get): Store => ({
      activeTab: 0,
      setActiveTab: (activeTab: number) => set(() => ({ activeTab })),
      editingTab: null,
      setEditingTab: (editingTab) => set(() => ({ editingTab })),
      tabs: [],
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
      relayVolumeScale: 6e10,
      setRelayVolumeScale: (relayVolumeScale) => set({ relayVolumeScale }),
      configPathHistory: [],
      setConfigPathHistory: (configPathHistory) => set({ configPathHistory }),
      filterList: [],
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
      setTargetBody: (targetBody) => set({ targetBody, trajectories: [], entries: [], arcs: [], selectedTrajectory: null, selectedEntries: [], confirmedSelectedTrajectory: false, dataRates: [] }),
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
      filtersInitialized: false,
      fetchFilterFields: () => {
        axios.get(`${constants.API}/filters`).then((response) => {
          set({
            trajectoryFilters: response.data.TrajectoryFilters,
            entryFilters: response.data.EntryFilters,
            filtersInitialized: true
          });
        }).catch(() => {
          setTimeout(() => {
            axios.get(`${constants.API}/filters`).then((res) => {
              set({
                trajectoryFilters: res.data.TrajectoryFilters,
                entryFilters: res.data.EntryFilters,
                filtersInitialized: true
              });
              get().searchTrajectories();
            }).catch(() => {
              set({
                trajectoryFilters: [],
                entryFilters: [],
                filtersInitialized: false,
              });
            })
          }, 5000);
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
        set({ selectedTrajectory, entries: [], selectedEntries: [], dataRates: [], arcs: [] })
        if (refetch) {
          get().fetchSelectedTrajectory();
        }
      },
      confirmedSelectedTrajectory: false,
      setConfirmedSelectedTrajectory: (confirmedSelectedTrajectory) => set({ confirmedSelectedTrajectory, selectedEntries: [], arcs: [], dataRates: [] }),
      trajectories: [],
      setTrajectories: (trajectories) => set({ trajectories }),
      searchTrajectories: () => {
        if (!get().filtersInitialized) {
          return;
        }

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
          "limit": 1000
        };

        let targetID = get().targetBodies[get().targetBody].value;

        axios
          .post(`${constants.API}/visualizations/trajectory_selection/${targetID}`, query)
          .then((response) => {

            const selectedTrajectory = get().selectedTrajectory;
            let isSelectedTrajectoryVisible = false;

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
              });


              if (selectedTrajectory && selectedTrajectory.id === trajectory.id && isInRange) {
                isSelectedTrajectoryVisible = true;
              }

              return isInRange;
            }).map((trajectory: Trajectory) => {
              trajectory["t_arr"] = trajectory["t_arr"] ? trajectory["t_arr"] / 60 / 60 / 24 / 365.25 : trajectory["t_arr"];
              trajectory["t_launch"] = trajectory["t_launch"] ? trajectory["t_launch"] / 60 / 60 / 24 / 365.25 : trajectory["t_launch"];

              return trajectory;
            })
            if (!isSelectedTrajectoryVisible) {
              set({ trajectories: filteredData, selectedTrajectory: null, confirmedSelectedTrajectory: false, entries: [], selectedEntries: [], dataRates: [], arcs: [] });
            } else {
              set({ trajectories: filteredData });
            }

            get().fetchEntries();
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
          set({ entries: [] });
          return;
        }

        axios
          .get(`${constants.API}/trajectories/${selectedTrajectory.id}/entries?limit=${get().requestedEntryPointCount}&offset=0`)
          .then((response) => {
            const filterList = get().filterList;
            const relayVolumeScale = get().relayVolumeScale;

            const selectedEntries = get().selectedEntries;
            const filteredSelectedEntries: Entry[] = [];

            let filteredData = response.data.filter((entry: any) => {
              let isInRange = true;
              filterList.forEach((filterItem) => {
                if (filterItem.dataField.includes("entry.")) {
                  let dataField = filterItem.dataField.replace(/^entry./, "");
                  if (Array.isArray(filterItem.value)) {
                    const [lower, upper] = filterItem.value;
                    isInRange = isInRange && lower <= entry[dataField] && entry[dataField] <= upper;
                  } else {
                    isInRange = isInRange && entry[dataField] === filterItem.value;
                  }
                }
              })

              return isInRange;
            }).map((entry: any) => {
              entry["relay_volume"] = entry["relay_volume"] ? entry["relay_volume"] * relayVolumeScale : 0;
              entry["t_entry"] = entry["t_entry"] ? entry["t_entry"] / 60 / 60 / 24 / 365.25 : entry["t_entry"];
              entry["safe"] = entry["safe"] ? 1 : 0;

              selectedEntries.forEach(selectedEntry => {
                if (selectedEntry.id === entry.id) {
                  filteredSelectedEntries.push(selectedEntry);
                }
              });

              return entry;
            });

            set({ entries: filteredData, selectedEntries: filteredSelectedEntries })
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
        if (selectedEntries.length >= 1) {
          get().fetchDataRates(selectedEntries[selectedEntries.length - 1].id);
        } else {
          set({ dataRates: [] });
        }
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
                "probe_ta_step": 50,
                "carrier_ta_step": 100
              })
              .then((response) => {

                let pointData: Coordinate[] = [];
                Object.entries(response.data).forEach(([pointType, data]: [string, any]) => {
                  data.forEach((point: any) => {
                    // @ts-ignore
                    let altitude = (point.height / selectedEntry.target_body.radius) - 1;

                    pointData.push({
                      ...point,
                      entryID: selectedEntry.id,
                      pointType,
                      altitude,
                      color: constants.TRAJECTORY_COLORS[i % constants.TRAJECTORY_COLORS.length],
                      label: `<div class="globe-tooltip">
                      <div>
                        <span>Entry ID: </span><b>${selectedEntry.id}</b>
                      </div>
                      <div>
                        <span>Type: </span><b>${pointType}</b>
                      </div>
                      <div>
                        <span>Radius: </span><b>${math.round(point.height, 3)} km</b>
                      </div>
                    </div>`
                    });
                  });
                });
                set({ arcs: [...arcs, ...pointData] });
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
        constants.SCHEMA_NAMES.forEach((schemaName: string) => {
          let schema = require(`../../vipre-schemas/models/vipre_schema-${schemaName}.json`);
          if (schema && schema.fields) {
            schema.fields.forEach((field: SchemaField) => {
              if (["t_arr", "t_entry", "t_launch"].includes(field["field_name"])) {
                field["units"] = "years past 2000";
              }
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
      launchVehicleName: "Falcon Heavy Recoverable",
      setLaunchVehicle: (launchVehicleName) => {
        // @ts-ignore
        if (constants.LAUNCH_VEHICLES[launchVehicleName]) {
          set({ launchVehicleName: launchVehicleName })
        }
      },
      requestedEntryPointCount: 10000,
      setRequestedEntryPointCount: (requestedEntryPointCount) => set({ requestedEntryPointCount }),
      apiVersion: null,
      databaseMetadata: { database: "", tables: [], schema_version: "" },
      loadingAPI: false,
      fetchAPIVersion: (retryCounter = 3, callback = () => { }) => {
        set({ loadingAPI: true });
        axios.get(`${constants.API}/version`).then((response) => {
          set({ apiVersion: response.data });
          axios.get(`${constants.API}/database`).then((response) => {
            set({ databaseMetadata: response.data });
          }).catch(err => {
            set({ databaseMetadata: { database: "", tables: [], schema_version: "" } });
            console.error(`Error loading database info: ${err}`);
          })
          setTimeout(() => {
            set({ loadingAPI: false });
          }, 500);
          callback();
        }).catch(err => {
          if (retryCounter <= 0) {
            console.error(`Error fetching version: ${err}`);
            set({ apiVersion: null, loadingAPI: false, databaseMetadata: { database: "", tables: [], schema_version: "" } });
          } else {
            setTimeout(() => {
              get().fetchAPIVersion(retryCounter - 1);
            }, 1000);
          }
        });
      },
      resetData: () => {
        set({ trajectories: [], selectedTrajectory: null, confirmedSelectedTrajectory: false, entries: [], selectedEntries: [], arcs: [], dataRates: [] });
      },
      activeDatabase: "",
      setActiveDatabase: (activeDatabase) => set({ activeDatabase }),
      databaseHistory: [],
      setDatabaseHistory: (databaseHistory) => set({ databaseHistory }),
      dataRates: [],
      fetchDataRates: (entryID) => {
        if (entryID === null) {
          return;
        }

        axios.get(`${constants.API}/entries/${entryID}/datarates`).then((response) => {
          let relayVolumeScale = get().relayVolumeScale || 1;
          let scaledDataRates = response.data.map((dataRate: DataRate) => {
            return {
              data_rate: dataRate.rate * relayVolumeScale,
              time: dataRate.time,
              id: dataRate.id,
              entry_id: dataRate.entry_id,
              order: dataRate.order,
              scale: relayVolumeScale
            };
          })
          set({ dataRates: scaledDataRates });
        }).catch((err) => {
          console.error(`Error fetching data rates for Entry ${entryID}: ${err}`);
          set({ dataRates: [] });
        })
      }
    })
  )
);

export default useStore;
