using Project2Service as service from '../../srv/service';

annotate service.Tasks with @(
    UI.SelectionFields: [ ID ], // 这里需要包含你 schema.cds 里的 ID 字段
    UI.LineItem : [
        { Value: ID },          // 至少要有一个 Value 字段显示出来
        { Value: fileName },    // 假设你的 schema 里有 fileName 字段
        {
            $Type : 'UI.DataFieldForAction',
            Action : 'Project2Service.processFile', // 注意：Action 必须带上命名空间
            Label : 'Upload'
        }
    ]
);