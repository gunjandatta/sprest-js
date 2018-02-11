import { IToggle, IToggleProps } from "./types"
import { fabric } from ".";

/**
 * Toggle
 */
export const Toggle = (props: IToggleProps): IToggle => {
    let _toggle = null;

    // Method to get the toggle element
    let get = (): HTMLInputElement => {
        // Returns the toggle element
        return props.el.querySelector(".ms-Toggle") as HTMLInputElement;
    }

    // Method to get the value
    let getValue = (): boolean => {
        // Get the toggle value
        return _toggle ? _toggle._container.querySelector(".ms-Toggle-field").className.indexOf("is-selected") > 0 : false;
    }

    // Set the class name
    let className = props.className || "";
    if (props.disable) { className += " is-disabled"; }

    // Add the toggle html
    props.el.innerHTML = [
        '<div class="ms-Toggle ' + className.trim() + '">',
        props.description ? '<span class="ms-Toggle-description">' + props.description + "</span>" : '',
        '<input type="checkbox" class="ms-Toggle-input">',
        '<label class="ms-Toggle-field" tabindex="0">',
        '<span class="ms-Label ms-Label--off">Off</span>',
        '<span class="ms-Label ms-Label--on">On</span>',
        '</label>',
        '</div>'
    ].join('\n');

    // Get the toggle
    let toggle = get();

    // Set the toggle click event
    toggle.onclick = () => {
        // Execute the change event
        props.onChange ? props.onChange(getValue()) : null;
    }

    // Create the toggle
    _toggle = new fabric.Toggle(toggle);

    // Update the value
    props.value ? _toggle.check() : _toggle.uncheck();

    // Return the toggle
    return {
        get,
        getValue
    };
}
