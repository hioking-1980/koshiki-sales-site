// Googleスプレッドシートの「Webに公開」したCSV URL
const SHEET_SALES_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR42a0Ajt-YBkcx13xy-CbRD5ytwFoAt7V-akyO3Xjojf-VCRUjVF1q5lgo6gUD_IJROeV7nMFvJgXq/pub?gid=0&single=true&output=csv;

// 【追加】取り扱い店舗データのCSV URL
// 注意: ユーザーから提供されたURL(gid=378996732)をCSV形式に変換したURLを推定して記載しています。
// スプレッドシートを「ウェブに公開」し、形式を「カンマ区切り形式(.csv)」にして取得したURLに置き換えてください。
const SHEET_SHOP_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR42a0Ajt-YBkcx13xy-CbRD5ytwFoAt7V-akyO3Xjojf-VCRUjVF1q5lgo6gUD_IJROeV7nMFvJgXq/pub?gid=378996732&single=true&output=csv;

const elements = {
    offlineBadge: document.getElementById('offline-badge'),
    lastUpdatedTime: document.getElementById('last-updated-time'),
    refreshButton: document.getElementById('refresh-button'),
    yearlyProgress: document.getElementById('yearly-progress'),
    yearlyPercent: document.getElementById('yearly-percent'),
    yearlyTarget: document.getElementById('yearly-target'),
    monthlyProgress: document.getElementById('monthly-progress'),
    monthlyPercent: document.getElementById('monthly-percent'),
    monthlyTarget: document.getElementById('monthly-target'),
    monthlyGrid: document.getElementById('monthly-grid'),
    // 【追加】店舗関連の要素
    currentStores: document.getElementById('current-stores'),
    targetStores: document.getElementById('target-stores'),
    storeList: document.getElementById('store-list')
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
const dummyDataSales = {
    total_target: "20000",
    monthly_overall_percent: "50",
    yearly_overall_percent: "75",
    monthly_percent_07: "38", monthly_percent_08: "11", monthly_percent_09: "24",
    monthly_percent_10: "58", monthly_percent_11: "21", monthly_percent_12: "1",
    monthly_percent_01: "0" // 1月ダミー
};
const dummyDataShop = {
    total_shops: "7",
    target_shops: "300",
    shop_name_list: "46クラフト,物産協会,アンバサド,山下商店,ソーレリーフ,ダーツバーメビウス,ラスタ食堂"
};

// データレンダリング
const render = (salesData, shopData) => {
    // --- 売上データレンダリング ---
    
    // 年間・月間進捗バー (ここでは変更なし)
    const yearlyPercent = parseFloat(salesData.yearly_overall_percent);
    const monthlyPercent = parseFloat(salesData.monthly_overall_percent);
    const totalTarget = parseFloat(salesData.total_target);
    const monthlyTarget = 1666; 

    const totalAchieved = Math.round(totalTarget * (yearlyPercent / 100));
    const monthlyAchieved = Math.round(monthlyTarget * (monthlyPercent / 100));

    elements.yearlyProgress.style.width = `${clamp(yearlyPercent, 0, 100)}%`;
    elements.yearlyPercent.textContent = `${formatPercent(yearlyPercent)} (${formatNumber(totalAchieved)}本)`;
    elements.yearlyTarget.textContent = `${formatNumber(totalTarget)}本`;
    elements.yearlyProgress.setAttribute('aria-valuenow', yearlyPercent);

    elements.monthlyProgress.style.width = `${clamp(monthlyPercent, 0, 100)}%`;
    elements.monthlyPercent.textContent = `${formatPercent(monthlyPercent)} (${formatNumber(monthlyAchieved)}本)`;
    elements.monthlyTarget.textContent = `${formatNumber(monthlyTarget)}本`;
    elements.monthlyProgress.setAttribute('aria-valuenow', monthlyPercent);
    
    // 月別カード
    const monthNames = ["07", "08", "09", "10", "11", "12", "01"]; // 1月を追加
    elements.monthlyGrid.innerHTML = ''; 
    
    monthNames.forEach(month => {
        const monthKey = `monthly_percent_${month}`;
        if (salesData[monthKey] !== undefined) {
            const percent = parseFloat(salesData[monthKey]);
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

    // --- 店舗データレンダリング ---
    const currentShopCount = parseFloat(shopData.total_shops || 0);
    const targetShopCount = parseFloat(shopData.target_shops || 300);
    const shopNames = shopData.shop_name_list ? shopData.shop_name_list.split(',').map(name => name.trim()) : [];
    
    elements.currentStores.textContent = formatNumber(currentShopCount);
    elements.targetStores.textContent = formatNumber(targetShopCount);

    elements.storeList.innerHTML = shopNames.map(name => `<span>${name}</span>`).join(' ');


    // 最終更新時刻を更新
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    elements.lastUpdatedTime.textContent = formattedTime;
    elements.offlineBadge.classList.add('hidden');
};

// メインの処理関数
const init = async () => {
    elements.refreshButton.disabled = true;

    // 複数のデータを並行してフェッチ
    const [salesData, shopData] = await Promise.all([
        fetchCsvData(SHEET_SALES_URL),
        fetchCsvData(SHEET_SHOP_URL)
    ]);

    let finalSalesData = salesData;
    let finalShopData = shopData;
    
    if (!salesData) {
        finalSalesData = dummyDataSales;
        elements.offlineBadge.classList.remove('hidden');
    }
    if (!shopData) {
        finalShopData = dummyDataShop;
        elements.offlineBadge.classList.remove('hidden');
    }

    render(finalSalesData, finalShopData);
    elements.refreshButton.disabled = false;
};

// イベントリスナー
elements.refreshButton.addEventListener('click', init);

// 初期実行
init();
