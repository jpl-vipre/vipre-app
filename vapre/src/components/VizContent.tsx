import { FC } from "react";
import { VizTab } from "../utils/store";
import Visualization from "./Visualizations/Visualization";

interface VizContentProps {
  tab: VizTab;
}
const VizContent: FC<VizContentProps> = ({ tab }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {tab.topRow.length > 0 && (
        <div style={{ display: "flex", flex: 1, alignItems: "center", margin: "5px", marginTop: "10px" }}>
          {tab.topRow.map((graphConfig) => {
            return (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "5px",
                  height: "100%",
                }}
              >
                <Visualization config={graphConfig} />
              </div>
            );
          })}
        </div>
      )}
      {tab.bottomRow.length > 0 && (
        <div style={{ display: "flex", flex: 1, alignItems: "center", margin: "5px", marginBottom: "10px" }}>
          {tab.bottomRow.map((graphConfig) => {
            return (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "5px",
                  height: "100%",
                }}
              >
                <Visualization config={graphConfig} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VizContent;
