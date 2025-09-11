/**
 * Search.js
 * @NApiVersion   2.x
 * @NModuleScope  Public
 * @NAmdConfig    ./paths.json
 */

define(
    ['TFO/Args', 'N/search'],
    (Args, search) => {

        const Parsing = {
            NONE: null,

            INT: "integer",
            INTEGER: "integer",
            NUMBER: "integer",

            FLOAT: "float",
        };

        const getSingleField = (args) => {
            let params = parseArgs(args, [
                { name: "type" },
                { name: "id" },
                { name: "fieldId" },
            ], [
                { name: "getText", default: false },
                { name: "parsing", default: SearchParsing.NONE },
            ]);
            let result = search.lookupFields({
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
                case SearchParsing.FLOAT:
                    return parseFloat(result);
                case SearchParsing.INTEGER:
                    return parseInt(result);

                case SearchParsing.NONE:
                default:
                    return result;
            }
        };

        const simpleSearch = (args) => {
            let params = Args.parse(args, [
                { name: "type", type: "string" },
            ], [
                { name: "filters", type: "object", default: [] },
                { name: "columns", type: "object", default: ["internalid"] },
                { name: "limit", type: "number", default: 0 },
                { name: "callback" },
            ]);

            let filters = params.filters;

            let columns = [];
            for (let i in params.columns) {
                let column = params.columns[i];
                columns.push((typeof column === "string") ? search.createColumn({ name: column }) : column);
            }

            let s = search.create({
                type: params.type,
                filters: filters,
                columns: columns,
            });
            let pagedResults = s.runPaged({ pageSize: 1000 });

            let results = [];

            let recordCount = 0;
            pagedResults.pageRanges.forEach(function (pageRange) {
                let page = pagedResults.fetch({ index: pageRange.index });
                page.data.forEach(function (result) {
                    if ((params.limit > 0) && (recordCount >= params.limit)) return false;
                    let out = {};
                    for (let colIdx in columns) {
                        let col = columns[colIdx];
                        let name = col.name;
                        if (col.hasOwnProperty('join')) {
                            if (col.join) {
                                if (col.join.length > 0) {
                                    name = col.join + '.' + name;
                                }
                            }
                        }
                        let id = col.label ? col.label : name;
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
            Operator: search.Operator,
            Parsing: Parsing,
            Type: search.Type,

            createColumn: (args) => { return search.createColumn(args); },
            getSingleField: getSingleField,
            simpleSearch: simpleSearch,
        }

    }
);