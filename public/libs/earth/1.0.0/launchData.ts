export interface LaunchData {
    sites:     Sites;
    locations: { [key: string]: LocationValue };
    agencies:  Agencies;
    launches:  { [key: string]: LaunchValue };
    missions:  { [key: string]: MissionValue };
}

export interface Agencies {
}

export interface LaunchValue {
    id:          number;
    name:        string;
    windowstart: string;
    windowend:   string;
    net:         string;
    wsstamp:     number;
    westamp:     number;
    netstamp:    number;
    isostart:    string;
    isoend:      string;
    isonet:      string;
    status:      number;
    inhold:      number;
    tbdtime:     number;
    vidURLs:     string[];
    vidURL:      null | string;
    infoURLs:    string[];
    infoURL:     null;
    holdreason:  Holdreason | null;
    failreason:  null | string;
    tbddate:     number;
    probability: number;
    hashtag:     null | string;
    changed:     string;
    location:    LaunchLocation;
    rocket:      Rocket;
    missions:    MissionElement[];
    lsp?:        Lsp;
}

export enum Holdreason {
    Empty = "",
    KanopusSTFailedToSeparateFromTheUpperStage = "Kanopus-ST failed to separate from the upper stage.",
}

export interface LaunchLocation {
    pads:         LocationPad[];
    id?:          number;
    name?:        string;
    infoURL?:     string;
    wikiURL?:     string;
    countryCode?: Countrycode;
}

export enum Countrycode {
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
    Usa = "USA",
}

export interface LocationPad {
    id:        number;
    name:      string;
    infoURL:   null | string;
    wikiURL:   null | string;
    mapURL:    null | string;
    latitude:  number;
    longitude: number;
    agencies:  Lsp[] | null;
}

export interface Lsp {
    id:          number;
    name:        string;
    abbrev:      string;
    countryCode: string;
    type:        number;
    infoURL:     null | string;
    wikiURL:     null | string;
    changed?:    string;
    infoURLs:    string[];
}

export interface MissionElement {
    id:          number;
    name:        string;
    description: string;
    type:        number;
    wikiURL:     string;
    typeName:    TypeName;
    agencies:    Lsp[] | null;
    payloads:    PurplePayload[];
}

export interface PurplePayload {
    id:   number;
    name: string;
}

export enum TypeName {
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
    Unknown = "Unknown",
}

export interface Rocket {
    id:            number;
    name:          string;
    configuration: string;
    familyname:    string;
    agencies:      Lsp[] | null;
    wikiURL:       string;
    infoURLs:      string[];
    imageURL:      string;
    imageSizes:    number[];
    infoURL?:      string;
}

export interface LocationValue {
    id:          number;
    name:        string;
    countrycode: Countrycode;
    infoURL:     string;
    wikiURL:     string;
    infoURLs:    string[];
    changed:     string;
}

export interface MissionValue {
    id:          number;
    name:        string;
    description: string;
    agencies:    Lsp[] | null;
    type:        number;
    typeName?:   TypeName;
    launch:      MissionLaunch | null;
    infoURL:     string;
    wikiURL:     string;
    events:      null;
    infoURLs:    string[];
    changed:     string;
    payloads:    FluffyPayload[];
}

export interface MissionLaunch {
    id:          number;
    name:        string;
    windowstart: string;
    windowend:   string;
    net:         string;
}

export interface FluffyPayload {
    id:           number;
    name:         string;
    countryCodes: null | string;
    weight:       null | string;
    dimensions:   null | string;
    description:  string;
    total:        number | null;
    type:         number | null;
    agencies:     Lsp[];
}

export interface Sites {
    pads:   SitesPad[];
    total:  number;
    count:  number;
    offset: number;
}

export interface SitesPad {
    id:         number;
    name:       string;
    padType:    number;
    latitude:   null | string;
    longitude:  null | string;
    mapURL:     null | string;
    retired:    number;
    locationid: number;
    agencies:   Lsp[] | null;
    infoURL:    null | string;
    wikiURL:    null | string;
    infoURLs:   string[];
    changed:    string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export namespace Convert {
    export function toLaunchData(json: string): LaunchData {
        return cast(JSON.parse(json), r("LaunchData"));
    }

    export function launchDataToJson(value: LaunchData): string {
        return JSON.stringify(uncast(value, r("LaunchData")), null, 2);
    }

    function invalidValue(typ: any, val: any): never {
        throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
    }

    function jsonToJSProps(typ: any): any {
        if (typ.jsonToJS === undefined) {
            var map: any = {};
            typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
            typ.jsonToJS = map;
        }
        return typ.jsonToJS;
    }

    function jsToJSONProps(typ: any): any {
        if (typ.jsToJSON === undefined) {
            var map: any = {};
            typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
            typ.jsToJSON = map;
        }
        return typ.jsToJSON;
    }

    function transform(val: any, typ: any, getProps: any): any {
        function transformPrimitive(typ: string, val: any): any {
            if (typeof typ === typeof val) return val;
            return invalidValue(typ, val);
        }

        function transformUnion(typs: any[], val: any): any {
            // val must validate against one typ in typs
            var l = typs.length;
            for (var i = 0; i < l; i++) {
                var typ = typs[i];
                try {
                    return transform(val, typ, getProps);
                } catch (_) {}
            }
            return invalidValue(typs, val);
        }

        function transformEnum(cases: string[], val: any): any {
            if (cases.indexOf(val) !== -1) return val;
            return invalidValue(cases, val);
        }

        function transformArray(typ: any, val: any): any {
            // val must be an array with no invalid elements
            if (!Array.isArray(val)) return invalidValue("array", val);
            return val.map(el => transform(el, typ, getProps));
        }

        function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
            if (val === null || typeof val !== "object" || Array.isArray(val)) {
                return invalidValue("object", val);
            }
            var result: any = {};
            Object.getOwnPropertyNames(props).forEach(key => {
                const prop = props[key];
                const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
                result[prop.key] = transform(v, prop.typ, getProps);
            });
            Object.getOwnPropertyNames(val).forEach(key => {
                if (!Object.prototype.hasOwnProperty.call(props, key)) {
                    result[key] = transform(val[key], additional, getProps);
                }
            });
            return result;
        }

        if (typ === "any") return val;
        if (typ === null) {
            if (val === null) return val;
            return invalidValue(typ, val);
        }
        if (typ === false) return invalidValue(typ, val);
        while (typeof typ === "object" && typ.ref !== undefined) {
            typ = typeMap[typ.ref];
        }
        if (Array.isArray(typ)) return transformEnum(typ, val);
        if (typeof typ === "object") {
            return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
                : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
                : invalidValue(typ, val);
        }
        return transformPrimitive(typ, val);
    }

    function cast<T>(val: any, typ: any): T {
        return transform(val, typ, jsonToJSProps);
    }

    function uncast<T>(val: T, typ: any): any {
        return transform(val, typ, jsToJSONProps);
    }

    function a(typ: any) {
        return { arrayItems: typ };
    }

    function u(...typs: any[]) {
        return { unionMembers: typs };
    }

    function o(props: any[], additional: any) {
        return { props, additional };
    }

    function m(additional: any) {
        return { props: [], additional };
    }

    function r(name: string) {
        return { ref: name };
    }

    const typeMap: any = {
        "LaunchData": o([
            { json: "sites", js: "sites", typ: r("Sites") },
            { json: "locations", js: "locations", typ: m(r("LocationValue")) },
            { json: "agencies", js: "agencies", typ: r("Agencies") },
            { json: "launches", js: "launches", typ: m(r("LaunchValue")) },
            { json: "missions", js: "missions", typ: m(r("MissionValue")) },
        ], false),
        "Agencies": o([
        ], false),
        "LaunchValue": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "windowstart", js: "windowstart", typ: "" },
            { json: "windowend", js: "windowend", typ: "" },
            { json: "net", js: "net", typ: "" },
            { json: "wsstamp", js: "wsstamp", typ: 0 },
            { json: "westamp", js: "westamp", typ: 0 },
            { json: "netstamp", js: "netstamp", typ: 0 },
            { json: "isostart", js: "isostart", typ: "" },
            { json: "isoend", js: "isoend", typ: "" },
            { json: "isonet", js: "isonet", typ: "" },
            { json: "status", js: "status", typ: 0 },
            { json: "inhold", js: "inhold", typ: 0 },
            { json: "tbdtime", js: "tbdtime", typ: 0 },
            { json: "vidURLs", js: "vidURLs", typ: a("") },
            { json: "vidURL", js: "vidURL", typ: u(null, "") },
            { json: "infoURLs", js: "infoURLs", typ: a("") },
            { json: "infoURL", js: "infoURL", typ: null },
            { json: "holdreason", js: "holdreason", typ: u(r("Holdreason"), null) },
            { json: "failreason", js: "failreason", typ: u(null, "") },
            { json: "tbddate", js: "tbddate", typ: 0 },
            { json: "probability", js: "probability", typ: 0 },
            { json: "hashtag", js: "hashtag", typ: u(null, "") },
            { json: "changed", js: "changed", typ: "" },
            { json: "location", js: "location", typ: r("LaunchLocation") },
            { json: "rocket", js: "rocket", typ: r("Rocket") },
            { json: "missions", js: "missions", typ: a(r("MissionElement")) },
            { json: "lsp", js: "lsp", typ: u(undefined, r("Lsp")) },
        ], false),
        "LaunchLocation": o([
            { json: "pads", js: "pads", typ: a(r("LocationPad")) },
            { json: "id", js: "id", typ: u(undefined, 0) },
            { json: "name", js: "name", typ: u(undefined, "") },
            { json: "infoURL", js: "infoURL", typ: u(undefined, "") },
            { json: "wikiURL", js: "wikiURL", typ: u(undefined, "") },
            { json: "countryCode", js: "countryCode", typ: u(undefined, r("Countrycode")) },
        ], false),
        "LocationPad": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "infoURL", js: "infoURL", typ: u(null, "") },
            { json: "wikiURL", js: "wikiURL", typ: u(null, "") },
            { json: "mapURL", js: "mapURL", typ: u(null, "") },
            { json: "latitude", js: "latitude", typ: 3.14 },
            { json: "longitude", js: "longitude", typ: 3.14 },
            { json: "agencies", js: "agencies", typ: u(a(r("Lsp")), null) },
        ], false),
        "Lsp": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "abbrev", js: "abbrev", typ: "" },
            { json: "countryCode", js: "countryCode", typ: "" },
            { json: "type", js: "type", typ: 0 },
            { json: "infoURL", js: "infoURL", typ: u(null, "") },
            { json: "wikiURL", js: "wikiURL", typ: u(null, "") },
            { json: "changed", js: "changed", typ: u(undefined, "") },
            { json: "infoURLs", js: "infoURLs", typ: a("") },
        ], false),
        "MissionElement": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "description", js: "description", typ: "" },
            { json: "type", js: "type", typ: 0 },
            { json: "wikiURL", js: "wikiURL", typ: "" },
            { json: "typeName", js: "typeName", typ: r("TypeName") },
            { json: "agencies", js: "agencies", typ: u(a(r("Lsp")), null) },
            { json: "payloads", js: "payloads", typ: a(r("PurplePayload")) },
        ], false),
        "PurplePayload": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
        ], false),
        "Rocket": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "configuration", js: "configuration", typ: "" },
            { json: "familyname", js: "familyname", typ: "" },
            { json: "agencies", js: "agencies", typ: u(a(r("Lsp")), null) },
            { json: "wikiURL", js: "wikiURL", typ: "" },
            { json: "infoURLs", js: "infoURLs", typ: a("") },
            { json: "imageURL", js: "imageURL", typ: "" },
            { json: "imageSizes", js: "imageSizes", typ: a(0) },
            { json: "infoURL", js: "infoURL", typ: u(undefined, "") },
        ], false),
        "LocationValue": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "countrycode", js: "countrycode", typ: r("Countrycode") },
            { json: "infoURL", js: "infoURL", typ: "" },
            { json: "wikiURL", js: "wikiURL", typ: "" },
            { json: "infoURLs", js: "infoURLs", typ: a("") },
            { json: "changed", js: "changed", typ: "" },
        ], false),
        "MissionValue": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "description", js: "description", typ: "" },
            { json: "agencies", js: "agencies", typ: u(a(r("Lsp")), null) },
            { json: "type", js: "type", typ: 0 },
            { json: "typeName", js: "typeName", typ: u(undefined, r("TypeName")) },
            { json: "launch", js: "launch", typ: u(r("MissionLaunch"), null) },
            { json: "infoURL", js: "infoURL", typ: "" },
            { json: "wikiURL", js: "wikiURL", typ: "" },
            { json: "events", js: "events", typ: null },
            { json: "infoURLs", js: "infoURLs", typ: a("") },
            { json: "changed", js: "changed", typ: "" },
            { json: "payloads", js: "payloads", typ: a(r("FluffyPayload")) },
        ], false),
        "MissionLaunch": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "windowstart", js: "windowstart", typ: "" },
            { json: "windowend", js: "windowend", typ: "" },
            { json: "net", js: "net", typ: "" },
        ], false),
        "FluffyPayload": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "countryCodes", js: "countryCodes", typ: u(null, "") },
            { json: "weight", js: "weight", typ: u(null, "") },
            { json: "dimensions", js: "dimensions", typ: u(null, "") },
            { json: "description", js: "description", typ: "" },
            { json: "total", js: "total", typ: u(0, null) },
            { json: "type", js: "type", typ: u(0, null) },
            { json: "agencies", js: "agencies", typ: a(r("Lsp")) },
        ], false),
        "Sites": o([
            { json: "pads", js: "pads", typ: a(r("SitesPad")) },
            { json: "total", js: "total", typ: 0 },
            { json: "count", js: "count", typ: 0 },
            { json: "offset", js: "offset", typ: 0 },
        ], false),
        "SitesPad": o([
            { json: "id", js: "id", typ: 0 },
            { json: "name", js: "name", typ: "" },
            { json: "padType", js: "padType", typ: 0 },
            { json: "latitude", js: "latitude", typ: u(null, "") },
            { json: "longitude", js: "longitude", typ: u(null, "") },
            { json: "mapURL", js: "mapURL", typ: u(null, "") },
            { json: "retired", js: "retired", typ: 0 },
            { json: "locationid", js: "locationid", typ: 0 },
            { json: "agencies", js: "agencies", typ: u(a(r("Lsp")), null) },
            { json: "infoURL", js: "infoURL", typ: u(null, "") },
            { json: "wikiURL", js: "wikiURL", typ: u(null, "") },
            { json: "infoURLs", js: "infoURLs", typ: a("") },
            { json: "changed", js: "changed", typ: "" },
        ], false),
        "Holdreason": [
            "",
            "Kanopus-ST failed to separate from the upper stage.",
        ],
        "Countrycode": [
            "AUS",
            "CHN",
            "DZA",
            "GUF",
            "ISR",
            "IND",
            "IRN",
            "JPN",
            "KAZ",
            "KEN",
            "KOR",
            "MHL",
            "NZL",
            "PRK",
            "RUS",
            "UNK",
            "USA",
        ],
        "TypeName": [
            "Astrophysics",
            "Communications",
            "Dedicated Rideshare",
            "Earth Science",
            "",
            "Government/Top Secret",
            "Heliophysics",
            "Human Exploration",
            "Navigation",
            "Planetary Science",
            "Resupply",
            "Robotic Exploration",
            "Test Flight",
            "Unknown",
        ],
    };
}
