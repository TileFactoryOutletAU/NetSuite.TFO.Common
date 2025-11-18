/**
 * Install.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    ['/SuiteScripts/TFO/Common/Files'],
    function (Files) {

        function listManifests() {
            var folder = Files.getFolderByPath({ path: "/SuiteScripts/TFO/.install" });
            var files = Files.getFilesInFolder({ folderId: folder.id, extension: "json" });
            return files;
        };

        return {
            listManifests: listManifests,
        };
    }
);