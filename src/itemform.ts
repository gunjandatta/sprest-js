import { Helper } from "gd-sprest";
import { IItemFormProps } from "./types";
import { Field, Spinner } from ".";

/**
 * Item Form
 */
export const ItemForm = (props: IItemFormProps) => {
    // Load the list information
    let loadformInfo = () => {
        // Create an instance of the list form
        new Helper.ListForm({
            cacheKey: this.props.cacheKey,
            fields: props.fields,
            item: props.item,
            itemId: props.itemId,
            listName: props.listName,
            webUrl: props.webUrl
        }).then(formInfo => {
            // Render the form
        });
    }

    // Render the form
    let renderForm = (formInfo: Helper.Types.IListFormResult) => {
    }

    // Render a spinner
    let _spinner = Spinner({
        el: props.el,
        text: "Loading the field..."
    });
}