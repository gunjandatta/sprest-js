import { IComponentProps, IProps } from ".";
import { Fabric } from "../..";

/**
 * Dropdown
 */
export interface IDropdown {
    /** Returns the text element. */
    get(): HTMLInputElement;

    /** Returns the fabric component. */
    getFabricComponent(): Fabric.Types.IContextualMenu;

    /** Returns the dropdown value. */
    getValue(): Array<IDropdownOption>;

    /** Sets the dropdown options. */
    setOptions(options: Array<IDropdownOption>): IDropdown;
}

/**
 * Dropdown Option
 */
export interface IDropdownOption {
    /** The optional json data to assoicate with the option. */
    data?: any;

    /** Flag determining if the option is selected */
    isSelected?: boolean;

    /** The option children. */
    options?: Array<IDropdownOption>;

    /** The option text. */
    text?: string;

    /** The option value. */
    value?: any;
}

/**
 * Dropdown Properties
 */
export interface IDropdownProps extends IComponentProps {
    /** The drop down description. */
    description?: string;

    /** Flag determining if the selected options are sorted alphabetically. */
    isUnsorted?: boolean;

    /** Allow multiple values. */
    multi?: boolean;

    /** The change event */
    onChange?: (value: Array<IDropdownOption>) => void;

    /** The dropdown options. */
    options?: Array<IDropdownOption>

    /** The placeholder text. */
    placeholder?: string;

    /** The dropdown value(s). */
    value?: string | Array<string>;
}