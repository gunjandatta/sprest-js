import { SPTypes, Types } from "gd-sprest";
import { IWPSearch, IWPSearchCfg, IWPSearchInfo, IWPSearchProps } from "./types";
import { Fabric } from "..";
import { WPList, WPCfg } from ".";
import { IListQueryResult } from "gd-sprest/build/mapper/types";

/**
 * Search WebPart
 */
export const WPSearch = (props: IWPSearchProps): IWPSearch => {
    let _ddlFields: Fabric.Types.IDropdown = null;
    let _el: HTMLDivElement = null;
    let _items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult> = [];
    let _wpInfo: IWPSearchInfo;

    // Method to filter the items
    let filterItems = (filterText: string): Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult> => {
        let results: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult> = [];

        // Ensure the filter exists
        if (filterText && filterText.length > 0) {
            // Update the filter
            filterText = filterText.toLowerCase();

            // Parse the items
            for (let i = 0; i < _items.length; i++) {
                let item = _items[i];
                let addToResults = false;

                // Parse the fields
                let fields = (_wpInfo.cfg ? _wpInfo.cfg.Fields : null) || [];
                for (let j = 0; j < fields.length; j++) {
                    // Get the field value
                    let fieldValue: string = (item[fields[j]] as string || "").toLowerCase();

                    // See if the item contains the filter
                    if (fieldValue.indexOf(filterText) >= 0) {
                        // Set the flag
                        addToResults = true;
                        break;
                    }
                }

                // See if we are adding this item to the results
                if (addToResults) {
                    // Add the item
                    results.push(item);
                }
            }
        } else {
            // Copy the items
            results = _items;
        }

        // Return the results
        return results;
    }

    // Method to render the fields
    let renderFields = (el: HTMLDivElement, wpInfo: IWPSearchInfo, list: IListQueryResult) => {
        // Render the fields
        this.el = el;
        el.innerHTML = "<div></div><div></div>";

        // Ensure the list exists
        if (list == null) { return; }

        // Render a spinner
        Fabric.Spinner({
            el: el.children[0],
            text: "Loading the fields..."
        });

        // Load the fields dropdown list
        renderFieldsDDL(el.children[0] as HTMLDivElement, wpInfo, list);

        // See if the custom event exists
        if (props.editPanel && props.editPanel.onRenderFooter) {
            // Call the custom event
            props.editPanel.onRenderFooter(el.children[1] as HTMLDivElement, wpInfo, list);
        }
    }

    // Method to render the fields drop down list
    let renderFieldsDDL = (el: HTMLDivElement, wpInfo: IWPSearchInfo, list: Types.SP.IListQueryResult) => {
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
                    text: field.Title + " [" + field.InternalName + "]",
                    value: field.InternalName
                });
            }
        }

        // Render the field dropdown
        _ddlFields = Fabric.Dropdown({
            el,
            label: "Filter Field(s):",
            multi: true,
            options
        });
    }

    // Set the list query
    let listQuery: Types.SP.ODataQuery = (props.editPanel ? props.editPanel.listQuery : null) || {};
    listQuery.Expand = listQuery.Expand || [];
    listQuery.Expand.push("Fields");

    // Create the webpart
    let _wp = WPList({
        camlQuery: props.camlQuery,
        cfgElementId: props.cfgElementId,
        className: props.className,
        editPanel: {
            listQuery,
            menuLeftCommands: props.editPanel ? props.editPanel.menuLeftCommands : null,
            menuRightCommands: props.editPanel ? props.editPanel.menuRightCommands : null,
            onListChanged: (wpInfo: IWPSearchInfo, list: IListQueryResult) => {
                // Render the fields
                renderFields(this.el.children[0], wpInfo, list);
            },
            onRenderFooter: renderFields,
            onSave: (cfg: IWPSearchCfg) => {
                // Clear the fields
                cfg.Fields = [];

                // Parse the fields
                let fields = _ddlFields.getValue();
                for (let i = 0; i < fields.length; i++) {
                    // Add the field name
                    cfg.Fields.push(fields[i].value);
                }

                // Call the save event
                cfg = (props.editPanel && props.editPanel.onSave ? props.editPanel.onSave(cfg) : null) || cfg;

                // Return the configuration
                return cfg;
            }
        },
        elementId: props.elementId,
        helpProps: props.helpProps,
        odataQuery: props.odataQuery,
        onExecutingODATAQuery: (wpInfo: IWPSearchInfo, query) => {
            // Default the query
            query = query || {};
            query.Select = query.Select || [];

            // Parse the fields
            let fields = (wpInfo.cfg ? wpInfo.cfg.Fields : null) || [];
            for (let i = 0; i < fields.length; i++) {
                // Add the field
                query.Select.push(fields[i]);
            }

            // Return the query
            return query;
        },
        onRenderItems: (wpInfo: IWPSearchInfo, items) => {
            // Save the wpinfo and items
            _wpInfo = wpInfo;
            _items = items;

            // Call the custom event
            props.onRenderItems ? props.onRenderItems(wpInfo, items) : null;
        },
        wpClassName: props.wpClassName
    });

    // Return the webpart
    return {
        cfg: _wp.cfg,
        filterItems,
        info: _wp.info
    } as any;
}