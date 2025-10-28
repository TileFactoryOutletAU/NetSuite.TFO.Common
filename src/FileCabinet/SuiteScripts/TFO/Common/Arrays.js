/**
 * Arrays.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    ['/SuiteScripts/TFO/Common/Args'],
    (Args) => {

        const findByProperty = (args) => {
            let params = Args.parse(args, [
                { name: "array", type: "object" },
                { name: "property", type: "string" },
                { name: "value" }
            ], []);

            for (let i in params.array) {
                if (!params.array[i].hasOwnProperty(params.property)) return -1;
                if (params.array[i][params.property] == params.value) return i;
            }
            return -1;
        };

        const groupByProperty = (args) => {
            let params = Args.parse(args, [
                { name: "array", type: "object" },
                { name: "property", type: "string" },
            ], []);

            let groups = {};
            for (let i in params.array) {
                let item = params.array[i];

                if (!item.hasOwnProperty(params.property)) return false;
                let value = item[params.property];

                if (!groups.hasOwnProperty(value)) groups[value] = [];
                groups[value].push(item);
            }
            return groups;
        };

        return {
            findByProperty: findByProperty,
            groupByProperty: groupByProperty,
        };
    }
);