import { Fabric, IOverlay, IOverlayProps } from "./types"
import { fabric, Templates } from ".";

/**
 * Overlay
 */
export const Overlay = (props: IOverlayProps): IOverlay => {
    // Method to get the fabric component
    let get = (): Fabric.IOverlay => { return _overlay; }

    // Add the overlay template
    props.el.innerHTML = Templates.Overlay(props);

    // Create the checkbox
    let _overlay: Fabric.IOverlay = new fabric.Overlay(props.el.querySelector(".ms-Overlay"));

    // Return the checkbox
    return {
        get
    };
}
