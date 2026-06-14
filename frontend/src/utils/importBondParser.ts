import * as XLSX from "xlsx";
import * as pdfjsLib from "pdfjs-dist";
import { RawBond } from "../pages/bonds/_data/bonds.data";

// Set worker for pdfjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * Utility to parse bond documents (CSV, XLSX, PDF)
 */

export const parseCSV = async (file: File): Promise<RawBond[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const workbook = XLSX.read(text, { type: "string" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json(worksheet) as RawBond[];
        resolve(data);
      } catch (err) {
        reject(new Error("Could not extract bond data. Please check the file format."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};

export const parseXLSX = async (file: File): Promise<RawBond[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as RawBond[];
        resolve(jsonData);
      } catch (err) {
        reject(new Error("Could not extract bond data. Please check the file format."));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
};

interface TextItem {
  str: string;
}

export const parsePDF = async (file: File): Promise<RawBond[]> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => (item as TextItem).str).join(" ");
      fullText += pageText + "\n";
    }

    // Attempt to extract fields via regex
    const bondNameMatch = fullText.match(/Bond Name:?\s*(.*)/i);
    const isinMatch = fullText.match(/ISIN:?\s*([A-Z0-9]{12})/i);
    const issuerMatch = fullText.match(/Issuer:?\s*(.*)/i);
    const maturityDateMatch = fullText.match(/Maturity Date:?\s*(\d{4}-\d{2}-\d{2})/i);
    const couponRateMatch = fullText.match(/Coupon Rate:?\s*(\d+(\.\d+)?)/i);
    const quantityMatch = fullText.match(/Quantity:?\s*(\d+)/i);
    const priceMatch = fullText.match(/Price:?\s*(\d+(\.\d+)?)/i);

    if (!bondNameMatch && !isinMatch) {
      throw new Error("Could not find bond information in the PDF.");
    }

    const qty = parseInt(quantityMatch?.[1] || "1", 10);
    const price = parseFloat(priceMatch?.[1] || "1000");

    return [
      {
        bond_id: "imported_" + Date.now(),
        bond_name: bondNameMatch?.[1]?.trim() || "Imported Bond",
        isin: isinMatch?.[1]?.trim() || "UNKNOWN",
        issuer: issuerMatch?.[1]?.trim() || "Unknown Issuer",
        maturity_date: maturityDateMatch?.[1]?.trim() || new Date().toISOString().split("T")[0],
        coupon_rate: parseFloat(couponRateMatch?.[1] || "0"),
        quantity: qty,
        current_price: price,
        invested_amount: qty * price,
      } as unknown as RawBond,
    ];
  } catch (err) {
    throw new Error("Could not extract bond data. Please check the file format.");
  }
};
