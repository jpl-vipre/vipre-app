import { FC } from "react";
import { ResponsiveContainer } from "recharts";

import ReactGlobe from "react-globe.gl";


import "../../scss/Globe.scss";
import useStore from "../../utils/store";

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
  const targetBodyMap = useStore(state => state.targetBodies[state.targetBody].map)
  const isEditing = useStore(state => state.editingTab !== null);

  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", background: "black" }}
      id={id}
    >
      {isEditing || <ResponsiveContainer>
        {/* <div style={{ width: "100%", maxWidth: "100%", height: "100%", display: "flex", justifyContent: "center", position: "relative" }} className="globe-container"> */}
        <ReactGlobe
          globeImageUrl={targetBodyMap}
          pointsData={data}
          pointAltitude="size"
          pointColor="color"
          backgroundColor="black"
        // @ts-ignore
        // width={"100%"}
        // height={"100%"}
        />
        {/* </div> */}
      </ResponsiveContainer>}
    </div>
  );
};

export default Globe;
