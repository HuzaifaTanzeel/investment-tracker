CREATE TABLE "portfolio_holdings" (
	"id" serial PRIMARY KEY NOT NULL,
	"symbol" text NOT NULL,
	"available_quantity" integer DEFAULT 0 NOT NULL,
	"avg_cost_per_share" real DEFAULT 0 NOT NULL,
	"total_invested_amount" real DEFAULT 0 NOT NULL,
	"total_shares_bought" integer DEFAULT 0 NOT NULL,
	"total_shares_sold" integer DEFAULT 0 NOT NULL,
	"total_realized_pnl" real DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "portfolio_holdings_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
CREATE TABLE "realized_pnl" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_id" integer NOT NULL,
	"symbol" text NOT NULL,
	"sell_date" timestamp NOT NULL,
	"quantity_sold" integer NOT NULL,
	"sell_rate" real NOT NULL,
	"avg_cost_basis" real NOT NULL,
	"gross_proceeds" real NOT NULL,
	"net_proceeds" real NOT NULL,
	"cost_basis" real NOT NULL,
	"realized_pnl" real NOT NULL,
	"pnl_percentage" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"transaction_date" timestamp NOT NULL,
	"symbol" text NOT NULL,
	"activity" text NOT NULL,
	"quantity" integer NOT NULL,
	"rate" real NOT NULL,
	"amount" real NOT NULL,
	"commission" real NOT NULL,
	"sst" real NOT NULL,
	"cdc" real NOT NULL,
	"total_charges" real NOT NULL,
	"net_amount" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "realized_pnl" ADD CONSTRAINT "realized_pnl_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE cascade ON UPDATE no action;