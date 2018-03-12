import { Types } from "gd-sprest";
import { IField } from ".";

/**
 * List Form
 */
export interface IListForm {
    /**
     * Creates an instance of the list form
     * @param props - The list form properties.
     */
    new(props: IListFormProps): PromiseLike<IListFormResult>;

    /**
     * Creates an instance of the list form
     * @param props - The list form properties.
     */
    create(props: IListFormProps): PromiseLike<IListFormResult>;

    /**
     * Method to load the item attachments
     * @param info - The list form information.
    */
    loadAttachments(info: IListFormProps): PromiseLike<Array<Types.SP.IAttachment>>

    /**
     * Method to refresh the item.
     * @param info - The list form information.
     */
    refreshItem(info: IListFormResult): PromiseLike<IListFormResult>;

    /**
     * Method to remove attachments from an item.
     */
    removeAttachments(info: IListFormProps, attachmentInfo: Array<Types.SP.IAttachment>): PromiseLike<void>;

    /**
     * Method to render the display form template.
     * @param props - The display form properties.
     */
    renderDisplayForm(props: IListFormDisplayProps): IListFormDisplay;

    /**
     * Method to render the edit/new form.
     * @param props - The edit/new form properties.
     */
    renderEditForm(props: IListFormEditProps): IListFormEdit;

    /**
     * Method to render the form template.
     * @param props - The form properties.
     */
    renderFormTemplate(props: IListFormDisplayProps);

    /**
     * Method to save attachments to the item.
     * @param info - The list form information.
     * @param attachmentInfo - The attachment files to add.
     */
    saveAttachments(info: IListFormProps, attachmentInfo: Array<IListFormAttachmentInfo>): PromiseLike<Array<Types.SP.IAttachment>>;

    /**
     * Method to save the item.
     * @param info - The list form information.
     * @param itemValues - The list item values.
     */
    saveItem(info: IListFormResult, formValues: any): PromiseLike<IListFormResult>;

    /**
     * Method to show the file dialog.
     * @param info - The list form information.
     */
    showFileDialog(info: IListFormResult): PromiseLike<IListFormResult>;
}

/**
 * List Form Attachment Information
 */
export interface IListFormAttachmentInfo {
    /** The file content */
    data: any;

    /** The name of the file */
    name: string;
}

/**
 * List Form Cache
 */
export interface IListFormCache {
    ct: string;
    fields: string;
    list: string;
}

/**
 * List Form Display
 */
export interface IListFormDisplay {
    /**
     * Method to get the fields
     */
    getFields(): Array<HTMLDivElement>;
}

/**
 * List Form Display Properties
 */
export interface IListFormDisplayProps {
    /** The element to render the form to. */
    el: Element;

    /** The fields to exclude from the form. */
    excludeFields?: Array<string>;

    /** The fields to include in the form. */
    includeFields?: Array<string>;

    /** The list form information. */
    info: IListFormResult;
}

/**
 * List Form Edit
 */
export interface IListFormEdit {
    /**
     * Method to get the fields
     */
    getFields(): Array<IField>;

    /**
     * Method to get the form values
     */
    getValues(): PromiseLike<any>;
}

/**
 * List Form Edit Properties
 */
export interface IListFormEditProps extends IListFormDisplayProps {
    /** The form mode (New/Edit) */
    controlMode?: number;
}

/**
 * List Form Properties
 */
export interface IListFormProps {
    /** If defined, the data will be cached to the session storage. */
    cacheKey?: string;

    /** The form fields to exclude. */
    excludeFields?: Array<string>;

    /** The form fields */
    fields?: Array<string>;

    /** The list item */
    item?: Types.SP.IListItemQueryResult | Types.SP.IListItemResult;

    /** The item id */
    itemId?: number;

    /** The list name */
    listName: string;

    /** Flag to deteremine if we are loading attachments */
    loadAttachments?: boolean;

    /** OData query used when loading an item */
    query?: Types.SP.ODataQuery;

    /** The relative web url containing the list */
    webUrl?: string;
}

/**
 * List Form Result
 */
export interface IListFormResult {
    /** The item attachments. */
    attachments?: Array<Types.SP.IAttachment>;

    /** The form fields. */
    fields: { [key: string]: Types.SP.IFieldResult };

    /** The list item. */
    item?: Types.SP.IListItemQueryResult | Types.SP.IListItemResult;

    /** The item query. */
    query?: Types.SP.ODataQuery;

    /** The list. */
    list: Types.SP.IListResult;
}