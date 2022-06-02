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
}

const TARGET_BODIES = Object.keys(constants.TARGET_BODIES);
export type TargetBodyName = typeof TARGET_BODIES[number];

export type TargetBody = {
  icon?: string;
  map?: string;
  value: string | number;
}

export type TargetBodies = Record<TargetBodyName, TargetBody>;

export type Store = {
  activeTab: number;
  setActiveTab: (activeTab: number) => void;
  tabs: VizTab[];
  setTabs: (tabs: VizTab[]) => void;
  setTab: (tab: VizTab) => void;
  filterList: FilterItem[];
  targetBodies: TargetBodies;
  targetBody: TargetBodyName;
  setTargetBody: (targetBody: TargetBodyName) => void;
  setFilterList: (filterList: FilterItem[]) => void;
  setFilter: (filter: FilterItem) => void;
  trajectoryFields: FilterField[];
  entryFields: FilterField[];
  fetchFilterFields: () => void;
  trajectories: Trajectory[];
  setTrajectories: (trajectories: Trajectory[]) => void;
  selectedTrajectory: Trajectory | null;
  setSelectedTrajectory: (trajectory: Trajectory | null) => void;
  confirmedSelectedTrajectory: boolean;
  setConfirmedSelectedTrajectory: (confirmedSelectedTrajectory: boolean) => void;
  searchTrajectories: () => void;
};

const TEST_DATA = [{ 'id': 4.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1166788800.0, 'v_inf_arr_x': -6.20405387878418, 'v_inf_arr_y': 5.338814735412598, 'v_inf_arr_z': 0.14504101872444153, 'c3': 96.74520972060795, 'dv_total': 4.62993192486465, 'pos_earth_arr_x': 138848510.7518344, 'pos_earth_arr_y': 54588639.91061366, 'pos_earth_arr_z': -5585.790837645531, 'pos_sc_arr_x': 9201897.827167783, 'pos_sc_arr_y': 11261009.628468525, 'pos_sc_arr_z': 13463170.552251715, 'pos_target_arr_x': -1284198529.599371, 'pos_target_arr_y': 533637648.1582078, 'pos_target_arr_z': 41859341.50641534 }, { 'id': 5.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1169380800.0, 'v_inf_arr_x': -6.179444789886475, 'v_inf_arr_y': 5.173794269561768, 'v_inf_arr_z': 0.15334460139274597, 'c3': 95.86677804280733, 'dv_total': 4.567493623122573, 'pos_earth_arr_x': 98323405.38939509, 'pos_earth_arr_y': 110793953.3209923, 'pos_earth_arr_z': -10147.4054748714, 'pos_sc_arr_x': 9534592.563314538, 'pos_sc_arr_y': 11633711.382970732, 'pos_sc_arr_z': 13876756.04962065, 'pos_target_arr_x': -1293913496.880629, 'pos_target_arr_y': 512688403.0786129, 'pos_target_arr_z': 42609723.42745465 }, { 'id': 6.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1171972800.0, 'v_inf_arr_x': -6.132739067077637, 'v_inf_arr_y': 5.1659440994262695, 'v_inf_arr_z': 0.14896053075790405, 'c3': 95.03237991799116, 'dv_total': 4.506118055433035, 'pos_earth_arr_x': 98323405.38939509, 'pos_earth_arr_y': 110793953.3209923, 'pos_earth_arr_z': -10147.4054748714, 'pos_sc_arr_x': 9697235.060632417, 'pos_sc_arr_y': 11791265.404587528, 'pos_sc_arr_z': 14028179.05670249, 'pos_target_arr_x': -1293913496.880629, 'pos_target_arr_y': 512688403.0786129, 'pos_target_arr_z': 42609723.42745465 }, { 'id': 7.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1174564800.0, 'v_inf_arr_x': -6.1306586265563965, 'v_inf_arr_y': 5.132931232452393, 'v_inf_arr_z': 0.149794802069664, 'c3': 94.23993549749547, 'dv_total': 4.453185385093093, 'pos_earth_arr_x': 86000118.82776454, 'pos_earth_arr_y': 120355702.2595596, 'pos_earth_arr_z': -10402.2070723474, 'pos_sc_arr_x': 9763267.878526477, 'pos_sc_arr_y': 11866356.313474994, 'pos_sc_arr_z': 14112562.29458622, 'pos_target_arr_x': -1296025926.382564, 'pos_target_arr_y': 508013871.1159397, 'pos_target_arr_z': 42775075.11398038 }, { 'id': 8.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1176379200.0, 'v_inf_arr_x': -6.109244346618652, 'v_inf_arr_y': 5.007604598999023, 'v_inf_arr_z': 0.15612103044986725, 'c3': 93.85874504611343, 'dv_total': 4.399748869705945, 'pos_earth_arr_x': 36397704.02253349, 'pos_earth_arr_y': 142813631.0154346, 'pos_earth_arr_z': -12543.93136266619, 'pos_sc_arr_x': 10033956.895121973, 'pos_sc_arr_y': 12167315.15423595, 'pos_sc_arr_z': 14444321.631752, 'pos_target_arr_x': -1303282026.55548, 'pos_target_arr_y': 491600461.7249071, 'pos_target_arr_z': 43348970.93546501 }, { 'id': 9.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1179230400.0, 'v_inf_arr_x': -6.0633721351623535, 'v_inf_arr_y': 5.000737190246582, 'v_inf_arr_z': 0.15174005925655365, 'c3': 93.12555721016153, 'dv_total': 4.343437032774091, 'pos_earth_arr_x': 36397704.02253349, 'pos_earth_arr_y': 142813631.0154346, 'pos_earth_arr_z': -12543.93136266619, 'pos_sc_arr_x': 10198764.153216192, 'pos_sc_arr_y': 12326910.148765445, 'pos_sc_arr_z': 14597641.539776195, 'pos_target_arr_x': -1303282026.55548, 'pos_target_arr_y': 491600461.7249071, 'pos_target_arr_z': 43348970.93546501 }, { 'id': 10.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1181822400.0, 'v_inf_arr_x': -6.057731628417969, 'v_inf_arr_y': 4.9664764404296875, 'v_inf_arr_z': 0.15330860018730164, 'c3': 92.42985321705991, 'dv_total': 4.2843988633248955, 'pos_earth_arr_x': 21003407.92383968, 'pos_earth_arr_y': 145763527.7645663, 'pos_earth_arr_z': -12192.1373718977, 'pos_sc_arr_x': 10265475.855776891, 'pos_sc_arr_y': 12402510.591650695, 'pos_sc_arr_z': 14682339.668379534, 'pos_target_arr_x': -1305316614.96121, 'pos_target_arr_y': 486896632.5125331, 'pos_target_arr_z': 43511388.02043799 }, { 'id': 11.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1184673600.0, 'v_inf_arr_x': -6.047425746917725, 'v_inf_arr_y': 4.8655104637146, 'v_inf_arr_z': 0.1582076996564865, 'c3': 91.76978951174812, 'dv_total': 4.232193428091705, 'pos_earth_arr_x': -25864915.8167466, 'pos_earth_arr_y': 144817593.0996289, 'pos_earth_arr_z': -12592.93196002394, 'pos_sc_arr_x': 10464003.979034044, 'pos_sc_arr_y': 12627675.642034406, 'pos_sc_arr_z': 14934757.550419595, 'pos_target_arr_x': -1311317028.325375, 'pos_target_arr_y': 472745169.7035928, 'pos_target_arr_z': 43995926.96515581 }, { 'id': 12.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1187524800.0, 'v_inf_arr_x': -6.015580654144287, 'v_inf_arr_y': 4.876519203186035, 'v_inf_arr_z': 0.1547214835882187, 'c3': 91.14400155414246, 'dv_total': 4.178948829416186, 'pos_earth_arr_x': -18104792.48576083, 'pos_earth_arr_y': 145998071.3251919, 'pos_earth_arr_z': -12745.73429516703, 'pos_sc_arr_x': 10556207.660102095, 'pos_sc_arr_y': 12711453.828719046, 'pos_sc_arr_z': 15009198.770922503, 'pos_target_arr_x': -1310327479.271311, 'pos_target_arr_y': 475107653.0691782, 'pos_target_arr_z': 43915536.1763472 }, { 'id': 13.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1187784000.0, 'v_inf_arr_x': -6.002259254455566, 'v_inf_arr_y': 4.859484672546387, 'v_inf_arr_z': 0.15382106602191925, 'c3': 91.14400155414246, 'dv_total': 4.187814760953188, 'pos_earth_arr_x': -25864915.8167466, 'pos_earth_arr_y': 144817593.0996289, 'pos_earth_arr_z': -12592.93196002394, 'pos_sc_arr_x': 10631100.27353158, 'pos_sc_arr_y': 12789430.753423374, 'pos_sc_arr_z': 15090088.683201574, 'pos_target_arr_x': -1311317028.325375, 'pos_target_arr_y': 472745169.7035928, 'pos_target_arr_z': 43995926.96515581 }, { 'id': 14.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1190116800.0, 'v_inf_arr_x': -4.35708475112915, 'v_inf_arr_y': 7.097956657409668, 'v_inf_arr_z': -0.06006072461605072, 'c3': 90.55121324213802, 'dv_total': 4.135952711105347, 'pos_earth_arr_x': 150059107.6299086, 'pos_earth_arr_y': -7559880.445354217, 'pos_earth_arr_z': -553.0031527034007, 'pos_sc_arr_x': 6399641.982960437, 'pos_sc_arr_y': 7837501.289040839, 'pos_sc_arr_z': 9384461.673875792, 'pos_target_arr_x': -1106471097.529664, 'pos_target_arr_y': 817215917.2492543, 'pos_target_arr_z': 29860277.62716365 }, { 'id': 15.0, 'body_id': 699.0, 'architecture_id': 1.0, 't_launch': 947246400.0, 't_arr': 1191672000.0, 'v_inf_arr_x': -4.3486528396606445, 'v_inf_arr_y': 7.07496976852417, 'v_inf_arr_z': -0.060127705335617065, 'c3': 90.26676351547725, 'dv_total': 4.106699830037542, 'pos_earth_arr_x': 150123701.0221546, 'pos_earth_arr_y': 132240.2389258931, 'pos_earth_arr_z': -1354.956258545324, 'pos_sc_arr_x': 6462107.987972421, 'pos_sc_arr_y': 7904383.877907635, 'pos_sc_arr_z': 9455805.325314943, 'pos_target_arr_x': -1108094630.146894, 'pos_target_arr_y': 815194339.064067, 'pos_target_arr_z': 29959898.30530256 }]

const useStore = create<Store>(
  persist(
    {
      key: "vipre-app",
      allowlist: ["activeTab", "tabs", "filterList"],
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
      selectedTrajectory: null,
      setSelectedTrajectory: (selectedTrajectory) => set({ selectedTrajectory }),
      confirmedSelectedTrajectory: false,
      setConfirmedSelectedTrajectory: (confirmedSelectedTrajectory) => set({ confirmedSelectedTrajectory }),
      trajectories: [],
      setTrajectories: (trajectories) => set({ trajectories }),
      searchTrajectories: () => {
        // set({ trajectories: TEST_DATA })
        // return TEST_DATA;
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
