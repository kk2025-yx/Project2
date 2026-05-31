using { managed } from '@sap/cds/common'; 

namespace my.ai.adapter; 

entity IntegrationTasks : managed {
    key ID : UUID;
    scenarioType : String;
    fileName     : String;
    status       : String;
}