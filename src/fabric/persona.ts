import { IPersonaProps, IPersonasProps } from "./types";
import { Templates } from ".";

/**
 * Persona
 */
export const Persona = (props: IPersonaProps) => {
    // Render the persona
    props.el.innerHTML = Templates.Persona(props.userInfo);

    // See if a click event exists
    if (props.onCancel) {
        // Get the cancel icon
        let elIcon = props.el.querySelector("ms-Icon--Cancel");

        // Set the click event
        elIcon.addEventListener("click", () => {
            // Clear the persona
            props.el.innerHTML = "";

            // Call the event
            props.onCancel(props.userInfo);
        });
    }
}

/**
 * Personas
 */
export const Personas = (props: IPersonasProps) => {
    // Clear the element
    props.el.innerHTML = "";

    // Parse the personas
    for (let i = 0; i < props.userInfo.length; i++) {
        // Create the persona
        let el = document.createElement("div");
        el.innerHTML = Templates.Persona(props.userInfo[i]);
        el.children[0].setAttribute("data-idx", i.toString());

        // Set the index of the cancel icon
        let elCancel = el.querySelector(".ms-Icon--Cancel");
        elCancel.setAttribute("data-idx", i.toString());

        // Append the persona
        props.el.appendChild(el.children[0]);
    }

    // Get the cancel icons
    let elIcons = props.el.querySelectorAll(".ms-Icon--Cancel");
    for (let i = 0; i < elIcons.length; i++) {
        // Set the click event
        elIcons[i].addEventListener("click", ev => {
            // Get the index
            let idx = (ev.currentTarget as HTMLElement).getAttribute("data-idx");

            // Parse the personas
            for (let i = 0; i < props.el.children.length; i++) {
                // See if this is the target index
                if (props.el.children[i].getAttribute("data-idx") == idx) {
                    // Remove the element
                    props.el.children[i].remove();

                    // Call the click event
                    props.onCancel(props.userInfo[parseInt(idx)]);
                }
            }
        });
    }
}