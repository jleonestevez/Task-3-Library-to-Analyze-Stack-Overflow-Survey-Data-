#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path = __importStar(require("path"));
const loader_1 = require("./loader");
const explorer_1 = require("./explorer");
const filters_1 = require("./filters");
const analysis_1 = require("./analysis");
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
const table_1 = require("table");
const program = new commander_1.Command();
const DEFAULT_DATA = path.join(__dirname, '../data/so_2024_raw.xlsx');
function ensureFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(chalk_1.default.red(`Archivo no encontrado: ${filePath}`));
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
    .action((opts) => {
    ensureFile(opts.file);
    const data = (0, loader_1.loadSurvey)(opts.file);
    (0, explorer_1.showQuestions)(data);
});
program
    .command('search <keyword>')
    .option('-f, --file <file>', 'Ruta al archivo Excel', DEFAULT_DATA)
    .action((keyword, opts) => {
    ensureFile(opts.file);
    const data = (0, loader_1.loadSurvey)(opts.file);
    const results = (0, explorer_1.search)(data, keyword);
    if (results.length === 0) {
        console.log(chalk_1.default.yellow('No se encontraron coincidencias.'));
    }
    else {
        results.forEach(r => {
            if (r.option) {
                console.log(chalk_1.default.green(`Pregunta: ${r.question}`) + chalk_1.default.cyan(` | Opción: ${r.option}`));
            }
            else {
                console.log(chalk_1.default.green(`Pregunta: ${r.question}`));
            }
        });
    }
});
program
    .command('subset')
    .requiredOption('--question <question>', 'Pregunta a filtrar')
    .requiredOption('--option <option>', 'Opción a filtrar')
    .option('-f, --file <file>', 'Ruta al archivo Excel', DEFAULT_DATA)
    .action((opts) => {
    ensureFile(opts.file);
    const data = (0, loader_1.loadSurvey)(opts.file);
    const sub = (0, filters_1.subset)(data, opts.question, opts.option);
    console.log(chalk_1.default.blue(`Respuestas que seleccionaron "${opts.option}" en "${opts.question}": ${sub.responses.length}`));
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
    .action((opts) => {
    ensureFile(opts.file);
    const data = (0, loader_1.loadSurvey)(opts.file);
    const dist = (0, analysis_1.distribution)(data, opts.question, opts.type);
    const rows = [[chalk_1.default.bold('Opción'), chalk_1.default.bold('Conteo')]];
    for (const [opt, count] of Object.entries(dist.counts)) {
        rows.push([opt, count.toString()]);
    }
    console.log((0, table_1.table)(rows));
});
program.parse(process.argv);
