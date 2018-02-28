import { ContextInfo, Web, Types } from "gd-sprest";
import { IWPList, IWPListCfg, IWPListInfo, IWPListProps } from "./types";
import { Fabric } from "..";
import { WebPart, WPCfg } from ".";

/**
 * List WebPart
 */
export const WPList = (props: IWPListProps): IWPList => {
    let _items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult> = null;
    let _list: Types.SP.IListQueryResult | Types.SP.IListResult = null;
    let _wpInfo: IWPListInfo = null;

    /**
     * Display Form
     */

    // Method to render the display form
    let renderDisplayForm = (wpInfo: IWPListInfo) => {
        // Save the information
        _wpInfo = wpInfo;

        // Load the items
        loadItems();
    }

    // Method to load the items
    let loadItems = () => {
        // See if items exist
        if (_items && _items.length > 0) {
            // Call the render event
            props.onRenderItems ? props.onRenderItems(_wpInfo, _items) : null;
            return;
        }

        // See if we are using the CAML query
        let cfg: IWPListCfg = _wpInfo.cfg || {};
        if (props.camlQuery || props.onExecutingCAMLQuery) { loadCAML(cfg.WebUrl, cfg.ListName, props.camlQuery); }
        // Else, load using the ODATA query
        else { loadODATA(cfg.WebUrl, cfg.ListName, props.odataQuery); }
    }

    // Method to load the items using a CAML query
    let loadCAML = (webUrl: string, listName: string, caml: string = "") => {
        // Call the load caml query event
        caml = props.onExecutingCAMLQuery ? props.onExecutingCAMLQuery(_wpInfo, caml) : null;

        // See if we are targeting a different web
        if (webUrl) {
            // Get the context information for the destination web
            // Note - Since we are using a POST request, this would be required for cross-site collection requests
            ContextInfo.getWeb(webUrl).execute((contextInfo) => {
                // Get the web
                (new Web(webUrl, { requestDigest: contextInfo.GetContextWebInformation.FormDigestValue }))
                    // Get the list
                    .Lists(listName)
                    // Query the items
                    .getItemsByQuery(caml)
                    // Execute the request
                    .execute(items => {
                        // Render the items
                        props.onRenderItems ? props.onRenderItems(_wpInfo, items.results) : null;
                    });
            });
        } else {
            // Get the web
            (new Web(webUrl))
                // Get the list
                .Lists(listName)
                // Query the items
                .getItemsByQuery(caml)
                // Execute the request
                .execute(items => {
                    // Render the items
                    props.onRenderItems ? props.onRenderItems(_wpInfo, items.results) : null;
                });
        }
    }

    // Method to load the items using an ODATA query
    let loadODATA = (webUrl: string, listName: string, query: Types.SP.ODataQuery = {}) => {
        // Call the load caml query event
        query = props.onExecutingODATAQuery ? props.onExecutingODATAQuery(_wpInfo, query) : null;

        // Get the web
        (new Web(webUrl))
            // Get the list
            .Lists(listName)
            // Get the items
            .Items()
            // Query the list
            .query(query)
            // Execute the request
            .execute((items) => {
                // Render the items
                props.onRenderItems ? props.onRenderItems(_wpInfo, items.results) : null;
            });
    }

    /**
     * Edit Form
     */

    let _ddl: Fabric.Types.IDropdown = null;
    let _init = false;
    let _lists: Array<Types.SP.IListQueryResult | Types.SP.IListResult> = null;
    let _panel: Fabric.Types.IPanel = null;
    let _panelContents: HTMLElement = null;

    // Method to render the edit form
    let renderEditForm = (wpInfo: IWPListInfo) => {
        // Save the information
        _wpInfo = wpInfo;

        // Render the configuration panel
        _wpInfo.el.innerHTML = [
            '<div></div>',
            '<div></div>',
        ].join('\n');

        // Render the panel
        _panel = Fabric.Panel({
            el: _wpInfo.el.children[0],
            headerText: "Configuration Panel",
            panelType: props.panelType,
            showCloseButton: true
        });

        // Render the button
        let btn = Fabric.Button({
            el: _wpInfo.el.children[1],
            text: "Show Configuration",
            onClick: () => {
                // Show the panel
                _panel.show();

                // Render the configuration
                renderConfiguration();
            }
        });
    }

    // Method to load the lists
    let loadLists = (webUrl?: string): PromiseLike<Array<Types.SP.IListQueryResult | Types.SP.IListResult>> => {
        // Render a loading message
        Fabric.Spinner({
            el: _panelContents.children[1],
            text: "Loading the lists..."
        });

        // Return a promise
        return new Promise((resolve, reject) => {
            // The post render event
            let postRender = () => {
                // See if the list name exists and a post render event exists
                let list = null;
                if (_wpInfo.cfg && _wpInfo.cfg.ListName) {
                    // Parse the dropdown lists
                    for (let i = 0; i < _lists.length; i++) {
                        if (_lists[i].Title == _wpInfo.cfg.ListName) {
                            // Set the list
                            list = _lists[i];
                            break;
                        }
                    }
                }

                // Call the post render event
                props.onPostRender ? props.onPostRender(_wpInfo, list) : null;
            };

            // See if no data has been loaded
            if (_lists == null) {
                // Set the query
                let query: Types.SP.ODataQuery = props.listQuery || {};

                // Get the web
                (new Web(webUrl))
                    // Get the lists
                    .Lists()
                    // Include the fields
                    .query(query)
                    // Execute the request
                    .execute(lists => {
                        // Save the lists
                        _lists = lists.results;

                        // Call the list rendering event
                        _lists = props.onListsRendering ? props.onListsRendering(_wpInfo, _lists) : _lists;

                        // Render the dropdown
                        renderDropdown();

                        // Call the post render event
                        postRender();
                    });
            } else {
                // Render the dropdown
                renderDropdown();

                // Call the post render event
                postRender();
            }
        });
    }

    // Method to render the configuration panel
    let renderConfiguration = () => {
        // Render the panel contents
        _panelContents = _panel.updateContent([
            (props.onRenderHeader ? props.onRenderHeader(_wpInfo) : null) || "",
            '<div id="webUrl"></div>',
            '<div></div>',
            (props.onRenderFooter ? props.onRenderFooter(_wpInfo) : null) || "",
            '<div id="refresh"></div>',
            '<div id="save"></div>'
        ].join('\n'));

        // Render the web url textbox
        let tb = Fabric.TextField({
            el: _panelContents.querySelector("#webUrl"),
            label: "Relative Web Url:",
            description: "The web containing the list. If blank, the current web is used."
        });

        // See if we haven't initialized the form
        if (!_init && _wpInfo && _wpInfo.cfg) {
            // Initialized the textbox
            tb.setValue(_wpInfo.cfg.WebUrl || "");
        }

        // Render the refresh button
        Fabric.Button({
            el: _panelContents.querySelector("#refresh"),
            text: "Refresh",
            onClick: () => {
                // Load the lists
                loadLists(tb.getValue());
            }
        });

        // Render the refresh button
        Fabric.Button({
            el: _panelContents.querySelector("#save"),
            text: "Save",
            onClick: () => {
                let selectedList = _ddl.getValue() as Fabric.Types.IDropdownOption;

                // Get the configuration
                let cfg = {
                    ListName: selectedList ? selectedList.text : "",
                    WebPartId: _wpInfo.wpId,
                    WebUrl: tb.getValue()
                } as IWPListCfg;

                // Call the save event
                cfg = props.onSave ? props.onSave(cfg) : cfg;

                // Save the configuration
                WPCfg.saveConfiguration(_wpInfo.wpId, props.cfgElementId, cfg);
            }
        });

        // Load the lists
        loadLists(tb.getValue());
    }

    // Method to render the dropdown
    let renderDropdown = () => {
        let options: Array<Fabric.Types.IDropdownOption> = [];

        // Parse the lists
        for (let i = 0; i < _lists.length; i++) {
            // Add the option
            options.push({
                text: _lists[i].Title,
                value: _lists[i].Title
            });
        }

        // Render the dropdown
        _ddl = Fabric.Dropdown({
            el: _panelContents.children[1],
            label: "List:",
            options,
            value: !_init && _wpInfo.cfg ? _wpInfo.cfg.ListName : null,
            onChange: (option: Fabric.Types.IDropdownOption) => {
                // Parse the list
                for (let i = 0; i < _lists.length; i++) {
                    // See if this is the target list
                    if (_lists[i].Title == option.text) {
                        // Call the change event
                        props.onListChanged ? props.onListChanged(_wpInfo, _lists[i]) : null;
                        break;
                    }
                }
            }
        });

        // See if we haven't initialized the dropdown
        if (!_init) {
            // Set the intialization flag
            _init = true;
        }
    }

    /**
     * Main
     */

    // Create the webpart
    let _wp = WebPart({
        cfgElementId: props.cfgElementId,
        elementId: props.elementId,
        onRenderDisplay: renderDisplayForm,
        onRenderEdit: renderEditForm
    });

    // Return the webpart
    return {
        cfg: _wp.cfg,
        info: _wp.info,
        items: _items,
        list: _list
    };
}