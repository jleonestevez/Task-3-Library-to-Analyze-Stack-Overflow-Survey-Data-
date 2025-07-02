# 📊 Stack Overflow Survey Analyzer

Herramienta CLI en TypeScript para analizar los resultados de la Encuesta de Desarrolladores Stack Overflow 2024.

## 🚀 Instalación

```bash
npm install
npm run build
```

## 📂 Estructura del proyecto

- `src/` Código fuente principal
- `test/` Pruebas unitarias
- `data/` Datos de la encuesta (so_2024_raw.xlsx)

## 🛠️ Comandos CLI

### Mostrar todas las preguntas
```bash
node dist/cli.js show-questions
```

### Buscar preguntas u opciones por palabra clave
```bash
node dist/cli.js search "remote"
```

### Filtrar subconjunto de respuestas por pregunta y opción
```bash
node dist/cli.js subset --question="MainBranch" --option="Freelancer"
```

### Mostrar la distribución de respuestas (SC o MC)
```bash
node dist/cli.js distribution --question="AIUsed" --type=mc
```

### Usar un archivo de datos personalizado
Agrega la opción `-f` o `--file` para especificar la ruta:
```bash
node dist/cli.js show-questions -f ./data/so_2024_raw.xlsx
```

## 🧪 Pruebas

```bash
npm test
```

---

Desarrollado para análisis de la encuesta Stack Overflow 2024. 