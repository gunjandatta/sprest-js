import { Fabric, IProps } from ".";

/**
 * Contextual Menu
 */
export interface IContextualMenu {
    /** Closes the menu. */
    close();

    /** Returns the fabric component. */
    get(): Fabric.IContextualMenu;
}

/**
 * Contextual Menu Props
 */
export interface IContextualMenuProps extends IProps {
    /** The target element to associate the menu with. */
    elTarget?: Element | HTMLElement;

    /** The menu items. */
    items?: Array<IContextualMenuItem>;

    /** The button icon. */
    icon?: string;

    /** True to hide the context menu. (Default: true) */
    isHidden?: boolean;

    /** The click event */
    onClick?: (ev?: Event, item?: IContextualMenuItem) => void;

    /** The button text. */
    text?: string;
}

/**
 * IContextualMenuItem
 */
export interface IContextualMenuItem {
    /** The button icon. */
    icon?: string;

    /** True to disable the item. */
    isDisabled?: boolean;

    /** True to render the item as selected. */
    isSelected?: boolean;

    /** The sub-menu. */
    menu?: Array<IContextualMenuItem>;

    /** The item click event. */
    onClick?: (ev?: Event, item?: IContextualMenuItem) => void;

    /** The item text. */
    text?: string;

    /** The item value. */
    value?: string;
}
