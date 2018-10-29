export var Holdreason;
(function (Holdreason) {
    Holdreason["Empty"] = "";
    Holdreason["KanopusSTFailedToSeparateFromTheUpperStage"] = "Kanopus-ST failed to separate from the upper stage.";
})(Holdreason || (Holdreason = {}));
export var Countrycode;
(function (Countrycode) {
    Countrycode["Aus"] = "AUS";
    Countrycode["Chn"] = "CHN";
    Countrycode["Dza"] = "DZA";
    Countrycode["Guf"] = "GUF";
    Countrycode["ISR"] = "ISR";
    Countrycode["Ind"] = "IND";
    Countrycode["Irn"] = "IRN";
    Countrycode["Jpn"] = "JPN";
    Countrycode["Kaz"] = "KAZ";
    Countrycode["Ken"] = "KEN";
    Countrycode["Kor"] = "KOR";
    Countrycode["Mhl"] = "MHL";
    Countrycode["Nzl"] = "NZL";
    Countrycode["Prk"] = "PRK";
    Countrycode["Rus"] = "RUS";
    Countrycode["Unk"] = "UNK";
    Countrycode["Usa"] = "USA";
})(Countrycode || (Countrycode = {}));
export var TypeName;
(function (TypeName) {
    TypeName["Astrophysics"] = "Astrophysics";
    TypeName["Communications"] = "Communications";
    TypeName["DedicatedRideshare"] = "Dedicated Rideshare";
    TypeName["EarthScience"] = "Earth Science";
    TypeName["Empty"] = "";
    TypeName["GovernmentTopSecret"] = "Government/Top Secret";
    TypeName["Heliophysics"] = "Heliophysics";
    TypeName["HumanExploration"] = "Human Exploration";
    TypeName["Navigation"] = "Navigation";
    TypeName["PlanetaryScience"] = "Planetary Science";
    TypeName["Resupply"] = "Resupply";
    TypeName["RoboticExploration"] = "Robotic Exploration";
    TypeName["TestFlight"] = "Test Flight";
    TypeName["Unknown"] = "Unknown";
})(TypeName || (TypeName = {}));
// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export var Convert;
(function (Convert) {
    function toLaunchData(json) {
        return cast(JSON.parse(json), r("LaunchData"));
    }
    Convert.toLaunchData = toLaunchData;
    function launchDataToJson(value) {
        return JSON.stringify(uncast(value, r("LaunchData")), null, 2);
    }
    Convert.launchDataToJson = launchDataToJson;
    function invalidValue(typ, val) {
        throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
    }
    function jsonToJSProps(typ) {
        if (typ.jsonToJS === undefined) {
            var map = {};
            typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
            typ.jsonToJS = map;
        }
        return typ.jsonToJS;
    }
    function jsToJSONProps(typ) {
        if (typ.jsToJSON === undefined) {
            var map = {};
            typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
            typ.jsToJSON = map;
        }
        return typ.jsToJSON;
    }
    function transform(val, typ, getProps) {
        function transformPrimitive(typ, val) {
            if (typeof typ === typeof val)
                return val;
            return invalidValue(typ, val);
        }
        function transformUnion(typs, val) {
            // val must validate against one typ in typs
            var l = typs.length;
            for (var i = 0; i < l; i++) {
                var typ = typs[i];
                try {
                    return transform(val, typ, getProps);
                }
                catch (_) { }
            }
            return invalidValue(typs, val);
        }
        function transformEnum(cases, val) {
            if (cases.indexOf(val) !== -1)
                return val;
            return invalidValue(cases, val);
        }
        function transformArray(typ, val) {
            // val must be an array with no invalid elements
            if (!Array.isArray(val))
                return invalidValue("array", val);
            return val.map(el => transform(el, typ, getProps));
        }
        function transformObject(props, additional, val) {
            if (val === null || typeof val !== "object" || Array.isArray(val)) {
                return invalidValue("object", val);
            }
            var result = {};
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
        if (typ === "any")
            return val;
        if (typ === null) {
            if (val === null)
                return val;
            return invalidValue(typ, val);
        }
        if (typ === false)
            return invalidValue(typ, val);
        while (typeof typ === "object" && typ.ref !== undefined) {
            typ = typeMap[typ.ref];
        }
        if (Array.isArray(typ))
            return transformEnum(typ, val);
        if (typeof typ === "object") {
            return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
                : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                    : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                        : invalidValue(typ, val);
        }
        return transformPrimitive(typ, val);
    }
    function cast(val, typ) {
        return transform(val, typ, jsonToJSProps);
    }
    function uncast(val, typ) {
        return transform(val, typ, jsToJSONProps);
    }
    function a(typ) {
        return { arrayItems: typ };
    }
    function u(...typs) {
        return { unionMembers: typs };
    }
    function o(props, additional) {
        return { props, additional };
    }
    function m(additional) {
        return { props: [], additional };
    }
    function r(name) {
        return { ref: name };
    }
    const typeMap = {
        "LaunchData": o([
            { json: "sites", js: "sites", typ: r("Sites") },
            { json: "locations", js: "locations", typ: m(r("LocationValue")) },
            { json: "agencies", js: "agencies", typ: r("Agencies") },
            { json: "launches", js: "launches", typ: m(r("LaunchValue")) },
            { json: "missions", js: "missions", typ: m(r("MissionValue")) },
        ], false),
        "Agencies": o([], false),
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
})(Convert || (Convert = {}));
