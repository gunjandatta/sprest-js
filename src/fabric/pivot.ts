import { Fabric, IPivotLink, IPivotProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Pivot
 */
export const Pivot = (props: IPivotProps): Fabric.IPivot => {
    let _pivot = null;

    // The tab click event
    let onTabClick = (ev: MouseEvent) => {
        let elTab = ev.currentTarget as HTMLElement;

        // Get the tab
        let tabIdx = parseInt(elTab.getAttribute("data-tab-idx"));
        let tab = props.tabs[tabIdx];
        if (tab) {
            // Execute the click events
            props.onClick ? props.onClick(elTab, tab) : null;
            tab.onClick ? tab.onClick(elTab, tab) : null;
        }
    }

    // Ensure the element exists
    if (props.el) {
        // Render a pivot
        props.el.innerHTML = Templates.Pivot(props);

        // Initialize the pivot
        _pivot = new fabric.Pivot(props.el.querySelector(".ms-Pivot"));

        // Parse the tab links
        let links = props.el.querySelectorAll(".ms-Pivot-link");
        for (let i = 0; i < links.length; i++) {
            let link = links[i];

            // Set the tab index
            link.setAttribute("data-tab-idx", i.toString());

            // Set the click event
            link.addEventListener("click", onTabClick);
        }
    }

    // Return the pivot
    return _pivot;
}