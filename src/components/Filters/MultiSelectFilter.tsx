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
        id={`${filter.label.replace(/ /g, "-").toLowerCase()}-multi-select`}
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
              reorderId={`tag-order-${filter.label.replace(/ /g, "-").toLowerCase()}`}
              onReorder={(event: any, previousIndex: number, nextIndex: number) => {
                let newTagOrder = reorder([...tags], previousIndex, nextIndex);
                setFilter({ ...filter, value: newTagOrder.join("-") });
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
