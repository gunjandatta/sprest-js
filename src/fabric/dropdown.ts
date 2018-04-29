import { Fabric, IDropdown, IDropdownOption, IDropdownProps } from "./types";
import {
    fabric,
    Callout, CalloutPositions, CalloutTypes,
    List, Templates,
    TextField, TextFieldTypes
} from ".";

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
    // Method to create the list items
    let createList = (el: Element, options: Array<IDropdownOption> = []): Fabric.IList => {
        let items: Array<string> = [];

        // Method to render the items
        let renderItems = (options: Array<IDropdownOption>, isCategory: boolean = false) => {
            let items: Array<string> = [];

            // Parse the options
            for (let i = 0; i < options.length; i++) {
                let option = options[i];

                // See if this is a header
                if (option.type == DropdownTypes.Header) {
                    // Add a header item
                    items.push(Templates.ListItem({
                        className: "ms-ListItem--" + (isCategory ? "category" : "header"),
                        isSelectable: isCategory ? props.multi : false,
                        isSelected: props.multi ? option.isSelected : false,
                        primaryText: option.text,
                        value: JSON.stringify(option)
                    }));
                }
                // Else, see if this option has children
                else if (option.options && option.options.length > 0) {
                    // Add the option as a category
                    items.push(renderItems(option.options, true).join('\n'));
                }
                // Else, this is an item
                else {
                    // Add the item
                    items.push(Templates.ListItem({
                        isSelectable: props.multi,
                        isSelected: props.multi ? option.isSelected : false,
                        secondaryText: option.text,
                        value: JSON.stringify(option)
                    }));
                }
            }

            // Return the items
            return items;
        }

        // Set the click event
        let onClick = (ev: MouseEvent) => {
            let item = ev.currentTarget as HTMLLIElement;
            let option = JSON.parse(item.getAttribute("data-value")) as IDropdownOption;
            let tb = _tb.get()._textField;

            // Return if this is a header
            if (item.className.indexOf("ms-ListItem--header") > 0) { return; }

            // See if this is a multi-select
            if (props.multi) {
                let removeFl = false;

                // See if this item is selected
                if (item.className.indexOf("is-selected") >= 0) {
                    // Unselect this item
                    item.className = item.className.replace(/is\-selected/g, "").trim();

                    // Set the flag
                    removeFl = true;
                } else {
                    // Select this item
                    item.className += " is-selected";
                }

                // Update the value
                let values = updateValue(option.value, removeFl);

                // Call the change event
                props.onChange ? props.onChange(values) : null;
            } else {
                // Update the textbox
                updateValue(option.value);

                // Call the change event
                props.onChange ? props.onChange(option) : null;

                // Close the callout
                _callout._contextualHost.disposeModal();
            }
        };

        // Return the list
        return List({
            className: "ms-List--dropdown",
            el,
            items: renderItems(options),
            onClick
        }).get();
    }

    // Method to get the toggle element
    let get = (): HTMLInputElement => {
        // Returns the toggle element
        return props.el.querySelector(".ms-ContextualMenu") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = (): Fabric.IContextualHost => {
        // Return the menu
        return _callout._contextualHost;
    }

    // Method to get the value
    let getValue = (): IDropdownOption | Array<IDropdownOption> => {
        let value = _tb.get()._textField.getAttribute("data-value");

        // Return the value
        return value ? JSON.parse(value) : value;
    }

    // Method to set the options
    let setOptions = (options: Array<IDropdownOption>): IDropdown => {
        // Clear the textbox value
        _tb.setValue("");

        // Create the list
        _list = createList(_callout._container, options);

        // Return this object
        return this;
    }

    // Method to update the value
    let updateValue = (value: any, removeFl: boolean = false) => {
        let isUnsorted = props.multi && props.isUnsorted ? true : false;
        let values: Array<IDropdownOption> = (isUnsorted ? getValue() as any : null) || [];

        // See if this is a multi-select dropdown
        if (props.multi) {
            // Get the selected values
            let items = _list._container.querySelectorAll(".is-selected");
            for (let i = 0; i < items.length; i++) {
                let option = JSON.parse(items[i].getAttribute("data-value")) as IDropdownOption;

                // See if we are removing this value
                if (value == option.value && removeFl) { continue; }

                // See if the values are unsorted
                if (isUnsorted) {
                    let exists = false;

                    // Parse the selected values
                    for (let j = 0; j < values.length; j++) {
                        if (values[j].value == option.value) {
                            // Set the flag
                            exists = true;
                            break;
                        }
                    }

                    // Ensure the value exists
                    if (!exists) {
                        // Add the value
                        values.push(option);
                    }
                } else {
                    // Add the value
                    values.push(option);
                }
            }

            // Parse the values
            let textValues = [];
            for (let i = 0; i < values.length; i++) {
                // Add the text value
                textValues.push(values[i].text);
            }

            // Update the textbox
            _tb.get()._textField.setAttribute("data-value", JSON.stringify(props.multi ? values : values[0] || {}));
            _tb.setValue(textValues.join(", "));
        } else {
            let findOption = (options: Array<IDropdownOption>) => {
                // Ensure options exist
                if (options && options.length > 0) {
                    // Parse the options
                    for (let i = 0; i < options.length; i++) {
                        let option = options[i];

                        // See if this is the target item, and return it
                        if (option.value == value) { return option }

                        // Search the sub-options
                        option = findOption(option.options);
                        if (option) { return option; }
                    }
                }

                // Option not found
                return null;
            }

            // Find the option
            let option = findOption(props.options);
            if (option) {
                // Update the textbox
                _tb.get()._textField.setAttribute("data-value", JSON.stringify(option));
                _tb.setValue(option.text);
            }
        }

        // Return the values
        return values;
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
        el: props.el.querySelector(".textfield"),
        label: props.label,
        required: props.required,
        type: TextFieldTypes.Underline
    });

    // Create the callout
    let _callout = Callout({
        className: "dropdown-list",
        el: props.el.querySelector(".callout"),
        elTarget: _tb.get()._textField,
        position: CalloutPositions.left,
        subText: props.description,
        type: CalloutTypes.Default
    });

    // Render the list
    let _list = createList(_callout._container, props.options);

    // Update the value
    updateValue(props.value);

    // Disable the textbox
    _tb.get()._textField.addEventListener("keydown", ev => {
        // Cancel the event
        ev.preventDefault();
        return false;
    });

    // Fix the callout position
    _tb.get()._textField.addEventListener("click", ev => {
        // Get the callout element
        let callout = _callout._contextualHost ? _callout._contextualHost._contextualHost : null;
        if (callout) {
            // Ensure the fabric class name exists
            if (callout.className.indexOf("fabric") < 0) {
                // Set the class name
                callout.className += " fabric";
            }

            // See if a class is being applied
            if (props.className) {
                // Apply the class name
                callout.className += " " + props.className;
            }

            // Fix the menu
            // This was needed after we updated the css to target fabric elements
            // The "arrow" doesn't seem to be present, will need to figure this out
            _callout._contextualHost._matchTargetWidth = true;
            _callout._contextualHost._openModal();

            // See if the top style is defined
            if (callout.style.top) {
                let position = parseFloat(callout.style.top.replace("px", ""));
                let offset = document.body.clientHeight - (position + callout.scrollHeight);

                // See if the context menu is off the screen
                if (offset < 0) {
                    // Set the top position
                    callout.style.top = (position + offset) + "px"

                    // Get the callout beak icon
                    let beak = callout.querySelector(".ms-ContextualHost-beak") as HTMLDivElement;
                    if (beak && beak.style.top) {
                        // Get the position
                        position = parseFloat(beak.style.top.replace("px", ""));

                        // Update the position
                        beak.style.top = (position - offset) + "px";
                    }
                }
            }
        }
    });

    // Return the dropdown
    return {
        get,
        getFabricComponent,
        getValue,
        setOptions
    };
}