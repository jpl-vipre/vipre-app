import { FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useStore, { VizTab } from "../utils/store";

import "../scss/NewTabDialog.scss";
import DialogGraphRow from "./DialogGraphRow";

interface NewTabDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  modifiedTab: VizTab;
  setModifiedTab: (modifiedTab: VizTab) => void;
}
const NewTabDialog: FC<NewTabDialogProps> = ({ open, setOpen, modifiedTab, setModifiedTab }) => {
  const [tabs, setTabs] = useStore((state) => [state.tabs, state.setTabs]);
  const setTab = useStore((state) => state.setTab);
  const setActiveTab = useStore((state) => state.setActiveTab);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="tab-dialog">
      <DialogTitle className="dialog-title">Tab {modifiedTab.id}</DialogTitle>
      <DialogContent className="tab-content">
        <TextField
          autoFocus
          className="tab-title-text"
          label="Title"
          type="text"
          fullWidth
          variant="standard"
          value={modifiedTab.label || ""}
          onChange={(evt) => {
            setModifiedTab({ ...modifiedTab, label: evt.target.value });
          }}
        />
        <div style={{ marginTop: "15px" }}>
          <div style={{ marginBottom: "15px" }}>
            <DialogGraphRow
              modifiedTab={modifiedTab}
              setModifiedTab={setModifiedTab}
              rowLabel="Top Row"
              rowName="topRow"
            />
          </div>
          <div>
            <DialogGraphRow
              modifiedTab={modifiedTab}
              setModifiedTab={setModifiedTab}
              rowLabel="Bottom Row"
              rowName="bottomRow"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions className="dialog-actions">
        <Button
          style={{ marginRight: "auto" }}
          color="error"
          variant="contained"
          disabled={tabs.length === 1}
          onClick={() => {
            setOpen(false);
            let filteredTabs = tabs.filter((tab) => tab.id !== modifiedTab.id);
            setTabs(filteredTabs);
            if (filteredTabs.length > 0) {
              setActiveTab(filteredTabs[0].id);
            }
          }}
        >
          Delete
        </Button>
        <Button
          style={{ color: "white" }}
          onClick={() => {
            setOpen(false);
            let existingTab = tabs.filter((tab) => tab.id === modifiedTab.id)[0];
            if (existingTab.label !== "") {
              setModifiedTab(existingTab);
            } else {
              setTabs(tabs.filter((tab) => tab.id !== modifiedTab.id));
            }
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

export default NewTabDialog;
