import { Helper, SPTypes, Types } from "gd-sprest";
import { Fabric } from "..";
import { IField, IFieldProps } from "./types";
import { ListFormField, Types as FieldTypes } from ".";

/**
 * Field
 */
export const Field = (props: IFieldProps): PromiseLike<IField> => {
    // Method to generate the choice dropdown options
    let getChoiceOptions = (fieldinfo: FieldTypes.IListFormChoiceFieldInfo): Array<Fabric.Types.IDropdownOption> => {
        let options: Array<Fabric.Types.IDropdownOption> = [];

        // Get the current value
        let values = props.value || null;
        values = values && values.results ? values.results : [values];

        // Parse the options
        for (let i = 0; i < fieldinfo.choices.length; i++) {
            let choice = fieldinfo.choices[i];
            let isSelected = false;

            // Determine if this choice is selected
            for (let j = 0; j < values.length; j++) {
                // See if this choice is selected
                if (choice == values[j]) {
                    // Set the flag and break from the loop
                    isSelected = true;
                    break;
                }
            }

            // Add the option
            options.push({
                isSelected,
                text: choice,
                type: Fabric.DropdownTypes.Item,
                value: choice
            });
        }

        // Return the options
        return options;
    }

    // Method to generate the lookup dropdown options
    let getLookupOptions = (fieldinfo: FieldTypes.IListFormLookupFieldInfo, items: Array<Types.SP.IListItemQueryResult>): Array<Fabric.Types.IDropdownOption> => {
        let options: Array<Fabric.Types.IDropdownOption> = [];

        // Get the current value
        let values = props.value || null;
        values = values && values.results ? values.results : [values];

        // Parse the options
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let isSelected = false;

            // See if this is a multi-lookup field
            if (fieldinfo.multi) {
                // Determine if this lookup is selected
                for (let j = 0; j < values.length; j++) {
                    let id = values[j] ? values[j].Id : null;

                    // See if this choice is selected
                    if (item.Id == id) {
                        // Set the flag and break from the loop
                        isSelected = true;
                        break;
                    }
                }
            }

            // Add the option
            options.push({
                isSelected,
                text: item[fieldinfo.lookupField],
                type: Fabric.DropdownTypes.Item,
                value: item.Id.toString()
            });
        }

        // Return the options
        return options;
    }

    // Method to get the lookup values
    let getLookupValues = (fieldinfo: FieldTypes.IListFormLookupFieldInfo, value) => {
        let values = [];

        // See if this is a multi-lookup
        if (fieldinfo.multi) {
            let results = value && value.results ? value.results : [];

            // Parse the values
            for (let i = 0; i < results.length; i++) {
                // Add the value
                values.push(results[i].Id ? results[i].Id : results[i]);
            }
        } else {
            // Set the value
            values.push(value && value.Id > 0 ? value.Id : value);
        }

        // Return the values
        return values;
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

    // Method to get the MMS values
    let getMMSValues = (value) => {
        let values = [];

        // Parse the MMS values
        let mmsValues = (value || "").split(";#");
        for (let i = 0; i < values.length; i++) {
            let mmsValue = mmsValues[i].split("|");
            if (mmsValue[1]) {
                // Add the value
                values.push(mmsValue[1]);
            }
        }

        // Return the values
        return values;
    }

    // Method to update the value
    let _value = props.value;
    let updateValue = (value) => {
        // Update the value
        _value = value;

        // Call the change event
        props.onChange ? props.onChange(value) : null;
    }

    // Render a loading message
    let _spinner = Fabric.Spinner({
        el: props.el,
        text: "Loading the field..."
    });

    // Return a promise
    return new Promise((resolve, reject) => {
        // See if we are displaying the field
        if (props.controlMode == SPTypes.ControlMode.Display) {
            // Update the value, based on the type
            let value = props.value || "";
            switch (props.fieldInfo.field.FieldTypeKind) {
                // Lookup
                case SPTypes.FieldType.Lookup:
                    let results = value.results ? value.results : [value];
                    let values = [];

                    // Parse the results
                    for (let i = 0; i < results.length; i++) {
                        let result = results[i] ? results[i][(props.fieldInfo.field as Types.SP.IFieldLookup).LookupField] : null;

                        // Ensure the value exists
                        if (result) {
                            // Add the value
                            values.push(result);
                        }
                    }

                    // Update the value
                    value = values.join(", ");
                    break;

                // Multi-Choice
                case SPTypes.FieldType.MultiChoice:
                    // Update the values
                    value = value.results ? value.results.join(", ") : value;
                    break;

                // URL
                case SPTypes.FieldType.URL:
                    // Resolve the promise
                    resolve({
                        fieldInfo: props.fieldInfo,
                        element: Fabric.LinkField({
                            className: props.className,
                            description: props.fieldInfo.field.Description,
                            disable: true,
                            el: props.el,
                            label: props.fieldInfo.field.Title,
                            required: props.fieldInfo.required,
                            value
                        })
                    });
                    return;
            }

            // See if this is a taxonomy field
            if (props.fieldInfo.field.TypeAsString.startsWith("TaxonomyFieldType")) {
                let mmsValues = (value || "").split(";#")
                value = [];

                // Parse the values
                for (let i = 0; i < mmsValues.length; i++) {
                    // Add the term label
                    value.push(mmsValues[i].split("|")[0]);
                }

                // Update the value
                value = value.join(", ");
            }

            // Resolve the promise
            resolve({
                fieldInfo: props.fieldInfo,
                element: Fabric.TextField({
                    className: props.className,
                    description: props.fieldInfo.field.Description,
                    disable: true,
                    el: props.el,
                    label: props.fieldInfo.field.Title,
                    required: props.fieldInfo.required,
                    type: Fabric.TextFieldTypes.Underline,
                    value
                })
            });

            // Return
            return;
        }

        // Load the field information
        ListFormField.create(props.fieldInfo).then(fieldInfo => {
            // Set the value
            let value = props.controlMode == SPTypes.ControlMode.New ? props.fieldInfo.defaultValue : props.value;

            // Render the field based on the type
            switch (fieldInfo.type) {
                // Boolean Field
                case SPTypes.FieldType.Boolean:
                    resolve({
                        fieldInfo,
                        element: Fabric.Toggle({
                            className: props.className,
                            description: fieldInfo.field.Description,
                            disable: props.disabled,
                            el: props.el,
                            label: fieldInfo.title,
                            onChange: updateValue,
                            value
                        })
                    });
                    break;

                // Calculated Field
                case SPTypes.FieldType.Calculated:
                    resolve({
                        fieldInfo,
                        element: Fabric.TextField({
                            className: props.className,
                            description: fieldInfo.field.Description,
                            disable: true,
                            el: props.el,
                            label: fieldInfo.title,
                            onChange: updateValue,
                            required: fieldInfo.required,
                            type: Fabric.TextFieldTypes.Underline,
                            value
                        })
                    });
                    break;

                // Choice Field
                case SPTypes.FieldType.Choice:
                    resolve({
                        fieldInfo,
                        element: Fabric.Dropdown({
                            className: props.className,
                            description: fieldInfo.field.Description,
                            disable: props.disabled,
                            el: props.el,
                            label: fieldInfo.title,
                            onChange: updateValue,
                            options: getChoiceOptions(fieldInfo as FieldTypes.IListFormChoiceFieldInfo),
                            required: fieldInfo.required,
                            value
                        })
                    });
                    break;

                // Date/Time
                case SPTypes.FieldType.DateTime:
                    resolve({
                        fieldInfo,
                        element: Fabric.DatePicker({
                            className: props.className,
                            description: fieldInfo.field.Description,
                            disable: props.disabled,
                            el: props.el,
                            label: fieldInfo.title,
                            onChange: updateValue,
                            required: fieldInfo.required,
                            showTime: (fieldInfo as FieldTypes.IListFormDateFieldInfo).showTime,
                            value
                        })
                    });
                    break;

                // Lookup Field
                case SPTypes.FieldType.Lookup:
                    // Get the drop down information
                    ListFormField.loadLookupData(fieldInfo as FieldTypes.IListFormLookupFieldInfo, 500).then(items => {
                        resolve({
                            fieldInfo,
                            element: Fabric.Dropdown({
                                className: props.className,
                                description: fieldInfo.field.Description,
                                disable: props.disabled,
                                el: props.el,
                                label: fieldInfo.title,
                                multi: (fieldInfo as FieldTypes.IListFormLookupFieldInfo).multi,
                                onChange: updateValue,
                                options: getLookupOptions(fieldInfo as FieldTypes.IListFormLookupFieldInfo, items),
                                required: fieldInfo.required,
                                value: getLookupValues(fieldInfo as FieldTypes.IListFormLookupFieldInfo, value)
                            })
                        });
                    });
                    break;

                // Multi-Choice Field
                case SPTypes.FieldType.MultiChoice:
                    resolve({
                        fieldInfo,
                        element: Fabric.Dropdown({
                            className: props.className,
                            description: fieldInfo.field.Description,
                            disable: props.disabled,
                            el: props.el,
                            label: fieldInfo.title,
                            multi: true,
                            onChange: updateValue,
                            options: getChoiceOptions(fieldInfo as FieldTypes.IListFormChoiceFieldInfo),
                            required: fieldInfo.required,
                            value: value ? value.results : value
                        })
                    });
                    break;

                // Note Field
                case SPTypes.FieldType.Note:
                    resolve({
                        fieldInfo,
                        element: Fabric.TextField({
                            className: props.className,
                            description: fieldInfo.field.Description,
                            disable: props.disabled,
                            el: props.el,
                            label: fieldInfo.title,
                            onChange: updateValue,
                            required: fieldInfo.required,
                            type: Fabric.TextFieldTypes.Multi,
                            value
                        })
                    });
                    break;

                // Number or Currency Field
                case SPTypes.FieldType.Number:
                case SPTypes.FieldType.Currency:
                    let numberInfo = fieldInfo as FieldTypes.IListFormNumberFieldInfo;
                    resolve({
                        fieldInfo: numberInfo,
                        element: Fabric.NumberField({
                            className: props.className,
                            decimals: numberInfo.decimals,
                            description: numberInfo.field.Description,
                            disable: props.disabled,
                            el: props.el,
                            label: numberInfo.title,
                            maxValue: numberInfo.maxValue,
                            minValue: numberInfo.minValue,
                            onChange: updateValue,
                            required: numberInfo.required,
                            type: numberInfo.showAsPercentage ? Fabric.NumberFieldTypes.Percentage : (numberInfo.decimals == 0 ? Fabric.NumberFieldTypes.Integer : Fabric.NumberFieldTypes.Number),
                            value
                        })
                    });
                    break;

                // Text Field
                case SPTypes.FieldType.Text:
                    resolve({
                        fieldInfo,
                        element: Fabric.TextField({
                            className: props.className,
                            description: fieldInfo.field.Description,
                            disable: props.disabled,
                            el: props.el,
                            label: fieldInfo.title,
                            onChange: updateValue,
                            required: fieldInfo.required,
                            type: Fabric.TextFieldTypes.Underline,
                            value
                        })
                    });
                    break;

                // Url Field
                case SPTypes.FieldType.URL:
                    resolve({
                        fieldInfo,
                        element: Fabric.LinkField({
                            className: props.className,
                            description: fieldInfo.field.Description,
                            disable: props.disabled,
                            el: props.el,
                            label: fieldInfo.title,
                            onChange: updateValue,
                            required: fieldInfo.required,
                            value
                        })
                    });
                    break;

                // User Field
                case SPTypes.FieldType.User:
                    let userInfo = fieldInfo as FieldTypes.IListFormUserFieldInfo;
                    resolve({
                        fieldInfo: userInfo,
                        element: Fabric.PeoplePicker({
                            allowGroups: userInfo.allowGroups,
                            allowMultiple: userInfo.multi,
                            description: userInfo.field.Description,
                            el: props.el,
                            label: userInfo.title,
                            required: userInfo.required,
                            value
                        })
                    });
                    break;

                // Default
                default:
                    // See if this is a taxonomy field
                    if (fieldInfo.typeAsString.startsWith("TaxonomyFieldType")) {
                        let mmsInfo = fieldInfo as FieldTypes.IListFormMMSFieldInfo;

                        // See if this is a new form
                        if (props.controlMode == SPTypes.ControlMode.New) {
                            // Clear the value
                            value = [];

                            // Get the default values
                            let values = (mmsInfo.defaultValue || props.value || "").split(";#")
                            for (let i = 0; i < values.length; i++) {
                                let value = values[i].split("|");
                                if (value.length == 2) {
                                    // Add the term id
                                    value.push(value[1]);
                                }
                            }
                        } else {
                            // Parse the values
                            let values = value && value.results ? value.results : [value];
                            value = [];
                            for (let i = 0; i < values.length; i++) {
                                // Ensure the value exists
                                if (values[i] && values[i].TermGuid) {
                                    // Add the value
                                    value.push(values[i].TermGuid);
                                }
                            }
                        }

                        // Load the terms
                        ListFormField.loadMMSData(mmsInfo).then(terms => {
                            // Load the value field
                            ListFormField.loadMMSValueField(mmsInfo).then(valueField => {
                                // Set the value field
                                mmsInfo.valueField = valueField;

                                // Resolve the promise
                                resolve({
                                    fieldInfo: mmsInfo,
                                    element: Fabric.Dropdown({
                                        className: props.className,
                                        description: mmsInfo.field.Description,
                                        disable: props.disabled,
                                        el: props.el,
                                        label: mmsInfo.title,
                                        multi: mmsInfo.multi,
                                        onChange: updateValue,
                                        options: getMMSOptions(Helper.Taxonomy.toObject(terms)),
                                        required: mmsInfo.required,
                                        value
                                    })
                                });
                            });
                        });
                    } else {
                        // Log
                        console.log("[gd-sprest] The field type '" + fieldInfo.typeAsString + "' is not supported.");
                    }
                    break;
            }
        });
    });
}