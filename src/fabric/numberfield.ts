import { TextField, TextFieldTypes } from ".";
import { INumberField, INumberFieldProps } from "./types";

/**
 * Number Field Types
 */
export enum NumberFieldTypes {
    Integer = 0,
    Number = 1,
    Percentage = 2
}

/**
 * Number Field
 */
export const NumberField = (props: INumberFieldProps): INumberField => {
    // Method to validate the value
    let validate = (value: string): boolean => {
        let maxValue = typeof (props.minValue) === "number" ? props.maxValue : Number.MAX_VALUE;
        let minValue = typeof (props.minValue) === "number" ? props.minValue : Number.MIN_VALUE;
        let numberValue: number = null;
        let valueExists: boolean = (value || "").length > 0;

        // Clear the error message
        _numberfield.setErrorMessage("");

        // Ensure a value exists
        if (valueExists) {
            // Validate based on the type
            switch (props.type) {
                // Integer
                case NumberFieldTypes.Integer:
                    // Ensure this is an integer
                    numberValue = parseInt(value);
                    if (!(numberValue >= minValue && numberValue <= maxValue) || numberValue.toString() != value) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value is not an integer");

                        // Validation failed
                        return false;
                    }
                    break;
                case NumberFieldTypes.Number:
                    // Ensure this is a number
                    numberValue = parseFloat(value);
                    if (!(numberValue >= minValue && numberValue <= maxValue) || numberValue != value as any) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value is not a number");

                        // Validation failed
                        return false;
                    }
                    break;
                case NumberFieldTypes.Percentage:
                    // Update the min/max values
                    maxValue = maxValue == Number.MAX_VALUE ? 100 : maxValue;
                    minValue = minValue == Number.MIN_VALUE ? 0 : minValue;

                    // Ensure this is a number
                    numberValue = parseFloat(value);
                    if (!(numberValue >= minValue && numberValue <= maxValue) || numberValue != value as any) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value is not a number");

                        // Validation failed
                        return false;
                    }
                    break;
            }
        }

        // Call the change event
        props.onChange ? props.onChange(value) : null;

        // Validation passed
        return true;
    }

    // Render the number field
    let _numberfield = TextField({
        className: props.className,
        disable: props.disable,
        el: props.el,
        label: props.label,
        onChange: validate,
        placeholder: props.placeholder,
        required: props.required,
        value: props.value
    });

    // Return the number field
    return {
        get: _numberfield.get,
        getFabricComponent: _numberfield.getFabricComponent,
        getValue: _numberfield.getValue,
        setErrorMessage: _numberfield.setErrorMessage,
        setValue: _numberfield.setValue
    };
}