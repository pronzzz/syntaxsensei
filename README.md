# SyntaxSensei 🥋
> **The Intelligent, Multi-Language Code Validator**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blueviolet)
![React](https://img.shields.io/badge/React-18-blue)
![Node](https://img.shields.io/badge/Node-18-green)

SyntaxSensei is a modern web application that goes beyond simple syntax checking. It provides **context-aware explanations**, **smart fix suggestions**, and a **code health score** to help developers and learners improve their code quality in real-time.

[**📖 Read the User Guide**](./USER_GUIDE.md) | [**🐞 Report Bug**](https://github.com/pronzzz/syntaxsensei/issues)

---

## ✨ Key Features

### 🧠 Intelligent Feedback
Instead of cryptic compiler errors like `Error: Unexpected token`, SyntaxSensei tells you:
> *"You forgot to close the function block. Add a '}' at line 14."*

### 🌐 Multi-Language Support
| Language | Engine | Capabilities |
|----------|--------|--------------|
| **JavaScript** | Acorn | Syntax + Linting (console.log, debugger) |
| **Python** | Native AST | Indentation, Syntax, `print` calls |
| **Java** | Javac | Full compilation check (Class structure) |
| **C++** | Clang | Header/Macro syntax verification |
| **Web** | HTML/CSS | Nesting, Empty rulesets, Property validation |
| **JSON** | Native | Strict syntax enforcement |

### 📊 Syntax Score
Gamify your code quality!
- **100/100**: Perfect syntax.
- **Warnings**: Deducts 5 points (e.g., TODO comments).
- **Errors**: Deducts 50 points (Breaking bugs).

---

## ⚡ Quick Start

### Docker (Recommended)
The easiest way to run SyntaxSensei with all compilers pre-configured.

```bash
# 1. Clone the repo
git clone https://github.com/pronzzz/syntaxsensei.git
cd syntaxsensei

# 2. Start services
docker-compose up --build
```
- Open **http://localhost:8080** to use the app.

### Local Development
If you want to contribute or run without Docker.

**Requirements**: Node.js 18+, Python 3, JDK 17, Clang.

```bash
# Backend
cd server
npm install
npm start

# Frontend (New Terminal)
cd client
npm install
npm run dev
```

---

## 🏗️ Project Structure

```bash
syntaxsensei/
├── client/                 # React Frontend (Vite)
│   ├── src/components/     # UI Components (Editor, OutputPanel)
│   └── src/lib/            # Utilities
├── server/                 # Node.js Express Backend
│   ├── src/controllers/    # Request handlers
│   ├── src/validators/     # Language-specific logic (Java, C++, JS...)
│   ├── src/services/       # Linter & Explanation services
│   └── Dockerfile          # Backend container config
├── docker-compose.yml      # Orchestration
├── USER_GUIDE.md           # Detailed usage instructions
└── README.md               # You are here
```

## 🤝 Contributing
Contributions are welcome! Please view our [License](./LICENSE) file for more information.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ by [Pranav Dwivedi](https://github.com/pronzzz)*
