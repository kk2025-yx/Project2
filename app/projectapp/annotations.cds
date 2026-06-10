using Project2Service as service from '../../srv/service';

// 确保 action 是绑定的，并且指定了它是自定义的
annotate service.Tasks with @(
    UI.LineItem : [
        { 
            $Type : 'UI.DataFieldForAction',
            Action : 'Project2Service.processFile',
            Label : 'Upload',
       
            InvocationGrouping : #Isolated 
        }
    ]
);