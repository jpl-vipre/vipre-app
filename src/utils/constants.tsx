import VenusMap from "../assets/maps/299.jpg";
import SaturnMap from "../assets/maps/Saturn.jpg";
import NeptuneMap from "../assets/maps/899.jpg"
import UranusMap from "../assets/maps/799.jpg"
import JupiterMap from "../assets/maps/Jupiter.jpg"
import TitanMap from "../assets/maps/Titan.png"
import MarsMap from "../assets/maps/Mars.png"

import SaturnIcon from "../assets/icons/saturn.png";
import NeptuneIcon from "../assets/icons/neptune.png";
import UranusIcon from "../assets/icons/uranus.png";

export const API = process.env.REACT_APP_API || "http://localhost:8000";

// 299 = Venus
// 499 = Mars
// 599 = Jupiter
// 606 = Titan
// 699 = Saturn
// 799 = Uranus
// 899 = Neptune
export const DEFAULT_TARGET_BODY = "Saturn";
export const TARGET_BODIES = {
  "Venus": { icon: "", map: VenusMap, value: "299" },
  "Saturn": { icon: SaturnIcon, map: SaturnMap, value: "699" },
  "Neptune": { icon: NeptuneIcon, map: NeptuneMap, value: "899" },
  "Uranus": { icon: UranusIcon, map: UranusMap, value: "799" },
  "Jupiter": { icon: "", map: JupiterMap, value: "599" },
  "Titan": { icon: "", map: TitanMap, value: "606" },
  "Mars": { icon: "", map: MarsMap, value: "499" },
}

// Object.entries(TARGET_BODIES).forEach(([targetName, body]) => {
//   TARGET_BODIES[targetName].icon = convertToPackagedPath(body.icon);
//   TARGET_BODIES[targetName].map = convertToPackagedPath(body.map);
// })

export const GRAPH_TYPES = {
  scatterplot: {
    label: "Scatterplot",
    xAxis: true,
    yAxis: true,
    color: true,
  },
  globe: {
    label: "Globe",
    xAxis: true,
    yAxis: true,
    color: true,
  },
};

export const GRAPH_SOURCES = ["trajectories", "entries"];

export const DEFAULT_TABS = [
  {
    id: 0,
    label: "Dashboard",
    topRow: [
      { type: "scatterplot", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "" },
      { type: "scatterplot", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "" },
      { type: "scatterplot", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "" },
    ],
    bottomRow: [
      { type: "globe", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "" },
      { type: "globe", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "" },
      { type: "globe", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "" },
      { type: "globe", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "" },
    ],
  },
];

export const FILTER_TYPES = {
  select: {
    label: "Select",
    units: true,
    range: false,
    step: false,
  },
  "multi-select": {
    label: "Multi Select",
    units: false,
    range: false,
    step: false,
  },
  "date-range": {
    label: "Date Range",
    units: false,
    range: false,
    step: false,
  },
  "slider-range": {
    label: "Slider Range",
    units: true,
    range: true,
    step: true,
  },
};

export const FILTERS = [
  {
    label: "Entry Altitude",
    dataField: "entryAltitude",
    type: "select",
    options: [700, 750, 800],
    defaultValue: 700,
    units: "km",
  },
  {
    label: "Entry Latitude",
    dataField: "entryLatitude",
    type: "select",
    options: [60, 70, 80],
    defaultValue: 60,
    units: "deg",
  },
  {
    label: "Flyby Architecture",
    dataField: "flybyArchitecture",
    type: "multi-select",
    options: ["A", "B", "C"],
  },
  {
    label: "Launch Date Range",
    dataField: "launchDateRnage",
    type: "date-range",
    defaultValue: [new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1))],
  },
  {
    label: "Flight Path Angle",
    dataField: "flightPathAngle",
    type: "slider-range",
    min: 0,
    max: 360,
    step: 1,
    defaultValue: [0, 360],
    units: "deg",
  },
  {
    label: "Entry Speed",
    dataField: "entrySpeed",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "km/s",
  },
  {
    label: "Time visible from Earth",
    dataField: "timeVisibleFromEarth",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "mins",
  },
  {
    label: "Data Volume Returned",
    dataField: "dataVolumeReturned",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "MB",
  },
  {
    label: "Solar Phase",
    dataField: "solarPhase",
    type: "slider-range",
    min: 0,
    max: 11,
    step: 1,
    defaultValue: [0, 11],
    units: "cycle",
  },
];

const constants = { API, TARGET_BODIES, DEFAULT_TABS, FILTERS, GRAPH_TYPES, FILTER_TYPES, DEFAULT_TARGET_BODY, GRAPH_SOURCES };
export default constants;
