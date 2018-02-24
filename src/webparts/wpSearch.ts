import { SPTypes, Types } from "gd-sprest";
import { IWPSearchCfg, IWPSearchInfo, IWPSearchProps } from "./types";
import { Fabric } from "..";
import { WPList, WPCfg } from ".";

/**
 * Search WebPart
 */
export const WPSearch = (props: IWPSearchProps) => {
    let ddlFields: Fabric.Types.IDropdown = null;

    // Method to update the 
    let listChanged = (wpInfo: IWPSearchInfo, list: Types.SP.IListResult) => {
        // Get the fields
        list.Fields().execute(fields => {
            let options: Array<Fabric.Types.IDropdownOption> = [];

            // Parse the fields
            for (let i = 0; i < fields.results.length; i++) {
                let addField = false;
                let field = fields.results[i];

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
                        text: field.Title + " [" + field.InternalName + "]",
                        value: field.InternalName
                    });
                }
            }

            // Render the field dropdown
            ddlFields = Fabric.Dropdown({
                el: wpInfo.el.querySelector("#field-cfg"),
                multi: true,
                options
            });
        });
    }

    // Method to render the footer
    let renderFooter = (wpInfo: IWPSearchInfo, lists: Array<Types.SP.IListResult>) => {
        // Render a field dropdown if a list exists
        let footer = document.querySelector("#field-cfg");
        if (footer && wpInfo.cfg && wpInfo.cfg.ListName) {
            // Render a spinner
            Fabric.Spinner({
                el: footer,
                text: "Loading the fields..."
            });

            // Parse the lists
            for (let i = 0; i < lists.length; i++) {
                let list = lists[i];

                // See if this is the target list
                if (list.Title == wpInfo.cfg.ListName) {
                    // Load the fields
                    listChanged(wpInfo, list);
                    break;
                }
            }
        }
    };

    // Method to save the configuration
    let saveConfiguration = (cfg: IWPSearchCfg) => {
        // Set the fields configuraiton
        cfg.Fields = ddlFields ? ddlFields.getValue() as Array<Fabric.Types.IDropdownOption> : [];

        // Return the configuration
        return cfg;
    }

    // Return the webpart
    return WPList({
        camlQuery: props.camlQuery,
        cfgElementId: props.cfgElementId,
        className: props.className,
        elementId: props.elementId,
        helpProps: props.helpProps,
        odataQuery: props.odataQuery,
        onListChanged: listChanged,
        onListsRendering: props.onListsRendering,
        onPostRender: renderFooter,
        onRenderDisplay: props.onRenderDisplay,
        onRenderEdit: props.onRenderEdit,
        onRenderFooter: () => { return "<div id='field-cfg'></div>" },
        onRenderHeader: props.onRenderHeader,
        onRenderItems: props.onRenderItems,
        onSave: saveConfiguration
    })
}