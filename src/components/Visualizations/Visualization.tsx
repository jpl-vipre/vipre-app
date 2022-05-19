import { FC } from "react";
import useStore, { GraphConfig, Store } from "../../utils/store";
import Scatterplot from "./Scatterplot";
import Globe from "./Globe";

import "../../scss/Visualization.scss";

interface VisualizationProps {
  config: GraphConfig;
  id: string;
}
const Visualization: FC<VisualizationProps> = ({ config, id }) => {
  const dataSource = (config.source || "trajectories") as keyof Store;
  const data = useStore((state) => state[dataSource]);

  return (
    <div
      className="visualization-card"
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        height: "100%",
        maxHeight: "calc(100% - 15px)",
        padding: "5px",
        border: "1px solid #a1a1b5",
        borderRadius: "5px",
        background: config.type === "globe" ? "black" : "#232E44"
      }}
      id={id}
    >
      {config.type === "scatterplot" && (
        <Scatterplot
          isTrajectorySelector={dataSource === "trajectories"}
          data={data as any[]}
          xField={config.xAxis}
          xUnits={config.xUnits}
          yField={config.yAxis}
          yUnits={config.yUnits}
          colorField={config.color}
          colorUnits={config.colorUnits}
          id={`${id}-scatterplot`}
        />
      )}
      {config.type === "globe" && (
        <Globe
          data={data as any[]}
          xField={config.xAxis}
          xUnits={config.xUnits}
          yField={config.yAxis}
          yUnits={config.yUnits}
          colorField={config.color}
          colorUnits={config.colorUnits}
          id={`${id}-globe`}
        />
      )}
    </div>
  );
};

export default Visualization;
