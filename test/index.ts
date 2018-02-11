import { Button, Panel, Field } from "../build";

window.addEventListener("load", () => {
    // Get the element
    let el = document.querySelector("#test");
    if (el) {
        // Render elements
        el.innerHTML = "<div></div><div></div>";

        // Render the button
        let button = Button({
            el: el.firstElementChild,
            text: "Show Panel",
            onClick: () => {
                // Show the panel
                let content = panel.show("<div></div><div></div><div></div>");

                // Create a field element
                Field({
                    el: content.children[0],
                    fieldInfo: {
                        listName: "SPReact",
                        name: "Title"
                    }
                });

                // Create a field element
                Field({
                    el: content.children[1],
                    fieldInfo: {
                        listName: "SPReact",
                        name: "TestChoice"
                    }
                });

                // Create a field element
                Field({
                    el: content.children[2],
                    fieldInfo: {
                        listName: "SPReact",
                        name: "TestBoolean"
                    }
                });
            }
        })

        // Render the panel
        let panel = Panel({
            el: el.lastElementChild,
            headerText: "SPReact List Form"
        });
    }
});