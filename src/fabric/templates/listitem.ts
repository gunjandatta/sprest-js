import { IListItemProps } from "../types";

/**
 * List Item
 */
export const ListItem = (props: IListItemProps) => {
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

    // Return the list item
    return [
        '<li class="ms-ListItem' + className.trim() + '" tabindex="0">',
        '<span class="ms-ListItem-primaryText">' + props.primaryText + '</span>',
        '<span class="ms-ListItem-secondaryText">' + props.secondaryText + '</span>',
        '<span class="ms-ListItem-tertiaryText">' + props.tertiaryText + '</span>',
        '<span class="ms-ListItem-metaText">' + props.metaText + '</span>',
        '<div class="ms-ListItem-selectionTarget">' + (props.selectionTarget || "") + '</div>',
        '<div class="ms-ListItem-actions">' + (props.actions || "") + '</div>',
        '</li>'
    ].join('\n');
}