# Investment Tracker - Next.js Backend Implementation Plan

## Overview
Convert the existing frontend-only investment tracker to use Next.js App Router API routes with Prisma ORM for data persistence. The current calculation logic will be integrated with the backend.

## Current Project Analysis
- ✅ Frontend components are complete
- ✅ TypeScript types defined in `types/index.ts`
- ✅ Calculation utilities in `utils/calculations.ts`
- ❌ No database layer
- ❌ No API routes
- ❌ No data persistence

## Implementation Tasks

### 1. Database Setup with Prisma
- Set up Prisma schema with PostgreSQL/SQLite
- Create migrations
- Configure database client

### 2. Update Types and Validations
- Align existing types with Prisma schema
- Add Zod validation schemas
- Update calculation utilities

### 3. Create Service Layer
- Transaction service with business logic
- Portfolio calculation service
- P&L calculation service

### 4. API Routes (App Router)
- `/api/transactions` - CRUD operations
- `/api/portfolio` - Portfolio data and holdings
- `/api/reports` - P&L reports (monthly, yearly, script-wise)

### 5. Database Models
```
Transaction:
- id, date, type, symbol, quantity, rate
- commission, sst, cdc, totalCharges, netAmount

PortfolioHolding:
- symbol, quantity, avgCost, totalInvested, totalRealizedPnl

RealizedPnL:
- sellTransactionId, symbol, sellDate, quantitySold
- sellRate, avgBuyRate, profitLoss, profitLossPercentage
```

### 6. Business Logic Requirements
- Automatic charge calculations based on PSX rules
- Portfolio state updates on each transaction
- Average cost calculation for BUY transactions
- Realized P&L calculation for SELL transactions
- Validation: Cannot sell more than available quantity

### 7. Integration with Frontend
- Update existing API utility functions
- Maintain compatibility with current component props
- Use React Query for data fetching

## Timeline (1 Hour)
1. **0-15 min**: Database setup, Prisma schema, dependencies
2. **15-30 min**: Service layer and business logic
3. **30-45 min**: API routes implementation
4. **45-60 min**: Testing and frontend integration

## Key Business Rules (from existing calculations.ts)
- Commission: 0.15% of gross value (minimum PKR 20)
- SST: 16% on commission
- CDC: 0.02% of gross value
- Average cost updates only on BUY transactions
- Realized P&L calculated on SELL transactions

## Success Criteria
- All existing frontend functionality works with persistent data
- Accurate calculations match current logic
- Portfolio state correctly maintained
- CRUD operations for transactions
- Reports generation for P&L analysis
