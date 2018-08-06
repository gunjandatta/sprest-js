import { Types } from "gd-sprest";
import { IWPListCfg, IWPListEditPanel } from "./wpListCfg";
import { IWPSearchInfo } from "./wpSearch";

/**
 * WebPart Search Configuration
 */
export interface IWPSearchCfg extends IWPListCfg {
    /** The searchable fields. */
    Fields: Array<{ name: string, type: string }>;
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
