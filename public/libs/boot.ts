/// <///reference path="./earth/1.0.0/launches.d.ts" />

import { LaunchData } from "./earth/1.0.0/launchdata";
import Launches from "./earth/1.0.0/launches";

console.log("booting rocket earth...");

// (async () => { 
//     const foo = await import("./earth/1.0.0/launches.js");
//     console.log(typeof foo);
    
// })();

const data = new Launches();

(async () => {
    let locations = await data.getLocations();
    console.log(locations);
 })();