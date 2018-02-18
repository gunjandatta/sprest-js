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
    let _values = props.value && typeof (props.value) === "string" ? [props.value] : (props.value || []) as Array<string>

    // Method to create the items
    let createList = (el: Element): Fabric.IList => {
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
                        primaryText: option.text
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
                        secondaryText: option.text
                    }));
                }
            }

            // Return the items
            return items;
        }

        // Set the click event
        let onClick = (ev: MouseEvent) => {
            let item = ev.currentTarget as HTMLLIElement;

            // Return if this is a header
            if (item.className.indexOf("ms-ListItem--header") > 0) { return; }

            // See if this is a multi-select
            if (props.multi) {
                // See if this item is selected
                if (item.className.indexOf("is-selected") >= 0) {
                    // Unselect this item
                    item.className = item.className.replace(/is\-selected/g, "").trim();
                } else {
                    // Select this item
                    item.className += " is-selected";
                }

                // Query the selected items
                let values = [];
                let items = _list._container.querySelectorAll(".is-selected");
                for (let i = 0; i < items.length; i++) {
                    // Add the item
                    values.push(
                        (items[i].querySelector(".ms-ListItem-primaryText") as HTMLDivElement).innerText ||
                        (items[i].querySelector(".ms-ListItem-secondaryText") as HTMLDivElement).innerText
                    );
                }

                // Update the textbox
                _tb.setValue(values.join(', '));
            } else {
                // Update the textbox
                _tb.setValue(
                    (item.querySelector(".ms-ListItem-primaryText") as HTMLDivElement).innerText ||
                    (item.querySelector(".ms-ListItem-secondaryText") as HTMLDivElement).innerText
                );

                // Close the callout
                _callout._contextualHost.disposeModal();
            }
        };

        // Return the list
        return List({
            className: "ms-List--dropdown",
            el,
            items: renderItems(props.options || []),
            onClick
        });
    }

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
    let getValue = (): string => {
        // Return the value
        return _tb.getValue();
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

    // Create the callout
    let _callout = Callout({
        el: props.el.querySelector(".callout"),
        elTarget: _tb.get()._textField,
        position: CalloutPositions.left,
        subText: props.description,
        type: CalloutTypes.Default
    });

    // Render the list
    let _list = createList(_callout._container);

    // Return the dropdown
    return {
        get,
        getFabricComponent,
        getValue
    };
}