import { IContextualMenuProps, IContextualMenuItem, Fabric } from "../types";

/**
 * Contextual Menu
 */
export const ContextualMenu = (props: IContextualMenuProps): string => {
    // Set the hidden property
    let isHidden = typeof (props.isHidden) === "boolean" ? props.isHidden : true;

    // Method to determine if checkboxes exist
    let hasCheckboxes = (items?: Array<IContextualMenuItem>) => {
        // Parse the items
        for (let i = 0; i < items.length; i++) {
            // See if this item has icons
            if (items[i].isSelected) { return true; }
        }

        // Does not have icons
        return false;
    }

    // Method to determine if icons exist
    let hasIcons = (items?: Array<IContextualMenuItem>) => {
        // Parse the items
        for (let i = 0; i < items.length; i++) {
            // See if this item has icons
            if (items[i].icon) { return true; }
        }

        // Does not have icons
        return false;
    }

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
                    '<li class="ms-ContextualMenu-item' + (item.menu ? ' ms-ContextualMenu-item--hasMenu' : '') + '">',
                    '<a class="' + className + '" tabindex="1">' + (item.text || "") + '</a>',
                    item.icon ? '<i class="ms-Icon ms-Icon--' + item.icon + '"></i>' : '',
                    item.menu ? '<i class="ms-ContextualMenu-subMenuIcon ms-Icon ms-Icon--ChevronRight"></i>' : '',
                    item.menu ? renderList(false, "", item.menu) : '',
                    '</li>'
                ].join('\n'));
            }
        }

        // Return the items
        return menuItems.join('\n');
    }

    // Method to render the list template
    let renderList = (isHidden: boolean, className: string, items: Array<IContextualMenuItem>) => {
        // Set the class name
        let elClassName = [
            "ms-ContextualMenu",
            className || "",
            isHidden ? "is-hidden" : "",
            hasCheckboxes(items) ? "ms-ContextualMenu--hasChecks" : "",
            hasIcons(items) ? "ms-ContextualMenu--hasIcons" : ""
        ].join(' ').trim();

        // Return the template
        return [
            '<ul class="' + elClassName + '">',
            renderItems(items),
            '</ul>'
        ].join('\n');
    };

    // Render the template
    return renderList(isHidden, "", props.items);
}