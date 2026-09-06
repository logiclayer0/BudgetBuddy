# 💰 BudgetBuddy - Personal Budget Tracker with UPI Insights

A professional web application that helps you track UPI transactions, detect wasteful spending, and secure your financial data on the Sui blockchain.

---

## 📸 Screenshots

### Landing Page (Logged In)
![Landing Page](screenshots/Screenshot%202026-09-06%20124853.png)


### Dashboard
![Dashboard](screenshots/Screenshot%202026-09-06%20124940.png)

### Add Transaction
![Add Transaction](screenshots/Screenshot%202026-09-06%20123705.png)

### Budget Setup
![Budget Setup](screenshots/Screenshot%202026-09-06%20124919.png)

### Insights & AI Coach
![Insights](screenshots/Screenshot%202026-09-06%20124924.png)

### Transaction History
![Transaction History](screenshots/Screenshot%202026-09-06%20124931.png)

---

## 🚀 Features

- 📊 Track UPI transactions manually or via CSV import
- 🔍 AI-powered waste detection and spending insights
- ⛓️ Blockchain-secured immutable transaction records on Sui Network
- 📈 Visual spending analytics with interactive charts
- 💰 Budget management with real-time progress alerts
- 🔐 JWT-based authentication

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
| :--- | :--- |
| React.js + Vite | UI framework & build tool |
| Tailwind CSS | Styling & responsive design |
| Recharts | Data visualizations |
| React Router | Navigation |
| React Hot Toast | User notifications |

### Backend
| Technology | Purpose |
| :--- | :--- |
| Node.js + Express | REST API server |
| SQLite | Lightweight database |
| JWT | Authentication |
| Multer | CSV file upload |
| Sui CLI | Blockchain interaction |

### Blockchain
| Technology | Purpose |
| :--- | :--- |
| Sui Network (Testnet) | Decentralized ledger |
| Move Language | Smart contracts |

---

## 📁 Project Structure

```
BudgetBuddy/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── database.js # PostgreSQL connection
│ │ ├── contracts/
│ │ │ └── budget_tracker.move # Sui Move smart contract
│ │ ├── controllers/
│ │ │ ├── authController.js # Register/Login
│ │ │ ├── budgt.cntrlr.js # Budget operations
│ │ │ ├── insightController.js # AI insights
│ │ │ └── transactionController.js # Transaction CRUD
│ │ ├── middleware/
│ │ │ └── auth.js # JWT verification
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ ├── Transaction.js
│ │ │ └── Budget.js
│ │ ├── routes/
│ │ │ ├── authRoutes.js
│ │ │ ├── budgetRoutes.js
│ │ │ ├── insightRoutes.js
│ │ │ └── transactionRoutes.js
│ │ ├── services/
│ │ │ ├── aiservice.js # Gemini AI integration
│ │ │ ├── blockchainService.js # Sui blockchain operations
│ │ │ ├── csvParser.js # CSV file parsing
│ │ │ ├── notificationService.js # Alerts & reports
│ │ │ ├── suiService.js # Sui CLI wrapper
│ │ │ └── wasteDetector.js # Waste detection logic
│ │ ├── utils/
│ │ │ ├── constants.js # App constants
│ │ │ ├── helpers.js # Utility functions
│ │ │ └── validators.js # Input validation
│ │ └── app.js # Express server
│ ├── .env # Environment variables
│ ├── hardhat.config.js
│ ├── Move.toml
│ └── package.json
│
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── AddTransaction.jsx
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Insights.jsx
│ │ │ ├── Layout.jsx
│ │ │ ├── Setup.jsx
│ │ │ ├── TransactionHistory.jsx
│ │ │ └── WalletConnect.jsx
│ │ ├── hooks/
│ │ │ └── useWallet.js
│ │ ├── pages/
│ │ │ ├── Home.jsx
│ │ │ ├── Login.jsx
│ │ │ └── Register.jsx
│ │ ├── styles/
│ │ │ └── index.css
│ │ ├── utils/
│ │ │ ├── api.js
│ │ │ └── constants.js
│ │ ├── App.jsx
│ │ ├── index.css
│ │ └── main.jsx
│ ├── package.json
│ ├── postcss.config.js
│ ├── tailwind.config.js
│ └── vite.config.js
│
└── README.md

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Sui CLI
- MetaMask (for blockchain features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/budgetbuddy.git
cd budgetbuddy
```
## Setup Backend
```
cd backend
npm install
cp .env.example .env
# Update .env with your credentials
npm run dev
```
## Setup Frontend
```
cd frontend
npm install
npm run dev
```
## Setup Database
```
# Create PostgreSQL database
createdb budgetbuddy

# Run SQL schema (see database section)
```
## Deploy Smart Contract
```
cd backend
sui client publish --gas-budget 10000000
# Copy Package ID and update .env
```
## Environment Variables
```

JWT_SECRET=your_secret_key


```

## 🔧 Database Schema
```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    payee VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    upi_id VARCHAR(100),
    is_waste BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    limit_amount DECIMAL(10,2) NOT NULL,
    spent DECIMAL(10,2) DEFAULT 0,
    UNIQUE(user_id, category)
);


```
## 📱 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Transaction Routes (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/transactions` | Add transaction |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions/import` | Import CSV |
| GET | `/api/transactions/categories` | Get category breakdown |

### Budget Routes (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/budgets` | Set budget |
| GET | `/api/budgets` | Get all budgets |

### Insight Routes (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/insights` | Get spending insights |
## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

