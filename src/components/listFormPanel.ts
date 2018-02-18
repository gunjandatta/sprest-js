import { SPTypes } from "gd-sprest";
import { Button, CommandBar, Panel, PanelTypes, Templates, Spinner } from "../fabric";
import { Fabric, IPanel } from "../fabric/types";
import { Field, ListForm } from ".";
import { IListFormPanel, IListFormPanelProps, IListFormResult } from "./types";

/**
 * Item Form
 */
export const ListFormPanel = (props: IListFormPanelProps): IListFormPanel => {
    let _formInfo: IListFormResult = null;

    // Add the menu click events
    let addMenuClickEvents = () => {
        // Parse the buttons
        let buttons = _panel.get()._panel.querySelectorAll(".ms-CommandButton-cancel");
        for (let i = 0; i < buttons.length; i++) {
            // Add a click event
            buttons[i].addEventListener("click", () => {
                // Close the panel
                _panel.hide();

                // Disable postback
                return false;
            });
        }

        // Set the edit button click event
        let edit = _panel.get()._panel.querySelector(".ms-CommandButton-edit") as HTMLButtonElement;
        if (edit) {
            edit.addEventListener("click", () => {
                // Disable postback
                return false;
            });
        }

        // Set the save button click event
        let save = _panel.get()._panel.querySelector(".ms-CommandButton-save") as HTMLButtonElement;
        if (save) {
            save.addEventListener("click", () => {
                // Disable postback
                return false;
            });
        }
    }

    // Render the fields
    let renderFields = () => {
        // Parse the fields
        for (let fieldName in _formInfo.fields) {
            let field = _formInfo.fields[fieldName];

            // Render the field
            Field({
                el: _panel.get()._panel.querySelector("[data-field='" + fieldName + "']"),
                fieldInfo: {
                    field,
                    listName: _formInfo.list.Title,
                    name: fieldName
                }
            });
        }
    }

    // Render the form
    let renderForm = () => {
        // Parse the fields
        let fields = "";
        for (let fieldName in _formInfo.fields) {
            // Append the div for this field
            fields += "<div data-field='" + fieldName + "'></div>";
        }

        // Render the menu
        renderMenu();

        // Update the panel content
        _panel.updateContent('<div class="ms-ListForm">' + fields + '</div>');

        // Render the fields
        renderFields();

        // Add the menu click event
        addMenuClickEvents();
    }

    // Render the menu
    let renderMenu = () => {
        // Determine the main commands
        let mainCommands = null;
        switch (props.controlMode) {
            // Edit Button
            case SPTypes.ControlMode.Display:
                mainCommands = [
                    {
                        className: "ms-CommandButton-edit",
                        icon: "Edit",
                        text: "Edit"
                    },
                    {
                        className: "ms-CommandButton-cancel",
                        icon: "Cancel",
                        text: "Cancel"
                    }
                ];
                break;

            // Save Button
            case SPTypes.ControlMode.Edit:
            case SPTypes.ControlMode.New:
                mainCommands = [
                    {
                        className: "ms-CommandButton-save",
                        icon: "Save",
                        text: "Save"
                    },
                    {
                        className: "ms-CommandButton-cancel",
                        icon: "Cancel",
                        text: "Cancel"
                    }
                ];
                break;
        }

        // Render the menu
        CommandBar({
            className: "ms-CommandBar--navBar",
            el: _panel.get()._panel.querySelector(".ms-Panel-header"),
            mainCommands,
            sideCommands: [
                {
                    className: "ms-CommandButton-cancel",
                    icon: "Cancel"
                }
            ]
        });
    }

    // Render the panel
    props.el.innerHTML = Templates.Panel({
        className: props.className,
        el: props.el,
        headerText: props.panelTitle,
        panelType: typeof (props.panelType) === "number" ? props.panelType : PanelTypes.Large,
        showCloseButton: false
    });

    // Create the panel
    let _panel = Panel(props);

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