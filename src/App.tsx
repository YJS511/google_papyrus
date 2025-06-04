import './App.css'
import { useEffect, useState } from 'react'
import { gapiInit } from './services/gapiInit'
import { sheetsService, Spreadsheet, Sheet, CellData } from './services/sheetsService'

const clientId = import.meta.env.VITE_CLIENT_ID

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([])
    const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<string>('')
    const [sheets, setSheets] = useState<Sheet[]>([])
    const [selectedSheet, setSelectedSheet] = useState<string>('')
    const [sheetData, setSheetData] = useState<CellData | null>(null)

    useEffect(() => {
        const start = async () => {
            try {
                await gapiInit(clientId)
                setIsAuthenticated(true)
                await loadSpreadsheets()
            } catch (error) {
                console.error('Google API 초기화 실패:', error)
            } finally {
                setIsLoading(false)
            }
        }
        start()
    }, [])

    const loadSpreadsheets = async () => {
        try {
            const spreadsheets = await sheetsService.listSpreadsheets()
            setSpreadsheets(spreadsheets)
        } catch (error) {
            console.error('스프레드시트 목록 로드 실패:', error)
        }
    }

    const handleSpreadsheetChange = async (spreadsheetId: string) => {
        setSelectedSpreadsheet(spreadsheetId)
        setSelectedSheet('')
        setSheetData(null)
        try {
            const sheets = await sheetsService.getSheets(spreadsheetId)
            setSheets(sheets)
        } catch (error) {
            console.error('시트 목록 로드 실패:', error)
        }
    }

    const handleSheetChange = async (sheetTitle: string) => {
        setSelectedSheet(sheetTitle)
        try {
            const data = await sheetsService.getSheetData(selectedSpreadsheet, sheetTitle)
            setSheetData(data)
        } catch (error) {
            console.error('시트 데이터 로드 실패:', error)
        }
    }

    if (isLoading) {
        return <div className="loading">로딩 중...</div>
    }

    if (!isAuthenticated) {
        return <div className="error">Google API 인증에 실패했습니다.</div>
    }

    return (
        <div className="app">
            <header className="app-header">
                <h1>구글 시트 데이터 조회</h1>
            </header>
            <main className="app-main">
                <div className="container">
                    <div className="select-container">
                        <select 
                            value={selectedSpreadsheet} 
                            onChange={(e) => handleSpreadsheetChange(e.target.value)}
                        >
                            <option value="">스프레드시트 선택</option>
                            {spreadsheets.map((spreadsheet) => (
                                <option key={spreadsheet.spreadsheetId} value={spreadsheet.spreadsheetId}>
                                    {spreadsheet.properties.title}
                                </option>
                            ))}
                        </select>

                        <select 
                            value={selectedSheet} 
                            onChange={(e) => handleSheetChange(e.target.value)}
                            disabled={!selectedSpreadsheet}
                        >
                            <option value="">시트 선택</option>
                            {sheets.map((sheet) => (
                                <option key={sheet.properties.sheetId} value={sheet.properties.title}>
                                    {sheet.properties.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {sheetData && (
                        <div className="sheet-data">
                            <h2>시트 데이터</h2>
                            <table>
                                <tbody>
                                    {sheetData.values.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default App

