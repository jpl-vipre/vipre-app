import { FC, useEffect, useState } from "react";

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
import AddIcon from "@mui/icons-material/Add";

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

interface NewTabDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  modifiedTab: VizTab;
  setModifiedTab: (modifiedTab: VizTab) => void;
}

const NewTabDialog: FC<NewTabDialogProps> = ({ open, setOpen, modifiedTab, setModifiedTab }) => {
  const tabs = useStore((state) => state.tabs);
  const setTab = useStore((state) => state.setTab);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="tab-dialog">
      <DialogTitle className="dialog-title">Tab Title</DialogTitle>
      <DialogContent className="tab-content">
        <TextField
          autoFocus
          className="tab-title-text"
          label="title"
          type="text"
          fullWidth
          variant="standard"
          value={modifiedTab.label}
          onChange={(evt) => {
            setModifiedTab({ ...modifiedTab, label: evt.target.value });
          }}
        />
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button
          style={{ color: "white" }}
          onClick={() => {
            setOpen(false);
            setModifiedTab(tabs.filter((tab) => tab.id === modifiedTab.id)[0]);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          style={{ color: "white" }}
          onClick={() => {
            setOpen(false);
            setTab(modifiedTab);
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface VizTabButtonProps {
  tab: VizTab;
  defaultOpen?: boolean;
}

const VizTabButton: FC<VizTabButtonProps> = ({ tab, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useStore((state) => [state.activeTab, state.setActiveTab]);
  const setTab = useStore((state) => state.setTab);
  const [modifiedTab, setModifiedTab] = useState<VizTab>(tab);

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
          <h5 style={{ margin: "0 5px", cursor: "pointer" }} onClick={() => setActiveTab(tab.id)}>
            {modifiedTab.label}
          </h5>
        </span>
      </div>

      <NewTabDialog open={open} setOpen={setOpen} modifiedTab={modifiedTab} setModifiedTab={setModifiedTab} />
    </>
  );
};

const VizTabs: FC = () => {
  const tabs = useStore((state) => state.tabs);
  const setTab = useStore((state) => state.setTab);
  const [activeTab, setActiveTab] = useStore((state) => [state.activeTab, state.setActiveTab]);
  const [newTabID, setNewTabID] = useState<number>(-1);
  return (
    <div className="viz-tab-container">
      <div>
        <div className="tabs">
          {tabs.map((tab) => (
            <VizTabButton key={`${tab.id}-tab-button`} tab={tab} defaultOpen={newTabID === tab.id} />
          ))}
          <IconButton
            style={{ padding: 0, color: "white", cursor: "pointer", marginLeft: "5px" }}
            onClick={() => {
              let tabID = tabs.length;
              setTab({
                id: tabID,
                label: "",
                topRow: [],
                bottomRow: [],
              });
              setNewTabID(tabID);
            }}
          >
            <AddIcon />
          </IconButton>
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
