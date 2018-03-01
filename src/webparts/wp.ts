import { ContextInfo } from "gd-sprest";
import { Button, Panel, PanelTypes, Types } from "../fabric";
import { IWebPart, IWebPartCfg, IWebPartEditPanel, IWebPartInfo, IWebPartObject, IWebPartProps } from "./types";
import { WPCfg } from "./wpCfg";
declare var SP;
declare var MSOWebPartPageFormName;

/**
 * Web Part
 */
export const WebPart = (props: IWebPartProps): IWebPart => {
    let _panel: Types.IPanel = null;
    let _panelCfg: IWebPartEditPanel = props.editPanel || {};
    let _cfg: IWebPartCfg = {};
    let _wp: IWebPartInfo = null;

    /**
     * Method to add the help link to a script part editor.
     * @wpId - The webpart id.
     */
    let addHelpLink = () => {
        // Ensure the help properties exist
        if (props.helpProps) {
            // Get the webpart's "Snippet"
            let link = document.querySelector("div[webpartid='" + _wp.wpId + "'] a[title='Edit Snippet']");
            if (link) {
                // Create the help link
                let helpLink = document.createElement("a");
                helpLink.href = props.helpProps.url || "#";
                helpLink.style.paddingLeft = "10px";
                helpLink.setAttribute("role", "button");
                helpLink.title = props.helpProps.title || "Help";
                helpLink.innerHTML = "<span class='ms-metadata'>" + helpLink.title + "</span>";
                helpLink.target = "_blank";

                // Append the link
                link.parentElement.appendChild(helpLink);
            }
        }
    }

    /**
     * Method to get the webpart
     */
    let getWebPart = (wpId: string): PromiseLike<IWebPartObject> => {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Get the current context
            let context = SP.ClientContext.get_current();

            // Get the webpart from the current page
            let page = context.get_web().getFileByServerRelativeUrl(ContextInfo.serverRequestPath);
            let wpMgr = page.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
            let wpDef = wpMgr.get_webParts().getById(wpId);
            let wp = wpDef.get_webPart();
            context.load(wp, "Properties");

            // Execute the request
            context.executeQueryAsync(
                // Success
                () => {
                    // Resolve the promise
                    resolve({
                        Context: context,
                        Properties: wp.get_properties(),
                        WebPart: wp,
                        WebPartDefinition: wpDef,
                        WebPartId: wp.get_id()
                    } as IWebPartObject);
                },
                // Error
                (...args) => {
                    // Reject the promise
                    reject(args[1] ? args[1].get_message() : "");
                }
            );
        });
    }

    /**
     * Method to get the webpart id for a specified element
     * @param el - The target element.
     */
    let getWebPartId = (el: HTMLElement) => {
        // Loop until we find the webpart id
        while (el) {
            // See if this element contains the webpart id
            let wpId = el.getAttribute("webpartid");
            if (wpId) {
                // Return the webpart id
                return wpId;
            }

            // Check the parent
            el = el.parentElement;
        }

        // Unable to detect
        return "";
    }

    /**
     * Method to get the webpart information
     */
    let getWebPartInfo = (): IWebPartInfo => {
        let targetInfo: IWebPartInfo = {
            cfg: null,
            el: null,
            wpId: null
        };

        // Ensure the element id exists
        if (props.elementId) {
            // Get the webpart elements
            let elements = document.querySelectorAll("#" + props.elementId);
            for (let i = 0; i < elements.length; i++) {
                let elWebPart = elements[i] as HTMLElement;

                // See if we have already configured this element
                if (elWebPart.getAttribute("data-isConfigured")) { continue; }

                // Get the webpart id
                let wpId = getWebPartId(elWebPart);
                if (wpId) {
                    // See if the configuration element exists
                    let elCfg: HTMLElement = props.cfgElementId ? elWebPart.parentElement.querySelector("#" + props.cfgElementId) : null as any;
                    if (elCfg) {
                        try {
                            // Parse the configuration
                            let data = elCfg.innerText.trim();
                            let cfg: IWebPartCfg = data.length > 0 ? JSON.parse(data) : null;

                            // See if the webaprt id exists
                            if (cfg && cfg.WebPartId) {
                                // See if it's for this webpart
                                if (cfg.WebPartId == wpId) {
                                    // Set the target information
                                    targetInfo = {
                                        cfg,
                                        el: elWebPart,
                                        wpId: wpId
                                    };
                                    break;
                                }
                            } else {
                                // Set the target information
                                targetInfo = {
                                    cfg: {
                                        WebPartId: wpId
                                    },
                                    el: elWebPart,
                                    wpId: wpId
                                };
                                break;
                            }
                        }
                        catch (ex) {
                            // Set the target information
                            targetInfo = {
                                cfg: {
                                    WebPartId: wpId
                                },
                                el: elWebPart,
                                wpId: wpId
                            };

                            // Log
                            console.log("[sp-webpart] Error parsing the configuration for element '" + props.cfgElementId + "'.");
                        }

                        // Break from the loop
                        break;
                    } else {
                        // Set the target information
                        targetInfo = {
                            cfg: {
                                WebPartId: wpId
                            },
                            el: elWebPart,
                            wpId: wpId
                        };
                        break;
                    }
                }
            }

            // Ensure elements were found
            if (elements.length == 0) {
                // Log
                console.log("[sp-webpart] Error - Unable to find elements with id '" + props.elementId + "'.")
            }
        } else {
            // Log
            console.log("[sp-webpart] The target element id is not defined.");
        }

        // Ensure the target element exists
        if (targetInfo.el) {
            // Set the configuration flag
            targetInfo.el.setAttribute("data-isConfigured", "true");
        }

        // Return the target information
        return targetInfo;
    }

    /**
     * Method to detect if a page is being edited
     */
    let isEditMode = () => {
        let formName = MSOWebPartPageFormName ? MSOWebPartPageFormName : "";

        // Get the form
        let form = document.forms[MSOWebPartPageFormName];
        if (form) {
            // Get the wiki page mode
            let wikiPageMode: any = form._wikiPageMode ? form._wikiPageMode.value : null;

            // Get the webpart page mode
            let wpPageMode = form.MSOLayout_InDesignMode ? form.MSOLayout_InDesignMode.value : null;

            // Determine if the page is being edited
            return wikiPageMode == "Edit" || wpPageMode == "1";
        }

        // Unable to determine
        return false;
    }

    /**
     * Method to render the webpart
     */
    let render = () => {
        let element = null;

        // Get the webpart information
        _wp = getWebPartInfo();
        if (_wp == null || _wp.el == null) {
            // Log
            console.log("[sp-webpart] The target webpart element '" + props.elementId + "' was not found.");
            return;
        }

        // Set the configuration
        _cfg = _wp.cfg;

        // See if the page is being edited
        let returnVal = null;
        if (isEditMode()) {
            // Add the help link
            addHelpLink();

            // Call the render event
            if (props.onRenderEdit) {
                // Execute the render edit event
                returnVal = props.onRenderEdit(_wp);
            }
            // See if we are displaying the default edit panel
            else if (!(props.editPanel && props.editPanel.hide)) {
                // Display the edit panel
                renderEditPanel();
            }
        } else {
            // See if the configuration is defined, but has no value
            if (_wp.cfg || (props.cfgElementId || "").length == 0) {
                // Execute the render edit event
                returnVal = props.onRenderDisplay(_wp);
            } else {
                // Render a message
                _wp.el.innerHTML = '<h3>Please edit the page and configure the webpart.</h3>';
            }
        }

        // See if a promise was returned
        if (returnVal && returnVal.then) {
            // Wait for the request to complete
            returnVal.then((...args) => {
                // Execute the post render event
                props.onPostRender ? props.onPostRender(_wp) : null;
            });
        } else {
            // Execute the post render event
            props.onPostRender ? props.onPostRender(_wp) : null;
        }
    }

    // Renders the configuration panel
    let renderConfiguration = () => {
        // Render the panel contents
        let panelContents = _panel.updateContent([
            '<div></div>',
            '<div></div>',
            '<div></div>'
        ].join('\n'));

        // See if the render header event exists
        if (_panelCfg.onRenderHeader) {
            // Call the event
            _panelCfg.onRenderHeader(panelContents.children[0] as HTMLDivElement, _wp);
        }

        // See if we are rendering the save button
        let hideSaveBtn = _panelCfg.hideSaveButton;
        if (!hideSaveBtn) {
            // Render the refresh button
            Button({
                el: panelContents.children[1],
                text: "Save",
                onClick: () => {
                    // Call the save event and set the configuration
                    let cfg = _panelCfg.onSave ? _panelCfg.onSave(_wp.cfg) : null;
                    cfg = cfg ? cfg : _wp.cfg;

                    // Save the configuration
                    WPCfg.saveConfiguration(_wp.wpId, props.cfgElementId, cfg);
                }
            });
        }

        // See if the render footer event exists
        if (_panelCfg.onRenderFooter) {
            // Call the event
            _panelCfg.onRenderFooter(panelContents.children[2] as HTMLDivElement, _wp);
        }
    }

    // The default render method when the page is edited
    let renderEditPanel = () => {
        // Ensure we are rendering the panel
        if (_panelCfg == null || _panelCfg.hide) { return; }

        // Render the configuration panel
        _wp.el.innerHTML = [
            '<div></div>',
            '<div></div>',
        ].join('\n');

        // Render the panel
        _panel = Panel({
            el: _wp.el.children[0],
            headerText: "Configuration Panel",
            panelType: _panelCfg.panelType || PanelTypes.Medium,
            showCloseButton: true
        });

        // Render the button
        let btn = Button({
            el: _wp.el.children[1],
            text: "Show Configuration",
            onClick: () => {
                // Show the panel
                _panel.show();

                // Render the configuration
                renderConfiguration();
            }
        });
    }

    // Add a load event
    window.addEventListener("load", () => {
        // Render the component
        render();
    });

    return {
        cfg: _cfg,
        info: _wp
    }
}