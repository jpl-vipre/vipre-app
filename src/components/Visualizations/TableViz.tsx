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

import useStore, { Entry, Trajectory } from "../../utils/store";
import "../../scss/TableViz.scss";

import * as math from "mathjs";
import withStyles from "@mui/styles/withStyles";

const styles = (theme: any) => ({
    tableStriped: {},
    toolbar: {},
});


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
        let flattenedRows = data.map((row) => {
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
            flattendColumns = Object.keys(flattenedRows[0]).map((column) => ({ name: column, title: column, wordWrapEnabled: true }));
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

    const [searchValue, setSearchValue] = useState("");

    const TooltipFormatter = (row: any) => {
        return (
            <Tooltip title={`${row.column.title}: ${row.value}`} style={{ zIndex: 999 }}>
                <span>
                    {typeof row.value === "number" ? math.round(row.value, 3) : row.value}
                </span>
            </Tooltip>
        );
    };

    const CellTooltip = (props: any) => (
        <DataTypeProvider
            for={columns.map(({ name }) => name)}
            formatterComponent={TooltipFormatter}
            {...props}
        />
    );

    const ToolbarComponentBase = ({ classes, ...restProps }: any) => {
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
    const ToolbarComponent = withStyles(styles, { name: "TableComponent" })(ToolbarComponentBase);

    return <div className="table-container" id={id}>
        <Grid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
        >
            <SelectionState
                selection={selection}
                onSelectionChange={setSelection}
            />
            <SearchState
                value={searchValue}
                onValueChange={setSearchValue}
            />
            <IntegratedFiltering />
            <SortingState
                defaultSorting={[{ columnName: 'id', direction: 'asc' }]}
            />
            <IntegratedSorting />
            <CellTooltip />
            <VirtualTable />
            <TableHeaderRow showSortingControls />
            <TableColumnVisibility />
            <TableSelection
                selectByRowClick
                highlightRow
                showSelectionColumn={false}
            />
            <Toolbar rootComponent={ToolbarComponent} />
            <SearchPanel />
            <ColumnChooser />
        </Grid>
    </div>;
};

export default TableViz;