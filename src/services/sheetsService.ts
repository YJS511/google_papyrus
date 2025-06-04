import { gapi } from 'gapi-script'

export interface SheetData {
    values: string[][];
    range: string;
}

export interface Spreadsheet {
    spreadsheetId: string;
    properties: {
        title: string;
    };
}
export interface Sheet {
    properties: {
        title: string;
        sheetId: number;
    };
}

export interface CellData {
    range: string;
    values: string[][];
}

interface DriveFile {
    id: string;
    name: string;
}

interface DriveFileList {
    files: DriveFile[];
}

interface SheetProperties {
    title: string;
    sheetId: number;
}

interface SheetResponse {
    properties: SheetProperties;
}

interface SheetsResponse {
    sheets: SheetResponse[];
}

interface ValuesResponse {
    range: string;
    values: string[][];
}

export const sheetsService = {
    async listSpreadsheets(): Promise<Spreadsheet[]> {
        const response = await gapi.client.drive.files.list({
            q: "mimeType='application/vnd.google-apps.spreadsheet'",
            fields: 'files(id, name)',
            spaces: 'drive',
            orderBy: 'name'
        });
        const result = response.result as DriveFileList;
        return result.files.map(file => ({
            spreadsheetId: file.id,
            properties: {
                title: file.name
            }
        }));
    },

    async getSheets(spreadsheetId: string): Promise<Sheet[]> {
        const response = await gapi.client.sheets.spreadsheets.get({
            spreadsheetId: spreadsheetId,
            fields: 'sheets.properties'
        });
        const result = response.result as SheetsResponse;
        return result.sheets.map(sheet => ({
            properties: {
                title: sheet.properties.title,
                sheetId: sheet.properties.sheetId
            }
        }));
    },

    async getSheetData(spreadsheetId: string, range: string): Promise<CellData> {
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: range
        });
        const result = response.result as ValuesResponse;
        return {
            range: result.range,
            values: result.values || []
        };
    },

    async append(spreadsheetId: string, sheetName: string, values: string[][]) {
        await gapi.client.sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: `${sheetName}!A1`,
            valueInputOption: 'RAW',
            resource: { values }
        });
    },

    async update(spreadsheetId: string, sheetName: string, range: string, values: string[][]) {
        await gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: `${sheetName}!${range}`,
            valueInputOption: 'RAW',
            resource: { values }
        });
    },

    async delete(spreadsheetId: string, sheetName: string, range: string) {
        await gapi.client.sheets.spreadsheets.values.clear({
            spreadsheetId: spreadsheetId,
            range: `${sheetName}!${range}`,
            resource: {}
        });
    }
}; 