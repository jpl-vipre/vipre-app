import { FC, useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select, IconButton } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import useStore, { FilterItem } from "../utils/store";
import constants from "../utils/constants";
import OutlinedContainer from "./OutlinedContainer";
import AllFieldsSelect from "./AllFieldsSelect";

import "../scss/EditFiltersDialog.scss";

const EditFilter: FC<{ filter: FilterItem; setFilter: (filter: FilterItem) => void; deleteFilter: () => void }> = ({
  filter,
  setFilter,
  deleteFilter,
}) => {
  // @ts-ignore
  const filterOptions: any = (constants.FILTER_TYPES[filter.type] as any) || {};
  const schemas = useStore(state => state.schemas)

  return (
    <div>
      <div style={{ display: "flex" }}>
        <TextField
          autoFocus
          className="filter-label-text"
          label="Filter Label"
          type="text"
          fullWidth
          variant="standard"
          value={filter.label || ""}
          style={{ margin: "5px" }}
          onChange={(evt) => {
            setFilter({ ...filter, label: evt.target.value });
          }}
        />
        <AllFieldsSelect
          value={filter.dataField}
          label="Data Field"
          onChange={(value) => {
            setFilter({ ...filter, dataField: value });
            if (schemas && schemas[value] && schemas[value]["units"]) {
              setFilter({ ...filter, units: schemas[value]["units"] });
            }
          }}
        />
      </div>
      <FormControl fullWidth style={{ margin: "5px" }}>
        <InputLabel id="filter-type-label">Filter Type</InputLabel>
        <Select
          variant="standard"
          style={{ textAlign: "left", paddingLeft: "5px" }}
          labelId="filter-type-label"
          value={filter.type}
          label="Filter Type"
          onChange={(evt: any) => {
            let newValue = filter.value;
            if (evt.target.value === "slider-range" && filter.type !== "slider-range") {
              newValue = [filter.min || 0, filter.max || 0];
            }

            setFilter({ ...filter, type: evt.target.value, value: newValue });
          }}
        >
          {Object.entries(constants.FILTER_TYPES).map(([filterType, options], i) => {
            return (
              <MenuItem key={`${filter.id}-${filterType}-${i}`} value={filterType}>
                {options.label}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <div style={{ display: "flex", margin: "5px" }}>
        {filterOptions.units && (
          <TextField
            autoFocus
            className="filter-units-text"
            label="Units"
            type="text"
            fullWidth
            variant="standard"
            value={filter.units || ""}
            style={{ margin: "5px" }}
            onChange={(evt) => {
              setFilter({ ...filter, units: evt.target.value });
            }}
          />
        )}
        {filterOptions.step && (
          <TextField
            autoFocus
            className="filter-step-text"
            label="Step"
            type="number"
            fullWidth
            variant="standard"
            value={filter.step || 1}
            style={{ margin: "5px" }}
            onChange={(evt) => {
              setFilter({ ...filter, step: parseFloat(evt.target.value) as number });
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", margin: "5px" }}>
        {filterOptions.range && (
          <TextField
            autoFocus
            className="filter-min-text"
            label="Min"
            type="number"
            fullWidth
            variant="standard"
            value={filter.min}
            style={{ margin: "5px" }}
            onChange={(evt) => {
              let value = isNaN(parseFloat(evt.target.value)) ? evt.target.value : parseFloat(evt.target.value);
              // @ts-ignore
              setFilter({ ...filter, min: value });
            }}
          />
        )}
        {filterOptions.range && (
          <TextField
            autoFocus
            className="filter-max-text"
            label="Max"
            type="number"
            fullWidth
            variant="standard"
            value={filter.max}
            style={{ margin: "5px" }}
            onChange={(evt) => {
              let value = isNaN(parseFloat(evt.target.value)) ? evt.target.value : parseFloat(evt.target.value);
              // @ts-ignore
              setFilter({ ...filter, max: value });
            }}
          />
        )}
      </div>
      <div style={{ display: "flex" }}>
        <IconButton
          onClick={() => {
            deleteFilter();
          }}
          style={{ marginLeft: "auto" }}
        >
          <RemoveCircleOutlineIcon color="error" />
        </IconButton>
      </div>
    </div>
  );
};

interface EditFiltersDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const EditFiltersDialog: FC<EditFiltersDialogProps> = ({ open, setOpen }) => {
  const [filterList, setFilterList] = useStore((state) => [state.filterList, state.setFilterList]);

  const [modifiedFilters, setModifiedFilters] = useState(filterList);

  useEffect(() => {
    setModifiedFilters(filterList)
  }, [filterList])

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="filters-dialog">
      <DialogTitle className="filters-title">Filters</DialogTitle>
      <DialogContent className="filters-content">
        <OutlinedContainer label="Filters">
          {modifiedFilters.map((modifiedFilter, i) => {
            return (
              <OutlinedContainer
                key={`${modifiedFilter.id}-${i}`}
                label={modifiedFilter.label || "-"}
                style={{ marginBottom: "15px" }}
              >
                <EditFilter
                  filter={modifiedFilter}
                  setFilter={(filter) => {
                    let filterIndex = modifiedFilters.findIndex((existingFilter) => existingFilter.id === filter.id);
                    if (filterIndex === -1) {
                      setModifiedFilters([...modifiedFilters, filter]);
                    } else {
                      setModifiedFilters([
                        ...modifiedFilters.slice(0, filterIndex),
                        filter,
                        ...modifiedFilters.slice(filterIndex + 1),
                      ]);
                    }
                  }}
                  deleteFilter={() => {
                    setModifiedFilters(modifiedFilters.filter((filter) => filter.id !== modifiedFilter.id));
                  }}
                />
              </OutlinedContainer>
            );
          })}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={() => {
                let newFilters = [
                  ...modifiedFilters,
                  {
                    id: modifiedFilters.length,
                    label: "",
                    dataField: "",
                    type: "",
                    options: [],
                    value: "",
                    defaultValue: "",
                    units: "",
                    step: 0,
                    min: 0,
                    max: 0,
                    hidden: false,
                  },
                ];
                setModifiedFilters(newFilters);
              }}
              style={{ margin: "auto" }}
            >
              <AddIcon />
            </IconButton>
          </div>
        </OutlinedContainer>
      </DialogContent>
      <DialogActions className="filters-actions">
        <Button
          style={{ color: "white" }}
          onClick={() => {
            setOpen(false);
            setModifiedFilters(filterList);
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
