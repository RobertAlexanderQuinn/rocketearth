var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// client side data functions to work with launch data
// location (Space port) -> missions -> pads -> launches
// launch
import { Convert } from "./launchData.js";
export default class Launches {
    constructor() {
        this.launchData = null;
        this.isInitialized = (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield window.fetch("./data/launchdata.json");
                const json = yield res.json();
                this.launchData = Convert.toLaunchData(json);
                return true;
            }
            catch (reason) {
                console.warn(`Failed to initialize launch data: ${reason}`);
                return false;
            }
        }))();
    }
    getLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.isInitialized;
            if (this.launchData != null) {
                return this.launchData.locations;
            }
            return null;
        });
    }
    getLocationById(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getMissions() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getMissionsByLocation(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getPads() {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
    getPadsByLocation(locationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return null;
        });
    }
}
