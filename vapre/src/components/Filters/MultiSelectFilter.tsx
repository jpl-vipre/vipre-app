import { FC } from "react";
import { FormControl, Autocomplete, TextField, Chip } from "@mui/material";
import Reorder, { reorder } from "react-reorder";

import useStore, { FilterItem } from "../../utils/store";

import "../../scss/MultiSelectFilter.scss";

interface MultiSelectFilterProps {
  filter: FilterItem;
}

const MultiSelectFilter: FC<MultiSelectFilterProps> = ({ filter }) => {
  const setFilter = useStore((state) => state.setFilter);
  return (
    <FormControl fullWidth style={{ marginBottom: "15px" }}>
      <Autocomplete
        multiple
        id={`${filter.label}-multi-select`}
        options={filter.options!}
        getOptionLabel={(option) => option}
        filterSelectedOptions
        value={filter.value || []}
        onChange={(evt, values) => {
          setFilter({ ...filter, value: values });
        }}
        renderTags={(tags: readonly string[], getTagProps) => {
          return (
            <Reorder
              className="tag-order"
              reorderId={`tag-order-${filter.label}`}
              onReorder={(event: any, previousIndex: number, nextIndex: number) => {
                let newTagOrder = reorder([...tags], previousIndex, nextIndex);
                setFilter({ ...filter, value: newTagOrder });
              }}
              draggedClassName="dragged"
              placeholderClassName="tag-placeholder"
            >
              {tags.map((tag: string, index: number) => (
                <Chip variant="outlined" label={tag} {...getTagProps({ index })} />
              ))}
            </Reorder>
          );
        }}
        renderInput={(params) => <TextField {...params} label={filter.label} />}
      />
    </FormControl>
  );
};

export default MultiSelectFilter;
