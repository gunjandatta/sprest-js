import { Helper } from "gd-sprest";
export interface IBaseFieldProps {
    /** The element to render the field to. */
    el: Element | HTMLElement;
    /** The field information */
    fieldInfo: Helper.Types.IListFormFieldInfo;
}
/**
 * Base Field
 */
export declare const BaseField: (props: IBaseFieldProps) => void;
