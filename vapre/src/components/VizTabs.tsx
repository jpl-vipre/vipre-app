import { FC, useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import "../scss/VizTabs.scss";
import useStore, { VizTab } from "../utils/store";

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
      {activeTab === index && <div>{children}</div>}
    </div>
  );
};

interface VizTabButtonProps {
  tab: VizTab;
}

const VizTabButton: FC<VizTabButtonProps> = ({ tab }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useStore((state) => [state.activeTab, state.setActiveTab]);
  return (
    <>
      <div className={`viz-tab ${activeTab === tab.id ? "active" : ""}`}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <IconButton style={{ padding: 0 }} onClick={() => setOpen(!open)}>
            <EditIcon />
          </IconButton>
          <h5 style={{ margin: "0 5px", cursor: "pointer" }} onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </h5>
        </span>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Tab Title</DialogTitle>
        <DialogContent>
          <TextField autoFocus id="title" label="title" type="text" fullWidth variant="standard" value={tab.label} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const VizTabs: FC = () => {
  const tabs = useStore((state) => state.tabs);
  const [activeTab, setActiveTab] = useStore((state) => [state.activeTab, state.setActiveTab]);
  console.log(activeTab, tabs);
  return (
    <div className="viz-tab-container">
      <div>
        <div className="tabs">
          {tabs.map((tab) => (
            <VizTabButton key={`${tab.id}-tab-button`} tab={tab} />
          ))}
        </div>
      </div>
      <div>
        {tabs.map((tab) => (
          <TabPanel key={`${tab.id}-tabpanel`} index={tab.id}>
            {tab.label}
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

export default VizTabs;
