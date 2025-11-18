/**
 * Args.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    [],
    function () {

        function parse(args, required, optional) {
            var params = {};
            args = typeof args !== "undefined" ? args : {};

            for (var i in required) {
                var item = required[i];

                var name = item.hasOwnProperty("name") ? item.name : item;
                if (typeof name !== "string") throw new Error("Argument has no name");

                if (!args.hasOwnProperty(name)) throw new Error("Missing Argument: " + name);
                var value = args[name];

                var type = item.hasOwnProperty("type") ? item.type : null;
                if (type) {
                    if (typeof value !== type) throw new Error("Argument " + name + " is the wrong type. Got " + typeof value + ", expected " + type);
                }

                params[name] = value;
            }

            for (var i in optional) {
                var item = optional[i];

                var name = item.hasOwnProperty("name") ? item.name : item;
                if (typeof name !== "string") throw new Error("Argument has no name");

                var defaultValue = item.hasOwnProperty("default") ? item.default : null;
                var value = args.hasOwnProperty(name) ? args[name] : defaultValue;

                var type = item.hasOwnProperty("type") ? item.type : null;
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