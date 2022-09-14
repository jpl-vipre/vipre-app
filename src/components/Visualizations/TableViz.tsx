import { FC, useMemo, useState } from "react";

import {
    Column,
    SearchState,
    IntegratedFiltering,
    SelectionState,
    IntegratedSorting,
    SortingState,
    DataTypeProvider
} from '@devexpress/dx-react-grid';

import {
    Grid,
    VirtualTable,
    TableHeaderRow,
    Toolbar,
    SearchPanel,
    TableSelection,
    TableColumnVisibility,
    ColumnChooser
} from '@devexpress/dx-react-grid-material-ui';
import Tooltip from "@mui/material/Tooltip";

import ArrowDownward from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';

import * as math from "mathjs";
import withStyles from "@mui/styles/withStyles";

import useStore, { Entry, Trajectory } from "../../utils/store";
import "../../scss/TableViz.scss";
import { TextField } from "@mui/material";

const styles = (theme: any) => ({
    tableStriped: {},
    toolbar: {},
});

const SortingIcon = ({ direction }: { direction: string; }) => (
    direction === 'asc'
        ? <ArrowUpward style={{ fontSize: '18px' }} />
        : <ArrowDownward style={{ fontSize: '18px' }} />
);

const SortLabel = ({ onSort, children, direction }: { onSort: () => void; children: any; direction: string; }) => (
    <Tooltip title={children}>
        <div onClick={onSort} style={{ display: "flex", alignItems: "center", maxWidth: "100px", cursor: "pointer" }}>
            {children}
            {(direction && <SortingIcon direction={direction} />)}
        </div>
    </Tooltip>
);

const TooltipFormatter = (row: any) => {
    return (
        <Tooltip title={`${row.column.title}: ${row.value}`} style={{ zIndex: 999 }}>
            <span>
                {typeof row.value === "number" ? math.round(row.value, 3) : typeof row.value === "boolean" ? row.value ? "true" : "false" : row.value}
            </span>
        </Tooltip>
    );
};

const CellTooltip = ({ columns, ...props }: any) => (
    <DataTypeProvider
        for={columns.map(({ name }: { name: string }) => name)}
        formatterComponent={TooltipFormatter}
        {...props}
    />
);

const ToolbarComponentBase = ({ classes, dataSource, ...restProps }: any) => {
    let title = "";
    if (dataSource && dataSource.length > 0) {
        title = `${dataSource[0].toUpperCase()}${dataSource.slice(1)}`
    }
    return (
        <Toolbar.Root {...restProps} className={classes.toolbar}>
            <h4>{title}</h4>
            {restProps.children}
        </Toolbar.Root>
    );
};

// @ts-ignore
const SearchPanelInput = ({ value, onValueChange }) => {
    return (
        <TextField
            placeholder="Search..."
            variant="standard"
            autoFocus={value.length > 0}
            value={value}
            onChange={(evt) => onValueChange(evt.target.value)}
        />
    )
}

// @ts-ignore
const ToolbarComponent = withStyles(styles, { name: "TableComponent" })(ToolbarComponentBase);

interface TableVizProps {
    id: string;
    data: any[];
    dataSource: string;
}

const TableViz: FC<TableVizProps> = ({ id, data, dataSource }) => {
    const selectedTrajectory = useStore(state => state.selectedTrajectory);
    const setSelectedTrajectory = useStore(state => state.setSelectedTrajectory);
    const confirmedSelectedTrajectory = useStore(state => state.confirmedSelectedTrajectory);
    const [selectedEntries, setSelectedEntries] = useStore(state => [state.selectedEntries, state.setSelectedEntries]);

    const [searchValue, setSearchValue] = useState("");

    const selection = useMemo(() => {
        if (dataSource === "entries") {
            return selectedEntries.map((entry) => entry.id);
        } else if (dataSource === "trajectories" && selectedTrajectory) {
            return [selectedTrajectory.id];
        } else {
            return [];
        }
    }, [selectedTrajectory, selectedEntries, dataSource]);

    const [rows, columns] = useMemo(() => {
        let listData = Array.isArray(data) ? data : Object.entries(data).map(([title, body]: [string, any]) => ({ title, ...body }));

        let flattenedRows = listData.map((row: any) => {
            let flattenedRow: Record<string, string | number | null> = {};
            Object.entries(row).forEach(([column, value]: [string, any]) => {
                if (value && typeof value === "object" && Object.keys(value).length > 0) {
                    Object.entries(value).forEach(([key, subValue]: [string, any]) => {
                        flattenedRow[`${column}_${key}`] = subValue;
                    });
                } else {
                    flattenedRow[column] = value;
                }
            });

            return flattenedRow;
        });

        let flattendColumns: Column[] = [];
        if (flattenedRows.length > 0) {
            let longestColumnIndex = 0;
            flattenedRows.forEach((row, i) => {
                if (Object.keys(row).length > Object.keys(flattenedRows[longestColumnIndex]).length) {
                    longestColumnIndex = i;
                }
            })

            flattendColumns = Object.keys(flattenedRows[longestColumnIndex]).map((column) => ({ name: column, title: column, wordWrapEnabled: true }));
        }

        return [flattenedRows, flattendColumns];
    }, [data]);

    const setSelection = (ids: (string | number)[]) => {
        if (dataSource === "entries") {
            let entries = ids.map((id: string | number) => data[data.findIndex((row) => row.id === id)] as unknown as Entry);
            setSelectedEntries(entries);
        } else if (dataSource === "trajectories" && !confirmedSelectedTrajectory) {
            setSelectedTrajectory(data[data.findIndex((row) => row.id === ids[ids.length - 1])] as unknown as Trajectory, true);
        }
    };

    return <div className="table-container" id={id}>
        <Grid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
        >
            <SearchState
                value={searchValue}
                onValueChange={setSearchValue}
            />
            <SelectionState
                selection={selection}
                onSelectionChange={setSelection}
            />
            <IntegratedFiltering />
            <SortingState
                defaultSorting={[{ columnName: 'id', direction: 'asc' }]}
            />
            <IntegratedSorting />
            <CellTooltip columns={columns} />
            <VirtualTable />
            {/* @ts-ignore */}
            <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
            <TableColumnVisibility />
            <TableSelection
                selectByRowClick
                highlightRow
                showSelectionColumn={false}
            />
            <Toolbar rootComponent={(props) => <ToolbarComponent {...props} dataSource={dataSource} />} />
            <SearchPanel inputComponent={SearchPanelInput} />
            <ColumnChooser />
        </Grid>
    </div>;
};

export default TableViz;