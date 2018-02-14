import { Fabric, IPanel, IPanelProps } from "./types";
import { fabric } from ".";

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
        // Set the class name
        let className = (props.className || "");
        switch (props.panelType) {
            case PanelTypes.Left:
                className += " ms-Panel--left";
                break;
            case PanelTypes.Medium:
                className += " ms-Panel--md";
                break;
            case PanelTypes.Large:
                className += " ms-Panel--lg";
                break;
            case PanelTypes.LargeFixed:
                className += " ms-Panel--lg ms-Panel--fixed";
                break;
            case PanelTypes.XLarge:
                className += " ms-Panel--xl";
                break;
            case PanelTypes.XXLarge:
                className += " ms-Panel--xxl";
                break;
        }

        // Add the panel html
        props.el.innerHTML = [
            '<div class="ms-Panel ' + className.trim() + '">',
            '<button class="ms-Panel-closeButton ms-PanelAction-close">',
            '<i class="ms-Panel-closeIcon ms-Icon ms-Icon--Cancel"></i>',
            '</button>',
            '<div class="ms-Panel-contentInner" style="height: 90vh;">',
            '<p class="ms-Panel-headerText">' + (props.headerText || "") + '</p>',
            '<div class="ms-Panel-content">',
            content,
            '</div>',
            '</div>',
            '</div>',
        ].join('\n');

        // Show the panel
        _panel = new fabric.Panel(props.el.querySelector(".ms-Panel"));

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