import { IProps } from ".";

/**
 * Checkbox
 */
export interface ICheckbox {
    /** Returns the checkbox element. */
    get(): HTMLElement;

    /** Returns the checkbox value. */
    getValue(): boolean;
}

/**
 * Checkbox Properties
 */
export interface ICheckboxProps extends IProps {
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