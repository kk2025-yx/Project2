const cds = require('@sap/cds');
const axios = require('axios');
const FormData = require('form-data');

module.exports = cds.service.impl(async function () {
    
    const { Tasks } = this.entities;
    const AI_API_URL = 'https://sap-ai-adapter.cfapps.us10-001.hana.ondemand.com/upload';

 
    this.on('processFile', 'Tasks', async (req) => {
        console.log("=== backend received request, parameters： ===");
        console.log(req.data);
  
        const { scenarioType, fileName } = req.data;
        
        
        const { fileContent } = req.data;

        const taskID = req.params[0]; 

        try {
          
            const fileBuffer = Buffer.from(fileContent || '', 'base64');
            const form = new FormData();
            form.append('file', fileBuffer, { filename: fileName || 'file.json' });
            form.append('target_schema', scenarioType || 'BusinessPartner');

            // 调用 Python
            const pythonResponse = await axios.post(AI_API_URL, form, {
                headers: { ...form.getHeaders() }
            });

            if (pythonResponse.status === 200) {
                return "AI Mapping successfully completed and mapped to SAP!";
            }
        } catch (error) {
            console.error(`[Link Error]`, error.message);
            req.error(500, "Python AI Service failed: " + error.message);
        }
    });
});