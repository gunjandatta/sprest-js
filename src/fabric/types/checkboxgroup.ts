import { Fabric, ICheckBoxProps, IComponentProps } from ".";

/**
 * CheckBox Group
 */
export interface ICheckBoxGroup {
    /** Returns the checkbox elements. */
    get(): Array<Fabric.ICheckBox>;

    /** Returns the checkbox value. */
    getValues(): Array<boolean>;
}

/**
 * CheckBox Properties
 */
export interface ICheckBoxGroupProps extends IComponentProps {
    /** The change event */
    onChange?: (checked: boolean) => void;

    /** The checkbox properties */
    props?: Array<ICheckBoxProps>;
}