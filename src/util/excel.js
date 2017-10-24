/**
 * Created by lilu on 2017/10/17.
 */
import XLSX from 'xlsx'
import FileSaver from 'file-saver'

//转换函数
function s2ab(s) {
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
/*
根据数组导出excel
data为一个二维数组，
 */
export function exportExcel(params) {
  let {data,sheetName,fileName} = params
  let new_workbook = XLSX.utils.book_new();

  let worksheet = XLSX.utils.aoa_to_sheet(data);
  let wopts = { bookType:'xlsx', bookSST:false, type:'binary' };
  new_workbook.SheetNames.push(sheetName);
  new_workbook.Sheets[sheetName] = worksheet;
  let wbout = XLSX.write(new_workbook,wopts);
  try {
    FileSaver.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), fileName+'.xlsx');
  } catch(e) { if(typeof console != 'undefined') console.log(e); }
  return wbout;
}