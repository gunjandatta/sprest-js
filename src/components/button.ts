import { IButtonProps } from "./types"

/**
 * Button
 */
export const Button = (props: IButtonProps): HTMLButtonElement => {
    // Add the button html
    props.el.innerHTML = [
        '<button class="ms-Button ' + (props.className || "") + '">',
        '<span class="ms-Button-label">' + (props.text || "") + '</span>',
        '</button>'
    ].join('\n');

    // Get the button
    let btn = props.el.firstElementChild as HTMLButtonElement;

    // See if the button is disabled
    if (props.disable) {
        // Disable the button
        btn.disabled = true;
    }

    // Set the button click event
    btn.onclick = () => {
        // Execute the click event
        props.onClick ? props.onClick() : null;

        // Disable postback
        return false;
    }

    // Return the button
    return btn;
}
