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

    // Method to set the header text
    let setHeaderText = (html: string): HTMLDivElement => {
        let header = get()._panel.querySelector(".ms-Panel-headerText") as HTMLDivElement;
        if (header) {
            header.innerHTML = html;
        }

        // Return the header
        return header;
    }

    // Method to show the panel
    let show = (content: string = ""): HTMLDivElement => {
        // Add the panel html
        props.el.innerHTML = Templates.Panel(props);

        // Show the panel
        _panel = new fabric.Panel(props.el.querySelector(".ms-Panel"), content);

        // See if we are hiding the close button
        if (props.showCloseButton == false) {
            // Remove the button
            _panel._closeButton.remove();
        }

        // Return the panel content
        return _panel._panel.querySelector(".ms-Panel-content") as HTMLDivElement;
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
        setHeaderText,
        show
    };
}