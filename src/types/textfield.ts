import { IComponentProps, IProps } from ".";

/**
 * Text Field
 */
export interface ITextField {
    /** Returns the textfield element. */
    get(): HTMLInputElement;

    /** Returns the fabric component. */
    getFabricComponent(): any;

    /** Returns the textfield value. */
    getValue(): string;

    /** Sets the textfield value. */
    setValue(value: string);
}

/**
 * Text Field Properties
 */
export interface ITextFieldProps extends IComponentProps {
    /** The number of decimals allowed. */
    decimals?: number;

    /** The change event */
    onChange?: (value: string) => void;

    /** The maximum value. */
    maxValue?: number;

    /** The minimum value. */
    minValue?: number;

    /** The placeholder text. */
    placeholder?: string;

    /** The textfield type. */
    type?: number;

    /** The textfield value. */
    value?: string;
}