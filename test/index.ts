import { Button, Field, Panel, PanelTypes } from "../build";

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
                let panelContent = "";

                // Parse the fields
                let fields = [
                    "Title", "TestChoice", "TestBoolean", "TestDate", "TestDateTime", "TestMultiChoice",
                    "TestNumberDecimal", "TestNumberInteger", "TestNumberPercentage",
                    "TestLookup", "TestMultiLookup", "TestManagedMetadata"
                ];
                for (let i = 0; i < fields.length; i++) {
                    // Append the div for this field
                    panelContent += "<div data-field='" + fields[i] + "'></div>";
                }

                // Show the panel
                let content = panel.show(panelContent);

                // Parse the fields
                for (let i = 0; i < fields.length; i++) {
                    // Render the field
                    Field({
                        el: content.children[i],
                        fieldInfo: {
                            listName: "SPReact",
                            name: fields[i]
                        }
                    });
                }
            }
        })

        // Render the panel
        let panel = Panel({
            el: el.lastElementChild,
            headerText: "SPReact List Form",
            panelType: PanelTypes.Large
        });
    }
});