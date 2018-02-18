import { Fabric, ICommandButtonProps, IProps } from ".";

/**
 * Command Bar
 */
export interface ICommandBar {
    /** Returns the fabric component. */
    get(): Fabric.ICommandBar;
}

/**
 * Command Bar Properties
 */
export interface ICommandBarProps extends IProps {
    /** The class name. */
    className?: string;

    /** The main area commands. */
    mainCommands?: Array<ICommandButtonProps>;

    /** The side area commands. */
    sideCommands?: Array<ICommandButtonProps>;
}