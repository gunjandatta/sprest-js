import { Fabric, IDropdownOption, IProps } from ".";

/**
 * Table
 */
export interface ITable {
    /** Returns the fabric component. */
    get(): Fabric.ITable;

    /** Returns the selected rows. */
    getSelectedRows(): Array<HTMLTableRowElement>;
}

/**
 * Table Properties
 */
export interface ITableProps extends IProps {
    /** The column labels. */
    columns?: Array<string>;

    /** True for fixed tables. */
    isFixed?: boolean;

    /** True for selectable tables. */
    isSelectable?: boolean;

    /** True to render a header row. */
    renderHeaderRow?: boolean;

    /** The table rows. */
    rows?: Array<{ [key: string]: string }>;
}