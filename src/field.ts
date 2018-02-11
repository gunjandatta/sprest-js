import { Helper, SPTypes } from "gd-sprest";
import {
    fabric, Checkbox,
    TextField, TextFieldTypes
} from ".";

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

/**
 * Field
 */
export const Field = (props: IFieldProps) => {
    // Load the field information
    Helper.ListFormField.create(props.fieldInfo).then(fieldInfo => {
        // Render the field based on the type
        switch (fieldInfo.type) {
            // Boolean Field
            case SPTypes.FieldType.Boolean:
                Checkbox({
                    className: props.className,
                    disable: props.disabled,
                    el: props.el,
                    label: props.fieldInfo.title,
                    onChange: props.onChange,
                    value: props.value
                });
                break;

            // Text Field
            case SPTypes.FieldType.Text:
                TextField({
                    className: props.className,
                    disable: props.disabled,
                    el: props.el,
                    label: props.fieldInfo.title,
                    onChange: props.onChange,
                    value: props.value || props.fieldInfo.defaultValue || ""
                });
                break;
            default:
                // Log
                console.log("[gd-sprest] The field type '" + fieldInfo.typeAsString + "' is not supported.");
                break;
        }
    });

    // Render a spinner
    props.el.innerHTML = `
        <div class="ms-Spinner">
            <div class="ms-Spinner-label">Loading the field...</div>
        </div>
    `.trim();

    // Initialize the spinner
    new fabric.Spinner(props.el.firstChild as any);
}