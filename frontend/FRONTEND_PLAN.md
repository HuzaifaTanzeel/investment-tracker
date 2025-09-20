# 📈 PSX Investment Tracker - Frontend MVP Plan

> **Target Completion:** 1 Hour MVP  
> **Tech Stack:** React + TypeScript + Tailwind CSS  
> **Backend:** Spring Boot (parallel development)  
> **Market:** Pakistan Stock Exchange (PSX)

---

## 🎯 MVP Scope & Priorities

### Phase 1 (0-20 mins): Core Setup
- [x] Project setup with Vite + React + TypeScript
- [x] Tailwind CSS configuration
- [x] Basic routing structure
- [x] Layout components

### Phase 2 (20-40 mins): Essential Features
- [ ] Transaction management (Add/View)
- [ ] Basic portfolio view
- [ ] Core calculations

### Phase 3 (40-60 mins): Polish & Integration
- [ ] API integration
- [ ] Basic reports
- [ ] Error handling & validation

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── forms/
│   │   ├── TransactionForm.tsx
│   │   └── CalculationPreview.tsx
│   ├── tables/
│   │   ├── TransactionTable.tsx
│   │   ├── CurrentHoldingsTable.tsx
│   │   └── RealizedPnLTable.tsx
│   ├── cards/
│   │   ├── InvestmentSummary.tsx
│   │   ├── MonthlyPnLCard.tsx
│   │   └── ScriptInvestmentCard.tsx
│   └── charts/
│       └── MonthlyPnLChart.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── Transactions.tsx
│   ├── AddTransaction.tsx
│   ├── Portfolio.tsx
│   ├── Reports.tsx
│   ├── MonthlyReports.tsx
│   ├── YearlyReports.tsx
│   └── Settings.tsx
├── hooks/
│   ├── useTransactions.ts
│   ├── usePortfolio.ts
│   └── useReports.ts
├── utils/
│   ├── calculations.ts
│   ├── validation.ts
│   └── api.ts
└── types/
    └── index.ts
```

---

## 🚀 Phase-by-Phase Implementation

### **Phase 1: Foundation (0-20 mins)**

#### 1.1 Project Setup
```bash
npm create vite@latest psx-tracker -- --template react-ts
cd psx-tracker
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom react-query lucide-react
npm install recharts date-fns
```

#### 1.2 Core Types
```typescript
// types/index.ts
export interface Transaction {
  id: string;
  date: string;
  type: 'BUY' | 'SELL';
  symbol: string;
  quantity: number;
  rate: number;
  commission: number;
  sst: number;
  cdc: number;
  totalCharges: number;
  netAmount: number;
}

export interface Holding {
  symbol: string;
  quantity: number;
  avgCost: number;
  totalInvested: number;
  currentValue?: number;
}

export interface PnLSummary {
  totalInvested: number;
  totalRecovered: number;
  realizedPnL: number;
  currentMonthPnL: number;
}
```

#### 1.3 Basic Routing
```typescript
// App.tsx - Basic router setup
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
// ... other imports
```

### **Phase 2: Core Features (20-40 mins)**

#### 2.1 Transaction Form (Priority 1)
**File:** `components/forms/TransactionForm.tsx`
- PSX-specific validation rules
- Real-time charge calculation (Commission: 0.15%, SST: 16%, CDC: 0.02%)
- Buy/Sell toggle with different validation
- Auto-complete for PSX symbols

**Key Features:**
```typescript
const PSX_CHARGES = {
  COMMISSION_RATE: 0.0015, // 0.15%
  SST_RATE: 0.16,         // 16% on commission
  CDC_RATE: 0.0002        // 0.02%
};
```

#### 2.2 Transaction Table (Priority 2)
**File:** `components/tables/TransactionTable.tsx`
- Sortable by date, symbol, type, amount
- Filter by date range, symbol, transaction type
- Inline edit/delete actions
- Mobile-responsive design

#### 2.3 Portfolio Holdings (Priority 3)
**File:** `components/tables/CurrentHoldingsTable.tsx`
- Available shares per symbol
- Average cost calculation
- Total invested amount
- P/L indicators (colors: green/red)

### **Phase 3: Integration & Polish (40-60 mins)**

#### 3.1 API Integration
**File:** `utils/api.ts`
```typescript
const API_BASE = 'http://localhost:8080/api';

export const api = {
  transactions: {
    getAll: () => fetch(`${API_BASE}/transactions`),
    create: (data: Transaction) => fetch(`${API_BASE}/transactions`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    // ... CRUD operations
  },
  portfolio: {
    getHoldings: () => fetch(`${API_BASE}/portfolio/holdings`),
    getSummary: () => fetch(`${API_BASE}/portfolio/summary`),
  }
};
```

#### 3.2 Dashboard Assembly
**File:** `pages/Dashboard.tsx`
- Investment summary cards
- Recent transactions (last 5)
- Current month P/L
- Quick action buttons

#### 3.3 Reports Basic Implementation
**File:** `pages/MonthlyReports.tsx`
- Month selector
- P/L summary table
- Basic chart (if time permits)

---

## 🎨 UI/UX Guidelines

### Color Scheme (PSX Theme)
```css
:root {
  --psx-green: #10b981;    /* Profit */
  --psx-red: #ef4444;      /* Loss */
  --psx-blue: #3b82f6;     /* Primary */
  --psx-gray: #6b7280;     /* Secondary */
}
```

### Typography
- Headers: `font-bold text-2xl`
- Subheaders: `font-semibold text-lg`
- Body: `text-base`
- Numbers: `font-mono` (for amounts and calculations)

### Component Standards
- All monetary values formatted with PKR currency
- Dates in DD/MM/YYYY format
- Loading states with skeleton placeholders
- Error boundaries for critical components

---

## 📋 Validation Rules

### Transaction Form Validation
```typescript
const validationRules = {
  date: {
    required: true,
    maxDate: new Date(), // No future dates
  },
  symbol: {
    required: true,
    pattern: /^[A-Z0-9]{3,6}$/, // PSX symbol format
  },
  quantity: {
    required: true,
    min: 1,
    integer: true,
  },
  rate: {
    required: true,
    min: 0.01,
    maxDecimals: 4,
  },
  sellValidation: {
    // Prevent selling more than available
    maxQuantity: availableShares,
  }
};
```

---

## 🔧 Development Workflow

### 1. Component Development Order
1. **Layout components** (Header, Sidebar, Layout)
2. **TransactionForm** with validation
3. **TransactionTable** with basic CRUD
4. **Dashboard** assembly
5. **Portfolio** view
6. **Basic Reports**

### 2. Testing Strategy (If Time Permits)
```bash
# Quick component tests
npm install -D vitest @testing-library/react
```

### 3. Mock Data Setup
Create `utils/mockData.ts` for development before backend integration:
```typescript
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-01-15',
    type: 'BUY',
    symbol: 'TRG',
    quantity: 100,
    rate: 45.50,
    // ... calculated charges
  },
  // ... more mock data
];
```

---

## ⚡ Quick Win Features

### Must-Have (MVP Core)
- ✅ Add transactions (BUY/SELL)
- ✅ View transaction history
- ✅ Current holdings summary
- ✅ Basic P/L calculation

### Nice-to-Have (If Time Allows)
- 📊 Monthly P/L chart
- 🔍 Advanced filtering
- 📱 Mobile optimization
- ⚡ Real-time calculations

### Future Enhancements (Post-MVP)
- 📈 Real-time PSX prices
- 📊 Advanced analytics
- 📄 PDF report generation
- 🔔 Profit/loss alerts

---

## 🚨 Time Management

### 0-20 mins: Foundation
- Project setup: 5 mins
- Types & routing: 10 mins
- Layout components: 5 mins

### 20-40 mins: Core Features
- TransactionForm: 15 mins
- TransactionTable: 5 mins

### 40-60 mins: Integration
- API setup: 10 mins
- Dashboard: 5 mins
- Bug fixes & polish: 5 mins

---

## 📦 Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Form validations working
- [ ] Responsive design verified
- [ ] Error handling implemented

### Deployment Commands
```bash
npm run build
npm run preview  # Test production build
```

---

## 🔗 Backend Integration Points

### API Endpoints (Spring Boot)
- `GET /api/transactions` - Fetch all transactions
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/portfolio/holdings` - Current holdings
- `GET /api/portfolio/summary` - Investment summary
- `GET /api/reports/monthly/{year}/{month}` - Monthly P/L
- `GET /api/reports/yearly/{year}` - Yearly P/L

### Error Handling
- Network errors with retry mechanism
- Validation errors from backend
- Loading states during API calls

---

**🎯 Success Criteria:**
- User can add buy/sell transactions
- Portfolio holdings are calculated correctly
- Basic reports show P/L data
- Responsive UI works on mobile
- Integration with Spring Boot backend complete

**⏰ Remember:** This is an MVP - focus on core functionality first, polish later!
