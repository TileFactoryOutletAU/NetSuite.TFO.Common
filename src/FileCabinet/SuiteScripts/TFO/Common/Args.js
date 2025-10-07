/**
 * Args.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 * @NAmdConfig    ./paths.json
 */

define(
    [],
    () => {

        const parse = (args, required, optional) => {
            let params = {};
            args = typeof args !== "undefined" ? args : {};

            for (let i in required) {
                let item = required[i];

                let name = item.hasOwnProperty("name") ? item.name : item;
                if (typeof name !== "string") throw new Error("Argument has no name");

                if (!args.hasOwnProperty(name)) throw new Error("Missing Argument: " + name);
                let value = args[name];

                let type = item.hasOwnProperty("type") ? item.type : null;
                if (type) {
                    if (typeof value !== type) throw new Error("Argument " + name + " is the wrong type. Got " + typeof value + ", expected " + type);
                }

                params[name] = value;
            }

            for (let i in optional) {
                let item = optional[i];

                let name = item.hasOwnProperty("name") ? item.name : item;
                if (typeof name !== "string") throw new Error("Argument has no name");

                let defaultValue = item.hasOwnProperty("default") ? item.default : null;
                let value = args.hasOwnProperty(name) ? args[name] : defaultValue;

                let type = item.hasOwnProperty("type") ? item.type : null;
                if (type) {
                    if (typeof value !== type) throw new Error("Argument " + name + " is the wrong type. Got " + typeof value + ", expected " + type);
                }

                params[name] = value;
            }

            return params;
        };

        return {
            parse: parse,
        };
    }
);