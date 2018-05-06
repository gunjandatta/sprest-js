import { Fabric, IListItemProps, IProps } from ".";

/**
 * List
 */
export interface IList {
    /** Method to append the items. */
    appendItems?: (items: Array<IListItemProps>) => void;

    /** Returns the fabric component. */
    get(): Fabric.IList;

    /** Returns the fabric list item components. */
    getItems(): Array<Fabric.IListItem>;
}

/**
 * List Properties
 */
export interface IListProps extends IProps {
    /** The list items. */
    items?: Array<IListItemProps>;

    /** The list item click event. */
    onClick?: (ev?: MouseEvent) => void;
}