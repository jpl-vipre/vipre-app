import { FC, useMemo } from "react";

import useStore, { FilterField } from "../utils/store";

import "../scss/Overview.scss";

const exampleValues = [34.63, 42.8, 200.2, 165.32, 84.53, 932.41, 12.54, 67.24];

const nameRemapping: Record<string, Partial<FilterField>> = {
  t_launch: { display_name: "Launch Date", units: "Years Past 2000" },
  t_arr: { display_name: "Arrival Date", units: "Years Past 2000" },
  // m_arr: { display_name: "Arrival Mass", units: "At arrival, kg" },
  v_inf_arr_x: { display_name: "Arrival V ∞", units: "Vector X" },
  v_inf_arr_y: { display_name: "Arrival V ∞", units: "Vector Y" },
  v_inf_arr_z: { display_name: "Arrival V ∞", units: "Vector Z" },
  c3: { display_name: "Launch C3", units: "km₂/s₂" },
  dv_total: { display_name: "Total Cruise ΔV", units: "km/s" },
};

const Overview: FC = () => {
  const trajectoryFields = useStore((state) => state.trajectoryFields);

  const overviewFields = useMemo(() => {
    let fields: Partial<FilterField>[] = trajectoryFields && trajectoryFields.length > 0 ? trajectoryFields : Object.entries(nameRemapping).map(([key, value]) => ({ field_name: key, ...value }));
    console.log(fields)
    return fields.map((field, i) => {
      const remappedField: Partial<FilterField> = {
        ...field,
        ...(nameRemapping[field.field_name!] || {}),
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
      <div className="top" style={{ display: "flex", marginTop: "5px" }}>
        <h1>Overview</h1>
        <div style={{ marginLeft: "auto", background: "black", padding: "5px", borderRadius: "5px" }}><b>Trajectory ID:</b> 12345</div>
        <div style={{ marginLeft: "15px", marginRight: "5px", background: "black", padding: "5px", borderRadius: "5px" }}><b>Flyby Sequence:</b> 123-456-789</div>
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