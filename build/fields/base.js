"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gd_sprest_1 = require("gd-sprest");
var fabric_1 = require("../fabric");
var text_1 = require("./text");
/**
 * Base Field
 */
exports.BaseField = function (props) {
    // Load the field information
    gd_sprest_1.Helper.ListFormField.create(props.fieldInfo).then(function (fieldInfo) {
        // Render the field based on the type
        switch (fieldInfo.type) {
            case gd_sprest_1.SPTypes.FieldType.Text:
                // Render the text field
                text_1.TextField.render(props.el, fieldInfo);
                break;
            default:
                // Log
                console.log("[gd-sprest] The field type '" + fieldInfo.typeAsString + "' is not supported.");
                break;
        }
    });
    // Render a spinner
    props.el.innerHTML = "\n        <div class=\"ms-Spinner\">\n            <div class=\"ms-Spinner-label\">Loading the field...</div>\n        </div>\n    ".trim();
    // Initialize the spinner
    new fabric_1.fabric.Spinner(props.el.firstChild);
};
