import { Fabric, ICalloutProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Callout Positions
 */
export const CalloutPositions = {
    left: "left",
    right: "right",
    top: "top",
    bottom: "bottom"
}

/**
 * Callout Types
 */
export enum CalloutTypes {
    /** Action */
    Action = 0,

    /** Close */
    Close = 1,

    /** Default */
    Default = 2,

    /** Out of the Box */
    OOBE = 3,

    /** Peek */
    Peek = 4,
}

/**
 * Callout
 */
export const Callout = (props: ICalloutProps): Fabric.ICallout => {
    // Set the template
    props.el.innerHTML = Templates.Callout(props);

    // Return the callout
    return new fabric.Callout(props.el.querySelector(".ms-Callout"), props.elTarget, props.position || "top");
}