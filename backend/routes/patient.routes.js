import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import Patient from '../models/Patient.model.js';
import User from '../models/User.model.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/patient/profile
// @desc    Get patient profile
// @access  Private (Patient)
router.get('/profile', authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id })
      .populate('assignedDoctor', 'firstName lastName email')
      .populate('assignedNurse', 'firstName lastName email');

    if (!patient) {
      return res.status(404).json({ error: 'Patient profile not found' });
    }

    res.json({ patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/patient/vitals
// @desc    Get patient vitals
// @access  Private (Patient)
router.get('/vitals', authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      currentVitals: patient.currentVitals,
      recentVitals: patient.vitals.slice(-10).reverse()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/patient/medications
// @desc    Get patient medications
// @access  Private (Patient)
router.get('/medications', authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({ medications: patient.medications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/patient/alerts
// @desc    Get patient alerts
// @access  Private (Patient)
router.get('/alerts', authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const unacknowledgedAlerts = patient.alerts.filter(alert => !alert.acknowledged);
    res.json({ alerts: unacknowledgedAlerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/patient/reports
// @desc    Get patient medical reports
// @access  Private (Patient)
router.get('/reports', authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id })
      .populate('reports.createdBy', 'firstName lastName');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Sort reports by date (newest first)
    const sortedReports = patient.reports.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ reports: sortedReports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/patient/reports/:reportId/download
// @desc    Download patient report as PDF
// @access  Private (Patient)
router.get('/reports/:reportId/download', authorize('patient'), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const report = patient.reports.id(req.params.reportId);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    if (report.status !== 'ready') {
      return res.status(400).json({ error: 'Report is not ready for download' });
    }

    // Generate PDF content (simple HTML-based PDF)
    const pdfContent = generateReportPDF(report, patient, req.user);

    // Set headers for HTML download (browser can print as PDF)
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `attachment; filename="${report.title.replace(/\s+/g, '_')}_${report.date.toISOString().split('T')[0]}.html"`);
    
    res.send(pdfContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to generate PDF content (HTML format for browser to print as PDF)
function generateReportPDF(report, patient, user) {
  // Check if report has detailed test results
  const hasTestResults = report.testResults && Array.isArray(report.testResults) && report.testResults.length > 0;
  
  // Generate test results table if available
  let testResultsHTML = '';
  if (hasTestResults) {
    testResultsHTML = `
      <div style="margin-top: 30px;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">TEST RESULTS</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white;">
              <th style="padding: 12px; text-align: left; border: 1px solid #ddd;">Investigation</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Result</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Reference Value</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Unit</th>
              <th style="padding: 12px; text-align: center; border: 1px solid #ddd;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${report.testResults.map((test, idx) => {
              const statusColor = test.isAbnormal ? '#ef4444' : '#10b981';
              const resultColor = test.isAbnormal ? '#ef4444' : '#1f2937';
              return `
                <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f9fafb'};">
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">${test.investigation}</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; color: ${resultColor}; font-weight: ${test.isAbnormal ? 'bold' : 'normal'};">${test.result}</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${test.referenceValue}</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${test.unit || '-'}</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center; color: ${statusColor}; font-weight: bold;">${test.status}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Generate recommendations section if available
  let recommendationsHTML = '';
  if (report.recommendations) {
    recommendationsHTML = `
      <div style="margin-top: 30px; padding: 20px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 8px;">
        <h3 style="color: #1f2937; margin-top: 0;">RECOMMENDATIONS</h3>
        <p style="color: #4b5563; line-height: 1.6; margin: 0;">${report.recommendations}</p>
      </div>
    `;
  }

  // Generate notes section if available
  let notesHTML = '';
  if (report.notes) {
    notesHTML = `
      <div style="margin-top: 20px; padding: 15px; background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px;">
        <h4 style="color: #92400e; margin-top: 0;">NOTES</h4>
        <p style="color: #78350f; line-height: 1.6; margin: 0; font-size: 0.9rem;">${report.notes}</p>
      </div>
    `;
  }

  // Lab information section
  let labInfoHTML = '';
  if (report.labName || report.registeredOn || report.collectedOn || report.reportedOn) {
    labInfoHTML = `
      <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 8px;">
        <h4 style="color: #0c4a6e; margin-top: 0; margin-bottom: 10px;">LABORATORY INFORMATION</h4>
        ${report.labName ? `<div style="margin: 5px 0;"><strong>Lab:</strong> ${report.labName}</div>` : ''}
        ${report.labAddress ? `<div style="margin: 5px 0;"><strong>Address:</strong> ${report.labAddress}</div>` : ''}
        ${report.registeredOn ? `<div style="margin: 5px 0;"><strong>Registered:</strong> ${report.registeredOn}</div>` : ''}
        ${report.collectedOn ? `<div style="margin: 5px 0;"><strong>Collected:</strong> ${report.collectedOn}</div>` : ''}
        ${report.reportedOn ? `<div style="margin: 5px 0;"><strong>Reported:</strong> ${report.reportedOn}</div>` : ''}
      </div>
    `;
  }

  // NLA Guidelines table for Lipid Profile
  let nlaGuidelinesHTML = '';
  if (report.nlaGuidelines && Array.isArray(report.nlaGuidelines) && report.nlaGuidelines.length > 0) {
    nlaGuidelinesHTML = `
      <div style="margin-top: 30px;">
        <h3 style="color: #1f2937; border-bottom: 2px solid #10b981; padding-bottom: 10px;">NLA - 2014 RECOMMENDATIONS</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <thead>
            <tr style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Category</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Optimal</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Above Optimal</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Borderline High</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">High</th>
              <th style="padding: 10px; text-align: center; border: 1px solid #ddd;">Very High</th>
            </tr>
          </thead>
          <tbody>
            ${report.nlaGuidelines.map((guideline, idx) => `
              <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f0fdf4'};">
                <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: 600;">${guideline.category}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.optimal || '-'}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.aboveOptimal || '-'}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.borderlineHigh || '-'}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.high || '-'}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb; text-align: center;">${guideline.veryHigh || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${report.title}</title>
  <style>
    @media print {
      body { margin: 0; }
      .no-print { display: none; }
    }
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; background: #ffffff; }
    .header { border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
    .hospital-name { font-size: 24px; font-weight: bold; color: #3b82f6; }
    .report-title { font-size: 28px; font-weight: bold; margin: 30px 0; color: #1f2937; text-align: center; }
    .info-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #6b7280; display: inline-block; width: 150px; }
    .value { color: #1f2937; }
    .summary { margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
    table { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    th { font-weight: 700; }
  </style>
</head>
<body>
  <div class="header">
    <div class="hospital-name" style="text-align: center;">MEDIQ CENTRAL HOSPITAL</div>
    <div style="color: #6b7280; margin-top: 5px; text-align: center;">Official Medical Report | Accurate | Caring | Instant</div>
    <div style="color: #9ca3af; margin-top: 10px; font-size: 0.85rem; text-align: center;">
      Generated on: ${new Date().toLocaleString()}
    </div>
  </div>
  
  <h1 class="report-title">${report.title}</h1>
  
  <div class="info-section">
    <div>
      <div class="info-row">
        <span class="label">Patient Name:</span>
        <span class="value">${user.firstName} ${user.lastName}</span>
      </div>
      <div class="info-row">
        <span class="label">Report Date:</span>
        <span class="value">${new Date(report.date).toLocaleDateString()}</span>
      </div>
      <div class="info-row">
        <span class="label">Report Type:</span>
        <span class="value">${report.type.toUpperCase()}</span>
      </div>
    </div>
    <div>
      <div class="info-row">
        <span class="label">Status:</span>
        <span class="value" style="color: ${report.status === 'ready' ? '#10b981' : '#f97316'}; font-weight: bold;">${report.status.toUpperCase()}</span>
      </div>
      ${patient ? `<div class="info-row">
        <span class="label">Ward:</span>
        <span class="value">${patient.assignedWard || 'N/A'}</span>
      </div>` : ''}
    </div>
  </div>
  
  <div class="summary">
    <div class="label" style="margin-bottom: 10px; font-size: 1.1rem;">Summary:</div>
    <div style="color: #4b5563; line-height: 1.6;">${report.summary || 'No summary available'}</div>
  </div>
  
  ${labInfoHTML}
  ${testResultsHTML}
  ${nlaGuidelinesHTML}
  ${recommendationsHTML}
  ${notesHTML}
  
  <div class="footer">
    <div style="margin-bottom: 10px;"><strong>This is an official medical report from MedIQ Central Hospital.</strong></div>
    <div>For any queries, please contact your healthcare provider.</div>
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <div style="margin-bottom: 5px;">Report Generated Electronically</div>
      <div>**** End of Report ****</div>
    </div>
  </div>
</body>
</html>
  `;

  // Return HTML content (browser can print as PDF)
  return Buffer.from(htmlContent, 'utf-8');
}

export default router;

