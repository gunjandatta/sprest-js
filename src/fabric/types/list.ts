import { Fabric, IProps } from ".";

/**
 * List
 */
export interface IList {
    /** Method to append the items. */
    appendItems?: (items: Array<string>) => void;

    /** Returns the fabric component. */
    get(): Fabric.IList;
}

/**
 * List Properties
 */
export interface IListProps extends IProps {
    /** The list items. */
    items?: Array<string>;

    /** The list item click event. */
    onClick?: (ev: MouseEvent) => void;
}