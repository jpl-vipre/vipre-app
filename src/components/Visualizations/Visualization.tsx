import { FC } from "react";
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
  const dataSource = (config.source || "trajectories") as keyof Store;
  const data = useStore((state) => state[dataSource]);
  const entryData = useStore(state => state.entries);

  const stripSource = (field: string | undefined | null): string => field ? field.replace(/^[a-z]+./, "") : "";

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
          isTrajectorySelector={dataSource === "trajectories"}
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
