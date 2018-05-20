import { ContextInfo, Web, Types } from "gd-sprest";
import { IWPList, IWPListCfg, IWPListEditPanel, IWPListInfo, IWPListProps } from "./types";
import { Fabric } from "..";
import { WebPart, WPCfg } from ".";

/**
 * List WebPart
 */
export const WPList = (props: IWPListProps): IWPList => {
    let _cfg: IWPListEditPanel = props.editPanel || {};
    let _el: HTMLDivElement;
    let _items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult> = null;
    let _lists: Array<Types.SP.IListQueryResult | Types.SP.IListResult> = null;
    let _wpInfo: IWPListInfo = null;

    /**
     * Display Form
     */

    // Method to render the display form
    let renderDisplayForm = (wpInfo: IWPListInfo) => {
        // Save the information
        _wpInfo = wpInfo;

        // See if there is a custom render event
        if (props.onRenderDisplay) {
            // Execute the event
            props.onRenderDisplay(_wpInfo);
        } else {
            // Load the items
            loadItems();
        }
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

    // Method to load the lists
    let loadLists = (webUrl?: string) => {
        // Set the query
        let query: Types.SP.ODataQuery = (props.editPanel ? props.editPanel.listQuery : null) || {};

        // Render a loading message
        Fabric.Spinner({
            el: _el.children[2],
            text: "Loading the lists..."
        });

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
                _lists = (_cfg.onListsRendering ? _cfg.onListsRendering(_wpInfo, _lists) : null) || _lists;

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

                // Render the configuration
                renderConfiguration(list);

                // Call the list changed event
                props.editPanel.onListChanged ? props.editPanel.onListChanged(_wpInfo, list) : null;
            });
    }

    // Method to render the configuration panel
    let renderConfiguration = (list?: Types.SP.IListQueryResult | Types.SP.IListResult) => {
        // Render the panel contents
        _el.innerHTML = [
            '<div></div>',
            '<div></div>',
            '<div></div>',
            '<div></div>',
        ].join('\n');

        // Render the web url textbox
        let tb = Fabric.TextField({
            el: _el.children[1],
            label: "Relative Web Url:",
            description: "The web containing the list. If blank, the current web is used.",
            value: _wpInfo && _wpInfo.cfg ? _wpInfo.cfg.WebUrl : "",
            onChange: (value) => {
                // Update the configuration
                _wpInfo.cfg.WebUrl = value;
            }
        });

        // See if the lists exists
        if (_lists) {
            // See if the list hasn't been set, and a configuration exists
            if (list == null && _wpInfo.cfg.ListName) {
                // Parse the lists
                for (let i = 0; i < _lists.length; i++) {
                    // See if this is the target list
                    if (_lists[i].Title == _wpInfo.cfg.ListName) {
                        // Set the list
                        list = _lists[i];

                        // Call the change event
                        props.editPanel.onListChanged ? props.editPanel.onListChanged(_wpInfo, list) : null;

                        // Break from the loop
                        break;
                    }
                }
            }

            // Render the header
            if (_cfg.onRenderHeader) {
                _cfg.onRenderHeader(_el.children[0] as HTMLDivElement, _wpInfo, list);
            }

            // Render the dropdown
            renderDropdown(_el.children[2] as HTMLDivElement);

            // Render the footer
            if (_cfg.onRenderFooter) {
                _cfg.onRenderFooter(_el.children[3] as HTMLDivElement, _wpInfo, list);
            }
        } else {
            // Load the lists
            loadLists(tb.getValue());
        }
    }

    // Method to render the dropdown
    let renderDropdown = (el: HTMLDivElement) => {
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
        let ddl = Fabric.Dropdown({
            el,
            label: "List:",
            options,
            value: _wpInfo && _wpInfo.cfg ? _wpInfo.cfg.ListName : null,
            onChange: (options: Array<Fabric.Types.IDropdownOption>) => {
                let option = options[0];
                if (option) {
                    // Parse the list
                    for (let i = 0; i < _lists.length; i++) {
                        // See if this is the target list
                        if (_lists[i].Title == option.text) {
                            // Update the configuration
                            _wpInfo.cfg.ListName = option.value;

                            // Call the change event
                            _cfg.onListChanged ? _cfg.onListChanged(_wpInfo, _lists[i]) : null;
                            break;
                        }
                    }
                }
            }
        });
    }

    /**
     * Main
     */

    // Create the menu commands
    let menuLeftCommands: Array<Fabric.Types.ICommandButtonProps> = [
        {
            icon: "Refresh",
            text: "Refresh",
            onClick: () => {
                // Load the lists
                loadLists(_wpInfo.cfg.WebUrl);
            }
        }
    ];

    // See if custom commands exist
    if (props.editPanel && props.editPanel.menuLeftCommands) {
        // Add the custom commands
        menuLeftCommands = menuLeftCommands.concat(props.editPanel.menuLeftCommands);
    }

    // Create the webpart
    let _wp = WebPart({
        cfgElementId: props.cfgElementId,
        className: props.className,
        editPanel: {
            panelType: props.editPanel ? props.editPanel.panelType : null,
            menuLeftCommands,
            menuRightCommands: props.editPanel ? props.editPanel.menuRightCommands : null,
            onRenderHeader: (el, wpInfo) => {
                // Save the properties
                _el = el;
                _wpInfo = wpInfo;

                // Render the configuration
                renderConfiguration();
            },
            onSave: (cfg: IWPListCfg) => {
                // Update the webpart configuration and return it
                cfg.ListName = _wpInfo.cfg.ListName;
                cfg.WebUrl = _wpInfo.cfg.WebUrl;

                // Call the save event
                cfg = (props.editPanel && props.editPanel.onSave ? props.editPanel.onSave(cfg) : null) || cfg;

                // Return the configuration
                return cfg;
            }
        },
        elementId: props.elementId,
        onRenderDisplay: renderDisplayForm,
        wpClassName: props.wpClassName
    });

    // Return the webpart
    return {
        cfg: _wp.cfg,
        info: _wp.info
    };
}