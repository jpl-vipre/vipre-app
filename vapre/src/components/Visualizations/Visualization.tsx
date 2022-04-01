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
  id: string;
}
const Visualization: FC<VisualizationProps> = ({ config, id }) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        height: "100%",
        maxHeight: "calc(100% - 15px)",
        padding: "5px",
        border: "1px solid #a1a1b5",
        borderRadius: "5px",
      }}
      id={id}
    >
      {config.type === "scatterplot" && (
        <Scatterplot
          data={TEST_DATA}
          xField={config.xAxis}
          xUnits={config.xUnits}
          yField={config.yAxis}
          yUnits={config.yUnits}
          colorField={config.color}
          colorUnits={config.colorUnits}
          id={`${id}-scatterplot`}
        />
      )}
    </div>
  );
};

export default Visualization;
