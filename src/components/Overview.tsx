import { FC, useMemo } from "react";

import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";

import * as math from 'mathjs'

import useStore from "../utils/store";

import "../scss/Overview.scss";
import { Tooltip } from "@mui/material";
import { digitToSuperScript } from "../utils/helpers";
import constants from "../utils/constants";

// Launch date: formatted string of t_launch
// Flight time: (t_arr - t_launch) / 365.25 yr
// Delivered mass: lv_poly(c3) / exp(total_dv / gIsp).lv_poly is a polynomial in c3 and gIsp is 3.2 km / s for a bi - prop engine. (For Falcon Heavy lv_poly = -0.005881 * c3 ^ 3 + 1.362 * c3 ^ 2 - 166.8 * c3 + 6676)
// Arrival v_inf magnitude: v_inf_mag = sqrt(v_inf_arr_x ^ 2 + v_inf_arr_y ^ 2 + v_inf_arr_z ^ 2)
// Arrival v_inf declination: asin[(pole_vec_x * v_inf_arr_x + pole_vec_y * v_inf_arr_y + pole_vec_z * v_inf_arr_z) / v_inf_mag] = asin[dot(pole_vec, v_inf_arr) / v_inf_mag]
// Distance to Earth: pos_earth_mag = sqrt(pos_earth_arr_x ^ 2 + pos_earth_arr_y ^ 2 + pos_earth_arr_z ^ 2)
// Sun_Earth_Body angle: acos[dot(-pos_earth_arr, pos_target_earth) / pos_earth_mag / pos_target_earth_mag], where pos_target_earth = pos_target_arr - pos_earth_arr

const Overview: FC = () => {
  const selectedTrajectory = useStore((state) => state.selectedTrajectory);
  const setSelectedTrajectory = useStore(state => state.setSelectedTrajectory);
  const setConfirmedSelectedTrajectory = useStore(state => state.setConfirmedSelectedTrajectory);
  const confirmedSelectedTrajectory = useStore(state => state.confirmedSelectedTrajectory);
  const fetchEntries = useStore(state => state.fetchEntries);
  const getLaunchVehicle = useStore(state => state.getLaunchVehicle);
  const launchVehicle = useMemo(() => {
    return getLaunchVehicle();
  }, [getLaunchVehicle])

  const overviewFields = useMemo(() => {
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
      vInfMag = Math.sqrt(Math.pow(selectedTrajectory.v_inf_arr_x, 2) + Math.pow(selectedTrajectory.v_inf_arr_y, 2) + Math.pow(selectedTrajectory.v_inf_arr_z, 2));
      if (selectedTrajectory?.target_body?.pole_vec_x && selectedTrajectory?.target_body?.pole_vec_y && selectedTrajectory?.target_body?.pole_vec_z) {
        let { pole_vec_x, pole_vec_y, pole_vec_z } = selectedTrajectory.target_body;
        vInfDeclination = Math.asin((pole_vec_x * selectedTrajectory.v_inf_arr_x + pole_vec_y * selectedTrajectory.v_inf_arr_y + pole_vec_z * selectedTrajectory.v_inf_arr_z) / vInfMag);
        vInfDeclination *= 180 / Math.PI;
      }
    }

    let distanceToEarth: string | number = "N/A";
    let sunEarthBodyAngle: string | number = "N/A";
    if (selectedTrajectory?.pos_earth_arr_x && selectedTrajectory?.pos_earth_arr_y && selectedTrajectory?.pos_earth_arr_z && selectedTrajectory?.pos_earth_arr_mag) {
      let pos_earth_mag = selectedTrajectory.pos_earth_arr_mag;
      let pos_target_earth_mag = selectedTrajectory.pos_target_arr_mag;

      let pos_earth_arr = math.matrix([selectedTrajectory.pos_earth_arr_x, selectedTrajectory.pos_earth_arr_y, selectedTrajectory.pos_earth_arr_z]);
      let pos_target_arr = math.matrix([selectedTrajectory.pos_target_arr_x, selectedTrajectory.pos_target_arr_y, selectedTrajectory.pos_target_arr_z]);

      let pos_target_earth: math.Matrix = math.subtract(pos_target_arr, pos_earth_arr);
      let pos_target_earth_pow: math.Matrix = math.dotPow(pos_target_earth, 2) as math.Matrix;

      // @ts-ignore
      distanceToEarth = math.round(math.divide(math.sqrt(math.sum(pos_target_earth_pow)), 1.496e+8), 2).toString();

      // @ts-ignore
      sunEarthBodyAngle = math.round(math.multiply(math.acos(math.dot(math.multiply(pos_earth_arr, -1), pos_target_earth) / pos_earth_mag / pos_target_earth_mag), (180 / Math.PI)), 2).toString();
    }

    // lv_poly(c3) / exp(total_dv / gIsp).lv_poly is a polynomial in c3 and gIsp is 3.2 km / s for a bi - prop engine. (For Falcon Heavy lv_poly = -0.005881 * c3 ^ 3 + 1.362 * c3 ^ 2 - 166.8 * c3 + 6676)
    // Default polynomial set to Falcon Heavy
    let deliveredMass: string | number = "N/A";
    let deliveredMassTooltip: string | number = "";
    if (selectedTrajectory?.c3 && selectedTrajectory?.interplanetary_dv && launchVehicle && launchVehicle.polynomial) {
      let launchVehiclePolynomial = launchVehicle.polynomial(selectedTrajectory.c3);
      let lvDeliveredMass = launchVehiclePolynomial / Math.exp(selectedTrajectory.interplanetary_dv / 3.2);
      if (lvDeliveredMass >= 0) {
        deliveredMass = lvDeliveredMass;
      } else {
        deliveredMass = "Invalid";
        deliveredMassTooltip = `Incompatible Launch Vehicle (${launchVehicle.name})`;
      }
    }

    let overview = [
      { display_name: "Launch Date", units: "Years Past 2000", value: launchDate, precision: 2 },
      { display_name: "Flight Time", units: "Years", value: flightTime, precision: 2 },
      { display_name: "Delivered Mass", units: "kg", value: deliveredMass, tooltip: deliveredMassTooltip, precision: 0 },
      { display_name: "Arrival V ∞ Magnitude", units: "km/s", value: vInfMag, precision: 3 },
      { display_name: "Arrival V ∞ Declination", units: "degrees", value: vInfDeclination, precision: 2 },
      { display_name: "Distance to Earth", units: "AU", value: distanceToEarth, precision: 2 },
      { display_name: "Sun/Earth Angle", units: "degrees", value: sunEarthBodyAngle, precision: 2 },
    ];

    return overview;
  }, [selectedTrajectory, launchVehicle]);

  const architectureSequence: string = useMemo(() => {
    // @ts-ignore
    if (selectedTrajectory && selectedTrajectory?.architecture && selectedTrajectory?.architecture?.sequence) {
      // @ts-ignore
      return selectedTrajectory.architecture.sequence.replace(/[0-9]{3,3}/g, (code) => constants.TARGET_BODY_CODES[Number(code)]);
    } else {
      return "N/A";
    }
  }, [selectedTrajectory])

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
          <b style={{ marginRight: "5px" }}>Flyby Sequence:</b>{architectureSequence}
        </div>
      </div>
      <div className="overview-list">
        {overviewFields.map((overviewField, i) => {
          let value: string | number = overviewField.value;
          if (typeof overviewField.value === "number") {
            value = math.round(overviewField.value, overviewField?.precision);
            if (`${value}`.length >= 10) {
              value = value.toPrecision(5);
            }
          }

          let tooltipMessage = `${overviewField.display_name}: ${overviewField.value} ${overviewField.units}`;
          if (overviewField.tooltip) {
            tooltipMessage = overviewField.tooltip;
          }

          return (
            <Tooltip title={tooltipMessage} disableHoverListener={overviewField.value === "N/A" && !overviewField.tooltip} key={`overview-${i}`}>
              <div key={overviewField.display_name} className="overview-field">
                <h2>{value}</h2>
                <h5>{overviewField.display_name}</h5>
                <h6>{overviewField.units.replace(/\^[0-9]/g, digitToSuperScript)}</h6>
              </div>
            </Tooltip>
          );
        })}
      </div>
    </div >
  );
};

export default Overview;
