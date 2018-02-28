import { IPivotProps } from "../types";

/**
 * Pivot
 */
export const Pivot = (props: IPivotProps): string => {
    let tabs = [];
    let tabContents = [];

    // Parse the tabs
    for (let i = 0; i < props.tabs.length; i++) {
        let tab = props.tabs[i];

        // Set the class name
        let className = tab.className || "";
        className += tab.isSelected ? " is-selected" : "";

        // Add the tab
        tabs.push([
            '<li class="ms-Pivot-link ' + className + '" data-content="' + tab.name + '" title="' + tab.name + '" tabindex="1">',
            tab.name,
            '</li>'
        ].join('\n'));

        // Add the tab content
        tabContents.push([
            '<div class="ms-Pivot-content" data-content="' + tab.name + '">',
            tab.content,
            '</div>'
        ].join('\n'));
    }

    // Set the class name
    let className = [
        props.className || "",
        props.isLarge ? "ms-Pivot--large" : "",
        props.isTabs ? "ms-Pivot--tabs" : ""
    ].join(" ").trim();

    // Return the template
    return props.isFlipped ?
        [
            '<div class="ms-Pivot ' + className + '">',
            tabContents.join('\n'),
            '<ul class="ms-Pivot-links">',
            tabs.join('\n'),
            '</ul>',
            '</div>'
        ].join('\n')
        :
        [
            '<div class="ms-Pivot ' + className + '">',
            '<ul class="ms-Pivot-links">',
            tabs.join('\n'),
            '</ul>',
            tabContents.join('\n'),
            '</div>'
        ].join('\n');
}