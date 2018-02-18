import { PanelTypes } from "..";
import { IPanelProps } from "../types";

/**
 * Panel
 */
export const Panel = (props: IPanelProps, content?: string): string => {
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
    };

    // Method to render the close button
    let renderCloseButton = () => {
        return props.showCloseButton ? [
            '<button class="ms-Panel-closeButton ms-PanelAction-close">',
            '<i class="ms-Panel-closeIcon ms-Icon ms-Icon--Cancel"></i>',
            '</button>',
        ].join('\n') : '';
    };

    // Return the template
    return [
        '<div class="ms-Panel ' + className.trim() + '">',
        renderCloseButton(),
        '<div class="ms-Panel-header">' + (props.panelHeader || "") + '</div>',
        '<div class="ms-Panel-contentInner" style="height: 90vh;">',
        props.headerText ? '<p class="ms-Panel-headerText">' + props.headerText + '</p>' : '',
        '<div class="ms-Panel-content">' + (content || props.panelContent || "") + '</div>',
        '</div>',
        '<div class="ms-Panel-footer">' + (props.panelFooter || "") + '</div>',
        '</div>',
    ].join('\n');
}