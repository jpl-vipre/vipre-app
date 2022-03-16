import { FC } from "react";
import { GraphConfig } from "../../utils/store";

interface VisualizationProps {
  config: GraphConfig;
}
const Visualization: FC<VisualizationProps> = ({ config }) => {
  return <div>{config.type}</div>;
};

export default Visualization;
