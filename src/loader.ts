import * as XLSX from 'xlsx';

export interface SurveyData {
  questions: string[];
  options: Record<string, string[]>;
  responses: Record<string, any>[];
}

export function loadSurvey(filePath: string): SurveyData {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, any>[];

  if (json.length === 0) throw new Error('No data found in the Excel file.');

  const questions = Object.keys(json[0]);
  const options: Record<string, string[]> = {};

  // Opciones: para cada pregunta, recolectar valores únicos (ignorando vacíos)
  for (const q of questions) {
    const opts = new Set<string>();
    for (const row of json) {
      if ((row as Record<string, any>)[q]) {
        const vals = String((row as Record<string, any>)[q]).split(';').map(v => v.trim());
        vals.forEach(v => v && opts.add(v));
      }
    }
    options[q] = Array.from(opts);
  }

  return {
    questions,
    options,
    responses: json
  };
} 