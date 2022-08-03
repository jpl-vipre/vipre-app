import { FC, useCallback, useEffect, useMemo, useState } from "react";
import * as THREE from 'three';
import { ResponsiveContainer } from "recharts";

import ReactGlobe from "react-globe.gl";

import ColorScale, { colors } from "./ColorScale";
import useStore from "../../utils/store";

import "../../scss/Globe.scss";

interface GlobeProps {
  id: string;
  data: any[];
  globeType: string;
  colorField?: string;
}
const Globe: FC<GlobeProps> = ({ globeType, data, colorField, id }) => {
  const targetBody = useStore(state => state.targetBodies[state.targetBody])
  const isEditing = useStore(state => state.editingTab !== null);
  const arcs = useStore(state => state.arcs);

  const [selectedEntries, setSelectedEntries] = useStore(state => [state.selectedEntries, state.setSelectedEntries]);

  const [hoverID, setHoverID] = useState(-1);

  const [minBound, maxBound, steps] = useMemo(() => {
    if (!colorField || !data || !data.length) {
      return [0, 0, 1];
    }
    const colorValues = data.map((entry) => entry[colorField]);
    let min = Math.min(...colorValues);
    let max = Math.max(...colorValues);
    let steps = Math.ceil(Math.max(Math.min((max - min) / 0.01, 100), 1));

    return [min, max, steps];
  }, [data, colorField]);

  let globeObjects = useMemo(() => {
    const normalizeValue = (value: number) => {
      if (maxBound <= minBound) {
        return 0.15;
      }
      else {
        return ((value - minBound) / (maxBound - minBound)) * 0.8 + 0.15;
      }
    };

    if (globeType === "arc") {
      return arcs.map(obj => ({ ...obj }));
    } else {
      return data.map((entry) => {
        let selectedEntryIndex = selectedEntries.findIndex((selectedEntry) => selectedEntry.id === entry.id);
        let isSelectedEntry = selectedEntryIndex >= 0;

        let altitude = (entry.pos_entry_lat_long_h?.height / entry.target_body.radius) - 1;
        let color = colorField ? colors(normalizeValue(entry[colorField])) : "#fff";
        return {
          entryID: entry.id,
          altitude,
          latitude: entry.pos_entry_lat_long_h?.latitude,
          longitude: entry.pos_entry_lat_long_h?.longitude,
          color: hoverID === entry.id ? "blue" : isSelectedEntry ? "#fff" : color
        }
      })
    }
  }, [globeType, data, arcs, colorField, selectedEntries, maxBound, minBound, hoverID])

  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", background: "black" }}
      id={id}
    >
      {isEditing || <ResponsiveContainer>
        <ReactGlobe
          globeImageUrl={targetBody.map}
          objectsData={globeObjects}
          objectAltitude="altitude"
          objectLat="latitude"
          objectLng="longitude"
          objectThreeObject={(point: any) => {
            const geometry = new THREE.SphereGeometry(5, 32, 16);
            const material = new THREE.MeshBasicMaterial({ color: point.color });
            return new THREE.Mesh(geometry, material);
          }}
          objectLabel="label"
          backgroundColor="black"
          onObjectHover={(selected) => {
            // @ts-ignore
            let entryID = selected && selected["entryID"] ? selected.entryID : -1;
            setHoverID(entryID);
          }}
          onObjectClick={(selected) => {
            if (globeType === "entryPoint") {
              // @ts-ignore
              let clickedEntryIndex = selectedEntries.findIndex(selectedEntry => selectedEntry.id === selected.entryID);
              if (clickedEntryIndex >= 0) {
                // @ts-ignore
                setSelectedEntries(selectedEntries.filter(selectedEntry => selectedEntry.id !== selected.entryID));
              } else {
                // @ts-ignore
                let entryIndex = data.findIndex(selectedEntry => selectedEntry.id === selected.entryID);
                if (entryIndex >= 0) {
                  setSelectedEntries([...selectedEntries, data[entryIndex]])
                }
              }
            }
          }}
        />
      </ResponsiveContainer>}
    </div>
  );
};

export default Globe;
