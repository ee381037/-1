let examData = [];

// 當網頁載入時，去抓取 data.json 的資料
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            examData = data;
            renderTable(examData); // 畫出表格
        })
        .catch(error => {
            console.error('資料載入失敗:', error);
            document.getElementById('tableBody').innerHTML = '<tr><td colspan="6">資料載入失敗，請確認 data.json 檔案是否存在。</td></tr>';
        });
});

// 取得篩選元件
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const collegeFilter = document.getElementById('collegeFilter');
const resetBtn = document.getElementById('resetBtn');

// 監聽輸入與選擇事件
searchInput.addEventListener('input', filterData);
typeFilter.addEventListener('change', filterData);
collegeFilter.addEventListener('change', filterData);

// 重設按鈕
resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    typeFilter.value = '';
    collegeFilter.value = '';
    renderTable(examData);
});

// 過濾資料邏輯
function filterData() {
    const keyword = searchInput.value.toLowerCase();
    const typeValue = typeFilter.value;
    const collegeValue = collegeFilter.value;

    const filtered = examData.filter(item => {
        // 搜尋關鍵字：對學校、科系、考科進行比對
        const matchKeyword = 
            item.school.toLowerCase().includes(keyword) || 
            item.department.toLowerCase().includes(keyword) || 
            item.subjects.toLowerCase().includes(keyword);
        
        // 下拉選單比對
        const matchType = typeValue === "" || item.type === typeValue;
        const matchCollege = collegeValue === "" || item.college === collegeValue;

        return matchKeyword && matchType && matchCollege;
    });

    renderTable(filtered);
}

// 畫出表格邏輯
function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // 清空現有資料

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding:30px; color:#999;">找不到符合條件的資料 😢</td></tr>';
        return;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');
        
        // 判斷公私立標籤顏色
        const badgeClass = item.type === '公立' ? 'badge-public' : 'badge-private';

        tr.innerHTML = `
            <td><span class="badge ${badgeClass}">${item.type}</span></td>
            <td>${item.college}</td>
            <td class="school-name">${item.school}</td>
            <td class="text-left"><strong>${item.department}</strong></td>
            <td>${item.quota}</td>
            <td class="text-left" style="font-size: 13px; line-height: 1.5;">${item.subjects}</td>
        `;
        tbody.appendChild(tr);
    });
}
