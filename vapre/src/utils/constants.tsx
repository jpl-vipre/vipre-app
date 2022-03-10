export const DEFAULT_TABS = [
  {
    id: 0,
    label: "Dashboard",
    topRow: [],
    bottomRow: [],
  },
];

export const FILTERS = [
  {
    label: "Target Body",
    type: "select",
    options: ["Saturn", "Uranus", "Neptune"],
    defaultValue: "Saturn",
    hidden: true,
  },
  {
    label: "Entry Altitude",
    type: "select",
    options: [700, 750, 800],
    defaultValue: 700,
    units: "km",
  },
  {
    label: "Entry Latitude",
    type: "select",
    options: [60, 70, 80],
    defaultValue: 60,
    units: "deg",
  },
  {
    label: "Flyby Architecture",
    type: "multi-select",
    options: ["A", "B", "C"],
  },
  {
    label: "Launch Date Range",
    type: "date-range",
    defaultValue: [new Date(), new Date(new Date().setFullYear(new Date().getFullYear() + 1))],
  },
  {
    label: "Flight Path Angle",
    type: "slider-range",
    min: 0,
    max: 360,
    step: 1,
    defaultValue: [0, 360],
    units: "deg",
  },
  {
    label: "Entry Speed",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "km/s",
  },
  {
    label: "Time visible from Earth",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "mins",
  },
  {
    label: "Data Volume Returned",
    type: "slider-range",
    min: 0,
    max: 10000,
    step: 1,
    defaultValue: [0, 10000],
    units: "MB",
  },
  {
    label: "Solar Phase",
    type: "slider-range",
    min: 0,
    max: 11,
    step: 1,
    defaultValue: [0, 11],
    units: "cycle",
  },
];

const constants = { DEFAULT_TABS, FILTERS };
export default constants;
