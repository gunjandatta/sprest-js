import { Fabric, IProps } from ".";

/**
 * Overlay
 */
export interface IOverlay {
    /** Returns the fabric component. */
    get(): Fabric.IOverlay;
}

/**
 * Overlay Properties
 */
export interface IOverlayProps extends IProps {
    /** True, to create a dark overlay. */
    isDark?: boolean;
}