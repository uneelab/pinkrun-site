/**
 * MARKEN × Pink Run — 참가자 메시지 백엔드 (읽기 전용)
 * Google Apps Script 웹앱 · Google Sheets 에서 읽어오기만 합니다.
 *
 * 시트에 행을 추가/수정/삭제하면 사이트에 그대로 반영됩니다.
 * 설정 방법은 backend/SETUP.md 참고.
 */

/* 메시지를 담을 스프레드시트 ID.
   시트 주소 https://docs.google.com/spreadsheets/d/【이 부분】/edit
   시트 메뉴(확장 프로그램 → Apps Script)로 만든 경우 '' 로 비워두면 됩니다. */
var SHEET_ID = '1szOHQlN_apYqz7V5UYyduS1-qg2QIamp_Tr6tlnICfQ';

var SHEET_NAME = 'messages';

function book_() {
  return SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
}

/** 시트 1행(헤더) 기준으로 읽습니다.
 *  A: 이름   B: 소속/참가유형   C: 메시지   D: 표시(비우거나 TRUE 면 표시, FALSE 면 숨김)
 */
function doGet(e) {
  try {
    var ss = book_();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
    var last = sh.getLastRow();
    if (last < 2) return json_({ ok: true, items: [] });

    var rows = sh.getRange(2, 1, last - 1, 4).getValues();
    var items = [];

    for (var i = 0; i < rows.length; i++) {
      var name = String(rows[i][0] || '').trim();
      var role = String(rows[i][1] || '').trim();
      var msg  = String(rows[i][2] || '').trim();
      var show = rows[i][3];

      if (!msg) continue;                                  // 메시지 없으면 건너뜀
      if (show === false || String(show).toUpperCase() === 'FALSE') continue;  // 숨김 처리

      items.push({ row: i + 2, name: name, role: role, msg: msg });
    }

    // 시트에 나중에 적은 것이 위로 오게
    items.reverse();
    return json_({ ok: true, items: items });

  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** 사이트에서 남긴 메시지를 시트 맨 아래에 추가합니다.
 *  프론트에서 Content-Type: text/plain 으로 보내 preflight 를 피합니다. */
function doPost(e) {
  try {
    var body = {};
    try { body = JSON.parse(e.postData.contents); } catch (_) {}

    var name = clean_(body.name, 24);
    var role = clean_(body.role, 20);
    var msg  = clean_(body.msg, 500);
    if (!name || !msg) return json_({ ok: false, error: '이름과 메시지를 입력해 주세요' });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var ss = book_();
      var sh = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
      sh.appendRow([name, role, msg, true]);
      return json_({ ok: true });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function clean_(s, max) {
  return String(s == null ? '' : s).replace(/[\u0000-\u001F\u007F]/g, '').trim().slice(0, max);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** 처음 한 번 실행하면 헤더가 있는 messages 시트를 만들어 줍니다. (선택)
 *  Apps Script 편집기에서 이 함수를 골라 ▶ 실행 하세요. */
function setupSheet() {
  var ss = book_();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  sh.clear();
  sh.getRange(1, 1, 1, 4).setValues([['이름', '참가유형', '메시지', '표시']]);
  sh.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#f1f1f1');
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 140);
  sh.setColumnWidth(2, 140);
  sh.setColumnWidth(3, 520);
  sh.setColumnWidth(4, 80);
  sh.getRange(2, 1, 2, 4).setValues([
    ['김마켄', '2025 러너', '가족과 함께 걸으며 나눈 이야기가 오래 남았습니다.', true],
    ['이핑크', '마켄 가족', '처음엔 회사 행사였지만 결승선에선 모두 한 팀이었어요.', true]
  ]);
}
