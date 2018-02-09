import { Fields } from "../build";

window.addEventListener("load", () => {
    // Get the element
    let el = document.querySelector("#test");
    if (el) {
        el.innerHTML = "<div></div><div></div>";

        // Create a field element
        new Fields.BaseField({
            el: el.firstElementChild,
            fieldInfo: {
                listName: "SPReact",
                name: "Title"
            }
        });

        // Create a field element
        new Fields.BaseField({
            el: el.lastElementChild,
            fieldInfo: {
                listName: "SPReact",
                name: "TestBoolean"
            }
        });
    }
});