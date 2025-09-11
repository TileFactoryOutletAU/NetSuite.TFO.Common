/**
 * Install.js
 * @NApiVersion   2.x
 * @NModuleScope  Public
 * @NAmdConfig    ./paths.json
 */

define(
    ['TFO/Files'],
    (Files) => {

        const listManifests = () => {
            let folder = Files.getFolderByPath({ path: "/SuiteScripts/TFO/.install" });
            let files = Files.getFilesInFolder({ folderId: folder.id, extension: "json" });
            return files;
        };

        return {
            listManifests: listManifests,
        };
    }
);