import { IContextualMenuProps, IContextualMenuItem } from "../types";

/**
 * Contextual Menu
 */
export const ContextualMenu = (props: IContextualMenuProps): string => {
    // Method to render the items
    let renderItems = (items?: Array<IContextualMenuItem>) => {
        let menuItems: Array<string> = [];

        // Ensure items exist
        if (items && items.length > 0) {
            // Parse the items
            for (let i = 0; i < items.length; i++) {
                let item = items[i];

                // Set the class name
                let className = [
                    "ms-ContextualMenu-link",
                    item.isDisabled ? "is-disabled" : "",
                    item.isSelected ? "is-selected" : ""
                ].join(" ");

                // Add the menu item
                menuItems.push([
                    '<li class="ms-ContextualMenu-item">',
                    '<a class="ms-ContextualMenu-link' + (item.isSelected) + '" tabindex="1">' + (item.text || "") + '</a>',
                    item.icon ? '<i class="ms-Icon ms-Icon--' + item.icon + '"></i>' : '',
                    '</li>'
                ].join('\n'));
            }
        }

        // Return the items
        return menuItems;
    }


    // Return the template
    return [
        '<ul class="ms-ContextualMenu ' + (props.className || "") + '">',
        renderItems(props.items),
        '</ul>'
    ].join('\n');
}