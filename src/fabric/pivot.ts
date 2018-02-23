import { IPivotLink, IPivotProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Pivot
 */
export const Pivot = (props: IPivotProps) => {
    let _pivot = null;

    // Ensure the element exists
    if (props.el) {
        // Render a pivot
        props.el.innerHTML = Templates.Spinner(props);

        // Initialize the pivot
        _pivot = new fabric.Pivot(props.el.querySelector(".ms-Pivot"));
    }

    // Return the pivot
    return _pivot;
}