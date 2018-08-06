import { Helper } from "gd-sprest";
import { IWebPart, IWebPartInfo, IWebPartProps } from "./wp";
import { IWPTaxonomyCfg, IWPTaxonomyEditPanel } from "./wpTaxonomyCfg"

/**
 * WebPart Taxonomy
 */
export interface IWPTaxonomy extends IWebPart {
    /** The webpart configuration. */
    cfg: IWPTaxonomyCfg;

    /** The webpart information. */
    info: IWPTaxonomyInfo;
}

/**
 * WebPart Taxonomy Information
 */
export interface IWPTaxonomyInfo extends IWebPartInfo {
    /** The webpart information. */
    cfg: IWPTaxonomyCfg;
}

/**
 * WebPart Taxonomy Properties
 */
export interface IWPTaxonomyProps extends IWebPartProps {
    /** The edit panel. */
    editPanel?: IWPTaxonomyEditPanel;

    /** The on post render event. */
    onPostRender?: (wpInfo: IWPTaxonomyInfo) => void;

    /** The render event triggered when the page is in 'Display' mode */
    onRenderDisplay?: (wp: IWPTaxonomyInfo) => any;

    /** The render event triggered when the page is in 'Edit' mode */
    onRenderEdit?: (wp: IWPTaxonomyInfo) => any;

    /** The on render term set event. */
    onRenderTermSet?: (wpInfo: IWPTaxonomyInfo, termSet: Helper.Types.ITerm) => void;

    /** The on render term sets event. */
    onRenderTermSets?: (wpInfo: IWPTaxonomyInfo, termSets: Array<Helper.Types.ITermSetInfo>) => void;

    /** The save configuration event. */
    onSave?: (cfg: IWPTaxonomyCfg) => IWPTaxonomyCfg;
}