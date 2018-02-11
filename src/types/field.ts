import { Helper } from "gd-sprest";

/**
 * Field Properties
 */
export interface IFieldProps {
    /** Class name */
    className?: string;

    /** Disabled */
    disabled?: boolean;

    /** The element to render the field to. */
    el: Element | HTMLElement;

    /** The field information */
    fieldInfo: Helper.Types.IListFormFieldInfo;

    /** The change event */
    onChange?: (value: any) => void;

    /** The field value */
    value?: any;
}
