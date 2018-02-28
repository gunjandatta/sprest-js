import { ITableProps } from "../types";

/**
 * Table
 */
export const Table = (props: ITableProps): string => {
    let columns = props.columns || [];
    let rows = props.rows || [];

    // Set the class name
    let className = [
        props.className || "",
        props.isFixed ? "ms-Table--fixed" : "",
        props.isSelectable ? "ms-Table--selectable" : ""
    ].join(' ').trim();

    // See if we are rendering the header row
    let headerRow = props.renderHeaderRow ? [
        '<thead>',
        '<tr>',
        '<th>' + columns.join('</th><th>') + '</th>',
        '</tr>',
        '</thead>'
    ].join('\n') : "";

    // Parse the rows
    let rowData = [];
    for (let i = 0; i < rows.length; i++) {
        let row = rows[i];

        // Add the opening row element
        rowData.push('<tr>');

        // Parse the columns
        for (let j = 0; j < columns.length; j++) {
            // Add the column element
            rowData.push('<td>' + (row[columns[j]] || "") + '</td>');
        }

        // Add the closing row element
        rowData.push('</tr>');
    }

    // Return the template
    return [
        '<table class="ms-Table ' + className + '">',
        headerRow,
        '<tbody>',
        rowData.join('\n'),
        '</tbody>',
        '</table>'
    ].join('\n');
}