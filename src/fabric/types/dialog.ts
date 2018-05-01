import { Fabric, IButtonProps, IProps } from ".";

/**
 * Dialog
 */
export interface IDialog {
    /** Closes the dialog. */
    close();
    
    /** Returns the fabric component. */
    get(): Fabric.IDialog;

    /** Returns the actions container. */
    getActions(): HTMLDivElement;

    /** Returns the content container. */
    getContent(): HTMLDivElement;

    /** Returns the title container. */
    getTitle(): HTMLDivElement;

    /** Opens the dialog. */
    open();
}

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