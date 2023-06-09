/**
 * Copyright (c) 2021-2023 California Institute of Technology ("Caltech"). U.S.
 * Government sponsorship acknowledged.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of Caltech nor its operating division, the Jet Propulsion
 *   Laboratory, nor the names of its contributors may be used to endorse or
 *   promote products derived from this software without specific prior written
 *   permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

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

import SaturnRings from "../assets/maps/saturn_ring_image.png";
import UranusRings from "../assets/maps/uranus_ring_image.png";

import package_json from "../../package.json";

import { TARGET_BODY_CODES } from "./targetBodies";

export const API = process.env.REACT_APP_API ? process.env.REACT_APP_API : "http://localhost:8463";
export const STOP_API = process.env.REACT_APP_STOP_API === "true";

export const SCHEMA_NAMES = [
  "architecture",
  "body",
  "entry",
  "flyby",
  "maneuver",
  "occultation",
  "trajectory"
];

export const DEFAULT_TARGET_BODY = "Saturn";
export const TARGET_BODIES: Record<string, { icon: string; map: string; id: string | number; ringInnerRadius?: number; ringOuterRadius?: number; ringTexture?: string; radius?: number; angleOffset?: number[]; }> = {
  "Venus": { icon: "", map: VenusMap, id: "299" },
  "Saturn": { icon: SaturnIcon, map: SaturnMap, id: "699", ringInnerRadius: 66970, ringOuterRadius: 139970, radius: 60330, ringTexture: SaturnRings },
  "Neptune": { icon: NeptuneIcon, map: NeptuneMap, id: "899" },
  "Uranus": { icon: UranusIcon, map: UranusMap, id: "799", ringInnerRadius: 37900, ringOuterRadius: 51200, radius: 25559, ringTexture: UranusRings, angleOffset: [0, 0, 0] },
  "Jupiter": { icon: "", map: JupiterMap, id: "599" },
  "Titan": { icon: "", map: TitanMap, id: "606" },
  "Mars": { icon: "", map: MarsMap, id: "499" },
}

export const LAUNCH_VEHICLES: Record<string, { name: string; polynomial: (c3: number) => number; }> = {
  "Falcon Heavy Recoverable": {
    name: "Falcon Heavy Recoverable",
    polynomial: (c3: number) => (-0.005881 * Math.pow(c3, 3) + 1.362 * Math.pow(c3, 2) - 166.8 * c3 + 6676)
  },
  "Falcon Heavy Expendable": {
    name: "Falcon Heavy Expendable",
    polynomial: (c3: number) => (-0.0052 * Math.pow(c3, 3) + 1.3194 * Math.pow(c3, 2) - 166.56 * c3 + 6687)
  },
  "Vulcan VC0": {
    name: "Vulcan VC0",
    polynomial: (c3: number) => (-0.0069 * Math.pow(c3, 3) + 0.4223 * Math.pow(c3, 2) - 84.16 * c3 + 2110)
  },
  "SLS Block 1B": {
    name: "SLS Block 1B",
    polynomial: (c3: number) => (-0.00686 * Math.pow(c3, 3) + 2.949 * Math.pow(c3, 2) - 565.017 * c3 + 36533.95)
  },
  "SLS Block 2": {
    name: "SLS Block 2",
    polynomial: (c3: number) => (-0.01045 * Math.pow(c3, 3) + 4.1419 * Math.pow(c3, 2) - 707.83 * c3 + 43714)
  },
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
    xAxis: false,
    yAxis: false,
    color: true,
  },
  table: {
    label: "Table",
    xAxis: false,
    yAxis: false,
    color: false,
  }
};

export const GRAPH_SOURCES = ["trajectories", "entries", "dataRates"];

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
      { type: "globe", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "", globeType: "entryPoint" },
      { type: "globe", xAxis: "", xUnits: "", yAxis: "", yUnits: "", color: "", colorUnits: "", globeType: "arc" },
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

export const FILTERS = [];

export const TRAJECTORY_COLORS = [
  "#f7d300",
  "#68b9ff",
  "#fde6c6",
  "#15ff00",
  "#ff3b00",
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
];

export const VERSION = package_json.version;

const constants = { API, STOP_API, VERSION, SCHEMA_NAMES, TARGET_BODIES, TARGET_BODY_CODES, DEFAULT_TABS, FILTERS, GRAPH_TYPES, FILTER_TYPES, DEFAULT_TARGET_BODY, GRAPH_SOURCES, TRAJECTORY_COLORS, LAUNCH_VEHICLES };
export default constants;
