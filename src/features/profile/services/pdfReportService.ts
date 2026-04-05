/**
 * PDF Report Service
 * Generates pediatrician-ready PDF reports using expo-print
 */

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { colors } from '@/core/theme';
import type { PdfReportData } from '../types';

/**
 * Generate HTML template for the PDF report
 */
function generateHtmlTemplate(data: PdfReportData): string {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatPercentile = (value: number | null): string => {
    if (value === null) return 'N/A';
    return `${Math.round(value)}th`;
  };

  const milestoneSection = (title: string, items: string[], emoji: string) => {
    if (items.length === 0) return '';
    return `
      <div class="milestone-group">
        <h4>${emoji} ${title}</h4>
        <ul>
          ${items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  };

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pediatrician Report - ${data.babyName}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: ${colors.textPrimary};
      background: white;
      padding: 24px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid ${colors.primary};
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: ${colors.primary};
    }
    .logo span {
      font-size: 14px;
      color: ${colors.textSecondary};
      font-weight: 400;
      display: block;
    }
    .report-date {
      text-align: right;
      font-size: 11px;
      color: ${colors.textSecondary};
    }
    .baby-info {
      background: ${colors.backgroundSecondary};
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }
    .baby-info h2 {
      font-size: 20px;
      color: ${colors.textPrimary};
      margin-bottom: 8px;
    }
    .baby-info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .info-item {
      font-size: 11px;
    }
    .info-item .label {
      color: ${colors.textSecondary};
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
    }
    .info-item .value {
      font-weight: 600;
      color: ${colors.textPrimary};
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: ${colors.textPrimary};
      border-bottom: 1px solid ${colors.border};
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .growth-table {
      width: 100%;
      border-collapse: collapse;
    }
    .growth-table th {
      background: ${colors.primary};
      color: white;
      padding: 8px 12px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
    }
    .growth-table td {
      padding: 10px 12px;
      border-bottom: 1px solid ${colors.border};
    }
    .growth-table .metric {
      font-weight: 500;
    }
    .growth-table .value {
      font-weight: 600;
      color: ${colors.secondary};
    }
    .growth-table .percentile {
      background: ${colors.primaryDim};
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
      color: ${colors.primaryDark};
    }
    .milestones-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    .milestone-group h4 {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
      color: ${colors.textPrimary};
    }
    .milestone-group ul {
      list-style: none;
      padding-left: 0;
    }
    .milestone-group li {
      font-size: 11px;
      padding: 4px 0;
      border-bottom: 1px solid ${colors.borderLight};
      color: ${colors.textSecondary};
    }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid ${colors.border};
      font-size: 10px;
      color: ${colors.textMuted};
      text-align: center;
    }
    .disclaimer {
      font-style: italic;
      margin-bottom: 8px;
    }
    .no-data {
      color: ${colors.textMuted};
      font-style: italic;
      padding: 12px;
      text-align: center;
      background: ${colors.backgroundSecondary};
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">
      🌱 Sprout
      <span>Child Development Report</span>
    </div>
    <div class="report-date">
      Report Generated<br>
      <strong>${formatDate(data.reportDate)}</strong>
    </div>
  </div>

  <div class="baby-info">
    <h2>${data.babyName}</h2>
    <div class="baby-info-grid">
      <div class="info-item">
        <div class="label">Date of Birth</div>
        <div class="value">${formatDate(data.dateOfBirth)}</div>
      </div>
      <div class="info-item">
        <div class="label">Current Age</div>
        <div class="value">${data.ageText}</div>
      </div>
      <div class="info-item">
        <div class="label">Sex</div>
        <div class="value">${data.biologicalSex === 'male' ? 'Male' : 'Female'}</div>
      </div>
      <div class="info-item">
        <div class="label">Premature</div>
        <div class="value">${data.isPremature ? 'Yes (adjusted age used)' : 'No'}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h3 class="section-title">📊 Growth Summary</h3>
    ${data.growth ? `
    <table class="growth-table">
      <thead>
        <tr>
          <th>Metric</th>
          <th>Value</th>
          <th>Percentile</th>
          <th>Measurement Date</th>
        </tr>
      </thead>
      <tbody>
        ${data.growth.weightKg !== null ? `
        <tr>
          <td class="metric">Weight</td>
          <td class="value">${data.growth.weightKg.toFixed(2)} kg</td>
          <td><span class="percentile">${formatPercentile(data.growth.weightPercentile)}</span></td>
          <td>${formatDate(data.growth.date)}</td>
        </tr>
        ` : ''}
        ${data.growth.heightCm !== null ? `
        <tr>
          <td class="metric">Height/Length</td>
          <td class="value">${data.growth.heightCm.toFixed(1)} cm</td>
          <td><span class="percentile">${formatPercentile(data.growth.heightPercentile)}</span></td>
          <td>${formatDate(data.growth.date)}</td>
        </tr>
        ` : ''}
        ${data.growth.headCircumferenceCm !== null ? `
        <tr>
          <td class="metric">Head Circumference</td>
          <td class="value">${data.growth.headCircumferenceCm.toFixed(1)} cm</td>
          <td><span class="percentile">${formatPercentile(data.growth.headCircumferencePercentile)}</span></td>
          <td>${formatDate(data.growth.date)}</td>
        </tr>
        ` : ''}
      </tbody>
    </table>
    ` : '<div class="no-data">No growth data recorded yet</div>'}
  </div>

  <div class="section">
    <h3 class="section-title">🎯 Milestone Status</h3>
    ${(data.milestones.achieved.length + data.milestones.inProgress.length + data.milestones.delayed.length) > 0 ? `
    <div class="milestones-grid">
      ${milestoneSection('Achieved', data.milestones.achieved.slice(0, 8), '✅')}
      ${milestoneSection('In Progress', data.milestones.inProgress.slice(0, 8), '🟡')}
      ${milestoneSection('Monitor', data.milestones.delayed.slice(0, 8), '⏳')}
    </div>
    ` : '<div class="no-data">No milestone data recorded yet</div>'}
  </div>

  <div class="footer">
    <div class="disclaimer">
      This report is for informational purposes only and does not constitute medical advice.
      Please consult with your pediatrician for professional guidance.
    </div>
    <div>
      Generated by Sprout App • ${formatDate(data.reportDate)}
      ${data.parentName ? ` • ${data.parentName}` : ''}
    </div>
  </div>
</body>
</html>
  `;
}

export const pdfReportService = {
  /**
   * Generate and share/save PDF report
   */
  async generateAndSharePdf(data: PdfReportData): Promise<void> {
    try {
      const html = generateHtmlTemplate(data);
      
      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `${data.babyName} - Pediatrician Report`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        // Fallback: print directly
        await Print.printAsync({ uri });
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      throw new Error('Failed to generate PDF report');
    }
  },

  /**
   * Generate PDF for preview (returns URI)
   */
  async generatePdfUri(data: PdfReportData): Promise<string> {
    const html = generateHtmlTemplate(data);
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });
    return uri;
  },
};
