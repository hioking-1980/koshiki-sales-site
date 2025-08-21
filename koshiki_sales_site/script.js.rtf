{\rtf1\ansi\ansicpg932\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Google\uc0\u12473 \u12503 \u12524 \u12483 \u12489 \u12471 \u12540 \u12488 \u12398 \u12300 Web\u12395 \u20844 \u38283 \u12301 \u12375 \u12383 CSV URL\
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQf9Y6-fGvS9F-XfM6vY-eTz6Wf4Jg5n7x5r-jNq3D7J8fP9wA-z2y3x8L/pub?gid=0&single=true&output=csv';\
\
const elements = \{\
    offlineBadge: document.getElementById('offline-badge'),\
    lastUpdatedTime: document.getElementById('last-updated-time'),\
    refreshButton: document.getElementById('refresh-button'),\
    yearlyProgress: document.getElementById('yearly-progress'),\
    yearlyPercent: document.getElementById('yearly-percent'),\
    yearlyTarget: document.getElementById('yearly-target'),\
    monthlyProgress: document.getElementById('monthly-progress'),\
    monthlyPercent: document.getElementById('monthly-percent'),\
    monthlyGrid: document.getElementById('monthly-grid')\
\};\
\
// \uc0\u12518 \u12540 \u12486 \u12451 \u12522 \u12486 \u12451 \u38306 \u25968 \
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);\
const formatNumber = (num) => new Intl.NumberFormat('ja-JP').format(num);\
const formatPercent = (percent) => `$\{clamp(percent, 0, 100).toFixed(0)\}%`;\
\
// CSV\uc0\u12434 \u12501 \u12455 \u12483 \u12481 \u12375 \u12390 JSON\u12458 \u12502 \u12472 \u12455 \u12463 \u12488 \u12395 \u22793 \u25563 \
const fetchCsvData = async (url) => \{\
    try \{\
        const response = await fetch(url);\
        if (!response.ok) \{\
            throw new Error('Network response was not ok');\
        \}\
        const text = await response.text();\
        const [headerRow, dataRow] = text.split('\\n').map(row => row.split(','));\
        const data = \{\};\
        headerRow.forEach((key, i) => \{\
            data[key.trim()] = dataRow[i].trim();\
        \});\
        return data;\
    \} catch (error) \{\
        console.error('Fetch error:', error);\
        return null;\
    \}\
\};\
\
// \uc0\u12480 \u12511 \u12540 \u12487 \u12540 \u12479 \u65288 \u12501 \u12455 \u12483 \u12481 \u22833 \u25943 \u26178 \u12398 \u12501 \u12457 \u12540 \u12523 \u12496 \u12483 \u12463 \u65289 \
const dummyData = \{\
    total_target: "10000000",\
    monthly_overall_percent: "50",\
    yearly_overall_percent: "75",\
    monthly_percent_04: "65", monthly_percent_05: "85", monthly_percent_06: "105",\
    monthly_percent_07: "90", monthly_percent_08: "70", monthly_percent_09: "110",\
    monthly_percent_10: "55", monthly_percent_11: "88", monthly_percent_12: "100",\
    monthly_percent_01: "78", monthly_percent_02: "95", monthly_percent_03: "120"\
\};\
\
// \uc0\u12487 \u12540 \u12479 \u12524 \u12531 \u12480 \u12522 \u12531 \u12464 \
const render = (data) => \{\
    // \uc0\u24180 \u38291 \u12539 \u26376 \u38291 \u36914 \u25431 \u12496 \u12540 \
    const yearlyPercent = parseFloat(data.yearly_overall_percent);\
    const monthlyPercent = parseFloat(data.monthly_overall_percent);\
    const totalTarget = parseFloat(data.total_target);\
\
    elements.yearlyProgress.style.width = `$\{clamp(yearlyPercent, 0, 100)\}%`;\
    elements.yearlyPercent.textContent = formatPercent(yearlyPercent);\
    elements.yearlyTarget.textContent = `$\{formatNumber(totalTarget)\}\uc0\u20870 `;\
    elements.yearlyProgress.setAttribute('aria-valuenow', yearlyPercent);\
\
    elements.monthlyProgress.style.width = `$\{clamp(monthlyPercent, 0, 100)\}%`;\
    elements.monthlyPercent.textContent = formatPercent(monthlyPercent);\
    elements.monthlyProgress.setAttribute('aria-valuenow', monthlyPercent);\
    \
    // \uc0\u26376 \u21029 \u12459 \u12540 \u12489 \
    const monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];\
    elements.monthlyGrid.innerHTML = ''; // \uc0\u19968 \u24230 \u12463 \u12522 \u12450 \
    \
    monthNames.forEach(month => \{\
        const monthKey = `monthly_percent_$\{month\}`;\
        if (data[monthKey] !== undefined) \{\
            const percent = parseFloat(data[monthKey]);\
            const card = document.createElement('div');\
            card.className = 'monthly-card';\
            \
            let textColorClass = 'monthly-card__percent--gray';\
            if (percent >= 100) \{\
                textColorClass = 'monthly-card__percent--red';\
            \} else if (percent >= 80) \{\
                textColorClass = 'monthly-card__percent--black';\
            \}\
            \
            card.innerHTML = `\
                <div class="monthly-card__header">\
                    <div class="monthly-card__month">$\{parseInt(month, 10)\}\uc0\u26376 </div>\
                    <div class="monthly-card__percent $\{textColorClass\}">$\{formatPercent(percent)\}</div>\
                </div>\
                <div class="monthly-card__bar-container">\
                    <div class="monthly-card__bar" style="width: $\{clamp(percent, 0, 100)\}%;"></div>\
                </div>\
            `;\
            elements.monthlyGrid.appendChild(card);\
        \}\
    \});\
\
    // \uc0\u26368 \u32066 \u26356 \u26032 \u26178 \u21051 \u12434 \u26356 \u26032 \
    const now = new Date();\
    const formattedTime = `$\{String(now.getHours()).padStart(2, '0')\}:$\{String(now.getMinutes()).padStart(2, '0')\}`;\
    elements.lastUpdatedTime.textContent = formattedTime;\
    elements.offlineBadge.classList.add('hidden');\
\};\
\
// \uc0\u12513 \u12452 \u12531 \u12398 \u20966 \u29702 \u38306 \u25968 \
const init = async () => \{\
    let data = await fetchCsvData(SHEET_CSV_URL);\
    if (!data) \{\
        data = dummyData;\
        elements.offlineBadge.classList.remove('hidden');\
    \}\
    render(data);\
\};\
\
// \uc0\u12452 \u12505 \u12531 \u12488 \u12522 \u12473 \u12490 \u12540 \
elements.refreshButton.addEventListener('click', init);\
\
// \uc0\u21021 \u26399 \u23455 \u34892 \
init();}