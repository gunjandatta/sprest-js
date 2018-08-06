import { Types } from "gd-sprest";
import { IWebPartCfg, IWebPartEditPanel } from "./wp";
import { IWPListInfo } from "./wpList";

/**
 * WebPart List Configuration
 */
export interface IWPListCfg extends IWebPartCfg {
    /** The list name */
    ListName?: string;

    /** The relative web url */
    WebUrl?: string;
}

/**
 * WebPart List Edit Panel
 */
export interface IWPListEditPanel extends IWebPartEditPanel {
    /** The odata list query. */
    listQuery?: Types.SP.ODataQuery;

    /** The list changed event. */
    onListChanged?: (wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The lists rendering event. */
    onListsRendering?: (wpInfo: IWPListInfo, lists?: Array<Types.SP.IListQueryResult | Types.SP.IListResult>) => Array<Types.SP.IListQueryResult | Types.SP.IListResult>;

    /** The render footer event. */
    onRenderFooter?: (el: HTMLDivElement, wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The render header event. */
    onRenderHeader?: (el: HTMLDivElement, wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The save event. */
    onSave?: (wpCfg: IWPListCfg) => IWebPartCfg;
}