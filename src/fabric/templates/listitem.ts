import { IListItemProps } from "../types";

/**
 * List Item
 */
export const ListItem = (props: IListItemProps): string => {
    // Set the class name
    let className = [
        props.className || "",
        props.isDocument ? "ms-ListItem--document" : "",
        props.isImage ? "ms-ListItem--image" : "",
        props.isSelectable ? "is-selectable" : "",
        props.isSelected ? "is-selected" : "",
        props.isUnread ? "is-unread" : "",
        props.isUnseen ? "is-unseen" : ""
    ].join(' ').trim();

    // See if the actions exist
    let actions: Array<string> = [];
    if (props.actions && props.actions.length > 0) {
        // Parse the actions
        for (let i = 0; i < props.actions.length; i++) {
            let action = props.actions[i];

            // Add the action
            actions.push([
                '<div class="ms-ListItem-action"' + (action.target ? ' data-target="' + action.target + '"' : '') + (action.url ? ' data-url="' + action.url + '"' : '') + '>',
                '<i class="ms-Icon ms-Icon--' + action.iconName + '"></i>',
                '</div>'
            ].join('\n'));
        }
    }

    // Return the template
    return [
        '<li class="ms-ListItem ' + className + '" tabindex="0" data-value=\'' + (props.value || "") + '\'>',
        props.primaryText ? '<span class="ms-ListItem-primaryText">' + props.primaryText + '</span>' : '',
        props.secondaryText ? '<span class="ms-ListItem-secondaryText">' + props.secondaryText + '</span>' : '',
        props.tertiaryText ? '<span class="ms-ListItem-tertiaryText">' + props.tertiaryText + '</span>' : '',
        props.metaText ? '<span class="ms-ListItem-metaText">' + props.metaText + '</span>' : '',
        '<div class="ms-ListItem-selectionTarget">' + (props.selectionTarget || "") + '</div>',
        '<div class="ms-ListItem-actions">' + actions.join('\n') + '</div>',
        '</li>'
    ].join('\n');
}