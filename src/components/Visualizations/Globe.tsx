import { FC, useCallback, useMemo } from "react";
import { ResponsiveContainer } from "recharts";

import ReactGlobe from "react-globe.gl";

import { colors } from "./ColorScale";
import useStore from "../../utils/store";

import "../../scss/Globe.scss";

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
  const targetBodyMap = useStore(state => state.targetBodies[state.targetBody].map)
  const isEditing = useStore(state => state.editingTab !== null);
  const arcs = useStore(state => state.arcs);

  // const [minBound, maxBound] = useMemo(() => {
  //   if (!colorField || !data || !data.length) {
  //     return [0, 0];
  //   }
  //   const colorValues = data.map((entry) => entry[colorField]);
  //   return [Math.min(...colorValues), Math.max(...colorValues)];
  // }, [data, colorField]);

  // // Convert data point into a bounded value so that a color can be associated with it
  // const normalizeValue = useCallback((value: number) => {
  //   return ((value - minBound) / (maxBound - minBound)) * 0.8 + 0.15;
  // }, [minBound, maxBound]);

  // const dataWithColor = useMemo(() => {
  //   if (!colorField || !data || !data.length) {
  //     return data;
  //   }

  //   return data.map((entry) => {
  //     const color = colors(normalizeValue(entry[colorField]));
  //     return {
  //       ...entry,
  //       color,
  //     };
  //   });
  // }, [data, colorField, normalizeValue])

  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", background: "black" }}
      id={id}
    >
      {isEditing || <ResponsiveContainer>
        <ReactGlobe
          globeImageUrl={targetBodyMap}
          // pointsData={arcs}
          // pointAltitude="size"
          // pointColor="color"
          arcsData={arcs}
          arcColor={'color'}
          arcLabel={'label'}
          arcStroke={3}
          backgroundColor="black"
        />
      </ResponsiveContainer>}
    </div>
  );
};

export default Globe;
