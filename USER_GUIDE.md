# SyntaxSensei User Guide 🥋

Welcome to **SyntaxSensei**, your intelligent coding companion. This guide will help you set up, run, and get the most out of the application.

## 📋 Table of Contents
1. [Installation & Setup](#installation--setup)
2. [Using the Application](#using-the-application)
3. [Features Explained](#features-explained)
4. [Troubleshooting](#troubleshooting)

---

## 🏗️ Installation & Setup

You can run SyntaxSensei in two ways: **Docker** (Recommended) or **Local Manual Setup**.

### Option A: Docker (Fastest)
Ensure you have [Docker Desktop](https://www.docker.com/products/docker-desktop) installed.

1. Open your terminal in the project root.
2. Run the start command:
   ```bash
   docker-compose up --build
   ```
3. Open your browser to **http://localhost:8080**.

### Option B: Local Manual Setup
If you prefer to run services individually or don't have Docker.

**Prerequisites**:
- Node.js (v18+)
- Python 3
- Java Development Kit (JDK 17+)
- Clang (For C++)

**1. Start the Backend Server**
```bash
cd server
npm install
npm start
```
*Server runs at http://localhost:3000*

**2. Start the Frontend Client**
```bash
cd client
npm install
npm run dev
```
*Client runs at http://localhost:5173*

---

## 🖥️ Using the Application

### The Interface
- **Code Editor**: The main central area. Paste your code here.
- **Language Selector**: Top right. Select your language manually or click **✨ Auto Detect**.
- **Output Panel**: Bottom pane. Shows validation results, scores, and fixes.

### Workflow
1. **Paste Code**: Copy code from your IDE or write directly in the editor.
2. **Check Syntax**: The app validates automatically as you type (debounced) or when you change languages.
3. **Review Feedback**:
   - Check the **Status Badge** (Valid/Errors).
   - Look at the **Syntax Score** (0-100).
   - Read **Explanations** ("💡 Why") and **Fixes** ("🔧 Fix").

---

## 🚀 Features Explained

### 1. Multi-Language Support
We support:
- **JavaScript**: Full syntax checking + linting for `console.log`.
- **Python**: checks for indentation errors, missing colons, invalid syntax.
- **Java**: Compiles your code in a sandbox to ensure class correctness.
- **C++**: Uses Clang to verify syntax headers and logic.
- **HTML/CSS/JSON**: Standard validators included.

### 2. Intelligent Scoring
Your code starts at **100 points**.
- **Critical Errors**: -50 points (e.g., missing bracket, invalid keyword).
- **Warnings**: -5 points (e.g., `TODO` comments, empty CSS blocks).
- **Goal**: Keep your score above 90 for green status!

### 3. Smart Explanations
Compiler errors are often cryptic (e.g., `Unexpected token }).`).
SyntaxSensei translates this to:
> *"You likely closed a block that wasn't open, or forgot a matching '{'. Check your previous lines."*

### 4. Export Reports
Need to share your results? Click **Download Report 📥** in the output panel to save a `.json` file containing your code, errors, score, and timestamp.

---

## ❓ Troubleshooting

### "Validation checks fail immediately"
- **Cause**: Backend server might not be running.
- **Fix**: Ensure the server is listening on port 3000. If using Docker, check `docker-compose logs server`.

### "Java/C++ validation always returns error"
- **Cause**: Missing system compilers (javac/clang) if running locally.
- **Fix**: Install the missing tools or switch to Docker, which has them pre-installed.

### "Auto-Detect guessed wrong"
- **Cause**: Short snippets can be ambiguous (e.g., `print(x)` could be Python or Swift).
- **Fix**: Manually select the correct language from the dropdown.

---
*Generated for SyntaxSensei v1.0*
