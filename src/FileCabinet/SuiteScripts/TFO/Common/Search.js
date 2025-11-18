/**
 * Search.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    ['N/search', '/SuiteScripts/TFO/Common/Args'],
    function (search, Args) {

        var Parsing = {
            NONE: null,

            INT: "integer",
            INTEGER: "integer",
            NUMBER: "integer",

            FLOAT: "float",
        };

        function getSingleField(args) {
            var params = Args.parse(args, [
                { name: "type" },
                { name: "id" },
                { name: "fieldId" },
            ], [
                { name: "getText", default: false },
                { name: "parsing", default: Parsing.NONE },
            ]);
            var result = search.lookupFields({
                type: params.type,
                id: params.id,
                columns: params.fieldId,
            });

            if (typeof result !== "object") return false;
            if (!result.hasOwnProperty(params.fieldId)) return false;
            result = result[params.fieldId];

            if (typeof result == "object") {
                if (result.length == 0) return false;
                result = result[0];
                if (params.getText && result.hasOwnProperty("text")) result = result.text;
                else if (result.hasOwnProperty("value")) result = result.value;
            }

            switch (params.parsing) {
                case Parsing.FLOAT:
                    return parseFloat(result);
                case Parsing.INTEGER:
                    return parseInt(result);

                case Parsing.NONE:
                default:
                    return result;
            }
        };

        function simpleSearch(args) {
            var params = Args.parse(args, [
                { name: "type", type: "string" },
            ], [
                { name: "filters", type: "object", default: [] },
                { name: "columns", type: "object", default: ["internalid"] },
                { name: "limit", type: "number", default: 0 },
                { name: "callback" },
            ]);

            var filters = params.filters;

            var columns = [];
            for (var i in params.columns) {
                var column = params.columns[i];
                columns.push((typeof column === "string") ? search.createColumn({ name: column }) : column);
            }

            var s = search.create({
                type: params.type,
                filters: filters,
                columns: columns,
            });

            var pageSize = 1000;
            if ((params.limit >= 5) && (params.limit <= 1000)) pageSize = params.limit;
            var pagedResults = s.runPaged({ pageSize: pageSize });

            var results = [];

            var recordCount = 0;
            pagedResults.pageRanges.forEach(function (pageRange) {
                if ((params.limit > 0) && (recordCount >= params.limit)) return false;
                var page = pagedResults.fetch({ index: pageRange.index });
                page.data.forEach(function (result) {
                    if ((params.limit > 0) && (recordCount >= params.limit)) return false;
                    var out = {};
                    for (var colIdx in columns) {
                        var col = columns[colIdx];
                        var name = col.name;
                        if (col.hasOwnProperty('join')) {
                            if (col.join) {
                                if (col.join.length > 0) {
                                    name = col.join + '.' + name;
                                }
                            }
                        }
                        var id = col.label ? col.label : name;
                        out[id] = result.getValue(col);
                    }
                    results.push(out);
                    if (params.callback) params.callback(out);
                    recordCount++;
                });
            });

            return results;

        };

        return {
            Operator: (function() { return search.Operator })(),
            Parsing: Parsing,
            Sort: (function() { return search.Sort; })(),
            Summary: (function() { return search.Summary; })(),
            Type: (function() { return search.Type; })(),

            createColumn: function(params) { return search.createColumn(params); },
            getSingleField: getSingleField,
            simpleSearch: simpleSearch,
        }

    }
);