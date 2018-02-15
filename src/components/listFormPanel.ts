import { SPTypes } from "gd-sprest";
import { Button, Panel, PanelTypes, Templates } from "../fabric";
import { Fabric, IPanel } from "../fabric/types";
import { Field, ListForm } from ".";
import { IListFormPanel, IListFormPanelProps, IListFormResult } from "./types";

/**
 * Item Form
 */
export const ListFormPanel = (props: IListFormPanelProps): IListFormPanel => {
    let _formInfo: IListFormResult = null;
    let _isOpen = false;

    // Render the panel
    let renderPanel = () => {
        let panelContent = "";

        // Parse the fields
        for (let i = 0; i < props.fields.length; i++) {
            // Append the div for this field
            panelContent += "<div data-field='" + props.fields[i] + "'></div>";
        }

        // Show the panel
        let content = _panel.show(panelContent);

        // Parse the fields
        for (let i = 0; i < props.fields.length; i++) {
            let field = props.fields[i];

            // Render the field
            Field({
                el: content.children[i],
                fieldInfo: {
                    field: _formInfo.fields[field],
                    listName: props.listName,
                    name: field
                }
            });
        }
    }

    // Render the panel
    props.el.innerHTML = Templates.Panel(props, Templates.Spinner({ text: "Loading..." }));

    // Create the panel
    let _panel = Panel({
        el: props.el.querySelector(".panel"),
        className: props.className,
        headerText: props.panelTitle || "",
        panelType: typeof (props.panelType) === "number" ? props.panelType : PanelTypes.Large
    });

    // Create an instance of the list form
    new ListForm({
        cacheKey: props.cacheKey,
        fields: props.fields,
        item: props.item,
        itemId: props.itemId,
        listName: props.listName,
        loadAttachments: props.loadAttachments,
        query: props.query,
        webUrl: props.webUrl
    }).then(formInfo => {
        // Save the form information
        _formInfo = formInfo;

        // See if the panel is open
        if (_isOpen) {
            // Render the panel
            renderPanel();
        }
    });

    // Return the panel
    return {
        show: (controlMode: number = SPTypes.ControlMode.Display) => {
            // See if the panel is open
            if (_isOpen) { return; }

            // Show the panel
            _panel.show();

            // Set the flag
            _isOpen = true;
        }
    }
}