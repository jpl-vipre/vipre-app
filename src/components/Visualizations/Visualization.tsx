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

import { FC, useMemo } from "react";
import useStore, { GraphConfig, Store } from "../../utils/store";
import Scatterplot from "./Scatterplot";
import Globe from "./Globe";

import "../../scss/Visualization.scss";
import TableViz from "./TableViz";

interface VisualizationProps {
  config: GraphConfig;
  id: string;
}
const Visualization: FC<VisualizationProps> = ({ config, id }) => {
  const dataSource = useMemo(() => (config.source || "trajectories") as keyof Store, [config]);
  const data = useStore((state) => state[dataSource]);
  const entryData = useStore(state => state.entries);

  const stripSource = (field: string | undefined | null): string => field ? field.replace(/^[a-z]+\./, "") : "";
  return (
    <div
      className="visualization-card"
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        height: "100%",
        maxHeight: "calc(100% - 15px)",
        maxWidth: "100%",
        padding: "5px",
        border: "1px solid #a1a1b5",
        borderRadius: "5px",
        background: "black"
      }}
      id={id}
    >
      {config.type === "scatterplot" && (
        <Scatterplot
          dataSource={dataSource}
          isTrajectorySelector={dataSource === "trajectories"}
          isSelectable={!["dataRates"].includes(dataSource)}
          data={data as any[]}
          xField={stripSource(config.xAxis)}
          xUnits={config.xUnits}
          yField={stripSource(config.yAxis)}
          yUnits={config.yUnits}
          colorField={stripSource(config.color)}
          colorUnits={config.colorUnits}
          id={`${id}-scatterplot`}
        />
      )}
      {config.type === "globe" && (
        <Globe
          globeType={config.globeType || "entryPoint"}
          colorField={stripSource(config.color)}
          colorUnits={config.colorUnits}
          data={entryData}
          id={`${id}-globe`}
        />
      )}
      {config.type === "table" && (
        <TableViz
          dataSource={dataSource}
          data={data as any[]}
          id={`${id}-table`}
        />
      )}
    </div>
  );
};

export default Visualization;
