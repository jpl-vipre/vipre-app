import { FC, useCallback, useEffect, useMemo } from "react";
import * as THREE from 'three';
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
  const targetBody = useStore(state => state.targetBodies[state.targetBody])
  const isEditing = useStore(state => state.editingTab !== null);
  const arcs = useStore(state => state.arcs);


  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", background: "black" }}
      id={id}
    >
      {isEditing || <ResponsiveContainer>
        <ReactGlobe
          globeImageUrl={targetBody.map}
          objectsData={arcs.map(obj => ({ ...obj }))}
          objectAltitude="altitude"
          objectLat="latitude"
          objectLng="longitude"
          objectThreeObject={(point: any) => {
            const geometry = new THREE.SphereGeometry(5, 32, 16);
            const material = new THREE.MeshBasicMaterial({ color: point.color });
            return new THREE.Mesh(geometry, material);
          }}
          objectLabel="label"
          // pathPoin={2}
          // objec="color"
          // arcsData={arcs}
          // arcColor={'color'}
          // arcLabel={'label'}
          // arcStroke={3}
          backgroundColor="black"
        />
      </ResponsiveContainer>}
    </div>
  );
};

export default Globe;
