import { Types } from "gd-sprest";
import { IDropdownOption } from "../../fabric/types";
import { IWPCfg, IWPList, IWPListCfg, IWPListEditPanel, IWPListInfo, IWPListProps } from ".";

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
 * WebPart Search Edit Panel
 */
export interface IWPSearchEditPanel extends IWPListEditPanel {
    /** The render footer event. */
    onRenderFooter?: (el: HTMLDivElement, wpInfo: IWPSearchInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The render header event. */
    onRenderHeader?: (el: HTMLDivElement, wpInfo: IWPSearchInfo, list?: Types.SP.IListQueryResult | Types.SP.IListResult) => void;

    /** The save event. */
    onSave?: (wpCfg: IWPSearchCfg) => IWPSearchCfg;
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