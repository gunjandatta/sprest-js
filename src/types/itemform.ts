import { Helper } from "gd-sprest";

/**
 * Item Form Properties
 */
export interface IItemFormProps {
    /** Class name */
    className?: string;

    /** The form control mode. */
    controlMode?: number;

    /** The element to render the field to. */
    el: Element | HTMLElement;

    /** The list fields to render. */
    fields: Array<string>;

    /** The list item. */
    item?: any;

    /** The list item id. */
    itemId?: number;

    /** The list name */
    listName?: string;

    /** The relative web url. */
    webUrl?: string;
}