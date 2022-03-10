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

export const FILTERS = [
  {
    label: "Target Body",
    dataField: "Target Body",
    type: "select",
    options: ["Saturn", "Uranus", "Neptune"],
    defaultValue: "Saturn",
    hidden: true,
  },
  {
    label: "Entry Altitude",
    dataField: "Entry Altitude",
    type: "select",
    options: [700, 750, 800],
    defaultValue: 700,
    units: "km",
  },
  {
    label: "Entry Latitude",
    dataField: "Entry Latitude",
    type: "select",
    options: [60, 70, 80],
    defaultValue: 60,
    units: "deg",
  },
  {
    label: "Flyby Architecture",
    dataField: "Flyby Architecture",
    type: "multi-select",
    options: ["A", "B", "C"],
  },
  {
    label: "Launch Date Range",
    dataField: "Launch Date Range",
    type: "date-range",
    defaultValue: [new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1))],
  },
  {
    label: "Flight Path Angle",
    dataField: "Flight Path Angle",
    type: "slider-range",
    min: 0,
    max: 360,
    step: 1,
    defaultValue: [0, 360],
    units: "deg",
  },
  {
    label: "Entry Speed",
    dataField: "Entry Speed",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "km/s",
  },
  {
    label: "Time visible from Earth",
    dataField: "Time visible from Earth",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "mins",
  },
  {
    label: "Data Volume Returned",
    dataField: "Data Volume Returned",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "MB",
  },
  {
    label: "Solar Phase",
    dataField: "Solar Phase",
    type: "slider-range",
    min: 0,
    max: 11,
    step: 1,
    defaultValue: [0, 11],
    units: "cycle",
  },
];

const constants = { DEFAULT_TABS, FILTERS, GRAPH_TYPES };
export default constants;
