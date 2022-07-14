import { FC, useMemo } from "react";

import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";


import useStore, { FilterField, Trajectory } from "../utils/store";

import "../scss/Overview.scss";
import { Tooltip } from "@mui/material";

// Launch date: formatted string of t_launch
// Flight time: (t_arr - t_launch) / 365.25 yr
// Delivered mass: lv_poly(c3) / exp(total_dv / gIsp).lv_poly is a polynomial in c3 and gIsp is 3.2 km / s for a bi - prop engine. (For Falcon Heavy lv_poly = -0.005881 * c3 ^ 3 + 1.362 * c3 ^ 2 - 166.8 * c3 + 6676)
// Arrival v_inf magnitude: v_inf_mag = sqrt(v_inf_arr_x ^ 2 + v_inf_arr_y ^ 2 + v_inf_arr_z ^ 2)
// Arrival v_inf declination: asin[(pole_vec_x * v_inf_arr_x + pole_vec_y * v_inf_arr_y + pole_vec_z * v_inf_arr_z) / v_inf_mag] = asin[dot(pole_vec, v_inf_arr) / v_inf_mag]
// Distance to Earth: pos_earth_mag = sqrt(pos_earth_arr_x ^ 2 + pos_earth_arr_y ^ 2 + pos_earth_arr_z ^ 2)
// Sun_Earth_Body angle: acos[dot(-pos_earth_arr, pos_target_earth) / pos_earth_mag / pos_target_earth_mag], where pos_target_earth = pos_target_arr - pos_earth_arr

// const nameRemapping: Record<string, Partial<FilterField>> = {
//   t_launch: { display_name: "Launch Date", units: "Years Past 2000" },
//   t_arr: { display_name: "Arrival Date", units: "Years Past 2000" },
//   // m_arr: { display_name: "Arrival Mass", units: "At arrival, kg" },
//   v_inf_arr_x: { display_name: "Arrival V ∞", units: "Vector X" },
//   v_inf_arr_y: { display_name: "Arrival V ∞", units: "Vector Y" },
//   v_inf_arr_z: { display_name: "Arrival V ∞", units: "Vector Z" },
//   c3: { display_name: "Launch C3", units: "km₂/s₂" },
//   dv_total: { display_name: "Total Cruise ΔV", units: "km/s" },
// };

const Overview: FC = () => {
  // const trajectoryFields = useStore((state) => state.trajectoryFields);
  const selectedTrajectory = useStore((state) => state.selectedTrajectory);
  const setSelectedTrajectory = useStore(state => state.setSelectedTrajectory);
  const setConfirmedSelectedTrajectory = useStore(state => state.setConfirmedSelectedTrajectory);
  const confirmedSelectedTrajectory = useStore(state => state.confirmedSelectedTrajectory);
  const fetchEntries = useStore(state => state.fetchEntries);

  const overviewFields = useMemo(() => {
    // let fields: Partial<FilterField>[] = trajectoryFields && trajectoryFields.length > 0 ? trajectoryFields : Object.entries(nameRemapping).map(([key, value]) => ({ field_name: key, ...value }));
    // return fields.map((field, i) => {
    //   const remappedField: Partial<FilterField> = {
    //     ...field,
    //     ...(nameRemapping[field.field_name!] || {}),
    //   };
    //   let rawValue = selectedTrajectory && Object.keys(selectedTrajectory).includes(remappedField.field_name as string) ? selectedTrajectory[remappedField.field_name as keyof Trajectory] : null;
    //   if (rawValue !== null && remappedField.units?.toLowerCase() === "years past 2000") {
    //     rawValue = (rawValue as number) / 60 / 60 / 24 / 365.25;
    //   }

    //   return {
    //     display_name: remappedField.display_name,
    //     field_name: remappedField.field_name,
    //     units: remappedField.units || "",
    //     value: rawValue !== null ? Math.round(rawValue * 100) / 100 : "N/A",
    //   };
    // });

    let launchDate: string | number = "N/A";
    let flightTime: string | number = "N/A";
    if (selectedTrajectory?.t_launch !== undefined) {
      launchDate = selectedTrajectory.t_launch / 60 / 60 / 24 / 365.25;

      if (selectedTrajectory?.t_arr !== undefined) {
        flightTime = (selectedTrajectory.t_arr - selectedTrajectory.t_launch) / 60 / 60 / 24 / 365.25;
      }
    }

    let vInfMag: string | number = "N/A";
    let vInfDeclination: string | number = "N/A";
    if (selectedTrajectory?.v_inf_arr_x !== undefined && selectedTrajectory?.v_inf_arr_y !== undefined && selectedTrajectory?.v_inf_arr_z !== undefined) {
      vInfMag = Math.sqrt(Math.pow(selectedTrajectory.v_inf_arr_x, 2) + Math.pow(selectedTrajectory.v_inf_arr_y, 2) + Math.pow(selectedTrajectory.v_inf_arr_z, 2))
      if (selectedTrajectory?.target_body?.pole_vec_x && selectedTrajectory?.target_body?.pole_vec_y && selectedTrajectory?.target_body?.pole_vec_z) {
        let poleVecX = selectedTrajectory.target_body.pole_vec_x;
        let poleVecY = selectedTrajectory.target_body.pole_vec_y;
        let poleVecZ = selectedTrajectory.target_body.pole_vec_z;
        vInfDeclination = Math.asin((poleVecX * selectedTrajectory.v_inf_arr_x + poleVecY * selectedTrajectory.v_inf_arr_y + poleVecZ * selectedTrajectory.v_inf_arr_z) / vInfMag)
      }
    }

    let distanceToEarth: string | number = "N/A";
    if (selectedTrajectory?.pos_earth_arr_x && selectedTrajectory?.pos_earth_arr_y && selectedTrajectory?.pos_earth_arr_z) {
      distanceToEarth = Math.sqrt(Math.pow(selectedTrajectory.pos_earth_arr_x, 2) + Math.pow(selectedTrajectory.pos_earth_arr_y, 2) + Math.pow(selectedTrajectory.pos_earth_arr_z, 2))
    }

    // {
    //   "id": 1,
    //   "t_launch": 947246400,
    //   "dv_total": 4.852789611089975,
    //   "v_inf_arr_x": -6.337404727935791,
    //   "v_inf_arr_y": 5.546535015106201,
    //   "v_inf_arr_z": 0.14643369615077972,
    //   "t_arr": 1159012800,
    //   "c3": 99.6667924525816,
    //   "target_body": {
    //     "id": 699,
    //     "name": "Saturn",
    //     "radius": 60330,
    //     "mu": 37931206.15901047,
    //     "period": 0.4440092592388495,
    //     "pole_vec_x": 0.08550088186448726,
    //     "pole_vec_y": 0.46243921950794104,
    //     "pole_vec_z": 0.882518876546718
    //   },
    //   "architecture": {
    //     "sequence": "399 - 599 - 699"
    //   },
    //   "occultations": [
    //     {
    //       "id": 0
    //     }
    //   ],
    //   "flybys": [
    //     {
    //       "flyby_body": {
    //         "id": 699,
    //         "name": "Saturn",
    //         "radius": 60330,
    //         "mu": 37931206.15901047,
    //         "period": 0.4440092592388495,
    //         "pole_vec_x": 0.08550088186448726,
    //         "pole_vec_y": 0.46243921950794104,
    //         "pole_vec_z": 0.882518876546718
    //       },
    //       "order": 1,
    //       "t_flyby": 1000641600
    //     },
    //     {
    //       "flyby_body": {
    //         "id": 699,
    //         "name": "Saturn",
    //         "radius": 60330,
    //         "mu": 37931206.15901047,
    //         "period": 0.4440092592388495,
    //         "pole_vec_x": 0.08550088186448726,
    //         "pole_vec_y": 0.46243921950794104,
    //         "pole_vec_z": 0.882518876546718
    //       },
    //       "order": 2,
    //       "t_flyby": 1159012800
    //     }
    //   ]
    // }

    let overview = [
      { display_name: "Launch Date", units: "Years Past 2000", value: launchDate },
      { display_name: "Flight Time", units: "Years", value: flightTime },
      { display_name: "Delivered Mass", units: "kg", value: "N/A" },
      { display_name: "Arrival V ∞ Magnitude", units: "km/s", value: vInfMag },
      { display_name: "Arrival V ∞ Declination", units: "km/s", value: vInfDeclination },
      { display_name: "Distance to Earth", units: "km", value: distanceToEarth },
      { display_name: "Sun/Earth Body Angle", units: "degrees", value: "N/A" },
    ];

    return overview;
  }, [selectedTrajectory]);
  // }, [trajectoryFields, selectedTrajectory]);

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
          {selectedTrajectory && !confirmedSelectedTrajectory &&
            <div
              style={{ marginRight: "5px", display: "flex", alignItems: "center" }}
              className="close-button"
              onClick={() => {
                setConfirmedSelectedTrajectory(true);
                fetchEntries();
              }}>
              <CheckIcon style={{ fontSize: "18px", color: "#77D572" }} />
            </div>
          }
          <b style={{ marginRight: "5px" }}>Trajectory ID:</b>{selectedTrajectory ? selectedTrajectory.id : "N/A"}
        </div>
        <div style={{ marginLeft: "15px", marginRight: "5px", background: "black", padding: "10px", borderRadius: "5px", display: "flex", alignItems: "center" }}>
          <b style={{ marginRight: "5px" }}>Flyby Sequence:</b>N/A
        </div>
      </div>
      <div className="overview-list">
        {overviewFields.map((overviewField) => {
          return (
            <Tooltip title={`${overviewField.display_name}: ${overviewField.value} ${overviewField.units}`} disableHoverListener={overviewField.value === "N/A"}>
              <div key={overviewField.display_name} className="overview-field">
                <h2>{typeof overviewField.value === "number" ? Math.round(overviewField.value * 100) / 100 : overviewField.value}</h2>
                <h5>{overviewField.display_name}</h5>
                <h6>{overviewField.units}</h6>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div >
  );
};

export default Overview;
