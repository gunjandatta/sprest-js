import { ITextField, ITextFieldProps } from ".";

/**
 * Number Field
 */
export interface INumberField extends ITextField {
    /** Returns the textfield value. */
    getValue(): number | any;
}

/**
 * Number Field Properties
 */
export interface INumberFieldProps extends ITextFieldProps {
    /** The number of decimals allowed. */
    decimals?: number;

    /** The maximum value allowed. */
    maxValue?: number;

    /** The minimum value allowed. */
    minValue?: number;
}