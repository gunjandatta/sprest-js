import { ISearchBoxProps } from "../types";
import { SearchBoxTypes } from "../searchbox";

/**
 * Search Box
 */
export const SearchBox = (props: ISearchBoxProps): string => {
    let isDefault = props.type == SearchBoxTypes.Collapsed || props.type == SearchBoxTypes.CommandBar ? false : true;

    // Set the class name
    let className = [
        props.className || "",
        isDefault ? "" : "ms-SearchBox--commandBar",
        props.type == SearchBoxTypes.Collapsed ? "is-collapsed" : ""
    ].join(' ').trim();

    // Return the default template
    return [
        '<div class="ms-SearchBox ' + className + '">',
        '<input class="ms-SearchBox-field" type="text" value="' + (props.value || "") + '"></input>',
        '<label class="ms-SearchBox-label">',
        '<i class="ms-SearchBox-icon ms-Icon ms-Icon--Search"></i>',
        '<span class="ms-SearchBox-text">' + (props.placeholder || "Search") + '</span>',
        '</label>',
        '<div class="ms-CommandButton ms-SearchBox-clear ms-CommandButton--noLabel">',
        '<button class="ms-CommandButton-button">',
        '<span class="ms-CommandButton-icon"><i class="ms-Icon ms-Icon--Clear"></i></span>',
        '<span class="ms-CommandButton-label"></span>',
        '</button>',
        '</div>',
        '<div class="ms-CommandButton ms-SearchBox-search ms-CommandButton--noLabel">',
        '<button class="ms-CommandButton-button">',
        '<span class="ms-CommandButton-icon"><i class="ms-Icon ms-Icon--Search"></i></span>',
        '<span class="ms-CommandButton-label"></span>',
        '</button>',
        '</div>',
        isDefault ? '' : [
            '<div class="ms-CommandButton ms-SearchBox-exit ms-CommandButton--noLabel">',
            '<button class="ms-CommandButton-button">',
            '<span class="ms-CommandButton-icon"><i class="ms-Icon ms-Icon--ChromeBack"></i></span>',
            '<span class="ms-CommandButton-label"></span>',
            '</button>',
            '</div>',
            '<div class="ms-CommandButton ms-SearchBox-filter ms-CommandButton--noLabel">',
            '<button class="ms-CommandButton-button">',
            '<span class="ms-CommandButton-icon"><i class="ms-Icon ms-Icon--Filter"></i></span>',
            '<span class="ms-CommandButton-label"></span>',
            '</button>',
            '</div>'
        ].join('\n'),
        '</div>'
    ].join('\n');
}