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

export const SCHEMA_NAMES = [
  "architecture",
  "body",
  "entry",
  "flyby",
  "maneuver",
  "occultation",
  "trajectory"
]

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

export const TRAJECTORY_COLORS = [
  "#4d4e5c",
  "#5555aa",
  "#fde6c6",
  "#f9f2d1",
  "#ae7f71",
  "#ffd6c7",
  "#433d3c",
  "#a9bdb1",
  "#8f7303",
  "#885511",
  "#ff964f",
  "#c47967",
  "#8f917c",
  "#cdd6b1",
  "#4f2923",
  "#f3c6cc",
  "#9d896c",
  "#b18276",
  "#96cbf1",
  "#dac43c",
  "#414634",
  "#00bbee",
  "#b0ab80",
  "#4a455d",
  "#bdbaae",
  "#b9a0d2",
  "#15646d",
  "#d4c7d9",
  "#5e5a67",
  "#e9e6d4"
]

const constants = { API, SCHEMA_NAMES, TARGET_BODIES, DEFAULT_TABS, FILTERS, GRAPH_TYPES, FILTER_TYPES, DEFAULT_TARGET_BODY, GRAPH_SOURCES, TRAJECTORY_COLORS };
export default constants;
