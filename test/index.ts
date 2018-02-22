import { Helper, List, SPTypes, Types } from "gd-sprest";
import { Fabric, ListFormPanel, WebParts } from "../build";
declare var SP;

// Create the global variable
window["TestJS"] = {
    // Configuration
    Configuration: {
        // List
        List: new Helper.SPConfig({
            ListCfg: [
                /** Test List */
                {
                    CustomFields: [
                        {
                            defaultValue: "0",
                            name: "TestBoolean",
                            title: "Boolean",
                            type: Helper.SPCfgFieldType.Boolean
                        },
                        {
                            defaultValue: "Choice 3",
                            name: "TestChoice",
                            title: "Choice",
                            type: Helper.SPCfgFieldType.Choice,
                            choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4", "Choice 5"]
                        } as Types.Helper.IFieldInfoChoice,
                        {
                            name: "TestComments",
                            title: "Comments",
                            type: Helper.SPCfgFieldType.Note
                        },
                        {
                            format: SPTypes.DateFormat.DateOnly,
                            name: "TestDate",
                            title: "Date Only",
                            type: Helper.SPCfgFieldType.Date
                        } as Types.Helper.IFieldInfoDate,
                        {
                            format: SPTypes.DateFormat.DateTime,
                            name: "TestDateTime",
                            title: "Date/Time",
                            type: Helper.SPCfgFieldType.Date
                        } as Types.Helper.IFieldInfoDate,
                        {
                            listName: "SPReact",
                            name: "TestLookup",
                            title: "Lookup",
                            showField: "Title",
                            type: Helper.SPCfgFieldType.Lookup
                        } as Types.Helper.IFieldInfoLookup,
                        {
                            name: "TestManagedMetadata",
                            title: "MMS",
                            type: Helper.SPCfgFieldType.MMS
                        },
                        {
                            defaultValue: "Choice 3",
                            multi: true,
                            name: "TestMultiChoice",
                            title: "Multi-Choice",
                            type: Helper.SPCfgFieldType.Choice,
                            choices: ["Choice 1", "Choice 2", "Choice 3", "Choice 4", "Choice 5"]
                        } as Types.Helper.IFieldInfoChoice,
                        {
                            listName: "SPReact",
                            multi: true,
                            name: "TestMultiLookup",
                            title: "Multi-Lookup",
                            showField: "Title",
                            type: Helper.SPCfgFieldType.Lookup
                        } as Types.Helper.IFieldInfoLookup,
                        {
                            multi: true,
                            name: "TestMultiUser",
                            title: "Multi-User",
                            type: Helper.SPCfgFieldType.User,
                            selectionMode: SPTypes.FieldUserSelectionType.PeopleAndGroups
                        } as Types.Helper.IFieldInfoUser,
                        {
                            name: "TestNote",
                            title: "Note",
                            type: Helper.SPCfgFieldType.Note
                        } as Types.Helper.IFieldInfoNote,
                        {
                            decimals: 2,
                            numberType: SPTypes.FieldNumberType.Decimal,
                            name: "TestNumberDecimal",
                            title: "Decimal",
                            type: Helper.SPCfgFieldType.Number
                        } as Types.Helper.IFieldInfoNumber,
                        {
                            numberType: SPTypes.FieldNumberType.Integer,
                            name: "TestNumberInteger",
                            title: "Integer",
                            type: Helper.SPCfgFieldType.Number
                        } as Types.Helper.IFieldInfoNumber,
                        {
                            numberType: SPTypes.FieldNumberType.Percentage,
                            name: "TestNumberPercentage",
                            title: "Percentage",
                            type: Helper.SPCfgFieldType.Number
                        } as Types.Helper.IFieldInfoNumber,
                        {
                            name: "TestUrl",
                            title: "Url",
                            type: Helper.SPCfgFieldType.Url
                        },
                        {
                            name: "TestUser",
                            title: "User",
                            type: Helper.SPCfgFieldType.User,
                            selectionMode: SPTypes.FieldUserSelectionType.PeopleAndGroups
                        } as Types.Helper.IFieldInfoUser
                    ],
                    ListInformation: {
                        BaseTemplate: SPTypes.ListTemplateType.GenericList,
                        Title: "SPReact"
                    },
                    ViewInformation: [
                        {
                            ViewFields: [
                                "LinkTitle", "TestBoolean", "TestChoice", "TestDate", "TestDateTime",
                                "TestLookup", "TestMultiChoice", "TestMultiLookup", "TestMultiUser",
                                "TestNote", "TestNumberDecimal", "TestNumberInteger", "TestUrl", "TestUser"
                            ],
                            ViewName: "All Items"
                        }
                    ]
                }
            ]
        }),

        // WebPart
        WebPart: new Helper.SPConfig({
            WebPartCfg: [
                {
                    FileName: "wp_test_js.webpart",
                    Group: "Dattabase",
                    XML:
                    `<?xml version="1.0" encoding="utf-8"?>
<webParts>
    <webPart xmlns="http://schemas.microsoft.com/WebPart/v3">
        <metaData>
            <type name="Microsoft.SharePoint.WebPartPages.ScriptEditorWebPart, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" />
            <importErrorMessage>$Resources:core,ImportantErrorMessage;</importErrorMessage>
        </metaData>
        <data>
            <properties>
                <property name="Title" type="string">Test List Item Form (JS)</property>
                <property name="Description" type="string">A test for the gd-sprest-js library.</property>
                <property name="ChromeType" type="chrometype">TitleOnly</property>
                <property name="Content" type="string">
                    &lt;script type="text/javascript" src="/sites/dev/siteassets/sprest-js/test.js"&gt;&lt;/script&gt;
                    &lt;div id="wp-test-js"&gt;&lt;/div&gt;
                    &lt;div id="wp-test-js-cfg" style="display:none"&gt;&lt;/div&gt;
                    &lt;script type="text/javascript"&gt;SP.SOD.executeOrDelayUntilScriptLoaded(function() { TestJS.init(); }, 'test.js');&lt;/script&gt;
                </property>
            </properties>
        </data>
    </webPart>
</webParts>`
                }
            ]
        })
    },

    // Initialize the webpart
    init: () => {
        WebParts.WebPart({
            cfgElementId: "wp-test-js-cfg",
            elementId: "wp-test-js",
            onRenderDisplay: (cfg) => {
                // Render elements
                cfg.el.innerHTML = "<div></div><div></div><div></div><div></div>";

                // The fields to render
                let fields = ["Title", "TestBoolean", "TestChoice", "TestComments", "TestDate", "TestDateTime",
                    "TestMultiChoice", "TestLookup", "TestMultiLookup", "TestManagedMetadata",
                    "TestNote", "TestNumberDecimal", "TestNumberInteger", "TestNumberPercentage",
                    "TestUrl"
                ];

                // Render the new form
                let newForm = ListFormPanel({
                    controlMode: SPTypes.ControlMode.New,
                    el: cfg.el.children[0],
                    fields,
                    listName: "SPReact",
                    panelTitle: "Test Item Form",
                    panelType: Fabric.PanelTypes.Large
                });

                // Render the new button
                let newButton = Fabric.Button({
                    el: cfg.el.children[1],
                    text: "New Item",
                    onClick: () => {
                        // Show the list form
                        newForm.show(SPTypes.ControlMode.New);

                        // Disable postback
                        return false;
                    }
                });

                // Get the list
                (new List("SPReact"))
                    // Get the items
                    .Items()
                    // Query for the first item
                    .query({
                        Top: 1
                    })
                    // Execute the request
                    .execute(items => {
                        let item = items.results ? items.results[0] : null;
                        if (item) {
                            // Render the view form
                            let viewForm = ListFormPanel({
                                controlMode: SPTypes.ControlMode.Display,
                                el: cfg.el.children[2],
                                fields,
                                itemId: item.Id,
                                listName: "SPReact",
                                panelTitle: item["Title"] || "",
                                panelType: Fabric.PanelTypes.Large
                            });

                            // Render the view button
                            let editButton = Fabric.Button({
                                el: cfg.el.children[3],
                                text: "View Item",
                                onClick: () => {
                                    // Show the list form
                                    viewForm.show(SPTypes.ControlMode.Display);

                                    // Disable postback
                                    return false;
                                }
                            });
                        }
                    });
            },
            onRenderEdit: (cfg) => {
                cfg.el.innerHTML = "<div class='ms-fontSize-xl'>The Page Is Being Edited</div>";
            }
        });
    }
}

// Notify SharePoint that this script is loaded
SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs("test.js");