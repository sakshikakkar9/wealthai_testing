// ─────────────────────────────────────────────────────────────────
//  shared/types.ts
//  Shared TypeScript interfaces used across all modules
// ─────────────────────────────────────────────────────────────────

import { Request } from 'express';

// JWT payload attached to req.user by auth middleware
export interface JwtPayload {
  account_id: string;
  user_id:    string;
  role:       'user' | 'admin' | 'advisor';
}

// Extend Express Request to include typed user
export interface AuthRequest extends Request {
  user: JwtPayload;
}

// Standard API response shape
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?:   T;
}

// ── Auth ──────────────────────────────────────────────────────────
export interface Account {
  id:                 string;
  username:           string;
  email:              string;
  full_name:          string | null;
  role:               'user' | 'admin' | 'advisor';
  is_email_verified:  boolean;
  last_login_at:      Date | null;
  created_at:         Date;
}

export interface UserProfile {
  id:                string;
  account_id:        string;
  profile_name:      string;
  relationship_type: 'self' | 'spouse' | 'child' | 'parent' | 'sibling' | 'friend' | 'client' | 'other';
  full_name:         string | null;
  email:             string | null;
  mobile_number:     string | null;
  pan_number:        string | null;
  dob:               Date | null;
  is_active:         boolean;
  created_at:        Date;
}

export interface UserBroker {
  id:             string;
  user_id:        string;
  broker_name:    string;
  account_number: string;
  nickname:       string | null;
  is_primary:     boolean;
  is_active:      boolean;
  created_at:     Date;
}

export interface LoginResult {
  access_token:  string;
  refresh_token: string;
  account: {
    id:      string;
    email:   string;
    username:string;
    role:    string;
    user_id: string | null;
  };
}

// ── Bond ──────────────────────────────────────────────────────────
export interface BondHolding {
  id:                 string;
  user_id:            string;
  bond_id:            string;
  platform:           string | null;
  quantity:           number;
  avg_purchase_price: number;
  invested_amount:    number;
  maturity_amount:    number | null;
  status:             'active' | 'matured' | 'sold';
  bond_name:          string;
  bond_type:          string;
  issuer_name:        string | null;
  coupon_rate:        number | null;
  maturity_date:      Date | null;
  isin:               string | null;
}

export interface BondTransaction {
  id:              string;
  holding_id:      string;
  txn_type:        'buy' | 'sell' | 'interest_credit' | 'maturity';
  txn_date:        Date;
  quantity:        number | null;
  price:           number | null;
  total_amount:    number | null;
  accrued_interest:number;
  remarks:         string | null;
}

// ── Deposits ──────────────────────────────────────────────────────
export type DepositAccountType = 'FD' | 'RD' | 'PPF' | 'EPF' | 'SSY' | 'NPS' | 'NSC' | 'SCSS' | 'KVP';
export type DepositStatus      = 'active' | 'matured' | 'closed' | 'premature_closed';

export interface DepositHolding {
  id:               string;
  user_id:          string;
  account_type:     DepositAccountType;
  account_name:     string | null;
  institution_name: string | null;
  principal_amount: number;
  current_value:    number;
  interest_rate:    number | null;
  start_date:       Date;
  maturity_date:    Date | null;
  maturity_amount:  number | null;
  status:           DepositStatus;
  created_at:       Date;
}

// ── Mutual Fund ───────────────────────────────────────────────────
export interface MFHolding {
  id:              string;
  user_id:         string;
  scheme_id:       string;
  folio_number:    string | null;
  units:           number;
  avg_nav:         number;
  invested_amount: number;
  current_nav:     number | null;
  day_change_percent: number | null;
  scheme_name:     string;
  fund_house:      string;
  category:        string | null;
  sub_category:    string | null;
  plan_type:       'Direct' | 'Regular' | null;
}

// ── Algo ──────────────────────────────────────────────────────────
export type DeploymentMode   = 'live' | 'paper' | 'backtest';
export type DeploymentStatus = 'draft' | 'active' | 'paused' | 'stopped';

export interface Strategy {
  id:            string;
  user_id:       string;
  strategy_name: string;
  strategy_desc: string | null;
  capital:       number;
  enabled:       boolean;
  is_public:     boolean;
  version:       number;
  created_at:    Date;
  updated_at:    Date;
}

export interface Deployment {
  id:                string;
  strategy_id:       string;
  broker_id:         string;
  deployment_mode:   DeploymentMode;
  multiplier:        number;
  capital_allocated: number;
  total_pnl:         number;
  status:            DeploymentStatus;
  strategy_name:     string;
  broker_name:       string;
  latest_run_date:   Date | null;
  latest_run_pnl:    number | null;
}

// ── India Market ──────────────────────────────────────────────────
export interface EquityHolding {
  id:               string;
  user_id:          string;
  quantity:         number;
  avg_buy_price:    number;
  current_price:    number | null;
  unrealised_pnl:   number | null;
  symbol:           string;
  company_name:     string;
  exchange:         string;
  invested_amount:  number;
  current_value:    number | null;
  broker_nickname:  string | null;
}

// ── Portfolio ─────────────────────────────────────────────────────
export interface PortfolioSummary {
  deposits:                  Record<string, unknown>;
  bonds:                     Record<string, unknown>;
  mutual_funds:              Record<string, unknown>;
  equity:                    Record<string, unknown>;
  algo:                      Record<string, unknown>;
  grand_total_invested:      number;
  grand_total_current_value: number;
  grand_total_gain:          number;
  grand_gain_pct:            string;
}

export interface AllocationItem {
  asset_class:    string;
  invested:       number;
  allocation_pct: string;
}
