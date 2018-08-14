import { Helper } from "gd-sprest";
import * as Fabric from "../../fabric";
import { IWPTaxonomyInfo, IWPTaxonomyCfg, IWPTaxonomyEditPanel } from "../types";

/**
 * Taxonomy WebPart Edit Panel
 */
export const WPTaxonomyEditPanel = (props: IWPTaxonomyEditPanel = {}): IWPTaxonomyEditPanel => {
    let _elHeader: HTMLDivElement = null;
    let _elFooter: HTMLDivElement = null;
    let _elTermGroups: HTMLDivElement = null;
    let _elTermSets: HTMLDivElement = null;
    let _elTermSetTerms: HTMLDivElement = null;
    let _wpInfo: IWPTaxonomyInfo = null;

    // Method to render the configuration
    let renderConfiguration = (el: HTMLDivElement, wpInfo: IWPTaxonomyInfo) => {
        // Save the properties
        _wpInfo = wpInfo;

        // Render the template
        el.innerHTML = "<div></div><div></div><div></div><div></div><div></div>";
        _elHeader = el.children[0] as any;
        _elTermGroups = el.children[1] as any;
        _elTermSets = el.children[2] as any;
        _elTermSetTerms = el.children[3] as any;
        _elFooter = el.children[4] as any;

        // Render the term groups
        renderTermGroups();
    }

    // Method to render the term groups
    let renderTermGroups = () => {
        // Render a loading dialog
        Fabric.Spinner({
            el: _elTermGroups,
            text: "Loading the term groups"
        });

        // Load the term groups
        Helper.Taxonomy.getTermGroups().then(groups => {
            let options: Array<Fabric.Types.IDropdownOption> = [];

            // Parse the groups
            for (let i = 0; i < groups.length; i++) {
                // Add the option
                options.push({
                    text: groups[i].name,
                    value: groups[i].id
                });
            }

            // Render the term groups
            Fabric.Dropdown({
                el: _elTermGroups,
                label: "Select the Term Group:",
                options,
                value: _wpInfo.cfg.TermGroupId,
                onChange: options => {
                    let option = options[0];

                    // Set the configuration
                    _wpInfo.cfg.TermGroupId = option ? option.value : "";
                    _wpInfo.cfg.TermGroupName = option ? option.text : "";

                    // Call the change event
                    props.onTermGroupChanged ? props.onTermGroupChanged(_wpInfo, { id: _wpInfo.cfg.TermGroupId, name: _wpInfo.cfg.TermGroupName }) : null;

                    // Render the term sets
                    renderTermSets();
                }
            });

            // See if a term group exists
            if (_wpInfo.cfg.TermGroupName) {
                // Render the term sets
                renderTermSets();
            }
        });
    }

    // Method to render the term sets
    let renderTermSets = () => {
        // Render a loading dialog
        Fabric.Spinner({
            el: _elTermSets,
            text: "Loading the term sets"
        });

        // Load the term sets
        Helper.Taxonomy.getTermSets(_wpInfo.cfg.TermGroupName).then(termSets => {
            let options: Array<Fabric.Types.IDropdownOption> = [];

            // Parse the term sets
            for (let i = 0; i < termSets.length; i++) {
                // Add the options
                options.push({
                    text: termSets[i].name,
                    value: termSets[i].id
                });
            }

            // Render the term sets
            Fabric.Dropdown({
                el: _elTermSets,
                label: "Select a Term Set:",
                options,
                value: _wpInfo.cfg.TermSetId,
                onChange: options => {
                    let option = options[0];

                    // Set the configuration
                    _wpInfo.cfg.TermSetId = option ? option.value : "";
                    _wpInfo.cfg.TermSetName = option ? option.text : "";

                    // Call the change event
                    props.onTermSetChanged ? props.onTermSetChanged(_wpInfo, { id: _wpInfo.cfg.TermSetId, name: _wpInfo.cfg.TermSetName }) : null;

                    // Render the term set terms
                    props.showTermSetTerms ? renderTermSetTerms() : null;
                }
            });

            // See if a value exists
            if (_wpInfo.cfg.TermSetId) {
                // Render the term set terms
                props.showTermSetTerms ? renderTermSetTerms() : null;
            }
        });
    }

    // Method to render the term set terms
    let renderTermSetTerms = () => {
        // Render a loading dialog
        Fabric.Spinner({
            el: _elTermSetTerms,
            text: "Loading the term set terms"
        });

        // Load the term set terms
        Helper.Taxonomy.getTermSetByGroupName(_wpInfo.cfg.TermSetName, _wpInfo.cfg.TermGroupName).then(termSet => {
            let options: Array<Fabric.Types.IDropdownOption> = [];

            // Get the term set terms
            let terms = Helper.Taxonomy.toArray(termSet).sort((a, b) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            });

            // Parse the term set terms
            for (let i = 0; i < terms.length; i++) {
                // Add the options
                options.push({
                    text: terms[i].name,
                    value: terms[i].id
                });
            }

            // Render the term sets
            Fabric.Dropdown({
                el: _elTermSets,
                label: "Select a Term Set Term:",
                options,
                value: _wpInfo.cfg.TermSetTermId,
                onChange: options => {
                    let option = options[0];

                    // Set the configuration
                    _wpInfo.cfg.TermSetTermId = option ? option.value : "";
                    _wpInfo.cfg.TermSetTermName = option ? option.text : "";

                    // Call the change event
                    props.onTermSetTermChanged ? props.onTermSetTermChanged(_wpInfo, { id: _wpInfo.cfg.TermSetTermId, name: _wpInfo.cfg.TermSetTermName }) : null;
                }
            });
        });
    }

    // Return the edit panel
    return {
        onRenderFooter: (el, wpInfo) => {
            // Call the event
            props.onRenderFooter ? props.onRenderFooter(el, _wpInfo) : null;
        },
        onRenderHeader: (el, wpInfo) => {
            // Render the template
            el.innerHTML = "<div></div><div></div>";

            // Render the configuration
            renderConfiguration(el.children[1] as any, wpInfo);

            // Call the event
            props.onRenderHeader ? props.onRenderHeader(el.children[0] as any, _wpInfo) : null;
        },
        onSave: (cfg: IWPTaxonomyCfg) => {
            // Return the configuration
            return props.onSave ? props.onSave(_wpInfo.cfg) : _wpInfo.cfg;
        }
    };
}