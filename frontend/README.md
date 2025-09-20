# PSX Investment Tracker - Frontend

A modern React/Next.js application for tracking Pakistan Stock Exchange (PSX) investments with real-time P&L calculations.

## 🚀 Features

- **Transaction Management**: Add, edit, and delete buy/sell transactions
- **Portfolio Tracking**: View current holdings and investment summary
- **Real-time Calculations**: Automatic PSX charge calculations (Commission, SST, CDC)
- **P&L Analysis**: Realized and unrealized profit/loss tracking
- **Reports**: Monthly, yearly, and script-wise performance reports
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts (ready for implementation)
- **Date Handling**: date-fns
- **Data Fetching**: React Query (configured)

## 🏗️ Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── transactions/      # Transaction management
│   ├── add-transaction/   # Add new transaction
│   ├── portfolio/         # Portfolio view
│   └── reports/          # Reports section
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── forms/            # Form components
│   ├── tables/           # Table components
│   ├── cards/            # Card components
│   └── dashboard/        # Dashboard-specific components
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
│   ├── calculations.ts   # PSX calculation logic
│   ├── validation.ts     # Form validation
│   └── api.ts           # API integration
└── types/                # TypeScript type definitions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 8080

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment** (optional):
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your backend API URL
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Open browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Key Features

### PSX-Specific Calculations

The application implements Pakistan Stock Exchange charge structure:

- **Commission**: 0.15% of gross value (minimum PKR 20)
- **SST**: 16% on commission amount
- **CDC**: 0.02% of gross value

### Form Validation

- PSX symbol format validation (3-6 alphanumeric characters)
- No future dates allowed
- Quantity must be positive integers
- Rate allows up to 4 decimal places
- Sell transactions validate against available shares

### Real-time Preview

Transaction forms show live calculation preview including:
- Gross transaction value
- Detailed charge breakdown
- Net amount (buy = total cost, sell = amount received)

## 🔌 API Integration

The frontend is designed to integrate with a Spring Boot backend. Key endpoints:

### Transactions
- `GET /api/transactions` - List all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction

### Portfolio
- `GET /api/portfolio/holdings` - Current holdings
- `GET /api/portfolio/summary` - Portfolio summary
- `GET /api/portfolio/available-shares` - Available shares for selling

### Reports
- `GET /api/reports/monthly/{year}` - Monthly P&L
- `GET /api/reports/yearly` - Yearly P&L
- `GET /api/reports/realized-pnl` - Realized P&L details

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Responsive tables with horizontal scroll
- Collapsible navigation for mobile

### Visual Indicators
- Green/red color coding for profit/loss
- Transaction type icons (buy/sell arrows)
- Loading states and error handling

### User Experience
- Form auto-completion and validation
- Real-time calculation preview
- Quick action buttons
- Intuitive navigation

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for consistent styling
- Functional components with hooks

## 📊 Mock Data

The application includes mock data for development:
- Sample transactions (TRG, OGDC, LUCK, UBL)
- Portfolio holdings with P&L calculations
- Monthly/yearly performance data

## 🔮 Future Enhancements

- Real-time PSX price integration
- Advanced charting and analytics
- PDF report generation
- Email notifications
- Tax calculation assistance
- Portfolio comparison tools

## 🤝 Integration with Backend

When the Spring Boot backend is ready:

1. Update `NEXT_PUBLIC_API_BASE` in environment variables
2. The API utility functions are ready to use
3. Replace mock data with real API calls
4. Add error handling for network issues

## 📝 License

This project is part of the PSX Investment Tracker system.

---

**Built for Pakistan Stock Exchange investors** 🇵🇰