import { FC, useState } from "react";

import {
    Grid,
    VirtualTable,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';

import "../../scss/TableViz.scss";

interface TableVizProps {
    id: string;
    data: any[];
    dataSource: string;
}

const TableViz: FC<TableVizProps> = ({ id, data, dataSource }) => {
    console.log("DATA", data);
    const [columns] = useState([
        // { name: 'id', title: 'ID' },
        // { name: 'name', title: 'Name' },
        // { name: 'gender', title: 'Gender' },
        // { name: 'city', title: 'City' },
        // { name: 'car', title: 'Car' },
    ]);
    const [rows] = useState([]);

    return <div className="table-container" id={id}>
        <Grid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id}
        >
            <VirtualTable />
            <TableHeaderRow />
        </Grid>
    </div>;
};

export default TableViz;