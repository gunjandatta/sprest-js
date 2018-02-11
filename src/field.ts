import { Helper, SPTypes, Types } from "gd-sprest";
import { IDropdownOption, IFieldProps } from "./types";
import {
    fabric, CheckBox, Dropdown, DropdownTypes,
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
                type: DropdownTypes.Item,
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
                type: DropdownTypes.Item,
                value: item.Id.toString()
            });
        }

        // Return the options
        return options;
    }

    // Method to get the mms dropdown options
    let getMMSOptions = (term: Helper.Types.ITerm): Array<IDropdownOption> => {
        let options: Array<IDropdownOption> = [];

        // See if information exists
        if (term.info) {
            // Add the heading
            options.push({
                text: term.info.name,
                type: DropdownTypes.Header,
                value: term.info.id
            });
        }

        // Parse the terms
        for (let termName in term) {
            let child = term[termName];

            // Skip the info and parent properties
            if (termName == "info" || termName == "parent") { continue; }

            // Get the child options
            let childOptions = getMMSOptions(child);

            // Add the option
            options.push({
                options: childOptions.length > 1 ? childOptions : null,
                text: child.info.name,
                type: DropdownTypes.Item,
                value: child.info.id
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
                    description: fieldInfo.field.Description,
                    disable: props.disabled,
                    el: props.el,
                    label: fieldInfo.title,
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
                    label: fieldInfo.title,
                    onChange: props.onChange,
                    options: getChoiceOptions(fieldInfo as Helper.Types.IListFormChoiceFieldInfo),
                    required: fieldInfo.required,
                    value: props.value
                });
                break;

            // Lookup Field
            case SPTypes.FieldType.Lookup:
                // Get the drop down information
                Helper.ListFormField.loadLookupData(fieldInfo as Helper.Types.IListFormLookupFieldInfo, 500).then(items => {
                    Dropdown({
                        className: props.className,
                        disable: props.disabled,
                        el: props.el,
                        label: fieldInfo.title,
                        multi: (fieldInfo as Helper.Types.IFieldInfoLookup).multi,
                        onChange: props.onChange,
                        options: getLookupOptions(fieldInfo as Helper.Types.IListFormLookupFieldInfo, items),
                        required: fieldInfo.required,
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
                    label: fieldInfo.title,
                    multi: true,
                    onChange: props.onChange,
                    options: getChoiceOptions(fieldInfo as Helper.Types.IListFormChoiceFieldInfo),
                    required: fieldInfo.required,
                    value: props.value ? props.value.results : props.value
                });
                break;

            // Text Field
            case SPTypes.FieldType.Text:
                TextField({
                    className: props.className,
                    disable: props.disabled,
                    el: props.el,
                    label: fieldInfo.title,
                    onChange: props.onChange,
                    required: fieldInfo.required,
                    type: TextFieldTypes.Underline,
                    value: props.value || fieldInfo.defaultValue || ""
                });
                break;
            default:
                // See if this is a taxonomy field
                if (fieldInfo.typeAsString.startsWith("TaxonomyFieldType")) {
                    // Load the terms
                    Helper.ListFormField.loadMMSData(fieldInfo as Helper.Types.IListFormMMSFieldInfo).then(terms => {
                        Dropdown({
                            className: props.className,
                            disable: props.disabled,
                            el: props.el,
                            label: fieldInfo.title,
                            multi: true,
                            onChange: props.onChange,
                            options: getMMSOptions(Helper.Taxonomy.toObject(terms)),
                            required: fieldInfo.required,
                            value: props.value ? props.value.results : props.value
                        });
                    });
                } else {
                    // Log
                    console.log("[gd-sprest] The field type '" + fieldInfo.typeAsString + "' is not supported.");
                }
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