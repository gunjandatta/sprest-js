import { Helper, SPTypes } from "gd-sprest";
import { TextField } from "./text";
declare var fabric;

export interface IBaseFieldProps {
    /** The element to render the field to. */
    el: Element | HTMLElement;

    /** The field information */
    fieldInfo: Helper.Types.IListFormFieldInfo;
}

/**
 * Base Field
 */
export class BaseField {
    private _props: IBaseFieldProps = null;

    // Constructor
    constructor(props: IBaseFieldProps) {
        // Save the properties
        this._props = props || {} as any;

        // Render the field
        this.render()
    }

    // Method to render the base field
    private render = () => {
        // Load the field information
        Helper.ListFormField.create(this._props.fieldInfo).then(fieldInfo => {
            // Render the field based on the type
            switch (fieldInfo.type) {
                case SPTypes.FieldType.Text:
                    // Render the text field
                    TextField.render(this._props.el, fieldInfo);
                    break;
                default:
                    // Log
                    console.log("[gd-sprest] The field type '" + fieldInfo.typeAsString + "' is not supported.");
                    break;
            }
        });

        // Render a spinner
        this._props.el.innerHTML = `
            <div class="ms-Spinner">
                <div class="ms-Spinner-label">Loading the field...</div>
            </div>
        `.trim();

        // Initialize the spinner
        new fabric.Spinner(this._props.el.firstChild);
    }
}