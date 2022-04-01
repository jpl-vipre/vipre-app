import { FC } from "react";

import "../scss/Overview.scss";

const Overview: FC = () => {
  const overviewFields = [
    {
      display_name: "Launch Date",
      field_name: "t_launch",
      units: "Years Past 2000",
      value: 34.63,
    },
    {
      display_name: "Arrival Date",
      field_name: "t_arr",
      units: "Years Past 2000",
      value: 42.8,
    },
    {
      display_name: "Arrival Mass",
      field_name: "m_arr",
      units: "Years Past 2000",
      value: 200.2,
    },
    {
      display_name: "Arrival V ∞",
      field_name: "v_inf_arr_x",
      units: "Vector X",
      value: 165.32,
    },
    {
      display_name: "Arrival V ∞",
      field_name: "v_inf_arr_y",
      units: "Vector Y",
      value: 84.53,
    },
    {
      display_name: "Arrival V ∞",
      field_name: "v_inf_arr_z",
      units: "Vector Z",
      value: 932.3,
    },
    {
      display_name: "Launch C3",
      field_name: "c3",
      units: "km2/s2",
      value: 12.54,
    },
    {
      display_name: "Total Cruise ΔV",
      field_name: "dv_total",
      units: "km/s",
      value: 67.24,
    },
  ];

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
