
/**
 * Web Part Tabs
 */
export const WebPartTabs = (props) => {
    /**
     * Flag to determine if the webpart is inside a content zone.
     */
    let _isContentZone: boolean = false;

    /**
     * Methods
     */

    /**
     * Methods to get the webparts
     */
    let getWebParts = () => {
        let wps = [];

        // Get the webpart element and zone
        let elWebPart = document.querySelector("div[webpartid='" + props.cfg.WebPartId + "']") as HTMLDivElement;
        let elWebPartZone = elWebPart ? this.getWebPartZone(elWebPart) : null;
        if (elWebPart && elWebPartZone) {
            // Parse the webparts in this zone
            let webparts = elWebPartZone.querySelectorAll(".ms-webpartzone-cell[id^='MSOZoneCell_WebPart']");
            for (let i = 0; i < webparts.length; i++) {
                let webpart = webparts[i] as HTMLElement;

                // Skip this webpart
                if (webpart.querySelector("div[webpartid='" + props.cfg.WebPartId + "']")) { continue; }

                // Skip hidden webparts
                let wpTitle: string = ((webpart.querySelector(".ms-webpart-titleText") || {}) as HTMLDivElement).innerText || "";
                let isHidden = webpart.firstElementChild && webpart.firstElementChild.className.indexOf("ms-hide") >= 0;
                isHidden = isHidden || wpTitle.startsWith("(Hidden)");
                if (isHidden) { continue; }

                // See if this is within a content zone
                if (this._isContentZone) {
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

    /**
     * Method to get the webpart zone
     */
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
                this._isContentZone = true;

                // Return it
                return el;
            }

            // Check the parent element
            return this.getWebPartZone(el.parentNode as HTMLDivElement);
        }

        // Return nothing
        return null;
    }

    /**
     * Method to render the component
     */
    let render = () => {
        // Get the web

        return (`
            <div className={(props.className || "")
    }>
        { this.onRenderHeader() }
        < Pivot onLinkClick= { this.updateSelectedTab } linkFormat= { props.linkFormat } linkSize= { props.linkSize } >
            { this.renderTabs() }
            < /Pivot>
    { this.onRenderFooter() }
    </div>`
        );
    }

    /**
     * Method to render the tabs
     */
    let renderTabs = () => {
        let tabs = [];

        // Parse the webparts
        for (let i = 0; i < _webparts.length; i++) {
            let webpart = _webparts[i];

            // Get the webpart title
            let wpTitle: string | HTMLDivElement = webpart.querySelector(".ms-webpart-titleText") as HTMLDivElement;
            wpTitle = wpTitle ? wpTitle.innerText : null;
            if (wpTitle) {
                // Add the tab
                tabs.push(`
                    <PivotItem
                        itemID={ i.toString() }
                        linkText= { wpTitle }
                        key= { i }
                        onRenderItemLink= { props.onRenderTab }
                    />
                `)

                // Get the webpart title element
                let elWebPartTitle = webpart.querySelector(".ms-webpart-chrome-title") as HTMLDivElement;
                if (elWebPartTitle) {
                    // Hide the title element
                    elWebPartTitle.style.display = "none";
                }
            }
        }

        // Return the tabs
        return tabs;
    }

    /**
     * Method to update the
     * @param item - The pivot item.
     * @param ev - The tab click event.
     */
    let updateSelectedTab = (item: any, ev?: any) => {
        // Update the state
        this.setState({
            selectedTabId: parseInt(item.props.itemID)
        });
    }

    /**
     * Main
     */

    // Get the webparts
    let _webparts = this.getWebParts();

    // Parse the webparts
    let _selectedTabId = 0;
    for (_selectedTabId = 0; _selectedTabId < _webparts.length; _selectedTabId++) {
        // Break if this webpart has a title
        if (_webparts[_selectedTabId].querySelector(".ms-webpart-titleText")) { break; }
    }

    // Parse the webparts
    for (let i = 0; i < _webparts.length; i++) {
        // Get the webpart
        let webpart = document.querySelector("#" + _webparts[i].id) as HTMLDivElement;
        if (webpart) {
            // Update the visibility
            webpart.style.display = i == _selectedTabId ? "" : "none";
        }
    }
}