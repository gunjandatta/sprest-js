import { Fabric, IProps } from ".";

/**
 * List
 */
export interface IList extends Fabric.IList { }

/**
 * List Properties
 */
export interface IListProps extends IProps {
    /** The list items. */
    items?: Array<string>;

    /** The list item click event. */
    onClick?: (ev: MouseEvent) => void;
}