/**
 * Copyright (c) 2021-2023 California Institute of Technology ("Caltech"). U.S.
 * Government sponsorship acknowledged.
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 * * Neither the name of Caltech nor its operating division, the Jet Propulsion
 *   Laboratory, nor the names of its contributors may be used to endorse or
 *   promote products derived from this software without specific prior written
 *   permission.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import { FC, useMemo, useState } from "react";

import { FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";

import useStore from "../utils/store";



import "../scss/Header.scss";

const { ipcRenderer } = window.require("electron");

const Header: FC<{ view: number; setView: (view: number) => void }> = ({ view, setView }) => {
  const [windowMaximized, setWindowMaximized] = useState(false);
  const targetBodies = useStore((state) => state.targetBodies);
  const targetedBodies = useStore((state) => state.targetedBodies);
  const searchTrajectories = useStore((state) => state.searchTrajectories);

  const [targetBody, setTargetBody] = useStore(state => [state.targetBody, state.setTargetBody])

  const targetBodyProps = useMemo(() => {
    if (!targetBody) return { icon: "", map: "", id: "" };
    return targetBodies[targetBody];
  }, [targetBody, targetBodies]);

  return (
    <header>
      <span className="target-select">
        {targetBodyProps && targetBodyProps.icon ? (
          <img src={targetBodyProps.icon} alt={`${targetBodyProps.id} target`} />
        ) : (
          <span className="img-placeholder" />
        )}
        {targetBodyProps && (
          <FormControl fullWidth style={{ minWidth: "200px", marginBottom: 0 }} className="target-body-select">
            <InputLabel id={"target-body-select-label"}>Target Body</InputLabel>
            <Select
              variant="standard"
              style={{ textAlign: "left", paddingLeft: "5px" }}
              labelId={"target-body-select-label"}
              id={"target-body-select"}
              value={targetBody}
              label="Target Body"
              onChange={(evt) => {
                setTargetBody(evt.target.value);
                searchTrajectories();
              }}
            >
              {targetedBodies.filter((body) => body.targeted).map((body) => (
                <MenuItem value={body.name} key={`filter-${body.name}-${body.id}`}>
                  {body.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </span>
      <span
        className="title-container"
        onDoubleClick={() => {
          if (windowMaximized) {
            ipcRenderer.send("unmaximize-app-window");
            setWindowMaximized(false);
          } else {
            ipcRenderer.send("maximize-app-window");
            setWindowMaximized(true);
          }
        }}
      >
        <h1>VIPRE</h1>
        <h5>Visualization of the Impact of PRobe Entry conditions on the science, mission and spacecraft design</h5>
      </span>
      <Tooltip title={view === 0 ? "Settings" : "Dashboard"}>
        <IconButton
          style={{ position: "absolute", right: "5px" }}
          onClick={() => {
            setView(view === 0 ? 1 : 0);
          }}
        >
          {view === 0 ? <SettingsIcon fontSize="large" /> : <DashboardIcon fontSize="large" />}
        </IconButton>
      </Tooltip>
    </header>
  );
};

export default Header;
