/**
 * Common.js
 * @NApiVersion   2.x
 * @NModuleScope  Public
 * @NAmdConfig    ./Common/paths.json
 */

define(
    ['TFO/Args', 'TFO/Arrays', 'TFO/Search'],
    (Args, Arrays, Search) => {

        return {
            /* Modules */
            Args: Args,
            Search: Search,

            /* Args */
            parseArgs: Args.parse,

            /* Arrays */
            findByProperty: Arrays.findByProperty,
            groupByProperty: Arrays.groupByProperty,

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