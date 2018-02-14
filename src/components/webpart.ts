import { ContextInfo } from "gd-sprest";
import * as WebPartTypes from "./types";
declare var SP;
declare var MSOWebPartPageFormName;

/**
 * WebPart Object
 */
interface IWebPartObject {
    /** The JSOM context object */
    Context: any;

    /** The webpart properties object */
    Properties: any;

    /** The webpart id */
    WebPartId: string;

    /** The webpart html element */
    WebPart: HTMLElement;

    /** The webpart definition object */
    WebPartDefinition: any;
}

/**
 * Web Part
 */
class _WebPart {
    private _props: WebPartTypes.IWebPartProps = null;
    private _wp: WebPartTypes.IWebPartInfo = null;

    /**
     * Constructor
     * @param props - The webpart properties.
     */
    constructor(props: WebPartTypes.IWebPartProps) {
        // Set the properties
        this._props = props || {} as any;

        // Add a load event
        window.addEventListener("load", () => {
            // Render the component
            this.render();
        });
    }

    /**
     * Method to add the help link to a script part editor.
     * @wpId - The webpart id.
     */
    private addHelpLink = () => {
        // Ensure the help properties exist
        if (this._props.helpProps) {
            // Get the webpart's "Snippet"
            let link = document.querySelector("div[webpartid='" + this._wp.wpId + "'] a[title='Edit Snippet']");
            if (link) {
                // Create the help link
                let helpLink = document.createElement("a");
                helpLink.href = this._props.helpProps.url || "#";
                helpLink.style.paddingLeft = "10px";
                helpLink.setAttribute("role", "button");
                helpLink.title = this._props.helpProps.title || "Help";
                helpLink.innerHTML = "<span class='ms-metadata'>" + helpLink.title + "</span>";
                helpLink.target = "_blank";

                // Append the link
                link.parentElement.appendChild(helpLink);
            }
        }
    }

    // Method to create an instance of the webpart
    static create(props: WebPartTypes.IWebPartProps) {
        // Return an instance of the webpart
        return new _WebPart(props);
    }

    /**
     * Method to get the webpart
     */
    private getWebPart = (wpId: string): PromiseLike<IWebPartObject> => {
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
    private getWebPartId = (el: HTMLElement) => {
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
    private getWebPartInfo = (): WebPartTypes.IWebPartInfo => {
        let targetInfo: WebPartTypes.IWebPartInfo = {
            cfg: null,
            el: null,
            wpId: null
        };

        // Ensure the element id exists
        if (this._props.elementId) {
            // Get the webpart elements
            let elements = document.querySelectorAll("#" + this._props.elementId);
            for (let i = 0; i < elements.length; i++) {
                let elWebPart = elements[i] as HTMLElement;

                // See if we have already configured this element
                if (elWebPart.getAttribute("data-isConfigured")) { continue; }

                // Get the webpart id
                let wpId = this.getWebPartId(elWebPart);
                if (wpId) {
                    // See if the configuration element exists
                    let elCfg: HTMLElement = this._props.cfgElementId ? elWebPart.parentElement.querySelector("#" + this._props.cfgElementId) : null as any;
                    if (elCfg) {
                        try {
                            // Parse the configuration
                            let cfg: WebPartTypes.IWebPartCfg = JSON.parse(elCfg.innerText.trim());

                            // See if the webaprt id exists
                            if (cfg.WebPartId) {
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
                            console.log("[sp-webpart] Error parsing the configuration for element '" + this._props.cfgElementId + "'.");
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
                console.log("[sp-webpart] Error - Unable to find elements with id '" + this._props.elementId + "'.")
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
    private isEditMode = () => {
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
    private render = () => {
        let element = null;

        // Get the webpart information
        this._wp = this.getWebPartInfo();
        if (this._wp == null || this._wp.el == null) {
            // Log
            console.log("[sp-webpart] The target webpart element '" + this._props.elementId + "' was not found.");
            return;
        }

        // See if the page is being edited
        let returnVal = null;
        if (this.isEditMode()) {
            // Add the help link
            this.addHelpLink();

            // Call the render event
            if (this._props.onRenderEdit) {
                // Execute the render edit event
                returnVal = this._props.onRenderEdit(this._wp);
            }
        } else {
            // See if the configuration is defined, but has no value
            if (this._wp.cfg || (this._props.cfgElementId || "").length == 0) {
                // Execute the render edit event
                returnVal = this._props.onRenderDisplay(this._wp);
            } else {
                // Render a message
                this._wp.el.innerHTML = '<h3>Please edit the page and configure the webpart.</h3>';
            }
        }

        // See if a promise was returned
        if (returnVal && returnVal.then) {
            // Wait for the request to complete
            returnVal.then((...args) => {
                // Execute the post render event
                this._props.onPostRender ? this._props.onPostRender(this._wp) : null;
            });
        } else {
            // Execute the post render event
            this._props.onPostRender ? this._props.onPostRender(this._wp) : null;
        }
    }
}
export const WebPart: WebPartTypes.IWebPart = _WebPart as any;