import { SPTypes } from "gd-sprest";
import { Button, CommandBar, Panel, PanelTypes, Templates, Spinner } from "../fabric";
import { Fabric, IPanel } from "../fabric/types";
import { Field, ListForm } from ".";
import { IField, IListFormPanel, IListFormPanelProps, IListFormResult } from "./types";

/**
 * Item Form
 */
export const ListFormPanel = (props: IListFormPanelProps): IListFormPanel => {
    let _fields: Array<IField> = [];
    let _formInfo: IListFormResult = null;

    // Add the menu click events
    let addMenuClickEvents = () => {
        let buttons: any = null;

        // Cancel buttons
        buttons = _panel.get()._panel.querySelectorAll(".ms-CommandButton-cancel");
        for (let i = 0; i < buttons.length; i++) {
            // Add a click event
            buttons[i].addEventListener("click", () => {
                // Close the panel
                _panel.hide();

                // Disable postback
                return false;
            });
        }

        // Close buttons
        buttons = _panel.get()._panel.querySelectorAll(".ms-CommandButton-cancel");
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
        buttons = _panel.get()._panel.querySelectorAll(".ms-CommandButton-edit");
        for (let i = 0; i < buttons.length; i++) {
            // Add a click event
            buttons[i].addEventListener("click", () => {
                // Render the form
                renderForm(SPTypes.ControlMode.Display);

                // Disable postback
                return false;
            });
        }

        // Set the save button click event
        buttons = _panel.get()._panel.querySelectorAll(".ms-CommandButton-save");
        for (let i = 0; i < buttons.length; i++) {
            // Add a click event
            buttons[i].addEventListener("click", () => {
                let formValues = {};

                // Parse the fields
                debugger;
                for (let i = 0; i < _fields.length; i++) {
                    let field = _fields[i];

                    // Set the form value
                    formValues[field.fieldInfo.name] = field.element.getValue();
                }
                debugger;

                // Save the item
                ListForm.saveItem(_formInfo, formValues).then(formInfo => {
                    // Update the form info
                    _formInfo = formInfo;

                    // Render the form
                    renderForm(SPTypes.ControlMode.Display);
                });

                // Disable postback
                return false;
            });
        }
    }

    // Render the fields
    let renderFields = (controlMode: number = SPTypes.ControlMode.Display) => {
        // Clear the fields
        _fields = [];

        // Parse the fields
        for (let fieldName in _formInfo.fields) {
            let field = _formInfo.fields[fieldName];

            // See if this is a read-only field
            if (field.ReadOnlyField) {
                // Do not render in the new form
                if (controlMode == SPTypes.ControlMode.New) { continue; }
            }

            // Render the field
            Field({
                controlMode,
                el: _panel.get()._panel.querySelector("[data-field='" + fieldName + "']"),
                fieldInfo: {
                    field,
                    listName: _formInfo.list.Title,
                    name: fieldName
                }
            }).then(field => {
                // Add the field
                _fields.push(field);
            });
        }
    }

    // Render the form
    let renderForm = (controlMode: number = SPTypes.ControlMode.Display) => {
        // Parse the fields
        let fields = "";
        for (let fieldName in _formInfo.fields) {
            // Append the div for this field
            fields += "<div data-field='" + fieldName + "'></div>";
        }

        // Render the menu
        renderMenu(controlMode);

        // Update the panel content
        _panel.updateContent('<div class="ms-ListForm">' + fields + '</div>');

        // Render the fields
        renderFields(controlMode);

        // Add the menu click event
        addMenuClickEvents();
    }

    // Render the menu
    let renderMenu = (controlMode: number) => {
        // Determine the main commands
        let mainCommands = null;
        switch (controlMode) {
            // Display
            case SPTypes.ControlMode.Display:
                mainCommands = [
                    {
                        className: "ms-CommandButton-edit",
                        icon: "Edit",
                        text: "Edit"
                    },
                    {
                        className: "ms-CommandButton-close",
                        icon: "Cancel",
                        text: "Close"
                    }
                ];
                break;

            // Edit
            case SPTypes.ControlMode.Edit:
                mainCommands = [
                    {
                        className: "ms-CommandButton-update",
                        icon: "Update",
                        text: "Update"
                    },
                    {
                        className: "ms-CommandButton-cancel",
                        icon: "Cancel",
                        text: "Cancel"
                    }
                ];
                break;

            // New
            case SPTypes.ControlMode.New:
                mainCommands = [
                    {
                        className: "ms-CommandButton-save",
                        icon: "Save",
                        text: "Save"
                    },
                    {
                        className: "ms-CommandButton-close",
                        icon: "Cancel",
                        text: "Close"
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
            renderForm(props.controlMode);
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
                _panel.show();

                // Render the form
                renderForm(props.controlMode);
            } else {
                // Show the panel
                let content = _panel.show(_formInfo ? "" : "<div class='spinner'></div>");

                // Render a spinner
                Spinner({ el: content.querySelector(".spinner"), text: "Loading..." });
            }
        }
    }
}