declare var SP;

// Fabric
import * as Fabric from "./fabric";
export { Fabric }

// Components
import * as Components from "./components";
export * from "./components";

// WebParts
import * as WebParts from "./webparts";
export { WebParts }

// Wait for the core library to be loaded
SP ? SP.SOD.executeOrDelayUntilScriptLoaded(() => {
    // Get the global variable
    var $REST = window["$REST"];
    if ($REST) {
        // Add the JS library
        $REST["JS"] = { Components, Fabric, WebParts };
    }

    // Alert other scripts this library is loaded
    SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs("gd-sprest-js.js");
}, "gd-sprest.js") : null;