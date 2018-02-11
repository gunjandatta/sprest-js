import { IProps } from ".";

/**
 * CheckBox
 */
export interface ICheckBox {
    /** Returns the checkbox element. */
    get(): HTMLElement;

    /** Returns the checkbox value. */
    getValue(): boolean;
}

/**
 * CheckBox Properties
 */
export interface ICheckBoxProps extends IProps {
    /**
     * Set to true, to disable the checkbox.
     * @default false
     */
    disable?: boolean;

    /** The checkbox label. */
    label?: string;

    /** The change event */
    onChange?: (checked: boolean) => void;

    /** The checkbox value */
    value?: boolean;
}