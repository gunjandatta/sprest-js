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
    // Method to get the value
    let getValue = () => {
        // Ensure a value exists
        let value: any = _numberfield.getValue();
        if (value) {
            switch (props.type) {
                case NumberFieldTypes.Integer:
                    value = parseInt(value);
                    return typeof (value) === "number" ? value : null;
                case NumberFieldTypes.Number:
                    value = parseFloat(value);
                    return typeof (value) === "number" ? value : null;
                case NumberFieldTypes.Percentage:
                    value = parseFloat(value);
                    return typeof (value) === "number" ? value / 100 : null;
            }
        }

        // Return nothing
        return null;
    }

    // Method to validate the value
    let validate = (value: string): boolean => {
        let maxValue = typeof (props.minValue) === "number" ? props.maxValue : Number.MAX_VALUE;
        let minValue = typeof (props.minValue) === "number" ? props.minValue : Number.MAX_VALUE*-1;
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
                    if (numberValue.toString() != value) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value is not an integer");

                        // Validation failed
                        return false;
                    }

                    // Ensure it's between the min/max range
                    if (!(numberValue >= minValue && numberValue <= maxValue)) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value must be between " + minValue + " and " + maxValue + ".");

                        // Validation failed
                        return false;
                    }
                    break;
                case NumberFieldTypes.Number:
                    // Ensure this is a number
                    numberValue = parseFloat(value);
                    if (numberValue != value as any) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value is not an number");

                        // Validation failed
                        return false;
                    }

                    // Ensure it's between the min/max range
                    if (!(numberValue >= minValue && numberValue <= maxValue)) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value must be between " + minValue + " and " + maxValue + ".");

                        // Validation failed
                        return false;
                    }
                    break;
                case NumberFieldTypes.Percentage:
                    // Update the min/max values
                    maxValue = maxValue == Number.MAX_VALUE ? 100 : maxValue;
                    minValue = minValue == Number.MAX_VALUE*-1 ? 0 : minValue;

                    // Ensure this is a number
                    numberValue = parseFloat(value);
                    if (numberValue != value as any) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value is not an number");

                        // Validation failed
                        return false;
                    }

                    // Ensure it's between the min/max range
                    if (!(numberValue >= minValue && numberValue <= maxValue)) {
                        // Set the error message
                        _numberfield.setErrorMessage("The value must be between " + minValue + " and " + maxValue + ".");

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
        getValue,
        setErrorMessage: _numberfield.setErrorMessage,
        setValue: _numberfield.setValue
    };
}