sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.ai.adapter.projectapp',
            componentId: 'IntegrationTasksList',
            contextPath: '/IntegrationTasks'
        },
        CustomPageDefinitions
    );
});