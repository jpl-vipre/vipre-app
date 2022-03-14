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

export const DEFAULT_TABS = [
  {
    id: 0,
    label: "Dashboard",
    topRow: [
      { type: "scatterplot", xAxis: "", yAxis: "", color: "" },
      { type: "scatterplot", xAxis: "", yAxis: "", color: "" },
      { type: "scatterplot", xAxis: "", yAxis: "", color: "" },
    ],
    bottomRow: [
      { type: "globe", xAxis: "", yAxis: "", color: "" },
      { type: "globe", xAxis: "", yAxis: "", color: "" },
      { type: "globe", xAxis: "", yAxis: "", color: "" },
      { type: "globe", xAxis: "", yAxis: "", color: "" },
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
    label: "Target Body",
    dataField: "targetBody",
    type: "select",
    options: ["Saturn", "Uranus", "Neptune"],
    defaultValue: "Saturn",
    hidden: true,
  },
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

const constants = { DEFAULT_TABS, FILTERS, GRAPH_TYPES, FILTER_TYPES };
export default constants;
