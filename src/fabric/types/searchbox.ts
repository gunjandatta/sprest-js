import { Fabric, IProps } from ".";

/**
 * Search Box
 */
export interface ISearchBox extends IProps {
    /** Returns the fabric component. */
    get(): Fabric.ISearchBox;

    /** Returns the textbox value. */
    getValue(): string;

    /** Sets the textbox value. */
    setValue(value: string);
}

/**
 * Search Box Properties
 */
export interface ISearchBoxProps extends IProps {
    /** The search icon click event. */
    onClick?: (searchText: string, ev?: Event) => void;

    /** The search box placeholder. */
    placeholder?: string;

    /** The search box type. */
    type?: number;

    /** The search box value. */
    value?: string;
}