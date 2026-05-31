const cds = require('@sap/cds');
const axios = require('axios');
const FormData = require('form-data');

module.exports = cds.service.impl(async function () {
    const { IntegrationTasks } = this.entities;

   
    this.on('Tasks/processFile', async (req) => {
        const { scenarioType, fileName, fileContent } = req.data;
        const taskID = cds.utils.uuid(); 

      
        await INSERT.into(IntegrationTasks).entries({
            ID: taskID,
            scenarioType: scenarioType || 'BusinessPartner',
            fileName: fileName || 'unnamed_file.json',
            status: 'Processing'
        });

   
        try {
         
            const fileBuffer = Buffer.from(fileContent || '', 'base64');


            const form = new FormData();
            form.append('file', fileBuffer, { filename: fileName || 'file.json' });
            form.append('target_schema', scenarioType || 'BusinessPartner');

            console.log(`[Connecting] Sending ${fileName} to Python AI Engine...`);

        
            const pythonResponse = await axios.post('http://127.0.0.1:8000/upload', form, {
                headers: { ...form.getHeaders() },
                responseType: 'json' 
            });

            if (pythonResponse.status === 200) {
                console.log(`[Python Success] AI Mapping complete for ${fileName}`);
                
                await UPDATE(IntegrationTasks, taskID).with({
                    status: 'Ready_for_SAP' // 收到同学的 Python 成功回执，状态瞬间变绿！
                });
            }

        } catch (error) {

            console.error(`[Link Error] Failed to call Python:`, error.message);
            await UPDATE(IntegrationTasks, taskID).with({
                status: 'AI_Error' 
            });
            return "Local task created, but Python AI Service was unreachable: " + error.message;
        }

     
        return "File has been securely tunneled to Python AI Mapper! Check status in a flash.";
    });
});