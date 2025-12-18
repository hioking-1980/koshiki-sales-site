const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR42a0Ajt-YBkcx13xy-CbRD5ytwFoAt7V-akyO3Xjojf-VCRUjVF1q5lgo6gUD_IJROeV7nMFvJgXq/pub?gid=1242629118&single=true&output=csv';

const elements = {
    offlineBadge: document.getElementById('offline-badge'),
    lastUpdatedTime: document.getElementById('last-updated-time'),
    refreshButton: document.getElementById('refresh-button'),
    yearlyProgress: document.getElementById('yearly-progress'),
    yearlyPercent: document.getElementById('yearly-percent'),
    yearlyTarget: document.getElementById('yearly-target'),
    monthlyProgress: document.getElementById('monthly-progress'),
    monthlyPercent: document.getElementById('monthly-percent'),
    grid2025: document.getElementById('monthly-grid-2025'),
    grid2026: document.getElementById('monthly-grid-2026')
};

// カード生成関数にミニバーを追加
const createCard = (month, percent) => {
    const card = document.createElement('div');
    card.className = 'monthly-card';
    const safePercent = Math.min(Math.max(parseFloat(percent) || 0, 0), 100);
    card.innerHTML = `
        <strong>${parseInt(month)}月</strong><span style="float:right; color:#999; font-size:0.8rem;">${safePercent}%</span>
        <div class="mini-progress-container">
            <div class="mini-progress-bar" style="width: ${safePercent}%"></div>
        </div>
    `;
    return card;
};

const init = async () => {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const text = await response.text();
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const data = rows[1];
        
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = data[i].trim());

        // 進捗の表示 (小数点以下を丸める)
        const yearlyPct = parseFloat(obj.yearly_overall_percent) || 0;
        const monthlyPct = parseFloat(obj.monthly_overall_percent) || 0;
        const target = parseFloat(obj.total_target) || 0;

        elements.yearlyProgress.style.width = yearlyPct + '%';
        elements.yearlyPercent.textContent = yearlyPct + '% (' + Math.floor(target * (yearlyPct/100)).toLocaleString() + '本)';
        elements.yearlyTarget.textContent = target.toLocaleString() + '本';
        
        elements.monthlyProgress.style.width = monthlyPct + '%';
        elements.monthlyPercent.textContent = monthlyPct + '% (' + Math.floor(1666 * (monthlyPct/100)).toLocaleString() + '本)';

        // 2026年（1月）
        elements.grid2026.innerHTML = '';
        ['01'].forEach(m => {
            const val = obj['monthly_percent_' + m];
            if(val !== undefined) elements.grid2026.appendChild(createCard(m, val));
        });

        // 2025年（ご希望の通り 12, 11, 10, 9, 8, 7 の順）
        elements.grid2025.innerHTML = '';
        ['12','11','10','09','08','07'].forEach(m => {
            const val = obj['monthly_percent_' + m];
            if(val !== undefined) elements.grid2025.appendChild(createCard(m, val));
        });

        const now = new Date();
        elements.lastUpdatedTime.textContent = String(now.getHours()).padStart(2,'0') + ':' + String(now.getMinutes()).padStart(2,'0');
    } catch (e) {
        console.error(e);
        elements.offlineBadge.classList.remove('hidden');
    }
};

elements.refreshButton.addEventListener('click', init);
init();
