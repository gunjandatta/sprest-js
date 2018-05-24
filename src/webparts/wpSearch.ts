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

            let fields = ((_wpInfo.cfg ? _wpInfo.cfg.Fields : null) || []).concat(props.searchFields || []);

            // Parse the items
            for (let i = 0; i < _items.length; i++) {
                let item = _items[i];
                let addToResults = false;

                // Set the taxonomy mapper
                let mapper = item["TaxCatchAll"];
                mapper = (mapper ? mapper.results : null) || [];

                // Parse the fields
                for (let j = 0; j < fields.length; j++) {
                    let field = fields[j];

                    // Get the field value(s)
                    let fieldValues = item[field.name];
                    if (fieldValues) {
                        fieldValues = fieldValues.results ? fieldValues.results : [fieldValues];

                        // Parse the field values
                        for (let k = 0; k < fieldValues.length; k++) {
                            let fieldValue = fieldValues[k];

                            // Ensure the field value exists
                            if (fieldValue) {
                                // Update the value, based on the type
                                switch (field.type) {
                                    // Lookup
                                    case "Lookup":
                                    case "LookupMulti":
                                        // Set the value
                                        fieldValue = fieldValue.Title;
                                        break;
                                    // Taxonomy
                                    case "TaxonomyFieldType":
                                    case "TaxonomyFieldTypeMulti":
                                        // Parse the mapper
                                        for (let i = 0; i < mapper.length; i++) {
                                            // See if this is the target id
                                            if (mapper[i].ID == fieldValue.WssId) {
                                                // Set the value
                                                fieldValue = mapper[i].Term;
                                            }
                                        }
                                        break;
                                    // URL
                                    case "URL":
                                        // Set the value
                                        fieldValue = fieldValue.Description;
                                        break;
                                    // User
                                    case "User":
                                        // Set the value
                                        fieldValue = fieldValue.Title;
                                        break;
                                }

                                // See if the item contains the filter
                                if (fieldValue && fieldValue.toLowerCase().indexOf(filterText) >= 0) {
                                    // Set the flag
                                    addToResults = true;
                                    break;
                                }
                            }
                        }

                        // See if we are adding this item to the results
                        if (addToResults) {
                            // Add the item
                            results.push(item);

                            // Break from the loop
                            break;
                        }
                    }
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
    let renderFields = (el: HTMLDivElement, list: Types.SP.IListQueryResult) => {
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
        renderFieldsDDL(el.children[0] as HTMLDivElement, list);

        // See if the custom event exists
        if (props.editPanel && props.editPanel.onRenderFooter) {
            // Call the custom event
            props.editPanel.onRenderFooter(el.children[1] as HTMLDivElement, _wpInfo, list);
        }
    }

    // Method to render the fields drop down list
    let renderFieldsDDL = (el: HTMLDivElement, list: Types.SP.IListQueryResult) => {
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
        _ddlFields = Fabric.Dropdown({
            el,
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
                renderFields(this.el.children[0], list);
            },
            onRenderFooter: (el, wpInfo: IWPSearchInfo, list: IListQueryResult) => {
                // Set the webpart information
                _wpInfo = wpInfo;

                // Render the fields
                renderFields(el, list);
            },
            onSave: (cfg: IWPSearchCfg) => {
                // Set the fields
                cfg.Fields = _wpInfo.cfg.Fields || [];

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
            query = (props.onExecutingODATAQuery ? props.onExecutingODATAQuery(wpInfo, query) : query) || {};
            query.Expand = query.Expand || [];
            query.Select = query.Select || ["*"];

            // Ensure the configuration exists
            if (wpInfo.cfg) {
                let hasTaxonomyField = false;

                // Parse the fields
                let fields = (wpInfo.cfg.Fields || []).concat(props.searchFields || []);
                for (let i = 0; i < fields.length; i++) {
                    let field = fields[i];

                    // Add the field, based on the type
                    switch (field.type) {
                        // Lookup
                        case "Lookup":
                        case "LookupMulti":
                            // Add the field
                            query.Expand.push(field.name);
                            query.Select.push(field.name + "/Title");
                            break;
                        // Taxonomy
                        case "TaxonomyFieldType":
                        case "TaxonomyFieldTypeMulti":
                            // Set the flag
                            hasTaxonomyField = true;

                            // Add the field
                            query.Select.push(field.name);
                            break;
                        // User
                        case "User":
                            // Add the field
                            query.Expand.push(field.name);
                            query.Select.push(field.name + "/Title");
                            break;
                        // Default
                        default:
                            query.Select.push(field.name);
                            break;
                    }
                }

                // See if there is a taxonomy field
                if (hasTaxonomyField) {
                    // Get the taxonomy field values
                    query.Expand.push("TaxCatchAll");
                    query.Select.push("TaxCatchAll/ID", "TaxCatchAll/Term");
                }
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