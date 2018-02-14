import { ITextField, ITextFieldProps } from ".";

/**
 * Number Field
 */
export interface INumberField extends ITextField { }

/**
 * Number Field Properties
 */
export interface INumberFieldProps extends ITextFieldProps {
    /** The number of decimals allowed. */
    decimals?: number;

    /** The maximum value. */
    maxValue?: number;

    /** The minimum value. */
    minValue?: number;
}