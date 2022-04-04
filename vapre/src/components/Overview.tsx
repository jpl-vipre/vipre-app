import { FC, useMemo } from "react";

import useStore, { FilterField } from "../utils/store";

import "../scss/Overview.scss";

const exampleValues = [34.63, 42.8, 200.2, 165.32, 84.53, 932.41, 12.54, 67.24];

const nameRemapping: Record<string, Partial<FilterField>> = {
  t_launch: { display_name: "Launch Date", units: "Years Past 2000" },
  t_arr: { display_name: "Arrival Date", units: "Years Past 2000" },
  m_arr: { display_name: "Arrival Mass", units: "At arrival, kg" },
  v_inf_arr_x: { display_name: "Arrival V ∞", units: "Vector X" },
  v_inf_arr_y: { display_name: "Arrival V ∞", units: "Vector Y" },
  v_inf_arr_z: { display_name: "Arrival V ∞", units: "Vector Z" },
  c3: { display_name: "Launch C3", units: "km₂/s₂" },
  dv_total: { display_name: "Total Cruise ΔV", units: "km/s" },
};

const Overview: FC = () => {
  const trajectoryFields = useStore((state) => state.trajectoryFields);

  const overviewFields = useMemo(() => {
    return trajectoryFields.map((field, i) => {
      const remappedField: FilterField = {
        ...field,
        ...(nameRemapping[field.field_name] || {}),
      };
      return {
        display_name: remappedField.display_name,
        field_name: remappedField.field_name,
        units: remappedField.units || "",
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
