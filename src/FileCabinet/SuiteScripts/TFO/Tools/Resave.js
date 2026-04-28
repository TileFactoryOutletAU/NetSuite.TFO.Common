/**
 * Resave.js
 * @NApiVersion   2.1
 * @NModuleScope  Public
 */

define(
    ['/SuiteScripts/TFO/Common/Args', 'N/record'],
    function (Args, record) {

        function resave(args) {
            var params = Args.parse(args, [
                { name: "type", type: "string" },
                { name: "id", type: "number" }
            ], []);

            var targetRec = record.load({ type: params.type, id: params.id });
            var recId = targetRec.save();
            
            return { saved: recId };
        };

        return {
            resave: resave
        };
    }
);