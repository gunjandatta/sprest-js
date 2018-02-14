import { IListProps } from "../types";

/**
 * List
 */
export const List = (props: IListProps) => {
    // Return the list item
    return [
        '<ul class="ms-List ' + props.className + '">',
        props.items,
        '</ul>'
    ].join('\n');
}