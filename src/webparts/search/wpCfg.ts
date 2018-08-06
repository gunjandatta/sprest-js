import { SPTypes, Types } from "gd-sprest";
import * as Fabric from "../../fabric";
import { IWPSearchCfg, IWPSearchEditPanel, IWPSearchInfo } from "../types";

/**
 * Search WebPart Edit Panel
 */
export const WPSearchEditPanel = (props: IWPSearchEditPanel = {}): IWPSearchEditPanel => {
    let _elFieldsDDL = null;
    let _wpInfo: IWPSearchInfo = null;

    // Method to render the fields
    let renderFields = (el: HTMLDivElement, list: Types.SP.IListQueryResult) => {
        // Render the fields
        this.el = el;
        el.innerHTML = "<div></div><div></div>";
        let _elFieldsDDL = el.children[0];

        // Ensure the list exists
        if (list == null) { return; }

        // Render a spinner
        Fabric.Spinner({
            el: _elFieldsDDL,
            text: "Loading the fields..."
        });

        // Load the fields dropdown list
        renderFieldsDDL(list);

        // Call the custom event
        props.onRenderFooter ? props.onRenderFooter(el.children[1] as HTMLDivElement, _wpInfo, list) : null;
    }

    // Method to render the fields drop down list
    let renderFieldsDDL = (list: Types.SP.IListQueryResult) => {
        let options: Array<Fabric.Types.IDropdownOption> = [];

        // Parse the fields
        let fields = (list.Fields ? list.Fields.results : null) || [];
        for (let i = 0; i < fields.length; i++) {
            let addField = false;
            let field = fields[i];

            // Add the field, based on the type
            switch (field.FieldTypeKind) {
                // Searchable Fields
                case SPTypes.FieldType.Choice:
                case SPTypes.FieldType.MultiChoice:
                case SPTypes.FieldType.Lookup:
                case SPTypes.FieldType.Text:
                case SPTypes.FieldType.URL:
                case SPTypes.FieldType.User:
                    addField = true;
                    break;
                default:
                    // Allow managed metadata fields
                    addField = field.TypeAsString.startsWith("TaxonomyFieldType");
                    break;
            }

            // See if we are adding the field
            if (addField) {
                options.push({
                    data: field.TypeAsString,
                    text: field.Title + " [" + field.InternalName + "]",
                    value: field.InternalName
                });
            }
        }

        // Sort the options
        options = options.sort((a, b) => {
            if (a.value < b.value) { return -1; }
            if (a.value > b.value) { return 1; }
            return 0;
        });

        // See if fields exist
        let value = [];
        if (_wpInfo.cfg && _wpInfo.cfg.Fields) {
            // Parse the fields
            for (let i = 0; i < _wpInfo.cfg.Fields.length; i++) {
                // Add the field
                value.push(_wpInfo.cfg.Fields[i].name);
            }
        }

        // Render the field dropdown
        Fabric.Dropdown({
            el: _elFieldsDDL,
            label: "Filter Field(s):",
            multi: true,
            options,
            value,
            onChange: options => {
                // Clear the fields
                _wpInfo.cfg.Fields = [];

                // Parse the options
                for (let i = 0; i < options.length; i++) {
                    let option = options[i];

                    // Add the field
                    _wpInfo.cfg.Fields.push({
                        name: option.value,
                        type: option.data
                    });
                }
            }
        });
    }

    // Set the list query
    let listQuery: Types.SP.ODataQuery = props.listQuery || {};
    listQuery.Expand = listQuery.Expand || [];
    listQuery.Expand.push("Fields");

    // Return the edit panel
    return {
        listQuery,
        menuLeftCommands: props.menuLeftCommands,
        menuRightCommands: props.menuRightCommands,
        onListsRendering: props.onListsRendering,
        onRenderHeader: props.onRenderHeader,
        panelType: props.panelType,
        showSaveButton: props.showSaveButton,
        onListChanged: (wpInfo: IWPSearchInfo, list: Types.SP.IListQueryResult) => {
            // Render the fields
            renderFields(this.el.children[0], list);
        },
        onRenderFooter: (el, wpInfo: IWPSearchInfo, list: Types.SP.IListQueryResult) => {
            // Save the webpart information
            _wpInfo = wpInfo;

            // Render the fields
            renderFields(el, list);
        },
        onSave: (cfg: IWPSearchCfg) => {
            // Update the configuration
            cfg.Fields = _wpInfo.cfg.Fields || [];

            // Return the configuration
            return props.onSave ? props.onSave(_wpInfo.cfg) : _wpInfo.cfg;
        }
    }
}