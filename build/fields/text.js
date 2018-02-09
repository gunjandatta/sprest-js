"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextField = {
    // Method to render a textfield
    render: function (el, fieldInfo) {
        // Render the textfield
        el.innerHTML = [
            "<div class='ms-TextField'>",
            "<label class='ms-Label'>" + fieldInfo.title + "</label>",
            "<input class='ms-TextField-field' type='text' value='" + (fieldInfo.defaultValue || "") + "' placeholder=''></input>",
            "</div>"
        ].join("");
        // Initialize the textfield
        new fabric.TextField(el.firstChild);
    }
};
//# sourceMappingURL=text.js.map