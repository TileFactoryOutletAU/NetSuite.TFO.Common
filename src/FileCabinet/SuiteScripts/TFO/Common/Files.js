/**
 * Files.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    ['/SuiteScripts/TFO/Common/Args', '/SuiteScripts/TFO/Common/Search'],
    function (Args, Search) {

        function getFilesInFolder(args) {
            var params = Args.parse(args, [
                { name: "folderId" },
            ], [
                { name: "extension", type: "string", default: "" },
                { name: "nameFilter", type: "object", default: null },
            ]);

            var filters = [ [ "folder", Search.Operator.IS, params.folderId ] ];
            
            if (params.extension.length > 0) {
                filters.push("and", [
                    "formulatext: CASE WHEN REGEXP_REPLACE({name}, '.+\\.(.+)$' , '\\1') = {name} THEN '' ELSE REGEXP_REPLACE({name}, '.+\\.(.+)$' , '\\1') END",
                    Search.Operator.IS,
                    params.extension,
                ]);
            }

            if (params.nameFilter) {
                filters.push("and", [ "name", params.nameFilter[0], params.nameFilter[1] ]);
            }

            //return filters;

            var results = Search.simpleSearch({
                type: "file",
                columns: [
                    Search.createColumn({ name: "internalid", label: "id" }),
                    "name",
                    "modified",
                    Search.createColumn({
                        label: "extension",
                        name: "formulatext",
                        formula: "CASE WHEN REGEXP_REPLACE({name}, '.+\\.(.+)$' , '\\1') = {name} THEN '' ELSE REGEXP_REPLACE({name}, '.+\\.(.+)$' , '\\1') END"
                    }),
                ],
                filters: filters,
            });

            return results;
        };

        function getFolderByPath(args) {
            var params = Args.parse(args, [
                { name: "path", type: "string" },
            ], [
                { name: "all", type: "boolean", default: false },
            ]);

            var pathParts = params.path.split("/").filter(function(v) { return v !== ""; });
            var returnData = [];
            var parentId = null;

            for (var i in pathParts) {
                var part = pathParts[i];

                var filters = [ [ "name", Search.Operator.IS, part ] ];
                if (parentId) { filters.push("and", [ "parent", Search.Operator.IS, parentId ]); }
                else { filters.push("and", [ "istoplevel", Search.Operator.IS, true ]); }

                var data = Search.simpleSearch({
                    type: Search.Type.FOLDER,
                    columns: [
                        Search.createColumn({ label: "id", name: "internalid" }),
                        "name",
                        Search.createColumn({ label: "parentid", name: "parent" }),
                    ],
                    filters: filters,
                });

                if (data.length == 1) {
                    data = data[0];
                    parentId = data.id;
                    returnData.push(data);
                } else {
                    throw new Error("Folder \"" + part + "\" not found.");
                }
            }

            if (!params.all) {
                returnData = returnData.slice(-1)[0];
            }

            return returnData;
        };

        return {
            getFilesInFolder: getFilesInFolder,
            getFolderByPath: getFolderByPath,
        };
    }
);