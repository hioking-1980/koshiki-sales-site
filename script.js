// Googleスプレッドシートの「Webに公開」したCSV URL
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
    monthlyGrid: document.getElementById('monthly-grid')
};

// ユーティリティ関数
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const formatNumber = (num) => new Intl.NumberFormat('ja-JP').format(num);
const formatPercent = (percent) => `${clamp(percent, 0, 100).toFixed(0)}%`;

// CSVをフェッチしてJSONオブジェクトに変換
const fetchCsvData = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        const [headerRow, dataRow] = text.split('\n').map(row => row.split(','));
        const data = {};
        headerRow.forEach((key, i) => {
            data[key.trim()] = dataRow[i].trim();
        });
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
};

// ダミーデータ（フェッチ失敗時のフォールバック）
const dummyData = {
    total_target: "10000000",
    monthly_overall_percent: "50",
    yearly_overall_percent: "75",
    monthly_percent_04: "65", monthly_percent_05: "85", monthly_percent_06: "105",
    monthly_percent_07: "90", monthly_percent_08: "70", monthly_percent_09: "110",
    monthly_percent_10: "55", monthly_percent_11: "88", monthly_percent_12: "100",
    monthly_percent_01: "78", monthly_percent_02: "95", monthly_percent_03: "120"
};

// データレンダリング
const render = (data) => {
    // 年間・月間進捗バー
    const yearlyPercent = parseFloat(data.yearly_overall_percent);
    const monthlyPercent = parseFloat(data.monthly_overall_percent);
    const totalTarget = parseFloat(data.total_target);

    elements.yearlyProgress.style.width = `${clamp(yearlyPercent, 0, 100)}%`;
    elements.yearlyPercent.textContent = formatPercent(yearlyPercent);
    elements.yearlyTarget.textContent = `${formatNumber(totalTarget)}円`;
    elements.yearlyProgress.setAttribute('aria-valuenow', yearlyPercent);

    elements.monthlyProgress.style.width = `${clamp(monthlyPercent, 0, 100)}%`;
    elements.monthlyPercent.textContent = formatPercent(monthlyPercent);
    elements.monthlyProgress.setAttribute('aria-valuenow', monthlyPercent);
    
    // 月別カード
    const monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    elements.monthlyGrid.innerHTML = ''; // 一度クリア
    
    monthNames.forEach(month => {
        const monthKey = `monthly_percent_${month}`;
        if (data[monthKey] !== undefined) {
            const percent = parseFloat(data[monthKey]);
            const card = document.createElement('div');
            card.className = 'monthly-card';
            
            let textColorClass = 'monthly-card__percent--gray';
            if (percent >= 100) {
                textColorClass = 'monthly-card__percent--red';
            } else if (percent >= 80) {
                textColorClass = 'monthly-card__percent--black';
            }
            
            card.innerHTML = `
                <div class="monthly-card__header">
                    <div class="monthly-card__month">${parseInt(month, 10)}月</div>
                    <div class="monthly-card__percent ${textColorClass}">${formatPercent(percent)}</div>
                </div>
                <div class="monthly-card__bar-container">
                    <div class="monthly-card__bar" style="width: ${clamp(percent, 0, 100)}%;"></div>
                </div>
            `;
            elements.monthlyGrid.appendChild(card);
        }
    });

    // 最終更新時刻を更新
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    elements.lastUpdatedTime.textContent = formattedTime;
    elements.offlineBadge.classList.add('hidden');
};

// メインの処理関数
const init = async () => {
    let data = await fetchCsvData(SHEET_CSV_URL);
    if (!data) {
        data = dummyData;
        elements.offlineBadge.classList.remove('hidden');
    }
    render(data);
};

// イベントリスナー
elements.refreshButton.addEventListener('click', init);

// 初期実行
init();
