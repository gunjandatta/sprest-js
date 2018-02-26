import { Fabric, ICheckBox, ICheckBoxProps } from "./types"
import { fabric, Templates } from ".";

/**
 * CheckBox
 */
export const CheckBox = (props: ICheckBoxProps): ICheckBox => {
    let _cb: Fabric.ICheckBox = null;

    // Method to get the checkbox element
    let get = (): HTMLInputElement => {
        // Returns the checkbox element
        return props.el.querySelector(".ms-CheckBox") as HTMLInputElement;
    }

    // Method to get the fabric component
    let getFabricComponent = (): Fabric.ICheckBox => {
        // Return the checkbox
        return _cb;
    }

    // Method to get the value
    let getValue = (): boolean => {
        // Get the checkbox value
        return _cb ? _cb.getValue() : false;
    }

    // Add the checkbox html
    props.el.innerHTML = Templates.CheckBox(props);

    // Get the checkbox
    let cb = get();

    // Set the checkbox change event
    cb.onchange = () => {
        // Execute the change event
        props.onChange ? props.onChange(_cb.getValue()) : null;
    }

    // Create the checkbox
    _cb = new fabric.CheckBox(cb);

    // Update the value
    props.value ? _cb.check() : _cb.unCheck();

    // Return the checkbox
    return {
        get,
        getFabricComponent,
        getValue
    };
}
