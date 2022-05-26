import { FC, useMemo } from "react";

import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";


import useStore, { FilterField, Trajectory } from "../utils/store";

import "../scss/Overview.scss";

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
  const selectedTrajectory = useStore((state) => state.selectedTrajectory);
  const setSelectedTrajectory = useStore(state => state.setSelectedTrajectory);
  const setConfirmedSelectedTrajectory = useStore(state => state.setConfirmedSelectedTrajectory);
  const confirmedSelectedTrajectory = useStore(state => state.confirmedSelectedTrajectory);

  const overviewFields = useMemo(() => {
    let fields: Partial<FilterField>[] = trajectoryFields && trajectoryFields.length > 0 ? trajectoryFields : Object.entries(nameRemapping).map(([key, value]) => ({ field_name: key, ...value }));
    return fields.map((field, i) => {
      const remappedField: Partial<FilterField> = {
        ...field,
        ...(nameRemapping[field.field_name!] || {}),
      };
      let rawValue = selectedTrajectory && Object.keys(selectedTrajectory).includes(remappedField.field_name as string) ? selectedTrajectory[remappedField.field_name as keyof Trajectory] : null;
      if (rawValue !== null && remappedField.units?.toLowerCase() === "years past 2000") {
        rawValue = (rawValue as number) / 60 / 60 / 24 / 365.25;
      }

      return {
        display_name: remappedField.display_name,
        field_name: remappedField.field_name,
        units: remappedField.units || "",
        value: rawValue !== null ? Math.round(rawValue * 100) / 100 : "N/A",
      };
    });
  }, [trajectoryFields, selectedTrajectory]);
  console.log(trajectoryFields, selectedTrajectory, overviewFields)
  return (
    <div className="overview-container">
      <div className="top" style={{ display: "flex", marginTop: "5px" }}>
        <h1>Overview</h1>
        <div style={{ marginLeft: "auto", background: "black", padding: "10px", borderRadius: "5px", display: "flex", alignItems: "center" }}>
          {selectedTrajectory && <div style={{ marginRight: "5px", display: "flex", alignItems: "center" }} className="close-button" onClick={() => {
            setSelectedTrajectory(null);
            setConfirmedSelectedTrajectory(false);
          }}>
            <CloseIcon style={{ fontSize: "18px", color: "#EB4D3E" }} />
          </div>}
          {selectedTrajectory && !confirmedSelectedTrajectory && <div style={{ marginRight: "5px", display: "flex", alignItems: "center" }} className="close-button" onClick={() => setConfirmedSelectedTrajectory(true)}>
            <CheckIcon style={{ fontSize: "18px", color: "#77D572" }} />
          </div>}
          <b style={{ marginRight: "5px" }}>Trajectory ID:</b>{selectedTrajectory ? selectedTrajectory.id : "N/A"}
        </div>
        <div style={{ marginLeft: "15px", marginRight: "5px", background: "black", padding: "10px", borderRadius: "5px", display: "flex", alignItems: "center" }}>
          <b style={{ marginRight: "5px" }}>Flyby Sequence:</b>N/A
        </div>
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
