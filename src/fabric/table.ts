import { Fabric, ITable, ITableProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Table
 */
export const Table = (props: ITableProps):ITable => {
    // Create the table
    props.el.innerHTML = Templates.Table(props);
    let _table: Fabric.ITable = new fabric.Table(props.el.querySelector(".ms-Table"));

    // Return the table
    return _table;
}