import { IProps } from ".";

/**
 * Toggle
 */
export interface IToggle {
    /** Returns the toggle element. */
    get(): HTMLElement;

    /** Returns the toggle value. */
    getValue(): boolean;
}

/**
 * Toggle Properties
 */
export interface IToggleProps extends IProps {
    /** The toggle description. */
    description?: string;

    /**
     * Set to true, to disable the toggle.
     * @default false
     */
    disable?: boolean;

    /** The toggle label. */
    label?: string;

    /** The change event */
    onChange?: (value: boolean) => void;

    /** The toggle value */
    value?: boolean;
}