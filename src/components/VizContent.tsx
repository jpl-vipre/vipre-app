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
                }}
              >
                <Visualization config={graphConfig} id={`${tab.id}-top-row-${i}`} />
              </div>
            );
          })}
        </div>
      )}
      {tab.bottomRow.length > 0 && (
        <div style={{ display: "flex", flex: 1, alignItems: "center", margin: "5px", marginBottom: "10px" }}>
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
                  height: "100%",
                }}
              >
                <Visualization config={graphConfig} id={`${tab.id}-bottom-row-${i}`} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VizContent;