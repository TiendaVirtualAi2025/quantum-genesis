// Apps Script para tracking y Bitly helper
const SHEET_ID = "YOUR_SHEET_ID";
const SHEET_NAME = "Sheet1";
const BITLY_TOKEN = "BITLY_TOKEN";

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var params = {};
  try { params = JSON.parse(e.postData.contents); } catch(err) { params = e.parameter || {}; }
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  var now = new Date();
  var row = [
    Utilities.formatDate(now, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    params.source || '',
    params.page || '',
    params.unique_users || '',
    params.page_views || '',
    params.emails_added || '',
    params.bitly_clicks || 0,
    params.affiliate_clicks || 0,
    params.affiliate_sales || 0,
    params.avg_time_seconds || '',
    params.notes || ''
  ];
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({status:'ok'})).setMimeType(ContentService.MimeType.JSON);
}

function shortenWithBitly(longUrl) {
  if (!BITLY_TOKEN || BITLY_TOKEN=="BITLY_TOKEN") return longUrl;
  var url = "https://api-ssl.bitly.com/v4/shorten";
  var payload = { long_url: longUrl };
  var options = {
    method:"post",
    contentType:"application/json",
    headers: { Authorization: "Bearer " + BITLY_TOKEN },
    payload: JSON.stringify(payload),
    muteHttpExceptions:true
  };
  var res = UrlFetchApp.fetch(url, options);
  var code = res.getResponseCode();
  if (code===200||code===201) {
    var data = JSON.parse(res.getContentText());
    return data.link;
  } else {
    return longUrl;
  }
}
