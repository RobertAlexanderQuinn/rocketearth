export interface LaunchData {
    sites: Sites;
    locations: {
        [key: string]: LocationValue;
    };
    agencies: Agencies;
    launches: {
        [key: string]: LaunchValue;
    };
    missions: {
        [key: string]: MissionValue;
    };
}
export interface Agencies {
}
export interface LaunchValue {
    id: number;
    name: string;
    windowstart: string;
    windowend: string;
    net: string;
    wsstamp: number;
    westamp: number;
    netstamp: number;
    isostart: string;
    isoend: string;
    isonet: string;
    status: number;
    inhold: number;
    tbdtime: number;
    vidURLs: string[];
    vidURL: null | string;
    infoURLs: string[];
    infoURL: null;
    holdreason: Holdreason | null;
    failreason: null | string;
    tbddate: number;
    probability: number;
    hashtag: null | string;
    changed: string;
    location: LaunchLocation;
    rocket: Rocket;
    missions: MissionElement[];
    lsp?: Lsp;
}
export declare enum Holdreason {
    Empty = "",
    KanopusSTFailedToSeparateFromTheUpperStage = "Kanopus-ST failed to separate from the upper stage."
}
export interface LaunchLocation {
    pads: LocationPad[];
    id?: number;
    name?: string;
    infoURL?: string;
    wikiURL?: string;
    countryCode?: Countrycode;
}
export declare enum Countrycode {
    Aus = "AUS",
    Chn = "CHN",
    Dza = "DZA",
    Guf = "GUF",
    ISR = "ISR",
    Ind = "IND",
    Irn = "IRN",
    Jpn = "JPN",
    Kaz = "KAZ",
    Ken = "KEN",
    Kor = "KOR",
    Mhl = "MHL",
    Nzl = "NZL",
    Prk = "PRK",
    Rus = "RUS",
    Unk = "UNK",
    Usa = "USA"
}
export interface LocationPad {
    id: number;
    name: string;
    infoURL: null | string;
    wikiURL: null | string;
    mapURL: null | string;
    latitude: number;
    longitude: number;
    agencies: Lsp[] | null;
}
export interface Lsp {
    id: number;
    name: string;
    abbrev: string;
    countryCode: string;
    type: number;
    infoURL: null | string;
    wikiURL: null | string;
    changed?: string;
    infoURLs: string[];
}
export interface MissionElement {
    id: number;
    name: string;
    description: string;
    type: number;
    wikiURL: string;
    typeName: TypeName;
    agencies: Lsp[] | null;
    payloads: PurplePayload[];
}
export interface PurplePayload {
    id: number;
    name: string;
}
export declare enum TypeName {
    Astrophysics = "Astrophysics",
    Communications = "Communications",
    DedicatedRideshare = "Dedicated Rideshare",
    EarthScience = "Earth Science",
    Empty = "",
    GovernmentTopSecret = "Government/Top Secret",
    Heliophysics = "Heliophysics",
    HumanExploration = "Human Exploration",
    Navigation = "Navigation",
    PlanetaryScience = "Planetary Science",
    Resupply = "Resupply",
    RoboticExploration = "Robotic Exploration",
    TestFlight = "Test Flight",
    Unknown = "Unknown"
}
export interface Rocket {
    id: number;
    name: string;
    configuration: string;
    familyname: string;
    agencies: Lsp[] | null;
    wikiURL: string;
    infoURLs: string[];
    imageURL: string;
    imageSizes: number[];
    infoURL?: string;
}
export interface LocationValue {
    id: number;
    name: string;
    countrycode: Countrycode;
    infoURL: string;
    wikiURL: string;
    infoURLs: string[];
    changed: string;
}
export interface MissionValue {
    id: number;
    name: string;
    description: string;
    agencies: Lsp[] | null;
    type: number;
    typeName?: TypeName;
    launch: MissionLaunch | null;
    infoURL: string;
    wikiURL: string;
    events: null;
    infoURLs: string[];
    changed: string;
    payloads: FluffyPayload[];
}
export interface MissionLaunch {
    id: number;
    name: string;
    windowstart: string;
    windowend: string;
    net: string;
}
export interface FluffyPayload {
    id: number;
    name: string;
    countryCodes: null | string;
    weight: null | string;
    dimensions: null | string;
    description: string;
    total: number | null;
    type: number | null;
    agencies: Lsp[];
}
export interface Sites {
    pads: SitesPad[];
    total: number;
    count: number;
    offset: number;
}
export interface SitesPad {
    id: number;
    name: string;
    padType: number;
    latitude: null | string;
    longitude: null | string;
    mapURL: null | string;
    retired: number;
    locationid: number;
    agencies: Lsp[] | null;
    infoURL: null | string;
    wikiURL: null | string;
    infoURLs: string[];
    changed: string;
}
export declare namespace Convert {
    function toLaunchData(json: string): LaunchData;
    function launchDataToJson(value: LaunchData): string;
}
