import { FC } from "react";

import "../scss/Overview.scss";

const Overview: FC = () => {
  return (
    <div className="overview-container">
      <div className="top" style={{ display: "flex" }}>
        <h1>Overview</h1>
        <div style={{ marginLeft: "auto" }}>Trajectory ID</div>
      </div>
      <div className="overview-list"></div>
    </div>
  );
};

export default Overview;
