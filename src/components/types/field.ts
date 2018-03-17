import { Helper } from "gd-sprest";
import { IDatePicker, IDropdown, ILinkField, IPeoplePicker, ITextField, IToggle } from "../../fabric/types";

/**
 * Field
 */
export interface IField {
    element: IDatePicker | IDropdown | ILinkField | IPeoplePicker | ITextField | IToggle;
    fieldInfo: Helper.Types.IListFormFieldInfo;
}

/**
 * Field Properties
 */
export interface IFieldProps {
    /** Class name */
    className?: string;

    /** The control mode of the form. */
    controlMode?: number;

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
