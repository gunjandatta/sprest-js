import { IComponentProps, IProps } from ".";

/**
 * Link
 */
export interface ILinkField {
    /** Returns the link element. */
    get(): HTMLInputElement;

    /** Returns the fabric component. */
    getFabricComponent(): any;

    /** Returns the link value. */
    getValue(): ILinkFieldValue;
}

/**
 * Link Properties
 */
export interface ILinkFieldProps extends IComponentProps {
    /** The link description. */
    description?: string;

    /** The change event. */
    onChange?: (value: ILinkFieldValue) => void;

    /** The link value. */
    value?: ILinkFieldValue;
}

/**
 * Link Value
 */
export interface ILinkFieldValue {
    /** The link description. */
    Description?: string;

    /** The link url. */
    Url?: string;
}