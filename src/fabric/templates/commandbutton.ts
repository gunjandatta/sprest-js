import { ICommandButtonProps } from "../types";
import { ContextualMenu } from ".";

/**
 * Command Button
 */
export const CommandButton = (props: ICommandButtonProps): string => {
    // Determine the class name
    let className = [
        "ms-CommandButton",
        props.className || "",
        props.isAction ? "ms-CommandButton--actionButton" : "",
        props.isActive ? "is-active" : "",
        props.isDisabled ? "is-disabled" : "",
        props.isInline ? "ms-CommandButton--inline" : "",
        props.isPivot ? "ms-CommandButton--pivot" : "",
        props.isTextOnly ? "ms-CommandButton--TextOnly" : "",
        props.menu ? "is-menu" : "",
        props.text ? "" : "ms-CommandButton--noLabel"
    ].join(' ').trim();

    // Get the menu props and set the default settings
    let menuProps = props.menu;
    if (menuProps) {
        // Set the class name
        menuProps.className = "is-opened ms-ContextualMenu--hasIcons " + (props.menu.className || "");
    }

    // Return the template
    return [
        '<div class="' + className + '">',
        '<button class="ms-CommandButton-button">',
        props.icon ? '<span class="ms-CommandButton-icon"><i class="ms-Icon ms-Icon--' + props.icon + '"></i></span>' : '',
        props.text ? '<span class="ms-CommandButton-label">' + props.text + '</span>' : '',
        props.menu ? '<span class="ms-CommandButton-dropdownIcon"><i class="ms-Icon ms-Icon--ChevronDown"></i></span>' : '',
        '</button>',
        props.isSplit ? '<button class="ms-CommandButton-splitIcon"><i class="ms-Icon ms-Icon--ChevronDown"></i></button>' : '',
        menuProps ? ContextualMenu(menuProps) : '',
        '</div>'
    ].join('\n');
}