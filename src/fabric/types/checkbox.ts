import { Fabric, IComponentProps } from ".";

/**
 * CheckBox
 */
export interface ICheckBox {
    /** Method to check the checkbox. */
    check();

    /** Returns the checkbox element. */
    get(): Fabric.ICheckBox;

    /** Returns the checkbox value. */
    getValue(): boolean;

    /** Method to uncheck the checkbox. */
    unCheck();
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