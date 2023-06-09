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

import { FC, useMemo, useRef, useState } from "react";
import * as THREE from 'three';
import { ResponsiveContainer } from "recharts";

import * as math from "mathjs";

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

  const selectedTrajectory = useStore(state => state.selectedTrajectory)
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
      globeObjectsData = data.filter(entry => entry.pos_entry_mag !== null && entry.pos_entry_lat !== null && entry.pos_entry_lon !== null).map((entry) => {
        let altitude = (entry.pos_entry_mag / (targetBody?.radius || 1)) - 1;
        let latitude = entry.pos_entry_lat;
        let longitude = entry.pos_entry_lon;
        let color = colorField ? colors(normalizeValue(entry[colorField])) : "#fff";

        return {
          entryID: entry.id,
          altitude,
          latitude,
          longitude,
          color,
          label: `<div class="globe-tooltip">
            <div>
              <span>Entry ID: </span><b>${entry.id}</b>
            </div>
            <div>
              <span>Lat: </span><b>${math.round(latitude, 3)} degrees</b>
            </div>
            <div>
              <span>Lon: </span><b>${math.round(longitude, 3)} degrees</b></div>
            ${colorField && `<div>
              <span>${colorField}: </span><b>${math.round(entry[colorField], 3)} ${colorUnits}</b>
            </div>`}
          </div>`
        }
      });
    }

    // @ts-ignore
    if (!initRotate && globeElement && globeElement.current && globeElement.current.pointOfView) {
      // @ts-ignore
      globeElement?.current.pointOfView({ lat: 10, lng: 0, altitude: 4 });
      setInitRotate(true);
    }

    let extraObjects: any[] = [];

    if (targetBody.radius && targetBody.ringInnerRadius && targetBody.ringOuterRadius) {
      let ringLayer = {
        entryID: -1,
        altitude: -1,
        latitude: 0,
        longitude: 0,
        innerRadius: targetBody.ringInnerRadius / targetBody.radius * GLOBE_RADIUS,
        outerRadius: targetBody.ringOuterRadius / targetBody.radius * GLOBE_RADIUS,
        ringTexture: targetBody.ringTexture,
        angleOffset: targetBody?.angleOffset || [0, 0, 0]
      };
      extraObjects.push(ringLayer);
    }

    return [...extraObjects, ...globeObjectsData];
  }, [globeType, data, arcs, colorField, maxBound, minBound, targetBody, colorUnits, initRotate, setInitRotate]);

  let pointData = useMemo(() => {
    if (globeType === "arc") {
      return [];
    }

    let points = [];
    if (selectedTrajectory && selectedTrajectory.pos_earth_arr_lat && selectedTrajectory.pos_earth_arr_lon) {
      let earthArrowLayer = {
        id: "earth",
        color: 0x00ff00,
        altitude: 3,
        latitude: selectedTrajectory.pos_earth_arr_lat,
        longitude: selectedTrajectory.pos_earth_arr_lon,
        label: `<div class="globe-tooltip">
            <div>
              <span>Direction of Earth</b>
            </div>
          </div>`
      };
      points.push(earthArrowLayer);
    }

    if (selectedTrajectory && selectedTrajectory.pos_sun_arr_lat && selectedTrajectory.pos_sun_arr_lon) {
      let sunArrowLayer = {
        id: "sun",
        color: 0xffff00,
        altitude: 3,
        latitude: selectedTrajectory.pos_sun_arr_lat,
        longitude: selectedTrajectory.pos_sun_arr_lon,
        label: `<div class="globe-tooltip">
            <div>
              <span>Direction of Sun</b>
            </div>
          </div>`
      };
      points.push(sunArrowLayer);
    }

    return points;
  }, [selectedTrajectory, globeType]);

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
            // Ring Layer
            if (point.entryID === -1) {
              const geometry = new THREE.RingGeometry(point.innerRadius, point.outerRadius, 32);
              const texture = new THREE.TextureLoader().load(point.ringTexture);
              const material = new THREE.MeshLambertMaterial({
                side: THREE.DoubleSide,
                map: texture,
                transparent: true
              });

              let ringMesh = new THREE.Mesh(geometry, material);
              ringMesh.rotation.x = Math.PI / 2;
              if (point.angleOffset) {
                let [xOffset, yOffset, zOffset] = point.angleOffset;
                ringMesh.rotation.x += (xOffset || 0);
                ringMesh.rotation.y += (yOffset || 0);
                ringMesh.rotation.z += (zOffset || 0);
              }

              return ringMesh;
            }
            // Carrier Arc
            else if (point?.pointType && point.pointType === "carrier") {
              const geometry = new THREE.DodecahedronBufferGeometry(10, 0);
              const material = new THREE.MeshBasicMaterial({ color: point.color, side: THREE.BackSide, wireframe: true });
              return new THREE.Mesh(geometry, material);
            }
            // Probe Arc
            else {
              let isEntryPoint = globeType === "entryPoint";
              let isHoverPoint = isEntryPoint && point.entryID === hoverID;
              let isSelectedEntry = isEntryPoint && !isHoverPoint && selectedEntries.findIndex((selectedEntry) => selectedEntry.id === point.entryID) >= 0;

              const geometry = new THREE.SphereGeometry(5, 32, 16);
              const material = new THREE.MeshBasicMaterial({ color: isHoverPoint ? "lightblue" : isSelectedEntry ? "blue" : point.color });
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
                  let selectedEntry = data[entryIndex];
                  setSelectedEntries([...selectedEntries, selectedEntry]);
                }
              }
            }
          }}
          pointsData={pointData}
          pointLat="latitude"
          pointLng="longitude"
          pointAltitude="altitude"
          pointColor="color"
          pointRadius={1}
          pointLabel="label"
        />
      </ResponsiveContainer>}
    </div>
  );
};

export default Globe;
