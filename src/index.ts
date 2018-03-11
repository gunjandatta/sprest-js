import * as Fabric from "./fabric";
import * as Components from "./components";
import * as WebParts from "./webparts";
export {
    Fabric,
    Components,
    WebParts
}
declare var SP;

// Wait for the core library to be loaded
SP && SP.SOD ? SP.SOD.executeOrDelayUntilScriptLoaded(() => {
    // Get the global variable
    var $REST = window["$REST"];
    if ($REST) {
        // Add the JS library
        $REST["JS"] = { Components, Fabric, WebParts };
    }

    // Alert other scripts this library is loaded
    SP.SOD.notifyScriptLoadedAndExecuteWaitingJobs("gd-sprest-js.js");
}, "gd-sprest.js") : null;