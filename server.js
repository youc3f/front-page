const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/validate', (req, res) => {
  const code = req.body.code;

  // Basic validation: check if it includes "public class" and curly braces
  const classRegex = /public\s+class\s+[A-Za-z0-9_]+/;
  const braceRegex = /\{.*\}/s;

  if (!classRegex.test(code)) {
    return res.status(400).json({
      valid: false,
      message: 'Invalid syntax: Missing or incorrect class declaration.',
    });
  }
  if (!braceRegex.test(code)) {
    return res.status(400).json({
      valid: false,
      message: 'Invalid syntax: Missing curly braces.',
    });
  }

  // If both checks pass, assume syntax is correct
  let count_instruction = 0;
  let position = code.indexOf(';');
  const lines = code.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Check if it's a 'for' loop
    if (trimmedLine.startsWith('for') && trimmedLine.includes(';')) {
      count_instruction++;
      continue; // Skip counting this line
    }

    // Count ';' outside 'for' loops
    count_instruction += (trimmedLine.match(/;/g) || []).length;
  }

  let count_comment = 0;
  position = code.indexOf('//');

  while (position != -1) {
    count_comment++;
    position = code.indexOf('//', position + 1);
  }

  const decisionRegex = /\b(if|else if|for|while|do|switch|case|default)\b/g;
  const decisions = (code.match(decisionRegex) || []).length + 1;

  let empty_lines = 0;
  lines.forEach((line) => {
    if (line.trim() === '') {
      empty_lines++;
    }
  });
  let count = count_comment + count_instruction;

  res.json({
    valid: true,
    message: 'Syntax is correct!',
    instruction: count_instruction,
    comment: count_comment,
    physique: count,
    empty_lines: empty_lines,
    decision: decisions,
  });
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
