import { Helper, SPTypes, Types } from "gd-sprest";
import { Fabric } from "..";
import { IFieldProps } from "./types";

/**
 * Field
 */
export const Field = (props: IFieldProps) => {
    // Method to generate the choice dropdown options
    let getChoiceOptions = (fieldinfo: Helper.Types.IListFormChoiceFieldInfo): Array<Fabric.Types.IDropdownOption> => {
        let options: Array<Fabric.Types.IDropdownOption> = [];

        // Parse the options
        for (let i = 0; i < fieldinfo.choices.length; i++) {
            let choice = fieldinfo.choices[i];

            // Add the option
            options.push({
                text: choice,
                type: Fabric.DropdownTypes.Item,
                value: choice
            });
        }

        // Return the options
        return options;
    }

    // Method to generate the lookup dropdown options
    let getLookupOptions = (fieldinfo: Helper.Types.IListFormLookupFieldInfo, items: Array<Types.SP.IListItemQueryResult>): Array<Fabric.Types.IDropdownOption> => {
        let options: Array<Fabric.Types.IDropdownOption> = [];

        // Parse the options
        for (let i = 0; i < items.length; i++) {
            let item = items[i];

            // Add the option
            options.push({
                text: item[fieldinfo.lookupField],
                type: Fabric.DropdownTypes.Item,
                value: item.Id.toString()
            });
        }

        // Return the options
        return options;
    }

    // Method to get the mms dropdown options
    let getMMSOptions = (term: Helper.Types.ITerm): Array<Fabric.Types.IDropdownOption> => {
        let options: Array<Fabric.Types.IDropdownOption> = [];

        // See if information exists
        if (term.info) {
            // Add the heading
            options.push({
                text: term.info.name,
                type: Fabric.DropdownTypes.Header,
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
                type: Fabric.DropdownTypes.Item,
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
                Fabric.Toggle({
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
                Fabric.Dropdown({
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

            // Date/Time
            case SPTypes.FieldType.DateTime:
                Fabric.DatePicker({
                    className: props.className,
                    disable: props.disabled,
                    el: props.el,
                    label: fieldInfo.title,
                    onChange: props.onChange,
                    required: fieldInfo.required,
                    showTime: (fieldInfo as Helper.Types.IListFormDateFieldInfo).showTime,
                    value: props.value
                });
                break;

            // Lookup Field
            case SPTypes.FieldType.Lookup:
                // Get the drop down information
                Helper.ListFormField.loadLookupData(fieldInfo as Helper.Types.IListFormLookupFieldInfo, 500).then(items => {
                    Fabric.Dropdown({
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
                Fabric.Dropdown({
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

            // Number
            case SPTypes.FieldType.Currency:
            case SPTypes.FieldType.Number:
                let numberInfo = fieldInfo as Helper.Types.IListFormNumberFieldInfo;
                Fabric.NumberField({
                    className: props.className,
                    decimals: numberInfo.decimals,
                    disable: props.disabled,
                    el: props.el,
                    label: numberInfo.title,
                    maxValue: numberInfo.maxValue,
                    minValue: numberInfo.minValue,
                    onChange: props.onChange,
                    required: numberInfo.required,
                    type: numberInfo.showAsPercentage ? Fabric.NumberFieldTypes.Percentage : (numberInfo.decimals == 0 ? Fabric.NumberFieldTypes.Integer : Fabric.NumberFieldTypes.Number),
                    value: props.value || numberInfo.defaultValue || ""
                });
                break;

            // Text Field
            case SPTypes.FieldType.Text:
                Fabric.TextField({
                    className: props.className,
                    disable: props.disabled,
                    el: props.el,
                    label: fieldInfo.title,
                    onChange: props.onChange,
                    required: fieldInfo.required,
                    type: Fabric.TextFieldTypes.Underline,
                    value: props.value || fieldInfo.defaultValue || ""
                });
                break;

            // Url Field
            case SPTypes.FieldType.URL:
                Fabric.LinkField({
                    className: props.className,
                    description: props.value ? props.value.Description : "",
                    disable: props.disabled,
                    el: props.el,
                    label: fieldInfo.title,
                    onChange: props.onChange,
                    required: fieldInfo.required,
                    value: props.value ? props.value.Url : ""
                });
                break;

            // User Field
            case SPTypes.FieldType.User:
                let userInfo = fieldInfo as Helper.Types.IListFormUserFieldInfo;
                Fabric.PeoplePicker({
                    allowGroups: userInfo.allowGroups,
                    allowMultiple: userInfo.multi,
                    el: props.el,
                    label: userInfo.title,
                    required: userInfo.required,
                    value: props.value
                });
                break;

            // Default
            default:
                // See if this is a taxonomy field
                if (fieldInfo.typeAsString.startsWith("TaxonomyFieldType")) {
                    let mmsInfo = fieldInfo as Helper.Types.IListFormMMSFieldInfo;
                    // Load the terms
                    Helper.ListFormField.loadMMSData(mmsInfo).then(terms => {
                        Fabric.Dropdown({
                            className: props.className,
                            disable: props.disabled,
                            el: props.el,
                            label: mmsInfo.title,
                            multi: mmsInfo.multi,
                            onChange: props.onChange,
                            options: getMMSOptions(Helper.Taxonomy.toObject(terms)),
                            required: mmsInfo.required,
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
    let _spinner = Fabric.Spinner({
        el: props.el,
        text: "Loading the field..."
    });
}