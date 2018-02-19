import { IProps } from ".";

/**
 * List Item Properties
 */
export interface IListItemProps extends IProps {
    /** The list item actions. */
    actions?: string;

    /** True for document types. */
    isDocument?: boolean;

    /** True for image types. */
    isImage?: boolean;

    /** True to make the item selectable. */
    isSelectable?: boolean;

    /** True to make the item selected. */
    isSelected?: boolean;

    /** True to make the item unread. */
    isUnread?: boolean;

    /** True to make the item unseen. */
    isUnseen?: boolean;

    /** The meta text. */
    metaText?: string;

    /** The primary text. */
    primaryText?: string;

    /** The secondary text. */
    secondaryText?: string;

    /** The selection target. */
    selectionTarget?: string;

    /** The tertiary text. */
    tertiaryText?: string;

    /** The list item value. */
    value?: string;
}