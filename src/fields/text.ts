import { Helper } from "gd-sprest";
import { fabric } from "../fabric";

export interface ITextField extends Helper.Types.IFieldInfo { }
export const TextField = {
    // Method to render a textfield
    render: (el: Element, fieldInfo: ITextField) => {
        // Render the textfield
        el.innerHTML = [
            "<div class='ms-TextField'>",
            "<label class='ms-Label'>" + fieldInfo.title + "</label>",
            "<input class='ms-TextField-field' type='text' value='" + (fieldInfo.defaultValue || "") + "' placeholder=''></input>",
            "</div>"
        ].join("");

        // Initialize the textfield
        new fabric.TextField(el.firstChild as any);
    }
}