import { LaunchData, LocationValue, MissionValue, LocationPad, SitesPad } from "./launchData";
export default class Launches {
    launchData: LaunchData | null;
    isInitialized: Promise<boolean>;
    constructor();
    getLocations(): Promise<{
        [key: string]: LocationValue;
    } | null>;
    getLocationById(locationId: number): Promise<LocationValue | null>;
    getMissions(): Promise<MissionValue | null>;
    getMissionsByLocation(locationId: number): Promise<MissionValue[] | null>;
    getPads(): Promise<SitesPad | null>;
    getPadsByLocation(locationId: number): Promise<LocationPad | null>;
}
