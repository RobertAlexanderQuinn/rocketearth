/// <///reference path="./earth/1.0.0/launches.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Launches from "./earth/1.0.0/launches";
console.log("booting rocket earth...");
// (async () => { 
//     const foo = await import("./earth/1.0.0/launches.js");
//     console.log(typeof foo);
// })();
const data = new Launches();
(() => __awaiter(this, void 0, void 0, function* () {
    let locations = yield data.getLocations();
    console.log(locations);
}))();
