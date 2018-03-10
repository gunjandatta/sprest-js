import { Helper, SPTypes, Types, Web } from "gd-sprest";
import { Fabric } from "..";
import { Field } from ".";
import * as ListFormTypes from "./types";

/**
 * List Form
 */
class _ListForm {
    private _cacheData: ListFormTypes.IListFormCache = null;
    private _info: ListFormTypes.IListFormResult = null;
    private _props: ListFormTypes.IListFormProps = null;
    private _resolve: (info: ListFormTypes.IListFormResult) => void = null;

    /**
     * Constructor
    */
    constructor(props: ListFormTypes.IListFormProps) {
        // Save the properties
        this._props = props || {} as any;
        this._props.fields = this._props.fields;

        // Return a promise
        return new Promise((resolve, reject) => {
            // Save the resolve method
            this._resolve = resolve;

            // Load the list data
            this.load();
        }) as any;
    }

    /**
     * Methods
     */

    // Method to create an instance of the list form
    static create(props: ListFormTypes.IListFormProps) {
        // Return an instance of the list form
        return new _ListForm(props);
    }

    // Method to generate the odata query
    static generateODataQuery = (info: ListFormTypes.IListFormResult, loadAttachments: boolean = false): Types.SP.ODataQuery => {
        let query: Types.SP.ODataQuery = info.query || {};

        // Default the select query to get all the fields by default
        query.Select = query.Select || ["*"];
        query.Expand = query.Expand || [];

        // See if we are loading the attachments
        if (loadAttachments) {
            // Expand the attachment files collection
            query.Expand.push("AttachmentFiles")

            // Select the attachment files
            query.Select.push("Attachments");
            query.Select.push("AttachmentFiles");
        }

        // Parse the fields
        for (let fieldName in info.fields) {
            let field = info.fields[fieldName];

            // Update the query, based on the type
            switch (field.FieldTypeKind) {
                // Lookup Field
                case SPTypes.FieldType.Lookup:
                    // Expand the field
                    query.Expand.push(field.InternalName);

                    // Select the fields
                    query.Select.push(field.InternalName + "/Id");
                    query.Select.push(field.InternalName + "/" + (field as Types.SP.IFieldLookup).LookupField);
                    break;

                // User Field
                case SPTypes.FieldType.User:
                    // Expand the field
                    query.Expand.push(field.InternalName);

                    // Select the fields
                    query.Select.push(field.InternalName + "/Id");
                    query.Select.push(field.InternalName + "/Title");
                    break;

                // Default
                default:
                    // See if this is an taxonomy field
                    if (field.TypeAsString.startsWith("TaxonomyFieldType")) {
                        // Parse the fields
                        for (let fieldName in info.fields) {
                            let valueField = info.fields[fieldName];

                            // See if this is the value field
                            if (valueField.InternalName == field.InternalName + "_0" || valueField.Title == field.InternalName + "_0") {
                                // Include the value field
                                query.Select.push(valueField.InternalName);
                                break;
                            }
                        }
                    }
                    break;
            }
        }

        // Return the query
        return query;
    }

    // Method to load the list data
    private load = () => {
        // Clear the information
        this._info = {
            item: this._props.item,
            query: this._props.query || {}
        } as any;

        // Load the data from cache
        this.loadFromCache();

        // Load the list data
        this.loadListData().then(() => {
            // See if the fields have been defined
            if (this._props.fields) {
                // Process the fields
                this.processFields();

                // Load the item data
                this.loadItem();
            } else {
                // Load the content type
                this.loadDefaultContentType();
            }
        });
    }

    // Method to load the item attachments
    static loadAttachments(info: ListFormTypes.IListFormProps): PromiseLike<Array<Types.SP.IAttachment>> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Ensure the item id exists
            let itemId = info.item ? info.item.Id : info.itemId;
            if (itemId > 0) {
                // Get the web
                (new Web(info.webUrl))
                    // Get the list
                    .Lists(info.listName)
                    // Get the item
                    .Items(itemId)
                    // Get the attachment files
                    .AttachmentFiles()
                    // Execute the request
                    .execute(attachments => {
                        // Resolve the promise
                        resolve(attachments.results || []);
                    });
            } else {
                // Resolve the promise
                resolve([]);
            }
        });
    }

    // Method to load the default content type
    private loadDefaultContentType = () => {
        // See if the content type info exists
        if (this._cacheData && this._cacheData.ct) {
            // Try to parse the data
            try {
                // Parse the content type
                let ct = Helper.parse(this._cacheData.ct) as Types.Util.IBaseCollection<Types.SP.IContentTypeQueryResult>;

                // Load the default fields
                this.loadDefaultFields(ct.results[0]);
                return;
            } catch{
                // Clear the cache data
                sessionStorage.removeItem(this._props.cacheKey);
            }
        }

        // Load the content types
        this._info.list.ContentTypes()
            // Query for the default content type and expand the field links
            .query({
                Expand: ["FieldLinks"],
                Top: 1
            })
            // Execute the request, but wait for the previous one to be completed
            .execute(ct => {
                // See if we are storing data in cache
                if (this._props.cacheKey) {
                    // Update the cache data
                    this._cacheData = this._cacheData || {} as any;
                    this._cacheData.ct = ct.stringify();

                    // Update the cache
                    sessionStorage.setItem(this._props.cacheKey, JSON.stringify(this._cacheData));
                }

                // Resolve the promise
                this.loadDefaultFields(ct.results[0]);
            });
    }

    // Method to load the default fields
    private loadDefaultFields = (ct: Types.SP.IContentTypeQueryResult) => {
        let fields = ct ? ct.FieldLinks.results : [];
        let formFields = {};

        // Parse the field links
        for (let i = 0; i < fields.length; i++) {
            let fieldLink = fields[i];

            // Get the field
            let field = this._info.fields[fieldLink.Name];
            if (field) {
                // Skip the content type field
                if (field.InternalName == "ContentType") { continue; }

                // Skip hidden fields
                if (field.Hidden || fieldLink.Hidden) { continue; }

                // Save the form field
                formFields[field.InternalName] = field;
            }
        }

        // Update the fields
        this._info.fields = formFields;

        // Load the item data
        this.loadItem();
    }

    // Method to load the field data
    private loadFieldData = (fields: Types.SP.IFieldResults) => {
        // Clear the fields
        this._info.fields = {};

        // Parse the fields
        for (let i = 0; i < fields.results.length; i++) {
            let field = fields.results[i];

            // See if the exclude fields is defined
            if (this._props.excludeFields) {
                let excludeField = false;

                // Parse the fields to exclude
                for (let j = 0; j < this._props.excludeFields.length; j++) {
                    // See if we are excluding this field
                    if (this._props.excludeFields[j] == field.InternalName) {
                        // Set the flag
                        excludeField = true;
                        break;
                    }
                }

                // See if we are excluding the field
                if (excludeField) { continue; }
            }

            // Save the field
            this._info.fields[field.InternalName] = field;
        }
    }

    // Method to load the data from cache
    private loadFromCache = () => {
        // See if we are loading from cache
        if (this._props.cacheKey) {
            // Get the data
            let data = sessionStorage.getItem(this._props.cacheKey);
            if (data) {
                // Try to parse the data
                try {
                    // Set the cache data
                    this._cacheData = JSON.parse(data);

                    // Update the list information
                    this._info = this._info || {} as any;
                    this._info.list = Helper.parse(this._cacheData.list);

                    // Load the field data
                    this.loadFieldData(Helper.parse(this._cacheData.fields));
                } catch {
                    // Clear the cache data
                    sessionStorage.removeItem(this._props.cacheKey);
                }
            }
        }
    }

    // Method to load the item
    private loadItem = () => {
        let reloadItem = false;

        // See if the item already exist
        if (this._info.item) {
            // Parse the fields
            for (let fieldName in this._info.fields) {
                let field = this._info.fields[fieldName];

                // See what type of field this is
                switch (field.FieldTypeKind) {
                    // Lookup or User Field
                    case SPTypes.FieldType.Lookup:
                    case SPTypes.FieldType.User:
                        let fieldValue = this._info.item[fieldName + "Id"];

                        // Ensure the value exists
                        if (fieldValue) {
                            // See if a value exists
                            if (fieldValue.results ? fieldValue.results.length > 0 : fieldValue > 0) {
                                // Ensure the field data has been loaded
                                if (this._info.item[fieldName] == null) {
                                    // Set the flag
                                    reloadItem = true;
                                }
                            }
                        }
                        break;

                    // Default
                    default:
                        // See if this is an taxonomy field
                        if (field.TypeAsString.startsWith("TaxonomyFieldType")) {
                            let fieldValue = this._info.item[fieldName + "Id"];

                            // Ensure the value exists
                            if (fieldValue) {
                                // See if a field value exists
                                if (fieldValue.results ? fieldValue.results.length > 0 : fieldValue != null) {
                                    // Parse the fields
                                    for (let fieldName in this._info.fields) {
                                        let valueField = this._info.fields[fieldName];

                                        // See if this is the value field
                                        if (valueField.InternalName == field.InternalName + "_0" || valueField.Title == field.InternalName + "_0") {
                                            // Ensure the value field is loaded
                                            if (this._info.item[valueField.InternalName] == null) {
                                                // Set the flag
                                                reloadItem = true;
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        break;
                }

                // See if we are reloading the item
                if (reloadItem) { break; }
            }
        }

        // See if the item exists
        if (this._info.item && !reloadItem) {
            // See if we are loading attachments
            if (this._props.loadAttachments && this._info.attachments == null) {
                // Load the attachments
                ListForm.loadAttachments(this._props).then(attachments => {
                    // Set the attachments
                    this._info.attachments = attachments;

                    // Resolve the promise
                    this._resolve(this._info);
                })
            } else {
                // Resolve the promise
                this._resolve(this._info);
            }
        }
        // Else, see if we are loading the list item
        else if (reloadItem || this._props.itemId > 0) {
            // Update the item query
            this._info.query = _ListForm.generateODataQuery(this._info, this._props.loadAttachments);

            // Get the list item
            this._info.list.Items(reloadItem ? this._props.item.Id : this._props.itemId)
                // Set the query
                .query(this._info.query)
                // Execute the request
                .execute(item => {
                    // Save the attachments
                    this._info.attachments = item.AttachmentFiles.results;

                    // Save the item
                    this._info.item = item;

                    // Resolve the promise
                    this._resolve(this._info);
                });
        } else {
            // Resolve the promise
            this._resolve(this._info);
        }
    }

    // Method to load the list data
    private loadListData = (): PromiseLike<void> => {
        // Return a promise
        return new Promise((resolve, reject) => {
            // See if the list & fields already exist
            if (this._info.list && this._info.fields) {
                // Resolve the promise
                resolve();
                return;
            }

            // Get the web
            let list = (new Web(this._props.webUrl))
                // Get the list
                .Lists(this._props.listName)
                // Execute the request
                .execute(list => {
                    // Save the list
                    this._info.list = list;
                });

            // Load the fields
            list.Fields()
                // Execute the request
                .execute(fields => {
                    // See if we are caching the data
                    if (this._props.cacheKey) {
                        // Update the cache
                        this._cacheData = this._cacheData || {} as any;
                        this._cacheData.fields = fields.stringify();
                        this._cacheData.list = this._info.list.stringify();

                        // Cache the data
                        sessionStorage.setItem(this._props.cacheKey, JSON.stringify(this._cacheData));
                    }

                    // Load the field data
                    this.loadFieldData(fields as any);

                    // Resolve the promise
                    resolve();
                });
        });
    }

    // Method to process the fields
    private processFields = () => {
        let formFields = {};

        // Parse the fields provided
        for (let i = 0; i < this._props.fields.length; i++) {
            let field = this._info.fields[this._props.fields[i]];

            // Ensure the field exists
            if (field) {
                // Save the field
                formFields[field.InternalName] = field;

                // See if this is a taxonomy field
                if (field.TypeAsString.startsWith("TaxonomyFieldType")) {
                    // Parse the list fields
                    for (let fieldName in this._info.fields) {
                        let valueField = this._info.fields[fieldName];

                        // See if this is a value field
                        if (valueField.InternalName == field.InternalName + "_0" || valueField.Title == field.InternalName + "_0") {
                            // Include this field
                            formFields[valueField.InternalName] = valueField;
                            break;
                        }
                    }
                }
            }
        }

        // Update the fields
        this._info.fields = formFields;
    }

    // Method to refresh an item
    static refreshItem(info: ListFormTypes.IListFormResult): PromiseLike<ListFormTypes.IListFormResult> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Update the query
            info.query = this.generateODataQuery(info, true);

            // Get the item
            info.list.Items(info.item.Id).query(info.query).execute(item => {
                // Update the item
                info.item = item;

                // Resolve the promise
                resolve(info);
            });
        });
    }

    // Method to remove attachments from an item
    removeAttachments(info: ListFormTypes.IListFormProps, attachments: Array<Types.SP.IAttachment>): PromiseLike<void> {
        // Return a promise
        return new Promise((resolve, reject) => {
            let web = new Web(info.webUrl);

            // Parse the attachments
            for (let i = 0; i < attachments.length; i++) {
                let attachment = attachments[i];

                // Get the file
                web.getFileByServerRelativeUrl(attachment.ServerRelativeUrl)
                    // Delete the file
                    .delete()
                    // Execute the request
                    .execute(true);
            }

            // Wait for the requests to complete
            web.done(() => {
                // Resolve the request
                resolve();
            });
        });
    }

    // Method to render a display form for an item
    static renderDisplayForm(props: ListFormTypes.IListFormDisplayProps): ListFormTypes.IListFormDisplay {
        let fields = [];

        // Render the form template
        _ListForm.renderFormTemplate(props);

        // Load the list item
        props.info.list.Items(props.info.item.Id)
            // Get the html for the fields
            .FieldValuesAsHtml()
            // Execute the request
            .execute(formValues => {
                let hasUserField = false;

                // Parse the fields
                for (let fieldName in props.info.fields) {
                    // Get the element
                    let elField = props.el.querySelector("[data-field='" + fieldName + "']");
                    if (elField) {
                        let field = props.info.fields[fieldName];
                        let html = formValues[fieldName] || formValues[fieldName.replace(/\_/g, "_x005f_")] || "";

                        // Set the flag
                        hasUserField = hasUserField || field.FieldTypeKind == SPTypes.FieldType.User;

                        // Set the html for this field
                        elField.innerHTML = [
                            '<div class="display-form">',
                            Fabric.Templates.Label({
                                className: "field-label",
                                description: field.Description,
                                text: field.Title
                            }),
                            '<div class="field-value">' + html + '</div>',
                            '</div>'
                        ].join('\n');

                        // Add this field
                        fields.push(elField);
                    }
                }

                // See if we are displaying a user field
                if (hasUserField) {
                    // Enable the persona
                    window["ProcessImn"]();
                }
            });

        // Return the form
        return {
            getFields: () => { return fields; }
        }
    }

    // Render the edit form
    static renderEditForm(props: ListFormTypes.IListFormEditProps): ListFormTypes.IListFormEdit {
        let controlMode = typeof (props.controlMode) === "number" ? props.controlMode : props.info.item ? SPTypes.ControlMode.Edit : SPTypes.ControlMode.New;
        let fields: Array<ListFormTypes.IField> = [];

        // Render the form template
        _ListForm.renderFormTemplate(props);

        // Parse the fields
        for (let fieldName in props.info.fields) {
            let field = props.info.fields[fieldName];
            let value = props.info.item ? props.info.item[fieldName] : null;

            // Get the field element and ensure it exists
            let elField = props.el.querySelector("[data-field='" + fieldName + "']");
            if (elField == null) { continue; }

            // See if this is a read-only field
            if (field.ReadOnlyField) {
                // Do not render in the new form
                if (props.controlMode == SPTypes.ControlMode.New) { continue; }
            }

            // See if this is the hidden taxonomy field
            if (field.Hidden && field.FieldTypeKind == SPTypes.FieldType.Note && field.Title.endsWith("_0")) {
                // Do not render this field
                continue;
            }

            // See if this is an invalid field type
            if (field.FieldTypeKind == SPTypes.FieldType.Invalid) {
                // Ensure it's not a taxonomy field
                if (!field.TypeAsString.startsWith("TaxonomyFieldType")) { continue; }
            }

            // Render the field
            Field({
                controlMode,
                el: elField,
                fieldInfo: {
                    field,
                    listName: props.info.list.Title,
                    name: fieldName,
                },
                value
            }).then(field => {
                // Add the field
                fields.push(field);
            });
        }

        // Return the form
        return {
            getFields: () => { return fields; },
            getValues: (): PromiseLike<any> => {
                let formValues = {};
                let unknownUsers = {};


                // Parse the fields
                for (let i = 0; i < fields.length; i++) {
                    let field = fields[i];
                    let fieldName = field.fieldInfo.name;
                    let fieldValue: any = field.element.getValue();

                    // Update the field name/value, based on the type
                    switch (field.fieldInfo.type) {
                        // Choice
                        case SPTypes.FieldType.Choice:
                            // Update the field value
                            fieldValue = fieldValue ? (fieldValue as Fabric.Types.IDropdownOption).value : fieldValue;
                            break;

                        // Lookup
                        case SPTypes.FieldType.Lookup:
                            // Append 'Id' to the field name
                            fieldName += fieldName.lastIndexOf("Id") == fieldName.length - 2 ? "" : "Id";

                            // See if this is a multi-value field
                            if ((field.fieldInfo as ListFormTypes.IListFormLookupFieldInfo).multi) {
                                let values: Array<Fabric.Types.IDropdownOption> = fieldValue || [];
                                fieldValue = { results: [] };

                                // Parse the options
                                for (let j = 0; j < values.length; j++) {
                                    // Add the value
                                    fieldValue.results.push(values[j].value);
                                }
                            } else {
                                // Update the field value
                                fieldValue = fieldValue ? (fieldValue as Fabric.Types.IDropdownOption).value : fieldValue;
                            }
                            break;

                        // Multi-Choice
                        case SPTypes.FieldType.MultiChoice:
                            let options: Array<Fabric.Types.IDropdownOption> = fieldValue || [];
                            fieldValue = { results: [] };

                            // Parse the options
                            for (let j = 0; j < options.length; j++) {
                                // Add the option
                                fieldValue.results.push(options[j].value);
                            }
                            break;

                        // URL
                        case SPTypes.FieldType.URL:
                            // See if the field value exists
                            if (fieldValue) {
                                // Add the metadata
                                fieldValue.__metadata = { type: "SP.FieldUrlValue" };
                            }
                            break;

                        // User
                        case SPTypes.FieldType.User:
                            // Append 'Id' to the field name
                            fieldName += fieldName.lastIndexOf("Id") == fieldName.length - 2 ? "" : "Id";

                            // See if this is a multi-value field
                            if ((field.fieldInfo as ListFormTypes.IListFormUserFieldInfo).multi) {
                                let values: Array<Fabric.Types.IDropdownOption> = fieldValue || [];
                                fieldValue = { results: [] };

                                // Parse the options
                                for (let j = 0; j < values.length; j++) {
                                    let userValue = values[j] as Types.SP.IPeoplePickerUser;
                                    if (userValue && userValue.EntityData) {
                                        // Ensure the user or group id exists
                                        if (userValue.EntityData.SPGroupID || userValue.EntityData.SPUserID) {
                                            // Update the field value
                                            fieldValue.results.push(userValue.EntityData.SPUserID || userValue.EntityData.SPGroupID);
                                        } else {
                                            // Add the unknown user account
                                            unknownUsers[fieldName] = unknownUsers[fieldName] || [];
                                            unknownUsers[fieldName].push(userValue.Key);
                                        }
                                    }
                                }
                            } else {
                                let userValue: Types.SP.IPeoplePickerUser = fieldValue ? fieldValue[0] : null;
                                if (userValue && userValue.EntityData) {
                                    // Ensure the user or group id exists
                                    if (userValue.EntityData.SPGroupID || userValue.EntityData.SPUserID) {
                                        // Update the field value
                                        fieldValue = userValue.EntityData.SPUserID || userValue.EntityData.SPGroupID;
                                    } else {
                                        // Add the unknown user account
                                        unknownUsers[fieldName] = unknownUsers[fieldName] || [];
                                        unknownUsers[fieldName].push(userValue.Key);
                                    }
                                } else {
                                    // Clear the field value
                                    fieldValue = null;
                                }
                            }
                            break;

                        // MMS
                        default:
                            if (field.fieldInfo.typeAsString.startsWith("TaxonomyFieldType")) {
                                // See if this is a multi field
                                if (field.fieldInfo.typeAsString.endsWith("Multi")) {
                                    // Update the field name to the value field
                                    fieldName = (field.fieldInfo as ListFormTypes.IListFormMMSFieldInfo).valueField.InternalName;

                                    // Parse the field values
                                    let fieldValues: Array<Fabric.Types.IDropdownOption> = fieldValue || [];
                                    fieldValue = [];
                                    for (let j = 0; j < fieldValues.length; j++) {
                                        let termInfo = fieldValues[j];

                                        // Add the field value
                                        fieldValue.push(-1 + ";#" + termInfo.text + "|" + termInfo.value);
                                    }

                                    // Set the field value
                                    fieldValue = fieldValue.join(";#");
                                } else {
                                    // Update the value
                                    fieldValue = fieldValue ? {
                                        __metadata: { type: "SP.Taxonomy.TaxonomyFieldValue" },
                                        Label: fieldValue.text,
                                        TermGuid: fieldValue.value,
                                        WssId: -1
                                    } : fieldValue;
                                }
                            }
                            break;
                    }

                    // Set the field value
                    formValues[fieldName] = fieldValue;
                }

                // Return a promise
                return new Promise((resolve, reject) => {
                    let web = new Web();

                    // Parse the field names
                    for (let fieldName in unknownUsers) {
                        // Parse the user accounts
                        for (let i = 0; i < unknownUsers[fieldName].length; i++) {
                            // Ensure this user account exists
                            web.ensureUser(unknownUsers[fieldName][i]).execute(true);
                        }
                    }

                    // Wait for the requests to complete
                    web.done((...args) => {
                        // Parse the field names
                        for (let fieldName in unknownUsers) {
                            // Parse the user accounts
                            for (let i = 0; i < unknownUsers[fieldName].length; i++) {
                                let userLogin = unknownUsers[fieldName][i];

                                // Parse the responses
                                for (let j = 0; j < args.length; j++) {
                                    let user = args[j] as Types.SP.IUserResult;

                                    // See if this is the user
                                    if (user.LoginName == userLogin) {
                                        // See if this is a multi-user value
                                        if (formValues[fieldName].results != null) {
                                            // Set the user account
                                            formValues[fieldName].push(user.Id);
                                        } else {
                                            // Set the user account
                                            formValues[fieldName] = user.Id;
                                        }
                                    }
                                }
                            }
                        }

                        // Resolve the promise
                        resolve(formValues);
                    });
                });
            }
        }
    }

    // Method to render the form template
    static renderFormTemplate(props: ListFormTypes.IListFormDisplayProps) {
        // Clear the element
        props.el.innerHTML = "";

        // See if the field order has been specified
        if (props.includeFields) {
            // Parse the fields to include
            for (let i = 0; i < props.includeFields.length; i++) {
                // Parse the fields
                for (let fieldName in props.info.fields) {
                    // See if we are including this field
                    if (props.includeFields[i] == fieldName) {
                        // Append the field to the form
                        props.el.innerHTML += "<div data-field='" + fieldName + "'></div>";
                        break;
                    }
                }
            }
        }
        // Else, see if fields have been specified to be excluded
        else if (props.excludeFields) {
            // Parse the fields
            for (let fieldName in props.info.fields) {
                let excludeField = props.includeFields ? true : false;

                // Parse the fields
                for (let i = 0; i < props.excludeFields.length; i++) {
                    // See if we are excluding this field
                    if (props.excludeFields[i] == fieldName) {
                        // Set the flag
                        excludeField = true;
                        break;
                    }
                }

                // See if we are excluding the field
                if (excludeField) { continue; }

                // Append the field to the form
                props.el.innerHTML += "<div data-field='" + fieldName + "'></div>";
            }
        } else {
            // Parse the fields
            for (let fieldName in props.info.fields) {
                // Append the field to the form
                props.el.innerHTML += "<div data-field='" + fieldName + "'></div>";
            }
        }
    }

    // Method to save attachments to an existing item
    static saveAttachments(info: ListFormTypes.IListFormProps, attachmentInfo: Array<ListFormTypes.IListFormAttachmentInfo>): PromiseLike<Array<Types.SP.IAttachment>> {
        // Return a promise
        return new Promise((resolve, reject) => {
            let itemId = info.item ? info.item.Id : info.itemId;
            if (itemId > 0) {
                // Get the web
                let attachments = (new Web(info.webUrl))
                    // Get the lists
                    .Lists(info.listName)
                    // Get the item
                    .Items(itemId)
                    // Get the attachment files
                    .AttachmentFiles();

                // Parse the attachment information
                for (let i = 0; i < attachmentInfo.length; i++) {
                    let attachment = attachmentInfo[i];

                    // Add the attachment
                    attachments.add(attachment.name, attachment.data).execute(true);
                }

                // Wait for the requests to complete
                attachments.done((...args) => {
                    // Resolve the promise
                    resolve(args);
                });
            } else {
                // Resolve the promise
                resolve();
            }
        });
    }

    // Method to save a new or existing item
    static saveItem(info: ListFormTypes.IListFormResult, formValues: any): PromiseLike<ListFormTypes.IListFormResult> {
        // Return a promise
        return new Promise((resolve, reject) => {
            // See if this is an existing item
            if (info.item && info.item.update) {
                // Update the item
                info.item.update(formValues).execute(response => {
                    // Refresh the item
                    this.refreshItem(info).then(info => {
                        // Resolve the promise
                        resolve(info);
                    });
                });
            } else {
                // Set the metadata type
                formValues["__metadata"] = { type: info.list.ListItemEntityTypeFullName };

                // Add the item
                info.list.Items().add(formValues)
                    // Execute the request
                    .execute(item => {
                        // Update the info
                        info.item = item;

                        // Refresh the item
                        this.refreshItem(info).then(info => {
                            // Resolve the promise
                            resolve(info);
                        });
                    });
            }
        });
    }
}
export const ListForm: ListFormTypes.IListForm = _ListForm as any;