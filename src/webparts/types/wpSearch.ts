import { Types } from "gd-sprest";
import { IWPList, IWPListInfo, IWPListProps } from "./wpList";
import { IWPSearchCfg, IWPSearchEditPanel } from "./wpSearchCfg";

/**
 * WebPart Search
 */
export interface IWPSearch extends IWPList {
    /** The webpart configuration. */
    cfg: IWPSearchCfg;

    /** The filter items method. */
    filterItems: (filterText: string) => Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult>;

    /** The webpart information. */
    info: IWPSearchInfo;
}

/**
 * WebPart Search Information
 */
export interface IWPSearchInfo extends IWPListInfo {
    /** The webpart information. */
    cfg: IWPSearchCfg;
}

/**
 * WebPart Search Properties
 */
export interface IWPSearchProps extends IWPListProps {
    /** The edit panel. */
    editPanel?: IWPSearchEditPanel;

    /** The executing caml query event. */
    onExecutingCAMLQuery?: (wpInfo: IWPSearchInfo, caml: string) => string;

    /** The executing odata query event. */
    onExecutingODATAQuery?: (wpInfo: IWPSearchInfo, odata: Types.SP.ODataQuery) => Types.SP.ODataQuery;

    /** The on post render event. */
    onPostRender?: (wpInfo: IWPSearchInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The on render items event. */
    onRenderItems?: (wpInfo: IWPSearchInfo, items: Array<Types.SP.IListItemQueryResult | Types.SP.IListItemResult>) => void;

    /** The internal field names to be used for search. These will be appended to the configuration fields. */
    searchFields?: Array<{ name: string, type: string }>;
}