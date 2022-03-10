import { FC, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import useStore, { FilterItem, VizTab } from "../utils/store";

import "../scss/EditFiltersDialog.scss";
import OutlinedContainer from "./OutlinedContainer";

const EditFilter: FC<{ filter: FilterItem }> = ({ filter }) => {
  return <div>{filter.label}</div>;
};

interface EditFiltersDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const EditFiltersDialog: FC<EditFiltersDialogProps> = ({ open, setOpen }) => {
  const [filterList, setFilterList] = useStore((state) => [state.filterList, state.setFilterList]);
  const setFilter = useStore((state) => state.setFilter);

  const [modifiedFilters, setModifiedFilters] = useState(filterList);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="filters-dialog">
      <DialogTitle className="filters-title">Filters</DialogTitle>
      <DialogContent className="filters-content">
        <OutlinedContainer label="Filters">
          {modifiedFilters.map((filter) => {
            return (
              <OutlinedContainer label={filter.label} style={{ marginBottom: "15px" }}>
                <EditFilter filter={filter} />
              </OutlinedContainer>
            );
          })}
        </OutlinedContainer>
      </DialogContent>
      <DialogActions className="filters-actions">
        <Button
          style={{ color: "white" }}
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          style={{ color: "white" }}
          onClick={() => {
            setOpen(false);
            setFilterList(modifiedFilters);
          }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFiltersDialog;
