sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/ai/adapter/projectapp/test/integration/pages/IntegrationTasksList",
	"com/ai/adapter/projectapp/test/integration/pages/IntegrationTasksObjectPage"
], function (JourneyRunner, IntegrationTasksList, IntegrationTasksObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/ai/adapter/projectapp') + '/test/flpSandbox.html#comaiadapterprojectapp-tile',
        pages: {
			onTheIntegrationTasksList: IntegrationTasksList,
			onTheIntegrationTasksObjectPage: IntegrationTasksObjectPage
        },
        async: true
    });

    return runner;
});

