/**
 * Files.js
 * @NApiVersion   2.x
 * @NModuleScope  Public
 * @NAmdConfig    ./paths.json
 */

define(
    ['TFO/Args', 'TFO/Search'],
    (Args, Search) => {

        const getFolderByPath = (args) => {
            let params = Args.parse(args, [
                { name: "path", type: "string" },
            ], []);

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
                    columns: [ "internalid", "name", "parent" ],
                    filters: filters,
                });

                if (data.length == 1) {
                    data = data[0];
                    parentId = data.internalid;
                    returnData.push(data);
                } else {
                    throw new Error("Folder \"" + path + "\" not found.");
                }
            }

            return returnData;
        };

        return {
            getFolderByPath: getFolderByPath,
        };
    }
);