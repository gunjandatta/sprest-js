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
        _panel = new fabric.Panel(props.el.querySelector(".ms-Panel"), content);

        // Update the z-index of the panel host
        _panel.panelHost.panelHost.style.zIndex = "1000";

        // See if we are hiding the close button
        if (props.showCloseButton == false) {
            // Remove the button
            _panel._closeButton.remove();
        }

        // Get the inner content
        let innerContent = _panel._panel.querySelector(".ms-Panel-contentInner");
        if (innerContent) {
            // Set the class name
            innerContent.className += " ms-Panel-main";
            // Return the panel content
            return innerContent.querySelector(".ms-Panel-content") as HTMLDivElement;
        }

        // Return nothing
        return null;
    }

    // Method to update the panel content
    let updateContent = (content: string = ""): HTMLDivElement => {
        // Update the content
        let el = _panel._panel.querySelector(".ms-Panel-content") as HTMLDivElement;
        el ? el.innerHTML = content : null;

        // Return the panel content
        return el;
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
        hide,
        isOpen,
        show,
        updateContent,
        updateFooter,
        updateHeader
    };
}