import { Fabric, ICallout, ICalloutProps } from "./types";
import { fabric, Templates } from ".";

/**
 * Callout Positions
 */
export const CalloutPositions = {
    left: "left",
    right: "right",
    top: "top",
    bottom: "bottom"
}

/**
 * Callout Types
 */
export enum CalloutTypes {
    /** Action */
    Action = 0,

    /** Close */
    Close = 1,

    /** Default */
    Default = 2,

    /** Out of the Box */
    OOBE = 3,

    /** Peek */
    Peek = 4,
}

/**
 * Callout
 */
export const Callout = (props: ICalloutProps): ICallout => {
    // Set the template
    props.el.innerHTML = Templates.Callout(props);

    // Create the callout
    let _callout: Fabric.ICallout = new fabric.Callout(props.el.querySelector(".ms-Callout"), props.elTarget, props.position || "top");

    // Ensure the target element exists
    if (props.elTarget) {
        // Set the click event
        props.elTarget.addEventListener("click", () => {
            // See if the host exists
            if (_callout._contextualHost) {
                // See if the fabric class doesn't exist
                if (_callout._contextualHost._contextualHost.classList.contains("fabric") == false) {
                    // Add the class
                    _callout._contextualHost._contextualHost.classList.add("fabric");
                }

                // See if actions are defined
                if (props.actions) {
                    // Parse the action buttons
                    let buttons = _callout._contextualHost._contextualHost.querySelectorAll(".ms-CommandButton-button");
                    for (let i = 0; i < buttons.length; i++) {
                        let action = props.actions[i];
                        let button = buttons[i];

                        // Set the button index
                        button.setAttribute("data-btn-idx", i.toString());

                        // Ensure the action and click event exist
                        if (action && action.onClick) {
                            // Set a click event
                            button.addEventListener("click", ev => {
                                let btn = ev.currentTarget as HTMLButtonElement;
                                let btnIdx = parseInt(btn.getAttribute("data-btn-idx"));
                                let action = props.actions[btnIdx];

                                // See if the click event exists
                                if (action && action.onClick) {
                                    // Execute the click event
                                    action.onClick(btn);
                                }
                            });
                        }
                    }
                }
            }
        });
    }

    // Return the callout
    return {
        close: () => {
            // See if the contextual host exists
            if (_callout._contextualHost && _callout._contextualHost) {
                // Close the callout
                _callout._contextualHost.disposeModal();
            }
        },
        get: () => { return _callout; },
        getContent: () => { return _callout._container.querySelector(".ms-Callout-content"); }
    };
}