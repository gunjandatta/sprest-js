import { Fabric, ICheckBox, ICheckBoxProps } from "./types"
import { fabric, Templates } from ".";

/**
 * CheckBox
 */
export const CheckBox = (props: ICheckBoxProps): ICheckBox => {
    let _cb: Fabric.ICheckBox = null;

    // Method to get the checkbox element
    let get = (): Fabric.ICheckBox => { return _cb; }

    // Method to get the value
    let getValue = (): boolean => {
        // Get the checkbox value
        return _cb ? _cb.getValue() : false;
    }

    // Add the checkbox html
    props.el.innerHTML = Templates.CheckBox(props);

    // Get the checkbox
    let cb = props.el.querySelector(".ms-CheckBox");

    // Create the checkbox
    _cb = new fabric.CheckBox(cb);

    // See if a change event exists
    if (props.onChange) {
        // Set the checkbox change event
        cb.addEventListener("change", () => {
            // Execute the change event
            props.onChange(getValue());
        });
    }

    // Update the value
    props.value ? _cb.check() : _cb.unCheck();

    // Return the checkbox
    return {
        check: () => { _cb ? _cb.check() : null; },
        get,
        getValue,
        unCheck: () => { _cb ? _cb.unCheck() : null; }
    };
}
