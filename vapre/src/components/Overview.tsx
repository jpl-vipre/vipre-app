import { FC } from "react";

import "../scss/Overview.scss";

const Overview: FC = () => {
  // const overviewFields = [
  //   {
  //     "field": "launchDate",
  //     "label": "Launch Date",
  //     "units": "Years Past 2000",
  //     "value": 34.63
  //   }
  // ]
  
  return (
    <div className="overview-container">
      <div className="top" style={{ display: "flex" }}>
        <h1>Overview</h1>
        <div style={{ marginLeft: "auto" }}>Trajectory ID</div>
      </div>
      <div className="overview-list">
        {/* {
          overviewFields.map((overviewField) => {
            return (
              <div key={overviewField.field} className="overview-field">
                <h2>{overviewField.value}</h2>
                <div>{overviewField.label}</div>
                <div>{overviewField.units}</div>
              </div>
            )
          })
        } */}
      </div>
    </div>
  );
};

export default Overview;
