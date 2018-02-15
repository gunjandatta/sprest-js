import { Helper } from "gd-sprest";
import { IListFormProps } from ".";

/**
 * List Form Panel
 */
export interface IListFormPanel {
    /**
     * Displays the list form
     * @param controlMode - The form type.
     */
    show(controlMode?: number);
}

/**
 * List Form Panel Properties
 */
export interface IListFormPanelProps extends IListFormProps {
    /** Class name */
    className?: string;

    /** The form control mode. */
    controlMode?: number;

    /** The element to render the field to. */
    el: Element | HTMLElement;

    /** The item. */
    item?: any;

    /** the panel title. */
    panelTitle?: string;

    /** The panel type. */
    panelType?: number;
}