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

import { FC, useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, MenuItem, Select, IconButton } from "@mui/material";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import useStore, { FilterItem } from "../utils/store";
import constants from "../utils/constants";
import OutlinedContainer from "./OutlinedContainer";
import AllFieldsSelect from "./AllFieldsSelect";

import "../scss/EditFiltersDialog.scss";

interface SearchSelectProps {
  onDeleteOption: (item: string) => void;
  value: string;
  options: any[];
  onChange: (newValue: string) => void;
  itemName?: string;
  label?: string;
  className?: string;
  style?: any;
}

const SearchSelect: FC<SearchSelectProps> = ({
  onDeleteOption,
  value,
  options,
  onChange,
  itemName = "index",
  label = "ElasticSearch Index",
  className = "",
  style = {},
}) => {
  const filter = createFilterOptions();

  return (
    <Autocomplete
      className={className}
      style={{ width: "100%", ...style }}
      freeSolo
      // @ts-ignore
      filterOptions={(options, params) => {
        // @ts-ignore
        const filtered = filter(options, params);

        const { inputValue } = params;
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}" ${itemName}`,
          });
        }

        return filtered;
      }}
      getOptionLabel={(option) => {
        if (typeof option === "string") {
          return option;
        }
        if (option.inputValue !== undefined && option.inputValue !== null) {
          return option.inputValue;
        }
        return option.title;
      }}
      renderOption={(props, option) => (
        <span style={{ display: "flex", alignItems: "center", position: "relative" }}>
          <li {...props} style={{ flex: 1 }}>
            {option.title}
          </li>
          <span className="delete-index-btn" style={{ position: "absolute", right: "5px" }}>
            <ClearIcon onClick={() => onDeleteOption(option.inputValue)} />
          </span>
        </span>
      )}
      value={value}
      options={options}
      renderInput={(params) => <TextField {...params} variant="outlined" label={label} />}
      onChange={(evt, newValue) => {
        if (newValue && (newValue as any)["inputValue"]) {
          let validNewValue = (newValue as any)["inputValue"];
          onChange(validNewValue);
        }
      }}
    />
  );
};

const EditFilter: FC<{ filter: FilterItem; setFilter: (filter: FilterItem) => void; deleteFilter: () => void }> = ({
  filter,
  setFilter,
  deleteFilter,
}) => {
  // @ts-ignore
  const filterOptions: any = ({ ...constants.FILTER_TYPES[filter.type] } as any) || {};
  const schemas = useStore(state => state.schemas);

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
            if (schemas && schemas[value] && schemas[value]["units"]) {
              setFilter({ ...filter, dataField: value, units: schemas[value]["units"] });
            } else {
              setFilter({ ...filter, dataField: value });
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
            console.log(filter.type)
            setFilter({ ...filter, type: evt.target.value, value: newValue, initial: true });
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
            value={filter.step !== null ? filter.step : 1}
            style={{ margin: "5px" }}
            onChange={(evt) => {
              let value = isNaN(parseFloat(evt.target.value)) ? evt.target.value : parseFloat(evt.target.value);
              // @ts-ignore
              setFilter({ ...filter, step: value });
            }}
          />
        )}
      </div>
      <div style={{ display: "flex", margin: "5px" }}>
        {["select"].includes(filter.type) && (
          <SearchSelect
            label="Options"
            itemName="Option"
            value={""}
            options={(filter?.options || []).map((option: string | number | boolean) => ({ inputValue: option, title: option }))}
            onDeleteOption={(option) => {
              // @ts-ignore
              let newOptions = (filter?.options || []).filter((filterOption: any) => filterOption !== option)
              setFilter({ ...filter, options: newOptions });
            }}
            onChange={(option) => {
              let value = isNaN(parseFloat(option)) ? option : parseFloat(option);
              setFilter({ ...filter, options: Array.from(new Set([...(filter?.options || []), value])) });
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
              setFilter({ ...filter, min: value, value: [value, filter.max || 0], initial: true });
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
              setFilter({ ...filter, max: value, value: [filter.min || 0, value], initial: true });
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

  const [modifiedFilters, setModifiedFilters] = useState(JSON.parse(JSON.stringify(filterList)) as FilterItem[]);

  useEffect(() => {
    setModifiedFilters(JSON.parse(JSON.stringify(filterList)));
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
