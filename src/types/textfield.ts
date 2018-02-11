import { IProps } from ".";

/**
 * Text Field
 */
export interface ITextField {
    /** Returns the textfield element. */
    get(): HTMLElement;

    /** Returns the fabric component. */
    getFabricComponent(): any;

    /** Returns the textfield value. */
    getValue(): string;
}

/**
 * Text Field Properties
 */
export interface ITextFieldProps extends IProps {
    /**
     * Set to true, to disable the button.
     * @default false
     */
    disable?: boolean;

    /** The textfield label. */
    label?: string;

    /** The text change event. */
    onChange?: (value?: string) => void;

    /** The placeholder text. */
    placeholder?: string;

    /** The textfield type. */
    type?: number;

    /** The textfield value. */
    value?: string;
}