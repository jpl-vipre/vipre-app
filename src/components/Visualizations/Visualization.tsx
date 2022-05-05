import { FC } from "react";
import { GraphConfig } from "../../utils/store";
import Scatterplot from "./Scatterplot";
import Globe from "./Globe";

import "../../scss/Visualization.scss";

// const TEST_DATA = [
//   { a: 1, b: 2, c: 1 },
//   { a: 2, b: 3, c: 10 },
//   { a: 3, b: 4, c: 2 },
//   { a: 4, b: 5, c: 10 },
//   { a: 5, b: 6, c: 5 },
//   { a: 6, b: 7, c: 7 },
// ];

const TEST_DATA =[
    {
        "id": 1,
        "body_id": 699,
        "architecture_id": 0,
        "t_launch": 947246400,
        "t_arr": 1159012800,
        "v_inf_arr_x": -6.337404727935791,
        "v_inf_arr_y": 5.546535015106201,
        "v_inf_arr_z": 0.14643369615077972,
        "c3": 99.6667924525816,
        "dv_total": 4.852789611089975,
        "pos_earth_x": 148990789.1377695,
        "pos_earth_y": -20966783.00571609,
        "pos_earth_z": 569.6724803624675,
        "pos_sc_x": 8483597.298251148,
        "pos_sc_y": 10508340.300352946,
        "pos_sc_z": 12677268.272616403,
        "pos_target_x": -1272998893.095102,
        "pos_target_y": 556745185.1876997,
        "pos_target_z": 41012437.60640222
    },
    {
        "id": 2,
        "body_id": 699,
        "architecture_id": 1,
        "t_launch": 947246400,
        "t_arr": 1161604800,
        "v_inf_arr_x": -6.251604080200195,
        "v_inf_arr_y": 5.347687244415283,
        "v_inf_arr_z": 0.14942625164985657,
        "c3": 98.64280344169806,
        "dv_total": 4.770866548642516,
        "pos_earth_x": 138848510.7518344,
        "pos_earth_y": 54588639.91061366,
        "pos_earth_z": -5585.790837645531,
        "pos_sc_x": 9041504.312097635,
        "pos_sc_y": 11105578.929963298,
        "pos_sc_z": 13313724.38920619,
        "pos_target_x": -1284198529.599371,
        "pos_target_y": 533637648.1582078,
        "pos_target_z": 41859341.50641534
    }
]

interface VisualizationProps {
  config: GraphConfig;
  id: string;
}
const Visualization: FC<VisualizationProps> = ({ config, id }) => {
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
      {config.type === "globe" && (
        <Globe
          data={TEST_DATA}
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
