import { Types } from "gd-sprest";
import { IWPCfg, IWebPartInfo, IWebPartProps } from ".";

/**
 * WebPart List Configuration
 */
export interface IWPListCfg {
    /** The list name */
    ListName?: string;

    /** The webpart id */
    WebPartId?: string;

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

    /** The odata query. */
    odataQuery?: Types.SP.ODataQuery;

    /** The list changed event. */
    onListChanged?: (wpInfo: IWPListInfo, list: Types.SP.IListResult) => void;

    /** The lists rendering event. */
    onListsRendering?: (wpInfo: IWPListInfo, lists: Array<Types.SP.IListResult>) => Array<Types.SP.IListResult>;

    /** The on post render event. */
    onPostRender?: (wpInfo: IWPListInfo, lists: Array<Types.SP.IListResult>) => void;

    /** The on render footer event. */
    onRenderFooter?: (wpInfo: IWPListInfo) => void;

    /** The on render header event. */
    onRenderHeader?: (wpInfo: IWPListInfo) => void;

    /** The on render items event. */
    onRenderItems?: (wpInfo: IWPListInfo, items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult>) => void;

    /** The save configuration event. */
    onSave?: (cfg: IWPListCfg) => IWPListCfg;
}