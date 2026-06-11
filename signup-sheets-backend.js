/**
 * ══════════════════════════════════════════════════════════════
 *  MYCOGEN × 放空男子 — 工作坊報名表 Google Sheets 後台接收程式
 *  Google Apps Script Web App
 * ══════════════════════════════════════════════════════════════
 *
 *  設定步驟（5 分鐘完成）：
 *
 *  1. 開啟（或新建）一個 Google 試算表
 *
 *  2. 點選上方選單：「擴充功能」→「Apps Script」
 *
 *  3. 將本檔案的全部內容貼入 Apps Script 編輯器，取代預設內容
 *     並把下方 SPREADSHEET_ID 換成你的試算表 ID
 *     （從網址取得：https://docs.google.com/spreadsheets/d/【這段】/edit）
 *
 *  4. 點選「部署」→「新增部署」→ 類型選「網頁應用程式」
 *       - 執行身份：我（您的 Google 帳號）
 *       - 存取對象：任何人
 *     → 複製產生的「網頁應用程式 URL」
 *
 *  5. 打開 mycogen_signup_v3.html，找到這一行：
 *       const SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
 *     將引號內的文字換成您複製的 URL。
 *
 *  完成！每筆報名會自動寫入「工作坊報名」分頁。
 *  （若日後修改本程式，須「部署」→「管理部署」→ 編輯 → 新版本，URL 不變）
 * ══════════════════════════════════════════════════════════════
 */

const SPREADSHEET_ID = '1z1Pd54g1v6XoawZhXsnIMNd-FlLvH2xE-fYYwjnhCkk';

const SHEET_NAME = '工作坊報名';

const HEADERS = [
  ['timestamp',  '報名時間'],
  ['name',       '姓名'],
  ['phone',      '電話'],
  ['email',      'Email'],
  ['session',    '場次'],
  ['date',       '日期'],
  ['date2',      '第二順位日期'],
  ['ticket',     '票種'],
  ['price',      '應付金額'],
  ['promo',      '優惠碼'],
  ['line_friend','已加LINE好友'],
  ['source',     '得知管道'],
  ['notes',      '身體狀況/備註'],
  ['agree',      '已同意活動聲明'],
  ['pay_mail',   '匯款信已寄送（手動勾選）'],
  ['confirmed',  '款項已核對（手動勾選）'],
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData ? e.postData.contents : '{}');
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(HEADERS.map(h => h[1]));
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, HEADERS.length)
           .setBackground('#2D6A4F')
           .setFontColor('#ffffff')
           .setFontWeight('bold');
    }

    sheet.appendRow(HEADERS.map(h => (h[0] === 'confirmed' || h[0] === 'pay_mail') ? '' : (data[h[0]] || '')));

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
