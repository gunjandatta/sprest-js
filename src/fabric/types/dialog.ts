import { IButtonProps, IProps } from ".";

/**
 * Dialog Properties
 */
export interface IDialogProps extends IProps {
    /** The dialog actions. */
    actions?: Array<IButtonProps>;

    /** The dialog content. */
    content?: string;

    /** True for blocking dialogs. */
    isBlocking?: boolean;

    /** True for dialogs with large headers. */
    isLargeHeader?: boolean;

    /** True for multi-line dialogs. */
    isMultiLine?: boolean;

    /** True to show the close button. */
    showCloseButton?: boolean;

    /** The dialog sub text. */
    subText?: string;

    /** The dialog title. */
    title?: string;
}