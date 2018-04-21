import * as Fabric from "./fabric";
import * as Components from "./components";
import * as WebParts from "./webparts";
import { Helper, $REST, IREST } from "gd-sprest";

/**
 * $REST Library
 */
export interface IRESTJS extends IREST {
    /** JavaScript Library */
    JS: {
        /** SharePoint Components */
        Components: {
            Field(props: Components.Types.IFieldProps): Components.Types.IField;
            ListForm(props: Helper.Types.IListFormProps): Components.Types.IListForm;
            ListFormPanel(props: Components.Types.IListFormPanelProps): Components.Types.IListFormPanel;
        },

        /** Fabric Components */
        Fabric: {
            Button(props: Fabric.Types.IButtonProps): HTMLButtonElement;
            Callout(props: Fabric.Types.ICalloutProps): Fabric.Types.Fabric.ICallout;
            CheckBox(props: Fabric.Types.ICheckBoxProps): Fabric.Types.ICheckBox;
            CommandBar(props: Fabric.Types.ICommandBarProps): Fabric.Types.ICommandBar;
            CommandButton(props: Fabric.Types.ICommandButtonProps): Fabric.Types.ICommandButton;
            ContextualMenu(props: Fabric.Types.IContextualMenuProps): Fabric.Types.IContextualMenu;
            DatePicker(props: Fabric.Types.IDatePickerProps): Fabric.Types.IDatePicker;
            Dialog(props: Fabric.Types.IDialogProps): Fabric.Types.IDialog;
            DropDown(props: Fabric.Types.IDropdownProps): Fabric.Types.IDropdown;
            LinkField(props: Fabric.Types.ILinkFieldProps): Fabric.Types.ILinkField;
            List(props: Fabric.Types.IListProps): Fabric.Types.IList;
            ListItem(props: Fabric.Types.IListItemProps): Fabric.Types.Fabric.IListItem;
            NumberField(props: Fabric.Types.INumberFieldProps): Fabric.Types.INumberField;
            Overlay(props: Fabric.Types.IOverlayProps): Fabric.Types.IOverlay;
            Panel(props: Fabric.Types.IPanelProps): Fabric.Types.IPanel;
            PeoplePicker(props: Fabric.Types.IPeoplePickerProps): Fabric.Types.IPeoplePicker;
            Pivot(props: Fabric.Types.IPivotProps): Fabric.Types.Fabric.IPivot;
            Spinner(props: Fabric.Types.ISpinnerProps): Fabric.Types.ISpinner;
            Table(props: Fabric.Types.ITableProps): Fabric.Types.ITable;
            TextField(props: Fabric.Types.ITextFieldProps): Fabric.Types.ITextField;
            Toggle(props: Fabric.Types.IToggleProps): Fabric.Types.IToggle;
        },

        /** WebParts */
        WebParts: {
            WebPart(props: WebParts.Types.IWebPartProps): WebParts.Types.IWebPart;
            WPCfg: WebParts.Types.IWebPartCfg;
            WPList(props: WebParts.Types.IWPListProps): WebParts.Types.IWPList;
            WPSearch(props: WebParts.Types.IWPSearchProps): WebParts.Types.IWPSearch;
            WPTabs(props: WebParts.Types.IWPTabsProps): WebParts.Types.IWebPart;
        }
    }
}

// Set the JS library
export const RESTJS: IRESTJS = $REST as any;
RESTJS.JS = {
    Components,
    Fabric,
    WebParts
} as any;

// Wait for the core library to be loaded
window["SP"] && window["SP"].SOD ? window["SP"].SOD.executeOrDelayUntilScriptLoaded(() => {
    // Get the global variable
    var $REST = window["$REST"];
    if ($REST) {
        // Add the JS library
        $REST["JS"] = { Components, Fabric, WebParts };
    }

    // Alert other scripts this library is loaded
    window["SP"].SOD.notifyScriptLoadedAndExecuteWaitingJobs("gd-sprest-js.js");
}, "gd-sprest.js") : null;