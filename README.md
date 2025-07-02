# 📊 Stack Overflow Survey Analyzer

A TypeScript CLI tool to analyze Stack Overflow Developer Survey data from Excel files. This library provides functionality to load, explore, filter, and analyze survey responses.

## 🚀 Features

- **Load survey data** from Excel files (.xlsx)
- **Show all questions** with their types and options
- **Search functionality** to find questions or options by keyword
- **Subset filtering** to filter responses by specific criteria
- **Distribution analysis** for single choice (SC) and multiple choice (MC) questions
- **CLI interface** for easy command-line usage
- **Full test coverage** with Jest

## 📦 Installation

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd so-survey-analyzer
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## 📂 Data Setup

Place your Stack Overflow survey Excel file in the `data/` directory:

```
data/
└── so_2024_raw.xlsx
```

The Excel file should have:
- First row as headers (question names/IDs)
- Subsequent rows as response data
- Multiple choice answers separated by semicolons (`;`)

## 🎯 Usage

### CLI Commands

#### 1. Show Questions
Display all available questions in the survey:

```bash
npm run dev show-questions
# or with custom file path:
npm run dev show-questions --file ./path/to/your/file.xlsx
```

#### 2. Search
Find questions or options containing a specific keyword:

```bash
npm run dev search "remote"
npm run dev search "developer"
```

#### 3. Subset
Filter responses based on a question and option:

```bash
npm run dev subset --question="MainBranch" --option="Freelancer"
npm run dev subset --question="DevType" --option="Full-stack developer"
```

#### 4. Distribution
Show response distribution for a question:

```bash
# Single choice questions
npm run dev distribution --question="MainBranch" --type=sc

# Multiple choice questions
npm run dev distribution --question="DevType" --type=mc
```

### After Building

Once built, you can use the compiled version:

```bash
node dist/cli.js show-questions
node dist/cli.js search "remote"
node dist/cli.js subset --question="MainBranch" --option="Freelancer"
node dist/cli.js distribution --question="DevType" --type=mc
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📚 API Reference

### Core Functions

#### `loadSurvey(filePath: string): SurveyData`
Loads and parses an Excel file containing survey data.

#### `showQuestions(data: SurveyData): void`
Displays all questions in the console with their types and options.

#### `search(data: SurveyData, keyword: string): QuestionMatch[]`
Searches for questions or options containing the specified keyword.

#### `subset(data: SurveyData, questionId: string, option: string): SurveyDataSubset`
Filters responses where a specific option was selected.

#### `distribution(data: SurveyData, questionId: string, type: 'sc' | 'mc'): DistributionResult`
Analyzes response distribution for single choice or multiple choice questions.

### Data Types

```typescript
interface SurveyData {
  questions: Question[];
  responses: Response[];
  metadata: {
    totalResponses: number;
    columns: string[];
  };
}

interface Question {
  id: string;
  text: string;
  type: 'sc' | 'mc' | 'text' | 'number';
  options?: string[];
}

interface Response {
  [questionId: string]: string | number | null;
}
```

## 🛠️ Development

### Project Structure

```
so-survey-analyzer/
├── src/
│   ├── types.ts          # TypeScript interfaces
│   ├── loader.ts         # Excel file loading
│   ├── explorer.ts       # Question display and search
│   ├── filters.ts        # Response filtering
│   ├── analysis.ts       # Distribution analysis
│   └── cli.ts           # CLI interface
├── test/
│   ├── loader.test.ts
│   ├── explorer.test.ts
│   ├── filters.test.ts
│   └── analysis.test.ts
├── data/
│   └── so_2024_raw.xlsx
└── dist/                # Compiled JavaScript
```

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run CLI commands with ts-node (development)
- `npm run start` - Run compiled CLI
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run clean` - Remove dist directory

## 🧠 How It Works

### Data Loading
The tool uses the `xlsx` library to parse Excel files. It automatically:
- Detects question types based on header patterns
- Handles numeric data conversion
- Preserves null/empty values

### Question Type Detection
Questions are automatically categorized as:
- **SC (Single Choice)**: Questions with terms like "choose one", "mainbranch", "employment"
- **MC (Multiple Choice)**: Questions with "select all", "multiple", or responses containing `;`
- **Number**: Questions containing "age", "years", "salary", "count"
- **Text**: Default type for all other questions

### Multiple Choice Handling
For MC questions, responses containing semicolons are split into individual options:
- Input: `"Full-stack developer;Back-end developer"`
- Processed as: `["Full-stack developer", "Back-end developer"]`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔧 Troubleshooting

### Common Issues

**File not found error:**
- Ensure the Excel file exists at the specified path
- Check file permissions
- Verify the file is a valid .xlsx format

**Empty results:**
- Check if your search terms match the actual data
- Verify question names/IDs are correct
- Ensure the Excel file has the expected structure

**Type errors:**
- Verify you're using the correct question type ('sc' or 'mc')
- Check that the question exists in the dataset

For more help, run any command with `--help` to see usage information.