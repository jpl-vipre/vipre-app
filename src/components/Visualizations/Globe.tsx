import { FC } from "react";
import {  ResponsiveContainer } from "recharts";
import { scaleSequential } from "d3-scale";
import { interpolateSpectral } from "d3-scale-chromatic";

import ReactGlobe from "react-globe.gl";


import "../../scss/Globe.scss";

// const colors = scaleSequential(interpolateSpectral);

const N = 100;
// @ts-ignore
  const gData = [...Array(N).keys()].map(() => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
    size: Math.random() / 3,
    color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
  }));

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
      style={{ display: "flex", width: "100%", height: "100%", maxHeight: "calc(100% - 15px)", alignItems: "center", background: "black" }}
      id={id}
    >
      <ResponsiveContainer>
      <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center" }} className="globe-container">
        <ReactGlobe
          globeImageUrl={"//unpkg.com/three-globe/example/img/earth-day.jpg"}
          pointsData={gData}
          pointAltitude="size"
          pointColor="color"
          backgroundColor="black"
          // @ts-ignore
          width={450}
          height={300}
        />
      </div>
      </ResponsiveContainer>
    </div>
  );
};

export default Globe;
