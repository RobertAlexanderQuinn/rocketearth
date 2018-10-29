
// client side data functions to work with launch data
// location (Space port) -> missions -> pads -> launches
// launch
import {LaunchData, LocationValue, Convert, MissionValue, LocationPad, SitesPad} from "./launchData";

export default class Launches {

    launchData: LaunchData | null;
    isInitialized: Promise<boolean>;

    constructor() {
        this.launchData = null;

        this.isInitialized = (async () => {
            try {
                const res = await window.fetch("./data/launchdata.json");
                const json = await res.json();
                this.launchData = Convert.toLaunchData(json);
                
                return true;

            } catch (reason) {
                
                console.warn(`Failed to initialize launch data: ${reason}`);

                return false;
            }
        })();
    }

    async getLocations() : Promise<{[key: string] : LocationValue} | null> {
        await this.isInitialized;

        if (this.launchData != null) {
            return this.launchData.locations;
        }
        return null;
    }

    async getLocationById(locationId: number) : Promise<LocationValue | null> {
        return null;
    }

    async getMissions(): Promise<MissionValue | null> {
        return null;
    }
    
    async getMissionsByLocation(locationId: number): Promise<MissionValue[] | null> {
        return null;
    }

    async getPads(): Promise<SitesPad | null> {
        return null;
    }

    async getPadsByLocation(locationId: number) : Promise<LocationPad | null> {
        return null;
    }
}
