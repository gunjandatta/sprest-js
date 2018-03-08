import { Fabric, IProps } from ".";

/**
 * Contextual Menu
 */
export interface IContextualMenu {
    /** Returns the fabric component. */
    get(): Fabric.IContextualMenu;
}

/**
 * Contextual Menu Props
 */
export interface IContextualMenuProps extends IProps {
    /** The menu items. */
    items?: Array<IContextualMenuItem>;

    /** The button icon. */
    icon?: string;

    /** The target element to associate the menu with. */
    elTarget?: Element | HTMLElement;

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

    /** The item click event. */
    onClick?: Function;

    /** The item text. */
    text?: string;
}