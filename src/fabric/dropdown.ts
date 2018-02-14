import { Fabric, IDropdown, IDropdownOption, IDropdownProps } from "./types";
import { fabric, Callout, CalloutPositions, CalloutTypes, TextField, TextFieldTypes } from ".";

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
    let _values = props.value && typeof (props.value) === "string" ? [props.value] : (props.value || []) as Array<string>

    // Method to get the toggle element
    let get = (): HTMLInputElement => {
        // Returns the toggle element
        return props.el.querySelector(".ms-ContextualMenu") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = () => {
        // Return the menu
        return _callout._contextualHost;
    }

    // Method to get the value
    let getValue = (): string | Array<string> => {
        // Return the value
        return props.multi ? _values : _values[0];
    }

    // Method to get the value as a string
    let getValueAsString = (): string => {
        // Ensure values exist
        if (_values && _values.length > 0) {
            // Return the value as a string
            return props.multi ? _values.join(", ") : _values[0];
        }

        // Value doesn't exist
        return "";
    }

    // Method to render the menu
    let renderMenu = (options: Array<IDropdownOption> = []): string => {
        let menu: Array<string> = [];

        // Add the menu
        menu.push('<ul class="ms-ContextualMenu ms-ContextualMenu--callout' + (props.multi ? ' ms-ContextualMenu--multiselect' : '') + '">');

        // Parse the options
        for (let i = 0; i < options.length; i++) {
            let option = options[i];

            // See if this is a header
            if (option.type == DropdownTypes.Header) {
                // Add the header
                menu.push([
                    '<li class="ms-ContextualMenu-item ms-ContextualMenu-item--divider"></li>',
                    '<li class="ms-ContextualMenu-item ms-ContextualMenu-item--header">' + option.text + '</li>'
                ].join('\n'));
            } else {
                let isSelected = false;

                // Ensure a value exists
                if (props.value) {
                    // See if we are allowing multiple values
                    if (props.multi) {
                        // Parse the value
                        for (let j = 0; j < props.value.length; j++) {
                            // Set the flag
                            isSelected = (props.value[j] == option.text) || (props.value[j] == option.value);
                        }
                    } else {
                        // Set the flag
                        isSelected = (props.value == option.text) || (props.value == option.value);
                    }
                }

                // Add the item
                let isSubMenu = option.options && option.options.length > 0;
                menu.push([
                    '<li class="ms-ContextualMenu-item' + (isSubMenu ? ' ms-ContextualMenu-item--hasMenu' : '') + '">',
                    '<a class="ms-ContextualMenu-link' + (isSelected ? ' is-selected' : '') + '" tabindex="1">' + option.text + '</a>',
                    isSubMenu ? '<i class="ms-ContextualMenu-subMenuIcon ms-Icon ms-Icon--ChevronRight"></i>' : '',
                    isSubMenu ? renderMenu(option.options) : '',
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
        '<div class="callout"></div>',
        '</div>'
    ].join('\n');

    // Render the textfield
    let _tb = TextField({
        disable: true,
        el: props.el.querySelector(".textfield"),
        label: props.label,
        onChange: () => { if (_tb.getValue() == "undefined") { _tb.setValue(""); } },
        required: props.required,
        type: TextFieldTypes.Underline
    });

    // Parse the menu items
    let items = props.el.querySelectorAll(".ms-ContextualMenu-item");
    for (let i = 0; i < items.length; i++) {
        // Add a click event
        items[i].addEventListener("click", (ev) => {
            let link = ev.currentTarget as HTMLLIElement;

            // See if the item clicked is not a menu
            if (link.className.indexOf("--hasMenu") < 0) {
                let isSelected = link.firstElementChild.className.indexOf("is-selected") > 0;
                let value = link.innerText.trim();

                // See if we are selecting the item
                if (isSelected) {
                    // Add the item
                    props.multi ? _values.push(value) : _values = [value];
                } else {
                    // Parse the values
                    for (let i = 0; i < _values.length; i++) {
                        // See if this is the target item
                        if (_values[i] == value) {
                            // Remove this item
                            _values.splice(i, 1);
                            break;
                        }
                    }
                }
            }

            // Set the textbox value
            _tb.get().value = getValueAsString();

            // Call the change event
            props.onChange ? props.onChange(getValue()) : null;
        });
    }

    // Create the callout
    let _callout = Callout({
        content: renderMenu(props.options),
        el: props.el.querySelector(".callout"),
        elTarget: _tb.getFabricComponent()._container,
        position: CalloutPositions.left,
        subText: props.description,
        type: CalloutTypes.Default
    });

    // Return the dropdown
    return {
        get,
        getFabricComponent,
        getValue,
        getValueAsString
    };
}