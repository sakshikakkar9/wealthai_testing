// src/api/bonds.api.ts

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const BOND_TYPE_MAP: Record<string, string> = {
  'government': 'Govt',
  'gsec': 'Govt',
  'sgb': 'SGB',
  'sovereign gold bond': 'SGB',
  'ncd': 'NCD',
  'non-convertible debenture': 'NCD',
  't-bill': 'T-Bill',
  't_bill': 'T-Bill',
  'treasury': 'T-Bill',
  'tax_free': 'Tax Free',
  'sdl': 'SDL',
  'default': 'Corporate'
};

export const fetchBondsFromAPI = async () => {
  try {
    // AUTH BYPASS — re-enable for production
    const response = await fetch(`${BASE_URL}/bond/all?_t=${Date.now()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    
    const result = await response.json();
    
    if (result.success && Array.isArray(result.data)) {
      return result.data.map((dbBond: any) => {
        const realCoupon = Number(dbBond.coupon_rate) || 0;
        const realFaceValue = Number(dbBond.face_value) || 1000;
        const actualInvested = Number(dbBond.invested_amount) || realFaceValue;
        const actualQuantity = Number(dbBond.quantity) || 1;

        const rawType = (dbBond.bond_type || '').toLowerCase();
        const uiType = BOND_TYPE_MAP[rawType] || BOND_TYPE_MAP['default'];

        return {
          bond_id: dbBond.bond_id || dbBond.master_bond_id || dbBond.id, 
          holding_id: dbBond.holding_id || dbBond.id, 
          isin: dbBond.isin || "N/A",
          bond_name: dbBond.bond_name,
          issuer: dbBond.issuer_name || "N/A",
          bond_type: uiType,
          rating: dbBond.credit_rating || "SOV",
          status: dbBond.status || "Active",
          coupon_rate: realCoupon,
          invested_amount: actualInvested, 
          current_value: actualQuantity * (dbBond.current_price || realFaceValue),
          quantity: actualQuantity,
          ytm: realCoupon || 7.00,                
          maturity_date: dbBond.maturity_date || "N/A"
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Frontend fetch parsing error:", error);
    return [];
  }
};

export const updateBondAPI = async (id: string, data: any) => {
  const response = await fetch(`${BASE_URL}/bond/holdings/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to update bond');
  return result;
};

export const deleteBondAPI = async (id: string) => {
  const response = await fetch(`${BASE_URL}/bond/holdings/${id}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete bond');
  return result;
};
