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

    /** The on render items event. */
    onRenderItems?: (items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult>) => void;
}