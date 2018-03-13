import { SPTypes, Types } from "gd-sprest";
import { IWPSearch, IWPSearchCfg, IWPSearchInfo, IWPSearchProps } from "./types";
import { Fabric } from "..";
import { WPList, WPCfg } from ".";

/**
 * Search WebPart
 */
export const WPSearch = (props: IWPSearchProps): IWPSearch => {
    let ddlFields: Fabric.Types.IDropdown = null;

    // Method to update the 
    let listChanged = (el: HTMLDivElement, wpInfo: IWPSearchInfo, list: Types.SP.IListQueryResult) => {
        let options: Array<Fabric.Types.IDropdownOption> = [];

        // Parse the fields
        for (let i = 0; i < list.Fields.results.length; i++) {
            let addField = false;
            let field = list.Fields.results[i];

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
    }

    // Method to render the footer
    let renderFooter = (el: HTMLDivElement, wpInfo: IWPSearchInfo, list: Types.SP.IListQueryResult) => {
        // Render a spinner
        Fabric.Spinner({
            el,
            text: "Loading the fields..."
        });

        // Load the fields
        listChanged(el, wpInfo, list);
    };

    // Method to save the configuration
    let saveConfiguration = (cfg: IWPSearchCfg) => {
        // Set the fields configuraiton
        cfg.Fields = ddlFields ? ddlFields.getValue() as Array<Fabric.Types.IDropdownOption> : [];

        // Return the configuration
        return cfg;
    }

    // Create the webpart
    let _wp = WPList({
        camlQuery: props.camlQuery,
        cfgElementId: props.cfgElementId,
        className: props.className,
        editPanel: {
            listQuery: props.editPanel ? props.editPanel.listQuery : null,
            menuLeftCommands: props.editPanel ? props.editPanel.menuLeftCommands : null,
            menuRightCommands: props.editPanel ? props.editPanel.menuRightCommands : null,
            onRenderFooter: props.editPanel.onRenderFooter ? props.editPanel.onRenderFooter : null
        },
        elementId: props.elementId,
        helpProps: props.helpProps,
        odataQuery: props.odataQuery,
        onRenderItems: props.onRenderItems,
        onSave: saveConfiguration
    });

    // Return the webpart
    return {
        cfg: _wp.cfg,
        info: _wp.info
    } as any;
}