import { Fabric, IPanel, IPanelProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Panel Types
 */
export enum PanelTypes {
    Left = 0,
    Medium = 1,
    Large = 2,
    LargeFixed = 3,
    XLarge = 4,
    XXLarge = 5
}

/**
 * Panel
 */
export const Panel = (props: IPanelProps): IPanel => {
    let _panel: Fabric.IPanel = null;

    // Method to get the fabric component
    let get = (): Fabric.IPanel => {
        // Return the panel
        return _panel;
    }

    // Method to get the content element
    let getContent = () => { return _panel ? _panel._panel.querySelector(".ms-Panel-content") as HTMLDivElement : null; }

    // Method to get the footer element
    let getFooter = () => { return _panel ? _panel._panel.querySelector(".ms-Panel-footer") as HTMLDivElement : null; }

    // Method to get the header element
    let getHeader = () => { return _panel ? _panel._panel.querySelector(".ms-Panel-header") as HTMLDivElement : null; }

    // Method to hide the panel
    let hide = () => {
        // Dismiss the panel
        _panel ? _panel.dismiss() : null;

        // Clear the panel
        _panel = null;
    }

    // Method to determine if the panel is open
    let isOpen = () => { return _panel && _panel._panel.className.indexOf("is-open") > 0; }

    // Method to show the panel
    let show = (content: string = ""): HTMLDivElement => {
        // Add the panel html
        props.el.innerHTML = Templates.Panel(props);

        // Show the panel
        _panel = new fabric.Panel(props.el.querySelector(".ms-Panel"));

        // See if this is a blocking panel
        if(props.isBlocking) {
            // Remove the click event to close the panel
            _panel.panelHost.overlay.overlayElement.removeEventListener("click", _panel._clickHandler);

            // Add a new event
            _panel.panelHost.overlay.overlayElement.addEventListener("click", () => {
                // Keep the overlay visible
                _panel.panelHost.overlay.show();
            });
        }

        // Get the inner content
        let innerContent = _panel._panel.querySelector(".ms-Panel-contentInner") as HTMLDivElement;
        if (innerContent) {
            // Set the class name
            innerContent.className += " ms-Panel-main";

            // Get the panel content
            innerContent = innerContent.querySelector(".ms-Panel-content") as HTMLDivElement;
            if (innerContent) {
                // Update the panel content
                innerContent.innerHTML = content;
            }
        }

        // Return content
        return innerContent;
    }

    // Method to update the panel content
    let updateContent = (content: string = ""): HTMLDivElement => {
        let panelContent = null;

        // Ensure the panel exists
        if (_panel == null) {
            // Show the panel
            panelContent = show(content);
        } else {
            // Update the panel content
            panelContent = _panel._panel.querySelector(".ms-Panel-content") as HTMLDivElement;
            panelContent ? panelContent.innerHTML = content : null;
        }

        // Return the panel content
        return panelContent;
    }

    // Method to update the panel footer
    let updateFooter = (content: string = ""): HTMLDivElement => {
        // Update the content
        let el = _panel._panel.querySelector(".ms-Panel-footer") as HTMLDivElement;
        el ? el.innerHTML = content : null;

        // Return the panel content
        return el;
    }

    // Method to update the panel header
    let updateHeader = (content: string = ""): HTMLDivElement => {
        // Update the content
        let el = _panel._panel.querySelector(".ms-Panel-header") as HTMLDivElement;
        el ? el.innerHTML = content : null;

        // Return the panel content
        return el;
    }

    // See if we are showing the panel
    if (props.visible) {
        // Show the panel
        this.show();
    }

    // Return the panel
    return {
        get,
        getContent,
        getFooter,
        getHeader,
        hide,
        isOpen,
        show,
        updateContent,
        updateFooter,
        updateHeader
    };
}