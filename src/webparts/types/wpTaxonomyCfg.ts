import { IWebPartCfg, IWebPartEditPanel } from "./wp";
import { IWPTaxonomyInfo } from "./wpTaxonomy";

/**
 * Term Group Info
 */
interface ITermGroupInfo {
    id: string;
    name: string;
}

/**
 * Term Set Info
 */
interface ITermSetInfo {
    id: string;
    name: string;
}

/**
 * WebPart Taxonomy Configuration
 */
export interface IWPTaxonomyCfg extends IWebPartCfg {
    /** The term group id. */
    TermGroupId?: string;

    /** The term group name. */
    TermGroupName?: string;

    /** The term set id. */
    TermSetId?: string;

    /** The term set name */
    TermSetName?: string;
}

/**
 * WebPart Taxonomy Edit Panel
 */
export interface IWPTaxonomyEditPanel extends IWebPartEditPanel {
    /** The render footer event. */
    onRenderFooter?: (el: HTMLDivElement, wpInfo: IWPTaxonomyInfo) => void;

    /** The render header event. */
    onRenderHeader?: (el: HTMLDivElement, wpInfo: IWPTaxonomyInfo) => void;

    /** The term group changed event. */
    onTermGroupChanged?: (wpInfo: IWPTaxonomyInfo, termGroupInfo?: ITermGroupInfo) => void;

    /** The term set changed event. */
    onTermSetChanged?: (wpInfo: IWPTaxonomyInfo, termSetInfo?: ITermSetInfo) => void;

    /** The save event. */
    onSave?: (wpCfg: IWPTaxonomyCfg) => IWebPartCfg;
}