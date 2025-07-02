import { showQuestions, search } from '../src/explorer';
import { loadSurvey } from '../src/loader';
import * as path from 'path';

describe('explorer (real data)', () => {
  const filePath = path.join(__dirname, '../data/so_2024_raw.xlsx');
  const data = loadSurvey(filePath);

  it('showQuestions should print all questions', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    showQuestions(data);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('MainBranch'));
    logSpy.mockRestore();
  });

  it('search should find questions by keyword', () => {
    const results = search(data, 'MainBranch');
    expect(results.some(r => r.question === 'MainBranch')).toBe(true);
  });

  it('search should find options by keyword', () => {
    const opt = data.options['MainBranch'][0];
    const results = search(data, opt.slice(0, 5)); // buscar por parte de la opción
    expect(results.some(r => r.option && r.option.includes(opt.slice(0, 5)))).toBe(true);
  });
}); 