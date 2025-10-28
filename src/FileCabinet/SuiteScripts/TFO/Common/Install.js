/**
 * Install.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    ['/SuiteScripts/TFO/Common/Files'],
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