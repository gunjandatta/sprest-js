import { Fabric, IContextualMenuProps, IProps } from ".";

/**
 * Command Button
 */
export interface ICommandButton {
    /** Returns the fabric component. */
    get(): Fabric.ICommandButton;
}

/**
 * Command Button Properties
 */
export interface ICommandButtonProps extends IProps {
    /** True for action command buttons. */
    isAction?: boolean;

    /** True for active command buttons. */
    isActive?: boolean;

    /** True to disable the button. */
    isDisabled?: boolean;

    /** True for inline command buttons. */
    isInline?: boolean;

    /** True for pivot command buttons. */
    isPivot?: boolean;

    /** True for split command buttons. */
    isSplit?: boolean;

    /** True for text only command buttons. */
    isTextOnly?: boolean;

    /** The contextual menu. */
    menu?: IContextualMenuProps;

    /** The button icon. */
    icon?: string;

    /** The button text. */
    text?: string;
}