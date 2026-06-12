using Project2Service as service from '../../srv/service';

annotate service.Tasks with @(
    UI.HeaderInfo : {
        TypeName       : 'Task',
        TypeNamePlural : 'Tasks',
        Title          : { Value : fileName },
        Description    : { Value : status }
    },
    UI.LineItem : [
        {
            Value : fileName,
            Label : 'File Name',
            ![@UI.Importance] : #High
        },
        { Value : scenarioType, Label : 'Scenario Type' },
        { Value : sourceSystem, Label : 'Source System' },
        { Value : status, Label : 'Status' },
        { Value : createdAt, Label : 'Created At' }
    ],
    UI.SelectionFields : [
        fileName,
        scenarioType,
        sourceSystem,
        status
    ],
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            Target : '@UI.FieldGroup#General'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Mapping Result',
            Target : '@UI.FieldGroup#Result'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Error Details',
            Target : '@UI.FieldGroup#Error'
        }
    ],
    UI.FieldGroup #General : {
        Data : [
            { Value : fileName },
            { Value : scenarioType },
            { Value : sourceSystem },
            { Value : status },
            { Value : createdAt },
            { Value : modifiedAt }
        ]
    },
    UI.FieldGroup #Result : {
        Data : [
            { Value : resultJson, Label : 'Mapping Result (JSON)' }
        ]
    },
    UI.FieldGroup #Error : {
        Data : [
            { Value : errorMessage, Label : 'Error Message' }
        ]
    }
);

annotate service.Tasks with {
    resultJson @UI.MultiLineText;
};
