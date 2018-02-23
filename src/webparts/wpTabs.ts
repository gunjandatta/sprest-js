import { IPivotLink } from "../fabric/types";
import { Pivot } from "../fabric";
import { IWebPartInfo, IWPTabsProps } from "./types";
import { WebPart } from ".";

/**
 * Web Part Tabs
 */
export const WPTabs = (props: IWPTabsProps) => {
    let _isContentZone: boolean = false;

    // Method to get the webparts
    let getWebParts = (wpInfo: IWebPartInfo) => {
        let wps = [];

        // Get the webpart element and zone
        let elWebPart = document.querySelector("div[webpartid='" + wpInfo.cfg.WebPartId + "']") as HTMLDivElement;
        let elWebPartZone = elWebPart ? getWebPartZone(elWebPart) : null;
        if (elWebPart && elWebPartZone) {
            // Add a class name to the webpart zone
            elWebPartZone.className += " wp-tabs"

            // Parse the webparts in this zone
            let webparts = elWebPartZone.querySelectorAll(".ms-webpartzone-cell[id^='MSOZoneCell_WebPart']");
            for (let i = 0; i < webparts.length; i++) {
                let webpart = webparts[i] as HTMLElement;

                // Skip this webpart
                if (webpart.querySelector("div[webpartid='" + wpInfo.cfg.WebPartId + "']")) { continue; }

                // Skip hidden webparts
                let wpTitle: string = ((webpart.querySelector(".ms-webpart-titleText") || {}) as HTMLDivElement).innerText || "";
                let isHidden = webpart.firstElementChild && webpart.firstElementChild.className.indexOf("ms-hide") >= 0;
                isHidden = isHidden || wpTitle.startsWith("(Hidden)");
                if (isHidden) { continue; }

                // See if this is within a content zone
                if (_isContentZone) {
                    // Get the parent webpart box
                    while (webpart.parentNode) {
                        // See if this is the webpart box element
                        if (webpart.className.indexOf("ms-rte-wpbox") >= 0) {
                            // Add this webpart and break from the loop
                            wps.push(webpart);
                            break;
                        }

                        // Check the parent element
                        webpart = webpart.parentNode as HTMLDivElement;
                    }
                } else {
                    // Add the webpart
                    wps.push(webpart);
                }
            }
        }

        // Return the webparts
        return wps;
    }

    // Method to get the webpart zone
    let getWebPartZone = (el: HTMLDivElement) => {
        // Ensure the element exists
        if (el) {
            // See if this is the webpart zone element
            if (el.className.indexOf("ms-webpart-zone") >= 0) {
                // Return it
                return el;
            }

            // See if this is the inner page zone
            if (el.className.indexOf("ms-rte-layoutszone-inner") >= 0) {
                // Set the flag
                _isContentZone = true;

                // Return it
                return el;
            }

            // Check the parent element
            return getWebPartZone(el.parentNode as HTMLDivElement);
        }

        // Return nothing
        return null;
    }

    // Method to update the visibility of the webparts
    let updateWebParts = (ev?: Event) => {
        let selectedTabId = 0;

        // See if the event exists
        if (ev) {
            // Parse the webparts
            for (let i = 0; i < _webparts.length; i++) {
                // Get the webpart
                let wpTitle = _webparts[i].querySelector(".ms-webpart-titleText") as HTMLDivElement;
                if (wpTitle && wpTitle.innerText == (ev.currentTarget as HTMLElement).getAttribute("title")) {
                    // Update the selected tab id
                    selectedTabId = i;
                    break;
                }
            }
        }
        // Else, default the selected tab to the first visible webpart
        else {
            // Parse the webparts
            for (selectedTabId = 0; selectedTabId < _webparts.length; selectedTabId++) {
                // Break if this webpart has a title
                if (_webparts[selectedTabId].querySelector(".ms-webpart-titleText")) { break; }
            }
        }

        // Parse the webparts
        for (let i = 0; i < _webparts.length; i++) {
            // Get the webpart
            let webpart = document.querySelector("#" + _webparts[i].id) as HTMLDivElement;
            if (webpart) {
                // Update the visibility
                webpart.style.display = i == selectedTabId ? "" : "none";
            }
        }
    }

    /**
     * Main
     */

    let _webparts = [];

    // Return the webpart
    let _wp = WebPart({
        elementId: props.elementId,
        onRenderDisplay: (wpInfo: IWebPartInfo) => {
            // Set the webparts
            _webparts = getWebParts(wpInfo);

            // Parse the webparts
            let tabs: Array<IPivotLink> = [];
            for (let i = 0; i < _webparts.length; i++) {
                // Add the tab
                let wpTitle = _webparts[i].querySelector(".ms-webpart-titleText") as HTMLDivElement;
                tabs.push({
                    isSelected: i == 0,
                    name: wpTitle.innerText,
                    onClick: updateWebParts
                });
            }

            // Render the tabs
            let pivot = Pivot({
                className: props.className,
                el: wpInfo.el,
                isLarge: props.isLarge,
                isTabs: props.isTabs,
                tabs
            });

            // Update the webparts
            updateWebParts();
        }
    });
}