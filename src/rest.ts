import * as Fabric from "./fabric";
import * as Components from "./components";
import * as WebParts from "./webparts";
import { $REST, IREST } from "gd-sprest";
declare var SP;

/**
 * $REST Library
 */
export interface IRESTJS extends IREST {
    /** JavaScript Library */
    JS: {
        /** SharePoint Components */
        Components;

        /** Fabric Components */
        Fabric;

        /** WebParts */
        WebParts;
    }
}

// Set the JS library
export const RESTJS: IRESTJS = $REST as any;
RESTJS.JS = {
    Components,
    Fabric,
    WebParts
}

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