import { IComponentProps, IProps } from ".";

/**
 * Dropdown
 */
export interface IDropdown {
    /** Returns the string element. */
    get(): HTMLElement;

    /** Returns the fabric component. */
    getFabricComponent(): any;

    /** Returns the dropdown value. */
    getValue(): string | Array<string>;

    /** Returns the dropdown value as a string. */
    getValueAsString(): string;
}

/**
 * Dropdown Option
 */
export interface IDropdownOption {
    /** The option children. */
    options?: Array<IDropdownOption>;

    /** The option text. */
    text?: string;

    /** The option value. */
    value?: string;

    /** The option type. */
    type?: number;
}

/**
 * Dropdown Properties
 */
export interface IDropdownProps extends IComponentProps {
    /** Allow multiple values. */
    multi?: boolean;

    /** The change event */
    onChange?: (checked: string | Array<string>) => void;

    /** The dropdown options. */
    options?: Array<IDropdownOption>

    /** The placeholder text. */
    placeholder?: string;

    /** The dropdown value(s). */
    value?: string | Array<string>;
}