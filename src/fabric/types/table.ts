import { IDropdownOption, IProps } from ".";

/**
 * Table Properties
 */
export interface ITableProps extends IProps {
    /** The class name. */
    className?: string;

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