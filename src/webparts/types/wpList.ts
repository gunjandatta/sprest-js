import { Types } from "gd-sprest";
import { IWPCfg, IWebPartCfg, IWebPartInfo, IWebPartProps } from ".";

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
 * WebPart List Information
 */
export interface IWPListInfo extends IWebPartInfo {
    /** The webpart information. */
    cfg: IWPListCfg;
}

/**
 * WebPart List Properties
 */
export interface IWPListProps extends IWebPartProps {
    /** The caml query. */
    camlQuery?: string;

    /** The odata list query. */
    listQuery?: Types.SP.ODataQuery;

    /** The odata query. */
    odataQuery?: Types.SP.ODataQuery;

    /** The executing caml query event. */
    onExecutingCAMLQuery?: (wpInfo: IWPListInfo, caml: string) => string;

    /** The executing odata query event. */
    onExecutingODATAQuery?: (wpInfo: IWPListInfo, odata: Types.SP.ODataQuery) => Types.SP.ODataQuery;

    /** The list changed event. */
    onListChanged?: (wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult) => void;

    /** The lists rendering event. */
    onListsRendering?: (wpInfo: IWPListInfo, lists?: Array<Types.SP.IListQueryResult>) => Array<Types.SP.IListQueryResult>;

    /** The on post render event. */
    onPostRender?: (wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult) => void;

    /** The on render footer event. */
    onRenderFooter?: (wpInfo: IWPListInfo) => string;

    /** The on render header event. */
    onRenderHeader?: (wpInfo: IWPListInfo) => string;

    /** The on render items event. */
    onRenderItems?: (wpInfo: IWPListInfo, items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult>) => void;

    /** The save configuration event. */
    onSave?: (cfg: IWPListCfg) => IWPListCfg;

    /** The panel type. */
    panelType?: number;
}