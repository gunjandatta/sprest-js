import { IPanel, IPanelProps } from "./types";
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
    let _panel = null;

    // Method to get the content element
    let getContent = (): HTMLElement => {
        // Return the content
        return query(".ms-Panel-content");
    }

    // Method to get the fabric component
    let getFabricComponent = () => {
        // Return the panel
        return _panel;
    }

    // Method to get the panel element
    let getPanel = (): HTMLElement => {
        // Return the panel
        return _panel ? _panel._panel : (props.el).querySelector(".ms-Panel") as HTMLElement;
    }

    // Method to hide the panel
    let hide = () => {
        // Dismiss the panel
        _panel ? _panel.dismiss() : null;

        // Clear the panel
        _panel = null;
    }

    // Method to query the panel
    let query = (qs: string = ""): HTMLElement => {
        let panel = getPanel();
        if (panel) {
            // Query the panel
            return panel.querySelector(qs) as any;
        }

        // Return nothing
        return null;
    }

    // Method to query the panel
    let queryAll = (qs: string = ""): Array<HTMLElement> => {
        let panel = getPanel();
        if (panel) {
            // Query the panel
            return panel.querySelectorAll(qs) as any;
        }

        // Return nothing
        return [];
    }

    // Method to set the header text
    let setHeaderText = (html: string): HTMLElement => {
        let header = query(".ms-Panel-headerText");
        if (header) {
            header.innerHTML = html;
        }

        // Return the header
        return header;
    }

    // Method to show the panel
    let show = (content: string = ""): HTMLElement => {
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
            '<div class="ms-Panel-contentInner" style="height: 90vh;">',
            '<p class="ms-Panel-headerText"></p>',
            '<div class="ms-Panel-content">',
            content,
            '</div>',
            '</div>',
            '</div>',
        ].join('\n');

        // See if we are showing the close button
        if (typeof (props.showCloseButton) === "undefined" || props.showCloseButton) {
            // Show the close button
            showCloseButton();
        }

        // Set the header text
        setHeaderText(props.headerText);

        // Show the panel
        _panel = new fabric.Panel(getPanel());

        // Return the panel content
        return getContent();
    }

    // Method to show the close button
    let showCloseButton = () => {
        // See if it exists
        if (query(".ms-Panel-closeButton")) { return; }

        // Get the panel
        let panel = getPanel();
        if (panel) {
            // Add the close button
            panel.innerHTML = [
                '<button class="ms-Panel-closeButton ms-PanelAction-close">',
                '<i class="ms-Panel-closeIcon ms-Icon ms-Icon--Cancel"></i>',
                '</button>',
                panel.innerHTML
            ].join('\n');

            // Set the click event for the close button
            (panel.firstElementChild as HTMLButtonElement).onclick = () => {
                // Hide the panel
                hide();

                // Disable postback
                return false;
            }
        }
    }

    // See if we are showing the panel
    if (props.visible) {
        // Show the panel
        this.show();
    }

    // Return the panel
    return {
        getContent,
        getFabricComponent,
        getPanel,
        hide,
        query,
        queryAll,
        setHeaderText,
        show,
        showCloseButton
    };
}