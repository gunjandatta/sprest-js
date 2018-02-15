import { IProps } from ".";

/**
 * List Properties
 */
export interface IListProps extends IProps {
    /** The list items. */
    items?: Array<string>;

    /** The list item click event. */
    onClick?: (ev: MouseEvent) => void;
}