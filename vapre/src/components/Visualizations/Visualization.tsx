import { FC } from "react";
import { GraphConfig } from "../../utils/store";
import Scatterplot from "./Scatterplot";

const TEST_DATA = [
  { a: 1, b: 2, c: 1 },
  { a: 2, b: 3, c: 10 },
  { a: 3, b: 4, c: 2 },
  { a: 4, b: 5, c: 10 },
  { a: 5, b: 6, c: 5 },
  { a: 6, b: 7, c: 7 },
];

interface VisualizationProps {
  config: GraphConfig;
}
const Visualization: FC<VisualizationProps> = ({ config }) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        height: "100%",
        maxHeight: "calc(100% - 15px)",
        padding: "5px",
        border: "1px solid white",
        borderRadius: "5px",
      }}
    >
      {config.type === "scatterplot" && (
        <Scatterplot data={TEST_DATA} xField={config.xAxis} yField={config.yAxis} colorField={config.color} />
      )}
    </div>
  );
};

export default Visualization;
