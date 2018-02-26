import { Fabric, ITableProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Table
 */
export const Table = (props: ITableProps) => {
    // Create the table
    props.el.innerHTML = Templates.Dialog(props);
    let _table: Fabric.ITable = new fabric.Table(props.el.querySelector(".ms-Table"));

    // Return the dialog
    return _table;
}