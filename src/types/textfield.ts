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
}

/**
 * Text Field Properties
 */
export interface ITextFieldProps extends IComponentProps {
    /** The change event */
    onChange?: (value: string) => void;

    /** The placeholder text. */
    placeholder?: string;

    /** The textfield type. */
    type?: number;

    /** The textfield value. */
    value?: string;
}