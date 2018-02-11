import { IDropdown, IDropdownOption, IDropdownProps } from "./types";
import { fabric, TextField, TextFieldTypes } from ".";

/**
 * Dropdown Types
 */
export enum DropdownTypes {
    Item = 0,
    Header = 1
}

/**
 * Dropdown
 */
export const Dropdown = (props: IDropdownProps): IDropdown => {
    // Method to get the toggle element
    let get = (): HTMLInputElement => {
        // Returns the toggle element
        return props.el.querySelector(".ms-ContextualMenu") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = () => {
        // Return the menu
        return _menu;
    }

    // Method to get the value
    let getValue = (): string => {
        // Get the text field value
        return _tb ? _tb.getValue() : "";
    }

    // Method to render the menu
    let renderMenu = (options: Array<IDropdownOption> = []): string => {
        let menu: Array<string> = [];

        // Add the menu
        menu.push('<ul class="ms-ContextualMenu is-hidden">');

        // Parse the options
        for (let i = 0; i < options.length; i++) {
            let option = options[i];

            // Compute the "is-selected" class
            // TO DO

            // See if this is a header
            if (option.type == DropdownTypes.Header) {
                // Add the header
                menu.push([
                    '<li class="ms-ContextualMenu-item ms-ContextualMenu-item--divider"></li>',
                    '<li class="ms-ContextualMenu-item ms-ContextualMenu-item--header">' + option.text + '</li>'
                ].join('\n'));
            } else {
                // Add the item
                menu.push([
                    '<li class="ms-ContextualMenu-item">',
                    '<a class="ms-ContextualMenu-link" tabindex="1">' + option.text + '</a>',
                    option.options ? renderMenu(option.options) : '',
                    '</li>'
                ].join('\n'));
            }
        }

        // Close the menu
        menu.push('</ul>');

        // Return the menu
        return menu.join('\n');
    }

    // Render the dropdown
    props.el.innerHTML = [
        '<div class="dropdown">',
        '<div class="textfield"></div>',
        renderMenu(props.options),
        '</div>'
    ].join('\n');

    // Render the textfield
    let _tb = TextField({
        el: props.el.querySelector(".textfield"),
        type: TextFieldTypes.Underline
    });

    // Create the menu
    let _menu = new fabric.ContextualMenu(get(), _tb.getFabricComponent()._container);

    // Return the dropdown
    return {
        get,
        getFabricComponent,
        getValue
    };
}