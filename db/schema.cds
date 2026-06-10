using { managed } from '@sap/cds/common'; 


namespace my.ai.adapter; 


entity IntegrationTasks : managed {
    key ID : UUID;
    scenarioType : String;
    fileName     : String;
    status       : String;
    @Core.MediaType : 'application/octet-stream'
    content : LargeBinary;
}
annotate Project2Service.Tasks with @(
    UI.LineItem : [
        { Value: fileName },
        { Value: status },
        { Value: createdAt }
    ],
    UI.FieldGroup #Upload : {
        Data : [
            { Value: content }
        ]
    }
);