import { Fabric, ICommandButtonProps, IProps } from ".";

/**
 * Callout
 */
export interface ICallout {
    /** Closes the callout. */
    close();

    /** Returns the fabric component. */
    get(): Fabric.ICallout;

    /** Gets the main content */
    getContent(): HTMLDivElement;
}

/**
 * Callout Properties
 */
export interface ICalloutProps extends IProps {
    /** The callout actions. */
    actions?: Array<ICommandButtonProps>;

    /** The callout content. */
    content?: string;

    /** The target element. */
    elTarget?: Element;

    /** The callout position. */
    position?: string;

    /** True to show the close button. */
    showCloseButton?: boolean;

    /** The callout sub text. */
    subText?: string;

    /** The callout title. */
    title?: string;

    /** The callout type. */
    type?: number;
}