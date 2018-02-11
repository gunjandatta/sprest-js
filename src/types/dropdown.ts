import { IProps } from ".";

/**
 * Dropdown
 */
export interface IDropdown {
    /** Returns the string element. */
    get(): HTMLElement;

    /** Returns the fabric component. */
    getFabricComponent(): any;

    /** Returns the dropdown value. */
    getValue(): string;
}

/**
 * Dropdown Option
 */
export interface IDropdownOption {
    options?: Array<IDropdownOption>;
    text?: string;
    value?: string;
    type?: number;
}

/**
 * Dropdown Properties
 */
export interface IDropdownProps extends IProps {
    /**
     * Set to true, to disable the dropdown.
     * @default false
     */
    disable?: boolean;

    /** The dropdown label. */
    label?: string;

    /** The change event. */
    onChange?: (value?: string) => void;

    /** The dropdown options. */
    options?: Array<IDropdownOption>

    /** The placeholder text. */
    placeholder?: string;

    /** The dropdown value. */
    value?: string;
}