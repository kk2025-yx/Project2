using { my.ai.adapter as my } from '../db/schema';
@path: '/odata/v4/project2'

service Project2Service {

    entity Tasks as projection on my.IntegrationTasks;

    action uploadTask (
        scenarioType : String,
        sourceSystem : String,
        fileName     : String,
        fileContent  : String,
        rawInputJson : String
    ) returns Tasks;

    action triggerUpload (
        fileName     : String,
        scenarioType : String,
        sourceSystem : String,
        fileContent  : LargeString
    ) returns String;
}
