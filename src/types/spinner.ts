import { Fabric, IProps } from ".";

/**
 * Spinner
 */
export interface ISpinner {
    /** Returns the fabric component. */
    get(): Fabric.ISpinner;
}

/**
 * Spinner Properties
 */
export interface ISpinnerProps extends IProps {
    /** The loading dialog text. */
    text?: string;
}