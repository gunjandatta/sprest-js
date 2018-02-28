import { Types } from "gd-sprest";
import { IWebPart, IWPCfg, IWebPartCfg, IWebPartEditPanel, IWebPartInfo, IWebPartProps } from ".";

/**
 * WebPart List
 */
export interface IWPList extends IWebPart {
    /** The webpart configuration. */
    cfg: IWPListCfg;

    /** The webpart information. */
    info: IWPListInfo;
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
 * WebPart List Edit Panel
 */
export interface IWPListEditPanel extends IWebPartEditPanel {
    /** The list changed event. */
    onListChanged?: (wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The lists rendering event. */
    onListsRendering?: (wpInfo: IWPListInfo, lists?: Array<Types.SP.IListQueryResult | Types.SP.IListResult>) => Array<Types.SP.IListQueryResult | Types.SP.IListResult>;

    /** The render footer event. */
    onRenderFooter?: (el:HTMLDivElement, wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The render header event. */
    onRenderHeader?: (el:HTMLDivElement, wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The save event. */
    onSave?: (wpCfg: IWPListCfg) => IWebPartCfg;
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

    /** The edit panel. */
    editPanel?: IWPListEditPanel;

    /** The odata list query. */
    listQuery?: Types.SP.ODataQuery;

    /** The odata query. */
    odataQuery?: Types.SP.ODataQuery;

    /** The executing caml query event. */
    onExecutingCAMLQuery?: (wpInfo: IWPListInfo, caml: string) => string;

    /** The executing odata query event. */
    onExecutingODATAQuery?: (wpInfo: IWPListInfo, odata: Types.SP.ODataQuery) => Types.SP.ODataQuery;

    /** The on post render event. */
    onPostRender?: (wpInfo: IWPListInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The on render items event. */
    onRenderItems?: (wpInfo: IWPListInfo, items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult>) => void;

    /** The save configuration event. */
    onSave?: (cfg: IWPListCfg) => IWPListCfg;
}