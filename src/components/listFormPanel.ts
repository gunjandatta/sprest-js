import { SPTypes } from "gd-sprest";
import { Button, Panel, PanelTypes, Templates, Spinner } from "../fabric";
import { Fabric, IPanel } from "../fabric/types";
import { Field, ListForm } from ".";
import { IListFormPanel, IListFormPanelProps, IListFormResult } from "./types";

/**
 * Item Form
 */
export const ListFormPanel = (props: IListFormPanelProps): IListFormPanel => {
    let _formInfo: IListFormResult = null;

    // Render the form
    let renderForm = () => {
        let panelContent = "";

        // Parse the fields
        for (let fieldName in _formInfo.fields) {
            // Append the div for this field
            panelContent += "<div data-field='" + fieldName + "'></div>";
        }

        // Update the panel
        let content = _panel.update(panelContent);

        // Parse the fields
        for (let fieldName in _formInfo.fields) {
            let field = _formInfo.fields[fieldName];

            // Render the field
            Field({
                el: content.querySelector("[data-field='" + fieldName + "']"),
                fieldInfo: {
                    field,
                    listName: _formInfo.list.Title,
                    name: fieldName
                }
            });
        }
    }

    // Render the panel
    props.el.innerHTML = Templates.Panel(props);

    // Create the panel
    let _panel = Panel({
        el: props.el,
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
        if (_panel.isOpen()) {
            // Render the panel
            renderForm();
        }
    });

    // Return the panel
    return {
        show: (controlMode: number = SPTypes.ControlMode.Display) => {
            // See if the panel is open
            if (_panel.isOpen()) { return; }

            // See if the list info exists
            if (_formInfo) {
                // Show the form
                _panel.show()

                // Render the form
                renderForm();
            } else {
                // Show the panel
                let content = _panel.show(_formInfo ? "" : "<div class='spinner'></div>");

                // Render a spinner
                Spinner({ el: content.querySelector(".spinner"), text: "Loading..." });
            }
        }
    }
}