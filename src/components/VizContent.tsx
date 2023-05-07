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

import { FC } from "react";
import { VizTab } from "../utils/store";
import Visualization from "./Visualizations/Visualization";

interface VizContentProps {
  tab: VizTab;
}
const VizContent: FC<VizContentProps> = ({ tab }) => {

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", maxWidth: "100%" }}>
      {tab.topRow.length > 0 && (
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            margin: "5px",
            marginTop: "10px",
            maxWidth: "100%",
            maxHeight: tab.bottomRow.length > 0 ? "50%" : "100%",
            justifyContent: "space-between"
          }}
        >
          {tab.topRow.map((graphConfig, i) => {
            return (
              <div
                key={`${tab.id}-top-row-${i}`}
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "5px",
                  height: "100%",
                  width: `calc(100% / ${tab.topRow.length} - 10px)`,
                  maxWidth: `calc(100% / ${tab.topRow.length} - 10px)`,
                }}
              >
                <Visualization config={graphConfig} id={`viz-${tab.id}-top-row-${i}`} />
              </div>
            );
          })}
        </div>
      )}
      {tab.bottomRow.length > 0 && (
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            margin: "5px",
            marginBottom: "10px",
            maxHeight: tab.bottomRow.length > 0 ? "50%" : "100%",
            justifyContent: "space-between"
          }}>
          {tab.bottomRow.map((graphConfig, i) => {
            return (
              <div
                key={`${tab.id}-bottom-row-${i}`}
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "5px",
                  width: `calc(100% / ${tab.bottomRow.length} - 10px)`,
                  maxWidth: `calc(100% / ${tab.bottomRow.length} - 10px)`,
                  height: "calc(100% - 10px)",

                }}
              >
                <Visualization config={graphConfig} id={`viz-${tab.id}-bottom-row-${i}`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VizContent;
