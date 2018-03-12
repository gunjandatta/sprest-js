import { Fabric, IPivotLink, IPivotProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Pivot
 */
export const Pivot = (props: IPivotProps): Fabric.IPivot => {
    let _pivot = null;

    // Ensure the element exists
    if (props.el) {
        // Render a pivot
        props.el.innerHTML = Templates.Pivot(props);

        // Initialize the pivot
        _pivot = new fabric.Pivot(props.el.querySelector(".ms-Pivot"));

        // Parse the tab links
        let links = props.el.querySelectorAll(".ms-Pivot-link");
        for (let i = 0; i < links.length; i++) {
            // Parse the tabs
            for (let j = 0; j < props.tabs.length; j++) {
                let tab = props.tabs[j];

                // See if a click event exists
                if (tab.onClick) {
                    // Add a click event
                    links[i].addEventListener("click", tab.onClick as any);
                }
            }
        }
    }

    // Return the pivot
    return _pivot;
}