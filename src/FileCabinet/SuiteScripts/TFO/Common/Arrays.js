/**
 * Arrays.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    ['/SuiteScripts/TFO/Common/Args'],
    function (Args) {

        function findByProperty(args) {
            var params = Args.parse(args, [
                { name: "array", type: "object" },
                { name: "property", type: "string" },
                { name: "value" }
            ], []);

            for (var i in params.array) {
                if (!params.array[i].hasOwnProperty(params.property)) return -1;
                if (params.array[i][params.property] == params.value) return i;
            }
            return -1;
        };

        function groupByProperty(args) {
            var params = Args.parse(args, [
                { name: "array", type: "object" },
                { name: "property", type: "string" },
            ], []);

            var groups = {};
            for (var i in params.array) {
                var item = params.array[i];

                if (!item.hasOwnProperty(params.property)) return false;
                var value = item[params.property];

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