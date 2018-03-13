import { Fabric, IComponentProps, IProps } from ".";

/**
 * Toggle
 */
export interface IToggle {
    /** Returns the toggle element. */
    get(): HTMLElement;

    /** Returns the fabric component. */
    getFabricComponent(): Fabric.IToggle;

    /** Returns the toggle value. */
    getValue(): boolean;
}

/**
 * Toggle Properties
 */
export interface IToggleProps extends IComponentProps {
    /** The toggle description. */
    description?: string;

    /** The change event */
    onChange?: (value: boolean) => void;

    /** The toggle value */
    value?: boolean;
}