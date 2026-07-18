import {publicConfig} from './publicConfig';

interface Mahatma {
    name: string;
    mobile: string;
    ageGroup?: 'less-8' | 'more-8' | '';
}

interface Submission {
    id: string;
    created_at: string;
    people: Mahatma[];
    amount: number;
    pickup_point?: string;
    status: string;
}

export const printReceipt = (sub: Submission) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Could not open print window. Please allow popups for this site.');
        return;
    }

    const dateStr = new Date(sub.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const statusColors = {
        verified: {bg: '#e6f4ea', text: '#137333', border: '#ceead6', label: 'Verified & Approved'},
        cancelled: {bg: '#fce8e6', text: '#c5221f', border: '#fad2cf', label: 'Cancelled / Rejected'},
        pending: {bg: '#fef7e0', text: '#b06000', border: '#feebc8', label: 'Pending Verification'}
    };

    const status = (sub.status.toLowerCase() as keyof typeof statusColors) || 'pending';
    const statusStyle = statusColors[status] || statusColors.pending;

    const peopleRows = sub.people.map((person, idx) => {
        const ageGroupText = person.ageGroup === 'less-8'
            ? 'Under 8 Years (Half Price)'
            : '8 Years & Above (Full Price)';
        const price = person.ageGroup === 'less-8'
            ? Math.round(publicConfig.picnicFare / 2)
            : publicConfig.picnicFare;

        return `
            <tr style="border-bottom: 1px solid #f0ebe6;">
                <td style="padding: 12px 16px; font-weight: 600; color: #2d241d;">${idx + 1}. ${person.name}</td>
                <td style="padding: 12px 16px; font-family: monospace; color: #574e46;">${person.mobile || '—'}</td>
                <td style="padding: 12px 16px; color: #574e46; font-size: 13px;">${ageGroupText}</td>
                <td style="padding: 12px 16px; text-align: right; font-family: monospace; font-weight: 700; color: #2d241d;">₹${price.toLocaleString('en-IN')}</td>
            </tr>
        `;
    }).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <title>Receipt - ${sub.id.substring(0, 8)}</title>
            <style>
                @media print {
                    body {
                        background: #ffffff !important;
                        color: #000000 !important;
                        padding: 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .receipt-card {
                        border: none !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                }
                body {
                    background-color: #fdfbf7;
                    color: #2d241d;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 40px 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                .receipt-card {
                    background: #ffffff;
                    border: 1px solid #f0ebe6;
                    border-radius: 24px;
                    box-shadow: 0 4px 20px rgba(45, 36, 29, 0.05);
                    max-width: 600px;
                    width: 100%;
                    padding: 40px;
                    box-sizing: border-box;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px dashed #f0ebe6;
                    padding-bottom: 30px;
                    margin-bottom: 30px;
                }
                .badge {
                    background-color: #fef2ee;
                    color: #CB4B1F;
                    font-size: 11px;
                    font-weight: 800;
                    text-transform: uppercase;
                    padding: 6px 16px;
                    border-radius: 20px;
                    display: inline-block;
                    margin-bottom: 12px;
                    letter-spacing: 1px;
                    border: 1px solid rgba(203, 75, 31, 0.15);
                }
                .title {
                    font-size: 24px;
                    font-weight: 900;
                    color: #2d241d;
                    margin: 0 0 6px 0;
                }
                .subtitle {
                    font-size: 14px;
                    color: #8c827a;
                    margin: 0;
                }
                .meta-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                .meta-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #8c827a;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding-bottom: 4px;
                }
                .meta-value {
                    font-size: 14px;
                    font-weight: 700;
                    color: #2d241d;
                }
                .status-badge {
                    background-color: ${statusStyle.bg};
                    color: ${statusStyle.text};
                    border: 1px solid ${statusStyle.border};
                    font-size: 11px;
                    font-weight: 800;
                    padding: 4px 10px;
                    border-radius: 12px;
                    display: inline-block;
                    text-transform: uppercase;
                }
                .details-box {
                    background-color: #fdf7f0;
                    border: 1px solid #fdf1ed;
                    border-radius: 16px;
                    padding: 20px;
                    margin-bottom: 30px;
                }
                .details-title {
                    font-size: 12px;
                    font-weight: 800;
                    color: #CB4B1F;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin: 0 0 10px 0;
                }
                .details-item {
                    font-size: 14px;
                    margin-bottom: 6px;
                }
                .details-item:last-child {
                    margin-bottom: 0;
                }
                .attendees-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                    font-size: 14px;
                }
                .attendees-table th {
                    text-align: left;
                    font-size: 11px;
                    font-weight: 700;
                    color: #8c827a;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    padding: 12px 16px;
                    border-bottom: 2px solid #f0ebe6;
                }
                .total-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #fef2ee;
                    border: 1px solid rgba(203, 75, 31, 0.15);
                    padding: 20px;
                    border-radius: 16px;
                    margin-bottom: 35px;
                }
                .total-label {
                    font-weight: 800;
                    color: #CB4B1F;
                    font-size: 14px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .total-val {
                    font-size: 24px;
                    font-weight: 900;
                    color: #2d241d;
                    font-family: monospace;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #8c827a;
                    border-top: 1px solid #f0ebe6;
                    padding-top: 25px;
                    line-height: 1.5;
                }
                .action-bar {
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }
                .btn {
                    font-family: inherit;
                    font-size: 13px;
                    font-weight: 700;
                    padding: 10px 24px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                    text-decoration: none;
                }
                .btn-print {
                    background-color: #CB4B1F;
                    color: white;
                }
                .btn-print:hover {
                    background-color: #b03d15;
                }
                .btn-close {
                    background-color: #f0ebe6;
                    color: #574e46;
                }
                .btn-close:hover {
                    background-color: #e5dfd9;
                }
            </style>
        </head>
        <body>
            <div class="receipt-card">
                <div class="header">
                    <span class="badge">${publicConfig.badgeText}</span>
                    <h1 class="title">Registration Receipt</h1>
                    <p class="subtitle">${publicConfig.title}</p>
                </div>

                <table class="meta-table">
                    <tr>
                        <td style="width: 50%; vertical-align: top; padding-bottom: 15px;">
                            <div class="meta-label">Registration ID</div>
                            <div class="meta-value" style="font-family: monospace; font-size: 12px; word-break: break-all; padding-right: 15px;">${sub.id}</div>
                        </td>
                        <td style="width: 50%; vertical-align: top; text-align: right; padding-bottom: 15px;">
                            <div class="meta-label">Registration Date</div>
                            <div class="meta-value">${dateStr}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 50%; vertical-align: top;">
                            <div class="meta-label">Status</div>
                            <div style="margin-top: 4px;">
                                <span class="status-badge">${statusStyle.label}</span>
                            </div>
                        </td>
                        <td style="width: 50%; vertical-align: top; text-align: right;">
                            <div class="meta-label">Primary Contact</div>
                            <div class="meta-value">${sub.people[0]?.name || 'N/A'}</div>
                            <div style="font-size: 12px; color: #8c827a; font-family: monospace; margin-top: 2px;">${sub.people[0]?.mobile || ''}</div>
                        </td>
                    </tr>
                </table>

                <div class="details-box">
                    <h3 class="details-title">Event & Boarding Details</h3>
                    <div class="details-item"><strong>Date:</strong> ${publicConfig.picnicDate}</div>
                    <div class="details-item"><strong>Boarding Point:</strong> 📍 ${sub.pickup_point || 'Self'}</div>
                    <div class="details-item" style="font-size: 12px; color: #8c827a; margin-top: 4px; border-top: 1px solid #fdf1ed; padding-top: 6px;">
                        <strong>Departure:</strong> ${publicConfig.departureTime}
                    </div>
                </div>

                <h3 class="meta-label" style="margin-bottom: 10px; padding-left: 16px;">Attendees</h3>
                <table class="attendees-table">
                    <thead>
                        <tr>
                            <th style="padding-left: 16px;">Name</th>
                            <th>Mobile</th>
                            <th>Age Group</th>
                            <th style="text-align: right; padding-right: 16px;">Fare</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${peopleRows}
                    </tbody>
                </table>

                <div class="total-section">
                    <span class="total-label">Total Amount Paid</span>
                    <span class="total-val">₹${sub.amount.toLocaleString('en-IN')}</span>
                </div>

                <div class="footer">
                    <p style="margin: 15px 0 0 0; font-size: 10px; color: #a69c94;">Receipt generated on ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div class="action-bar no-print">
                <button class="btn btn-print" onclick="window.print()">Print / Save PDF</button>
                <button class="btn btn-close" onclick="window.close()">Close Window</button>
            </div>

            <script>
                // Auto trigger print in a few milliseconds after render completes
                window.onload = function() {
                    setTimeout(() => {
                        window.print();
                    }, 300);
                }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};
