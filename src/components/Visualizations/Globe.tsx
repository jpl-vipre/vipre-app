import { FC, useMemo, useRef, useState } from "react";
import * as THREE from 'three';
import { ResponsiveContainer } from "recharts";

import ReactGlobe from "react-globe.gl";

import { colors } from "./ColorScale";
import useStore from "../../utils/store";

import "../../scss/Globe.scss";

const GLOBE_RADIUS = 100;

interface GlobeProps {
  id: string;
  data: any[];
  globeType: string;
  colorField?: string;
  colorUnits?: string;
}
const Globe: FC<GlobeProps> = ({ globeType, data, colorField, id, colorUnits }) => {
  const globeElement = useRef();

  const targetBody = useStore(state => state.targetBodies[state.targetBody])
  const isEditing = useStore(state => state.editingTab !== null);
  const arcs = useStore(state => state.arcs);

  const [selectedEntries, setSelectedEntries] = useStore(state => [state.selectedEntries, state.setSelectedEntries]);

  const [hoverID, setHoverID] = useState(-1);
  const [initRotate, setInitRotate] = useState(false);

  const [minBound, maxBound] = useMemo(() => {
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

    let globeObjectsData = [];

    if (globeType === "arc") {
      globeObjectsData = arcs.map(obj => ({ ...obj }));
    } else {
      globeObjectsData = data.map((entry) => {
        let selectedEntryIndex = selectedEntries.findIndex((selectedEntry) => selectedEntry.id === entry.id);
        let isSelectedEntry = selectedEntryIndex >= 0;

        let altitude = (entry.pos_entry_height / entry.target_body.radius) - 1;
        let latitude = entry.pos_entry_latitude;
        let longitude = entry.pos_entry_longitude;
        let color = colorField ? colors(normalizeValue(entry[colorField])) : "#fff";

        return {
          entryID: entry.id,
          altitude,
          latitude,
          longitude,
          color: hoverID === entry.id ? "lightblue" : isSelectedEntry ? "blue" : color,
          label: `<div class="globe-tooltip">
            <div>
              <span>Entry ID: </span><b>${entry.id}</b>
            </div>
            <div>
              <span>Lat: </span><b>${latitude}</b>
            </div>
            <div>
              <span>Lon: </span><b>${longitude}</b></div>
            ${colorField && `<div>
              <span>${colorField}: </span><b>${entry[colorField]}${colorUnits}</b>
            </div>`}
          </div>`
        }
      })
    }

    // @ts-ignore
    if (!initRotate && globeElement && globeElement.current && globeElement.current.pointOfView) {
      // @ts-ignore
      globeElement?.current.pointOfView({ lat: 10, lng: 0, altitude: 4 });
      setInitRotate(true);
    }

    if (targetBody.radius && targetBody.ringInnerRadius && targetBody.ringOuterRadius) {
      let ringLayer = {
        entryID: -1,
        altitude: -1,
        latitude: 0,
        longitude: 0,
        innerRadius: targetBody.ringInnerRadius / targetBody.radius * GLOBE_RADIUS,
        outerRadius: targetBody.ringOuterRadius / targetBody.radius * GLOBE_RADIUS,
        ringTexture: targetBody.ringTexture
      };

      return [ringLayer, ...globeObjectsData];
    } else {
      return globeObjectsData;
    }
  }, [globeType, data, arcs, colorField, selectedEntries, maxBound, minBound, hoverID, targetBody, colorUnits, initRotate, setInitRotate]);

  return (
    <div
      style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", background: "black", position: "relative" }}
      id={id}
    >
      {globeType === "entryPoint" && <div className="globe-color-scale" style={{ position: "absolute", right: "5px", display: "flex", flexDirection: "column", alignItems: "flex-end", zIndex: 1, height: "100%", justifyContent: "center" }}>
        <div className="globe-scale-label" style={{
          fontSize: "14px",
          color: "#a1a1b5"
        }}>{colorField}</div>
        <div style={{ color: "#a1a1b5", fontSize: "10px" }}>{Math.round(maxBound)} {colorUnits}</div>
        <div style={{ height: "80%", display: "flex" }}>
          <div style={{
            height: "100%",
            width: "10px",
            borderRadius: "5px",
            background: `linear-gradient(0deg, ${colors(0.15)} 0%, ${colors(0.55)} 50%, ${colors(0.95)} 100%)`
          }} />
        </div>
        <div style={{ color: "#a1a1b5", fontSize: "10px" }}>{Math.round(minBound)} {colorUnits}</div>
      </div>}
      {isEditing || <ResponsiveContainer>
        <ReactGlobe
          ref={globeElement}
          globeImageUrl={targetBody.map}
          objectsData={globeObjects}
          objectAltitude="altitude"
          objectLat="latitude"
          objectLng="longitude"
          objectThreeObject={(point: any) => {
            if (point.entryID === -1) {
              const geometry = new THREE.RingGeometry(point.innerRadius, point.outerRadius, 32);
              const texture = new THREE.TextureLoader().load(point.ringTexture);
              const material = new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                map: texture,
                transparent: true
              });

              let globeMesh = new THREE.Mesh(geometry, material);
              globeMesh.rotation.x = Math.PI / 2;
              return globeMesh;
            } else {
              const geometry = new THREE.SphereGeometry(5, 32, 16);
              const material = new THREE.MeshBasicMaterial({ color: point.color });
              return new THREE.Mesh(geometry, material);
            }
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
