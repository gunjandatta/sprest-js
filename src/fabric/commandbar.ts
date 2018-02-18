import { Fabric, ICommandBar, ICommandBarProps } from "./types"
import { fabric, Templates } from ".";

/**
 * Command Bar
 */
export const CommandBar = (props: ICommandBarProps): ICommandBar => {
    // Method to get the command bar
    let get = (): Fabric.ICommandBar => { return _menu; }

    // Set the command bar html
    props.el.innerHTML = Templates.CommandBar(props);

    // Create the command bar
    let _menu: Fabric.ICommandBar = new fabric.CommandBar(props.el.querySelector(".ms-CommandBar"));

    // Return the command bar
    return { get };
}
