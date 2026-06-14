// src/api/bonds.api.ts

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// --- Existing Fetch (Fixed) ---
// src/api/bonds.api.ts

export const fetchBondsFromAPI = async () => {
  try {
    // 🎯 CHANGE THIS LINE: point to /bond/holdings instead of /bond
    const response = await fetch(`${BASE_URL}/bond/holdings?_t=${Date.now()}`, {
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

        let uiType = "Corporate";
        const rawType = (dbBond.bond_type || '').toLowerCase();
        if (rawType === 'government' || rawType === 'gsec') uiType = "Govt";
        else if (rawType === 'tax_free') uiType = "Tax Free";
        else if (rawType === 'sdl') uiType = "SDL";
        else if (rawType === 't_bill') uiType = "T-Bill";

        return {
          // The ID of the global asset definition
          bond_id: dbBond.bond_id || dbBond.master_bond_id || dbBond.id, 
          
          // 🎯 THE KEY TRANSLATION:
          // Now that you are hitting 'getAllHoldings', the backend payload 
          // will contain the user's specific record identifier.
          holding_id: dbBond.holding_id || dbBond.id, 

          isin: dbBond.isin || "N/A",
          bond_name: dbBond.bond_name,
          issuer: dbBond.issuer_name || "N/A",
          bond_type: uiType,
          rating: dbBond.credit_rating || "SOV",
          status: dbBond.status || "Active",
          coupon_rate: realCoupon,
          invested_amount: actualInvested, 
          current_value: actualInvested,   
          quantity: actualQuantity,
          ytm: realCoupon || 7.00,                
          maturity_date: dbBond.maturity_date 
            ? new Date(dbBond.maturity_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : "N/A"
        };
      });
    }
    return [];
  } catch (error) {
    console.error("Frontend fetch parsing error:", error);
    return [];
  }
};
// --- Modular Edit & Delete API methods ---

export const updateBondAPI = async (id: string, data: any) => {
  // Now securely receives holding_id
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
  // Now securely receives holding_id
  const response = await fetch(`${BASE_URL}/bond/holdings/${id}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Failed to delete bond');
  return result;
};