import { Types } from "gd-sprest";
import { IDropdownOption } from "../../fabric/types";
import { IWPCfg, IWPListCfg, IWPListInfo, IWPListProps } from ".";

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