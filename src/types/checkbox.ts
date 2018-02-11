import { IComponentProps, IProps } from ".";

/**
 * CheckBox
 */
export interface ICheckBox {
    /** Returns the checkbox element. */
    get(): HTMLElement;

    /** Returns the fabric component. */
    getFabricComponent(): any;

    /** Returns the checkbox value. */
    getValue(): boolean;
}

/**
 * CheckBox Properties
 */
export interface ICheckBoxProps extends IComponentProps {
    /** The change event */
    onChange?: (checked: boolean) => void;
    
    /** The checkbox value */
    value?: boolean;
}