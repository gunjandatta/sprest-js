import { Types } from "gd-sprest";
import { IDropdownOption } from "../../fabric/types";
import { IWPCfg, IWPList, IWPListCfg, IWPListInfo, IWPListProps } from ".";

/**
 * WebPart Search
 */
export interface IWPSearch extends IWPList {
    /** The webpart configuration. */
    cfg: IWPSearchCfg;

    /** The webpart information. */
    info: IWPSearchInfo;
}

/**
 * WebPart Search Configuration
 */
export interface IWPSearchCfg extends IWPListCfg {
    /** The searchable fields. */
    Fields: Array<IDropdownOption>;
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
export interface IWPSearchProps extends IWPListProps { }