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

const createCard = (month, percent) => {
    const card = document.createElement('div');
    card.className = 'monthly-card';
    card.innerHTML = `<strong>${parseInt(month)}月</strong><br>${percent}%`;
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

        // 進捗
        elements.yearlyProgress.style.width = obj.yearly_overall_percent + '%';
        elements.yearlyPercent.textContent = obj.yearly_overall_percent + '% (' + Number(obj.total_target * (obj.yearly_overall_percent/100)).toLocaleString() + '本)';
        elements.yearlyTarget.textContent = Number(obj.total_target).toLocaleString() + '本';
        
        elements.monthlyProgress.style.width = obj.monthly_overall_percent + '%';
        elements.monthlyPercent.textContent = obj.monthly_overall_percent + '% (' + Number(1666 * (obj.monthly_overall_percent/100)).toLocaleString() + '本)';

        // 2026
        elements.grid2026.innerHTML = '';
        ['01'].forEach(m => {
            const val = obj['monthly_percent_' + m];
            if(val !== undefined) elements.grid2026.appendChild(createCard(m, val));
        });

        // 2025
        elements.grid2025.innerHTML = '';
        ['07','08','09','10','11','12'].forEach(m => {
            const val = obj['monthly_percent_' + m];
            if(val !== undefined) elements.grid2025.appendChild(createCard(m, val));
        });

        const now = new Date();
        elements.lastUpdatedTime.textContent = now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
    } catch (e) {
        elements.offlineBadge.classList.remove('hidden');
    }
};

elements.refreshButton.addEventListener('click', init);
init();
