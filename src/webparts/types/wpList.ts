import { Types } from "gd-sprest";
import { IWebPart, IWPCfg, IWebPartCfg, IWebPartInfo, IWebPartProps } from ".";

/**
 * WebPart List
 */
export interface IWPList extends IWebPart {
    /** The webpart configuration. */
    cfg: IWPListCfg;

    /** The webpart information. */
    info: IWPListInfo;

    /**
     * In display mode, the target list items.
     * In edit mode, null.
     */
    items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult>;

    /**
     * In display mode, the target list.
     * In edit mode, the selected list.
     */
    list: Types.SP.IListQueryResult | Types.SP.IListResult;
}

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
    onListChanged?: (wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The lists rendering event. */
    onListsRendering?: (wpInfo: IWPListInfo, lists?: Array<Types.SP.IListQueryResult | Types.SP.IListResult>) => Array<Types.SP.IListQueryResult | Types.SP.IListResult>;

    /** The on post render event. */
    onPostRender?: (wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

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