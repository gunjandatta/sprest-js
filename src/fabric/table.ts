import { Fabric, ITable, ITableProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Table
 */
export const Table = (props: ITableProps): ITable => {
    // Returns the fabric component
    let get = (): Fabric.ITable => { return _table; }

    // Returns the selected table rows
    let getSelectedRows = () => { return _table.container.querySelectorAll("tbody>tr.is-selected") as any; }

    // Create the table
    props.el.innerHTML = Templates.Table(props);
    let _table: Fabric.ITable = new fabric.Table(props.el.querySelector(".ms-Table"));

    // Return the table
    return {
        get,
        getSelectedRows
    };
}