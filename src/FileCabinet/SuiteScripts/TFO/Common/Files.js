/**
 * Files.js
 * @NApiVersion   2.x
 * @NModuleScope  Public
 * @NAmdConfig    ./paths.json
 */

define(
    ['TFO/Args', 'TFO/Search'],
    (Args, Search) => {

        const getFilesInFolder = (args) => {
            let params = Args.parse(args, [
                { name: "folderId" },
            ], [
                { name: "extension", type: "string", default: "" },
                { name: "nameFilter", type: "object", default: null },
            ]);

            let filters = [ [ "folder", Search.Operator.IS, params.folderId ] ];
            
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

            let results = Search.simpleSearch({
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

        const getFolderByPath = (args) => {
            let params = Args.parse(args, [
                { name: "path", type: "string" },
            ], [
                { name: "all", type: "boolean", default: false },
            ]);

            let pathParts = params.path.split("/").filter((v) => (v !== ""));
            let returnData = [];
            let parentId = null;

            for (let i in pathParts) {
                let part = pathParts[i];

                let filters = [ [ "name", Search.Operator.IS, part ] ];
                if (parentId) { filters.push("and", [ "parent", Search.Operator.IS, parentId ]); }
                else { filters.push("and", [ "istoplevel", Search.Operator.IS, true ]); }

                let data = Search.simpleSearch({
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