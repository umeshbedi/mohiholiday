import { google } from 'googleapis'
import { NextResponse } from 'next/server'

// Initialise the Google Sheets client using a service account stored in env vars.
// The private key is stored as a single-line string with literal \n characters,
// so we replace them to get proper PEM line breaks.
function getSheetsClient() {
    const credentials = {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    return google.sheets({ version: 'v4', auth })
}

export async function POST(request) {
    try {
        const body = await request.json()

        const {
            packageName = '',
            packageDetail = '',
            name = '',
            mobile = '',
            email = '',
            adults = '',
            kids = '',
            infants = '',
            date = '',
            message = '',
            userName = '',     // signed-in account display name
            userEmail = '',    // signed-in account email
            submittedAt = new Date().toISOString(),
        } = body

        const spreadsheetId = process.env.GOOGLE_SHEET_ID
        if (!spreadsheetId) {
            return NextResponse.json({ error: 'GOOGLE_SHEET_ID not configured' }, { status: 500 })
        }

        const sheets = getSheetsClient()

        // Append a new row — columns match the header row you create manually in the sheet:
        // Date | Package | Detail | Account Name | Account Email | Contact Name | Mobile | Email | Adults | Kids | Infants | Travel Date | Message
        const row = [
            submittedAt,
            packageName,
            packageDetail,
            userName,
            userEmail,
            name,
            mobile,
            email,
            adults,
            kids,
            infants,
            date,
            message,
        ]

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:M',   // adjust tab name if yours differs
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [row],
            },
        })

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[sheets-enquiry] Error:', err)
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
