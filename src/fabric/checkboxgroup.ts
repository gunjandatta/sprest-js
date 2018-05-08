import { Fabric, ICheckBoxGroup, ICheckBoxGroupProps } from "./types"
import { CheckBox } from ".";

/**
 * CheckBox Group
 */
export const CheckBoxGroup = (props: ICheckBoxGroupProps): ICheckBoxGroup => {
    let _cbs: Array<Fabric.ICheckBox> = [];

    // Method to get the checkbox elements
    let get = (): Array<Fabric.ICheckBox> => { return _cbs; };

    // Method to get the value
    let getValues = (): Array<boolean> => {
        let values = [];

        // Parse the checkboxes
        for (let i = 0; i < _cbs.length; i++) {
            // Add the value
            values.push(_cbs[i].getValue());
        }

        // Get the checkbox values
        return values;
    }

    // Parse the checkbox properties
    for (let i = 0; i < props.props.length; i++) {
        let cbProps = props.props[i];

        // Create an element
        let el = document.createElement("div");

        // Create the checkbox
        let cb = CheckBox({
            className: cbProps.className,
            disable: cbProps.disable,
            el,
            label: cbProps.label,
            onChange: cbProps.onChange || props.onChange,
            required: cbProps.required,
            value: cbProps.value
        }).get();

        // Append the checkbox
        props.el.appendChild(cb._container);

        // Save the checkbox
        _cbs.push(cb);
    }

    // Return the checkbox group
    return {
        get,
        getValues
    };
}