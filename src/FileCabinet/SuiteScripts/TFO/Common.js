/**
 * Common.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    [
        '/SuiteScripts/TFO/Common/Args',
        '/SuiteScripts/TFO/Common/Arrays',
        '/SuiteScripts/TFO/Common/Files',
        '/SuiteScripts/TFO/Common/Install',
        '/SuiteScripts/TFO/Common/Search'
    ],
    (Args, Arrays, Files, Install, Search) => {

        return {
            /* Modules */
            Args: Args,
            Search: Search,

            /* Args */
            parseArgs: Args.parse,

            /* Arrays */
            findByProperty: Arrays.findByProperty,
            groupByProperty: Arrays.groupByProperty,

            /* Files */
            getFolderByPath: Files.getFolderByPath,

            /* Install */
            listInstallManifests: Install.listManifests,

            /* Search */
            SearchOperator: Search.Operator,
            SearchParsing: Search.Parsing,
            SearchType: Search.Type,
            createSearchColumn: Search.createColumn,
            getSingleField: Search.getSingleField,
            simpleSearch: Search.simpleSearch,
        }

    }
);