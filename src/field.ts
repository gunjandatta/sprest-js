import { Helper, SPTypes, Types } from "gd-sprest";
import { IDropdownOption, IFieldProps } from "./types";
import {
    fabric, CheckBox, Dropdown,
    TextField, TextFieldTypes,
    Toggle
} from ".";

/**
 * Field
 */
export const Field = (props: IFieldProps) => {
    // Method to generate the choice dropdown options
    let getChoiceOptions = (fieldinfo: Helper.Types.IListFormChoiceFieldInfo): Array<IDropdownOption> => {
        let options: Array<IDropdownOption> = [];

        // Parse the options
        for (let i = 0; i < fieldinfo.choices.length; i++) {
            let choice = fieldinfo.choices[i];

            // Add the option
            options.push({
                text: choice,
                type: TextFieldTypes.Default,
                value: choice
            });
        }

        // Return the options
        return options;
    }

    // Method to generate the lookup dropdown options
    let getLookupOptions = (fieldinfo: Helper.Types.IListFormLookupFieldInfo, items: Array<Types.SP.IListItemQueryResult>): Array<IDropdownOption> => {
        let options: Array<IDropdownOption> = [];

        // Parse the options
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            // Add the option
            options.push({
                text: item[fieldinfo.lookupField],
                type: TextFieldTypes.Default,
                value: item.Id.toString()
            });
        }

        // Return the options
        return options;
    }

    // Load the field information
    Helper.ListFormField.create(props.fieldInfo).then(fieldInfo => {
        // Render the field based on the type
        switch (fieldInfo.type) {
            // Boolean Field
            case SPTypes.FieldType.Boolean:
                Toggle({
                    className: props.className,
                    description: props.fieldInfo.field.Description,
                    disable: props.disabled,
                    el: props.el,
                    label: props.fieldInfo.title,
                    onChange: props.onChange,
                    value: props.value
                });
                break;

            // Choice Field
            case SPTypes.FieldType.Choice:
                Dropdown({
                    className: props.className,
                    disable: props.disabled,
                    el: props.el,
                    label: props.fieldInfo.title,
                    onChange: props.onChange,
                    options: getChoiceOptions(props.fieldInfo as Helper.Types.IListFormChoiceFieldInfo),
                    required: props.fieldInfo.required,
                    value: props.value
                });
                break;

            // Lookup Field
            case SPTypes.FieldType.Lookup:
                // Get the drop down information
                Helper.ListFormField.loadLookupData(props.fieldInfo as Helper.Types.IListFormLookupFieldInfo, 500).then(items => {
                    Dropdown({
                        className: props.className,
                        disable: props.disabled,
                        el: props.el,
                        label: props.fieldInfo.title,
                        multi: (props.fieldInfo as Helper.Types.IFieldInfoLookup).multi,
                        onChange: props.onChange,
                        options: getLookupOptions(props.fieldInfo as Helper.Types.IListFormLookupFieldInfo, items),
                        required: props.fieldInfo.required,
                        value: props.value
                    });
                });
                break;

            // Multi-Choice Field
            case SPTypes.FieldType.MultiChoice:
                Dropdown({
                    className: props.className,
                    disable: props.disabled,
                    el: props.el,
                    label: props.fieldInfo.title,
                    multi: true,
                    onChange: props.onChange,
                    options: getChoiceOptions(props.fieldInfo as Helper.Types.IListFormChoiceFieldInfo),
                    required: props.fieldInfo.required,
                    value: props.value ? props.value.results : props.value
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
                    required: props.fieldInfo.required,
                    type: TextFieldTypes.Underline,
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