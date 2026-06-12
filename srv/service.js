const cds = require('@sap/cds');
const axios = require('axios');
const FormData = require('form-data');
const { randomUUID } = require('crypto');

const AI_API_BASE = (process.env.AI_ADAPTER_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

function serializeResult(data) {
    if (data === undefined || data === null) {
        return null;
    }
    return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

function serializeError(error) {
    if (error.response?.data) {
        return serializeResult(error.response.data);
    }
    return error.message;
}

module.exports = cds.service.impl(async function () {
    const { Tasks } = this.entities;

    this.on('triggerUpload', async (req) => {
        const { fileName, scenarioType, sourceSystem, fileContent } = req.data;

        if (!fileContent) {
            return req.error(400, 'fileContent is required.');
        }

        const taskID = randomUUID();
        const tx = cds.transaction(req);

        await tx.run(INSERT.into(Tasks).entries({
            ID: taskID,
            fileName,
            scenarioType: scenarioType || 'BusinessPartner',
            sourceSystem: sourceSystem || 'crm',
            status: 'PROCESSING'
        }));

        try {
            const form = new globalThis.FormData();
            const blob = new Blob(
                [fileContent],
                { type: fileName && fileName.endsWith('.json') ? 'application/json' : 'text/csv' }
            );
            form.append('file', blob, fileName || 'upload.csv');

            const params = new URLSearchParams({
                target_schema: scenarioType || 'BusinessPartner',
                mode: 'cap',
                source_system: sourceSystem || 'crm'
            });

            const url = `${AI_API_BASE}/upload?${params.toString()}`;

            const resp = await fetch(url, { method: 'POST', body: form });
            const result = await resp.json();

            console.log("=== Python response ===", JSON.stringify(result)); 

            if (!resp.ok || result.status !== 'Completed') {
                const errType = result.errorType || 'UNKNOWN_ERROR';
                const errMsg = result.message || `HTTP ${resp.status}`;

                await tx.run(UPDATE(Tasks, { ID: taskID }).with({
                    status: 'FAILED',
                    errorMessage: `[${errType}] ${errMsg}`
                }));

                return req.error(500, `Mapping failed: ${errMsg}`);
            }

            await tx.run(UPDATE(Tasks, { ID: taskID }).with({
                status: 'COMPLETED',
                resultJson: serializeResult(result.value),
                mappingResult: serializeResult(result.value),
                errorMessage: null
            }));

            return `Upload success: ${fileName}, ${result.recordCount} record(s) mapped.`;

        } catch (e) {
            await tx.run(UPDATE(Tasks, { ID: taskID }).with({
                status: 'FAILED',
                errorMessage: `[NETWORK_ERROR] ${e.message}`
            }));
            return req.error(500, `Forward to Python failed: ${e.message}`);
        }
    });

    this.on('uploadTask', async (req) => {
        const {
            scenarioType = 'BusinessPartner',
            sourceSystem = 'crm',
            fileName,
            fileContent,
            rawInputJson
        } = req.data;

        if (!fileContent && !rawInputJson) {
            return req.error(400, 'Provide a file or rawInputJson.');
        }

        const tx = cds.transaction(req);
        const taskID = randomUUID();
        const resolvedFileName = fileName
            || (rawInputJson ? 'raw-input.json' : 'upload.bin');

        await tx.run(INSERT.into(Tasks).entries({
            ID: taskID,
            fileName: resolvedFileName,
            scenarioType,
            sourceSystem,
            status: 'PROCESSING'
        }));

        try {
            const form = new FormData();
            const content = fileContent || rawInputJson;

            form.append('file', Buffer.from(content, fileContent ? 'base64' : 'utf8'), {
                filename: resolvedFileName,
                contentType: rawInputJson ? 'application/json' : 'text/plain'
            });

            const response = await axios.post(`${AI_API_BASE}/upload`, form, {
                params: {
                    target_schema: scenarioType,
                    source_system: sourceSystem,
                    mode: 'raw'
                },
                headers: form.getHeaders(),
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
                timeout: 60000
            });

            await tx.run(UPDATE(Tasks, { ID: taskID }).with({
                status: 'COMPLETED',
                resultJson: serializeResult(response.data),
                mappingResult: serializeResult(response.data),
                errorMessage: null
            }));
        } catch (error) {
            await tx.run(UPDATE(Tasks, { ID: taskID }).with({
                status: 'FAILED',
                errorMessage: serializeError(error)
            }));
        }

        return tx.run(SELECT.one.from(Tasks, { ID: taskID }));
    });
});
