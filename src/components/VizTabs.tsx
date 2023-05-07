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

import { FC, useCallback, useEffect, useMemo, useState } from "react";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import useStore, { VizTab } from "../utils/store";

import VizContent from "./VizContent";
import EditTabDialog from "./EditTabDialog";

import "../scss/VizTabs.scss";
import { Tooltip } from "@mui/material";

interface TabPanelProps {
  index: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, index }) => {
  const activeTab = useStore((state) => state.activeTab);

  return (
    <div
      className="tab-panel"
      role="tabpanel"
      hidden={activeTab !== index}
      id={`viz-tabpanel-${index}`}
      aria-labelledby={`viz-tab-${index}`}
      style={{ borderRadius: "5px", borderTopLeftRadius: index === 0 ? "0" : "5px" }}
    >
      {activeTab === index && <div style={{ height: "100%" }}>{children}</div>}
    </div>
  );
};

interface VizTabButtonProps {
  tab: VizTab;
  defaultOpen?: boolean;
}

const VizTabButton: FC<VizTabButtonProps> = ({ tab }) => {
  const [editingTab, setEditingTab] = useStore(state => [state.editingTab, state.setEditingTab]);
  const [activeTab, setActiveTab] = useStore((state) => [state.activeTab, state.setActiveTab]);
  const setTab = useStore((state) => state.setTab);
  const [modifiedTab, setModifiedTab] = useState<VizTab>({ ...tab });

  const open = useMemo(() => editingTab !== null && editingTab === tab.id, [tab, editingTab]);

  const setOpen = useCallback((isOpen) => {
    if (isOpen) {
      setEditingTab(tab.id);
    } else {
      setEditingTab(null);
    }
  }, [setEditingTab, tab])

  useEffect(() => {
    setModifiedTab({ ...tab });
  }, [tab]);

  useEffect(() => {
    if (open) {
      const keypressListener = (evt: any) => {
        if (evt.code === "Enter" || evt.code === "NumpadEnter") {
          evt.preventDefault();
          setOpen(false);
          setTab(modifiedTab);
        }
      };
      document.addEventListener("keydown", keypressListener);
      return () => {
        document.removeEventListener("keydown", keypressListener);
      };
    }
  }, [open, modifiedTab, setTab, setOpen]);

  return (
    <>
      <div className={`viz-tab ${activeTab === tab.id ? "active" : ""}`}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <IconButton style={{ padding: 0 }} onClick={() => setOpen(!open)}>
            <EditIcon />
          </IconButton>
          <Tooltip title={modifiedTab && modifiedTab.label && modifiedTab.label.length > 25 ? modifiedTab.label : ""} style={{ background: "black" }}>
            <h5 style={{
              margin: "0 5px",
              cursor: "pointer",
              maxWidth: "200px",
              textOverflow: "ellipsis",
              display: "inline-block",
              whiteSpace: "nowrap",
              overflow: "hidden",
              fontSize: "16px"
            }} onClick={() => setActiveTab(tab.id)}>
              {modifiedTab.label}
            </h5>
          </Tooltip>
        </span>
      </div>

      <EditTabDialog open={open} setOpen={setOpen} modifiedTab={modifiedTab} setModifiedTab={setModifiedTab} />
    </>
  );
};

const VizTabs: FC = () => {
  const tabs = useStore((state) => state.tabs);
  const setTab = useStore((state) => state.setTab);
  const setEditingTab = useStore(state => state.setEditingTab);
  return (
    <div className="viz-tab-container">
      <div>
        <div className="tabs">
          {tabs.map((tab) => (
            <VizTabButton key={`${tab.id}-tab-button`} tab={tab} />
          ))}
          <div
            style={{
              padding: 0,
              color: "white",
              cursor: "pointer",
              paddingLeft: "5px",
              borderLeft: "1px solid rgba(255,255,255,0.23)",
            }}
          >
            <IconButton
              onClick={() => {
                let tabID = tabs.length;
                setTab({
                  id: tabID,
                  label: "",
                  topRow: [],
                  bottomRow: [],
                });
                setEditingTab(tabID)
              }}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div>
        {tabs.map((tab) => {
          return (
            <TabPanel key={`${tab.id}-tabpanel`} index={tab.id}>
              <VizContent tab={tab} />
            </TabPanel>
          );
        })}
      </div>
    </div>
  );
};

export default VizTabs;
