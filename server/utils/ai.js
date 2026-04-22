/**
 * AI Logic for Universal Pension Ledger
 */

// Basic forecasting model
const forecastRetirement = (salary, currentBalance, age, targetAge, growthRate = 0.08, inflation = 0.04) => {
    let years = targetAge - age;
    if (years <= 0) return { futureValue: currentBalance, status: 'reached' };

    const netGrowth = growthRate - inflation;
    let futureValue = currentBalance * Math.pow(1 + netGrowth, years);
    
    // Simplified: add annual contributions assuming fixed % of salary
    let annualContribution = salary * 0.12 * 12; // 12% of monthly salary
    for (let i = 1; i <= years; i++) {
        futureValue += annualContribution * Math.pow(1 + netGrowth, years - i);
    }

    return {
        futureValue: Math.round(futureValue),
        yearsRemaining: years,
        confidence: 0.85
    };
};

// Anomaly detection for contributions
const detectAnomalies = (contributions) => {
    const alerts = [];
    if (!contributions || contributions.length === 0) return alerts;

    // Check for gaps
    // Sort by date (mock implementation)
    const sorted = [...contributions].sort((a, b) => new Date(a.month) - new Date(b.month));
    
    // Check if last month is missing
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastContribution = sorted[sorted.length - 1];
    
    if (lastContribution && new Date(lastContribution.month) < lastMonth) {
        alerts.push({
            type: 'missing',
            message: 'Contribution missing for recent month.',
            severity: 'high'
        });
    }

    // Check for significant amount drop (>20%)
    if (sorted.length >= 2) {
        const prev = sorted[sorted.length - 2].amount;
        const curr = sorted[sorted.length - 1].amount;
        if (curr < prev * 0.8) {
            alerts.push({
                type: 'drop',
                message: `Significant drop detected: ${Math.round((1 - curr/prev) * 100)}% decrease.`,
                severity: 'medium'
            });
        }
    }

    return alerts;
};

module.exports = { forecastRetirement, detectAnomalies };
