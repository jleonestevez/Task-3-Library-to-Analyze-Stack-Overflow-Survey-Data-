#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'path';
import { loadSurvey } from './loader';
import { showQuestions, search } from './explorer';
import { subset } from './filters';
import { distribution } from './analysis';
import * as fs from 'fs';
import chalk from 'chalk';
import { table } from 'table';

const program = new Command();
const DEFAULT_DATA = path.join(__dirname, '../data/so_2024_raw.xlsx');

function ensureFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`Archivo no encontrado: ${filePath}`));
    process.exit(1);
  }
}

program
  .name('so-analyzer')
  .description('CLI para analizar la encuesta de Stack Overflow 2024')
  .version('1.0.0');

program
  .command('show-questions')
  .option('-f, --file <file>', 'Ruta al archivo Excel', DEFAULT_DATA)
  .action((opts: { file: string }) => {
    ensureFile(opts.file);
    const data = loadSurvey(opts.file);
    showQuestions(data);
  });

program
  .command('search <keyword>')
  .option('-f, --file <file>', 'Ruta al archivo Excel', DEFAULT_DATA)
  .action((keyword: string, opts: { file: string }) => {
    ensureFile(opts.file);
    const data = loadSurvey(opts.file);
    const results = search(data, keyword);
    if (results.length === 0) {
      console.log(chalk.yellow('No se encontraron coincidencias.'));
    } else {
      results.forEach(r => {
        if (r.option) {
          console.log(chalk.green(`Pregunta: ${r.question}`) + chalk.cyan(` | Opción: ${r.option}`));
        } else {
          console.log(chalk.green(`Pregunta: ${r.question}`));
        }
      });
    }
  });

program
  .command('subset')
  .requiredOption('--question <question>', 'Pregunta a filtrar')
  .requiredOption('--option <option>', 'Opción a filtrar')
  .option('-f, --file <file>', 'Ruta al archivo Excel', DEFAULT_DATA)
  .action((opts: { file: string; question: string; option: string }) => {
    ensureFile(opts.file);
    const data = loadSurvey(opts.file);
    const sub = subset(data, opts.question, opts.option);
    console.log(chalk.blue(`Respuestas que seleccionaron "${opts.option}" en "${opts.question}": ${sub.responses.length}`));
    // Mostrar primeras 5 respuestas como ejemplo
    sub.responses.slice(0, 5).forEach((r, i) => {
      console.log(`#${i + 1}:`, r);
    });
  });

program
  .command('distribution')
  .requiredOption('--question <question>', 'Pregunta a analizar')
  .requiredOption('--type <type>', 'Tipo de pregunta (sc|mc)', /^(sc|mc)$/i)
  .option('-f, --file <file>', 'Ruta al archivo Excel', DEFAULT_DATA)
  .action((opts: { file: string; question: string; type: 'sc' | 'mc' }) => {
    ensureFile(opts.file);
    const data = loadSurvey(opts.file);
    const dist = distribution(data, opts.question, opts.type);
    const rows = [[chalk.bold('Opción'), chalk.bold('Conteo')]];
    for (const [opt, count] of Object.entries(dist.counts)) {
      rows.push([opt, count.toString()]);
    }
    console.log(table(rows));
  });

program.parse(process.argv); 