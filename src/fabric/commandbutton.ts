import { Fabric, ICommandButton, ICommandButtonProps } from "./types"
import { fabric, Templates } from ".";

/**
 * Command Button
 */
export const CommandButton = (props: ICommandButtonProps): ICommandButton => {
    // Method to get the fabric component
    let get = (): Fabric.ICommandButton => { return _button; }

    // Set the command button html
    props.el.innerHTML = Templates.CommandButton(props);

    // Create the contextual menu
    let _button: Fabric.ICommandButton = new fabric.CommandButton(props.el.querySelector(".ms-CommandButton"));

    // Return the contextual menu
    return { get };
}
