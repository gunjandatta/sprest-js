import { IOverlayProps } from "../types";

/**
 * Overlay
 */
export const Overlay = (props: IOverlayProps): string => {
    // Return the template
    return '<div class="ms-Overlay' + (props.isDark ? "ms-Overlay--dark" : "") + '"></div>';
}