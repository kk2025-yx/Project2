using { my.ai.adapter as my } from '../db/schema';
@path: '/odata/v4/project2'

service Project2Service {
    // 确保这里的实体名是 Tasks
    entity Tasks as projection on my.IntegrationTasks actions {
        action processFile (scenarioType : String, fileName : String) returns String;
    };
}