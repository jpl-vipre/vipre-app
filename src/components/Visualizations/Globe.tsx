import { FC, useMemo, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { scaleSequential } from "d3-scale";
import { interpolateSpectral } from "d3-scale-chromatic";

import ColorScale from "./ColorScale";

import "../../scss/Globe.scss";

const colors = scaleSequential(interpolateSpectral);

interface GlobeProps {
  id: string;
  data: any[];
  xField: string;
  xUnits?: string;
  yField: string;
  yUnits?: string;
  colorField?: string;
  colorUnits?: string;
}
const Globe: FC<GlobeProps> = ({ data, xField, xUnits, yField, yUnits, colorField, colorUnits, id }) => {

  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", maxHeight: "calc(100% - 15px)", alignItems: "center" }}
      id={id}
    >
      <div style={{ width: "100%", height: "100%" }} className="globe-container">
        Globe
      </div>
    </div>
  );
};

export default Globe;
