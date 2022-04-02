import { FC, useMemo } from "react";

import useStore from "../utils/store";

import "../scss/Overview.scss";

const exampleValues = [34.63, 42.8, 200.2, 165.32, 84.53, 932.41, 12.54, 67.24];

const Overview: FC = () => {
  const trajectoryFields = useStore((state) => state.trajectoryFields);

  const overviewFields = useMemo(() => {
    return trajectoryFields.map((field, i) => {
      let units = "";
      if (field.display_name.toLowerCase().includes("date")) {
        units = "Years Past 2000";
      } else if (field.display_name.includes("DeltaV")) {
        units = "km/s";
      } else {
        let unitMatch = field.display_name.match(/(?<units>Vector [XYZ])/);
        if (unitMatch && unitMatch.groups && unitMatch.groups.units) {
          units = unitMatch.groups.units;
        }
      }
      return {
        display_name: field.display_name
          .replace("Infinity", "∞")
          .replace("Delta", "Δ")
          .replace(/Vector [XYZ]/g, ""),
        field_name: field.field_name,
        units: units,
        value: exampleValues[i % exampleValues.length],
      };
    });
  }, [trajectoryFields]);

  return (
    <div className="overview-container">
      <div className="top" style={{ display: "flex" }}>
        <h1>Overview</h1>
        <div style={{ marginLeft: "auto" }}>Trajectory ID</div>
      </div>
      <div className="overview-list">
        {overviewFields.map((overviewField) => {
          return (
            <div key={overviewField.field_name} className="overview-field">
              <h2>{overviewField.value}</h2>
              <h5>{overviewField.display_name}</h5>
              <h6>{overviewField.units}</h6>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
