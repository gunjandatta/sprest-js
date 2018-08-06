import { Helper } from "gd-sprest";
import * as Fabric from "../../fabric";
import { IWPTaxonomyInfo, IWPTaxonomyProps } from "./types";
import { WebPart } from "../base";
import { WPTaxonomyEditPanel } from "./wpCfg";

/**
 * Taxonomy WebPart
 */
export const WPTaxonomy = (props: IWPTaxonomyProps) => {
    // Create an instance of the webpart
    WebPart({
        cfgElementId: props.cfgElementId,
        className: props.className,
        editPanel: WPTaxonomyEditPanel(props.editPanel || {}),
        elementId: props.elementId,
        helpProps: props.helpProps,
        onPostRender: props.onPostRender,
        onRenderEdit: props.onRenderEdit,
        wpClassName: props.wpClassName,
        onRenderDisplay: (wpInfo: IWPTaxonomyInfo) => {
            // See if the render term set event exists
            if (props.onRenderTermSet && wpInfo.cfg.TermGroupName && wpInfo.cfg.TermSetName) {
                // Render loading text
                Fabric.Spinner({
                    el: wpInfo.el,
                    text: "Loading the term set..."
                });

                // Load the term group information
                Helper.Taxonomy.getTermSetByGroupName(wpInfo.cfg.TermSetName, wpInfo.cfg.TermGroupName).then(termSet => {
                    // Call the event
                    props.onRenderTermSet(wpInfo, termSet);
                });
            }

            // See if the render term sets event exists
            if (props.onRenderTermSets && wpInfo.cfg.TermGroupName) {
                // Render loading text
                Fabric.Spinner({
                    el: wpInfo.el,
                    text: "Loading the term sets..."
                });

                // Load the term group information
                Helper.Taxonomy.getTermSets(wpInfo.cfg.TermGroupName).then(termSets => {
                    // Call the event
                    props.onRenderTermSets(wpInfo, termSets);
                });
            }
        }
    });
}