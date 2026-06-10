using { my.ai.adapter as my } from '../db/schema';
@path: '/odata/v4/project2'

service Project2Service {

    entity Tasks as projection on my.IntegrationTasks actions {
        action processFile (scenarioType : String, fileName : String) returns String;
    };
}