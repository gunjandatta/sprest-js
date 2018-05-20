import { Types } from "gd-sprest";
import { Fabric, IContextualMenu, IContextualMenuItem, IDropdown, IDropdownOption, IDropdownProps, IListItemProps } from "./types";
import {
    fabric,
    Callout, CalloutPositions, CalloutTypes,
    ContextualMenu,
    List, Personas, Templates,
    TextField, TextFieldTypes
} from ".";

/**
 * Dropdown
 */
export const Dropdown = (props: IDropdownProps): IDropdown => {
    let isMulti = typeof (props.multi) === "boolean" ? props.multi : false;
    let isSorted = typeof (props.isUnsorted) === "boolean" ? !props.isUnsorted : true;

    // Method to find the option
    let findOption = (options: Array<IDropdownOption>, value: string) => {
        // Parse the options
        for (let i = 0; i < options.length; i++) {
            let option = options[i];

            // See if this is the target item, and return it
            if (option.value == value) {
                // Return the option
                return option;
            }

            // See if options exist
            if (option.options) {
                // Find the option
                let subOption = findOption(option.options, value);
                if (subOption) { return subOption; }
            }
        }

        // Option not found
        return null;
    }

    // Method to get the toggle element
    let get = (): HTMLInputElement => {
        // Returns the toggle element
        return props.el.querySelector(".ms-ContextualMenu") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = (): IContextualMenu => {
        // Return the menu
        return _menu;
    }

    // Method to set the options
    let setOptions = (options: Array<IDropdownOption>): IDropdown => {
        // Clear the textbox value
        _tb.setValue("");

        // Set the value
        value = options;

        // Render the options
        renderValues(value);

        // Return this object
        return this;
    }

    // Method to render the values
    let renderValues = (values: Array<IDropdownOption> = []) => {
        // See if we are sorting the dropdown values
        if (isSorted) {
            // Sort the values
            values = values.sort((a, b) => {
                if (a.text < b.text) { return -1; }
                if (a.text > b.text) { return 1; }
                return 0;
            });
        }

        // Render the personas
        Personas({
            el: props.el.querySelector(".value"),
            userInfo: toUserInfo(values),
            onCancel: userInfo => {
                // Parse the values
                for (let i = 0; i < value.length; i++) {
                    // See if this is the target value
                    if (value[i].text == userInfo.DisplayText) {
                        // Remove this value
                        value.splice(i, 1);
                    }
                }
            }
        });
    }

    // Method to convert the options to menu options
    let toItems = (options: Array<IDropdownOption>): Array<IContextualMenuItem> => {
        let items: Array<IContextualMenuItem> = [];

        // Parse the options
        for (let i = 0; i < options.length; i++) {
            let option = options[i];

            // Append the item
            items.push({
                menu: option.options ? toItems(option.options) : null,
                text: option.text,
                value: option.value
            });
        }

        // Return the items
        return items;
    }

    // Method to convert the options to user information
    let toUserInfo = (options: Array<IDropdownOption>): Array<Types.SP.IPeoplePickerUser> => {
        let userInfo: Array<Types.SP.IPeoplePickerUser> = [];

        // Parse the values
        for (let i = 0; i < options.length; i++) {
            // Append the persona
            userInfo.push({
                DisplayText: options[i].text,
                Key: options[i].value
            });
        }

        // Return the user information
        return userInfo;
    }

    // Render the dropdown
    props.el.innerHTML = [
        '<div class="dropdown ' + (props.className || '') + '">',
        '<div class="textfield"></div>',
        '<div class="menu"></div>',
        '<div class="value"></div>',
        '</div>'
    ].join('\n');

    // Render the textfield
    let _tb = TextField({
        el: props.el.querySelector(".textfield"),
        label: props.label,
        required: props.required,
        type: TextFieldTypes.Underline
    });

    // Create the contextual menu
    let _menu = ContextualMenu({
        className: props.className,
        el: props.el.querySelector(".menu"),
        elTarget: props.el.querySelector(".textfield"),
        items: toItems(props.options),
        onClick: (ev, item) => {
            debugger;
            // Get the option
            let option = findOption(props.options, item.value);
            if (option) {
                // Parse the current values
                for (let i = 0; i < value.length; i++) {
                    // Ensure this value isn't already selected
                    if (value[i].value == option.value) {
                        // Close the menu
                        _menu.close();
                        return;
                    }
                }

                // See if this is a multi-select
                if (isMulti) {
                    // Append the value
                    value.push(option);
                } else {
                    // Set the value
                    value = [option];
                }

                // Render the values
                renderValues(value);

                // See if a change event exists
                if (props.onChange) {
                    // Call the event
                    props.onChange(value);
                }
            }

            // Close the menu
            _menu.close();
        }
    });

    // See if the value exists
    let value: Array<IDropdownOption> = [];
    if (props.value) {
        let values = typeof (props.value) === "string" ? [props.value] : props.value;

        // Parse the values
        for (let i = 0; i < values.length; i++) {
            // Find the option
            let option = findOption(props.options, values[i]);
            if (option) {
                // Append the option
                value.push(option);
            }
        }

        // Render the values
        renderValues(value);
    }

    // Return the dropdown
    return {
        get,
        getFabricComponent,
        getValue: () => { return value; },
        setOptions
    };
}