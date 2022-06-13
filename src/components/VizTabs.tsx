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
              overflow: "hidden"
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
