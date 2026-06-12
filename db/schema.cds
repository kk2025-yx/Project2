using { managed } from '@sap/cds/common';


namespace my.ai.adapter;


entity IntegrationTasks : managed {
    key ID            : UUID;
    fileName          : String;
    scenarioType      : String;
    sourceSystem      : String;
    status            : String;
    resultJson        : LargeString;
    mappingResult     : LargeString;
    errorMessage      : String;
    @Core.MediaType : 'application/octet-stream'
    @UI.Hidden
    content           : LargeBinary;
}
