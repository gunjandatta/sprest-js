"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gd_sprest_1 = require("gd-sprest");
var text_1 = require("./text");
/**
 * Base Field
 */
var BaseField = /** @class */ (function () {
    // Constructor
    function BaseField(props) {
        var _this = this;
        this._props = null;
        // Method to render the base field
        this.render = function () {
            // Load the field information
            gd_sprest_1.Helper.ListFormField.create(_this._props.fieldInfo).then(function (fieldInfo) {
                // Render the field based on the type
                switch (fieldInfo.type) {
                    case gd_sprest_1.SPTypes.FieldType.Text:
                        // Render the text field
                        text_1.TextField.render(_this._props.el, fieldInfo);
                        break;
                    default:
                        // Log
                        console.log("[gd-sprest] The field type '" + fieldInfo.typeAsString + "' is not supported.");
                        break;
                }
            });
            // Render a spinner
            _this._props.el.innerHTML = "\n            <div class=\"ms-Spinner\">\n                <div class=\"ms-Spinner-label\">Loading the field...</div>\n            </div>\n        ".trim();
            // Initialize the spinner
            new fabric.Spinner(_this._props.el.firstChild);
        };
        // Save the properties
        this._props = props || {};
        // Render the field
        this.render();
    }
    return BaseField;
}());
exports.BaseField = BaseField;
//# sourceMappingURL=base.js.map