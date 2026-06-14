import * as express from 'express';

declare global {
  // 1. Relaxes object parameter destructuring mapping globally (Fixes the "does not exist on type {}" errors)
  interface Object {
    [key: string]: any;
  }

  // 2. Map Express Controller Parameters
  type AuthRequest = express.Request & { user?: any; [key: string]: any };
  type Response = express.Response;
  type NextFunction = express.NextFunction;

  // 3. Fallbacks for global system tools & variables
  var db: any;
  type Logger = any;
  type ChildProcess = any;
  type ScheduledJob = any;

  // Add this block to allow dynamic properties on empty object fallbacks
  interface Object {
    search?: any;
    bond_type?: any;
    from?: any;
    to?: any;
    broker_account_id?: any;
    status?: any;
    order_source?: any;
    symbol?: any;
    exchange?: any;
    instrument_type?: any;
    segment?: any;
    category?: any;
    fund_house?: any;
    plan_type?: any;
    limit?: any;
  }
}

// 4. Overrides the built-in Object constructor to safely allow passing dynamic options objects
declare global {
  interface ObjectConstructor {
    assign(target: any, ...sources: any[]): any;
  }
}

export {};
// import * as express from 'express';

// declare global {
//   // 1. Relaxes object parameter destructuring mapping globally
//   interface Object {
//     [key: string]: any;
//   }

//   // 2. Map Express Controller Parameters
//   type AuthRequest = express.Request & { user?: any; [key: string]: any };
//   type Response = express.Response;
//   type NextFunction = express.NextFunction;

//   // 3. Fallbacks for global system tools & variables
//   var db: any;
//   type Logger = any;
//   type ChildProcess = any;
//   type ScheduledJob = any;
// }

// export {};