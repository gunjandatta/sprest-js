import { IListProps } from "../types";

/**
 * List
 */
export const List = (props: IListProps): string => {
    // Return the template
    return [
        '<ul class="ms-List ' + (props.className || "") + '">',
        props.items && props.items.length > 0 ? props.items.join('\n') : '',
        '</ul>'
    ].join('\n');
}