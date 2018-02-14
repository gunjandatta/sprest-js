import { Fabric, IProps } from ".";

/**
 * Callout Properties
 */
export interface ICalloutProps extends IProps {
    /** The callout actions. */
    actions?: string;

    /** The callout content. */
    content?: string;

    /** The target element. */
    elTarget: Element;

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