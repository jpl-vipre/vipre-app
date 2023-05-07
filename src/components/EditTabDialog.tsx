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

import { FC } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useStore, { VizTab } from "../utils/store";

import "../scss/EditTabDialog.scss";
import DialogGraphRow from "./DialogGraphRow";

interface EditTabDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  modifiedTab: VizTab;
  setModifiedTab: (modifiedTab: VizTab) => void;
}
const EditTabDialog: FC<EditTabDialogProps> = ({ open, setOpen, modifiedTab, setModifiedTab }) => {
  const [tabs, setTabs] = useStore((state) => [state.tabs, state.setTabs]);
  const setTab = useStore((state) => state.setTab);
  const setActiveTab = useStore((state) => state.setActiveTab);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="tab-dialog">
      <DialogTitle className="dialog-title">Tab {modifiedTab.id + 1}</DialogTitle>
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

export default EditTabDialog;
