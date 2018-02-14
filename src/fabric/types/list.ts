import { IProps } from ".";

/**
 * List Properties
 */
export interface IListProps extends IProps {
    /** The list items. */
    items?: Array<string>;
}