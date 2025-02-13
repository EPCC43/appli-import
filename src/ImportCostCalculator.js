import React, { useState, useEffect } from "react";

export default function ImportCostCalculator() {
  const [yenPrice, setYenPrice] = useState(0);
  const [yenTransport, setYenTransport] = useState(0);
  const [yenCommission, setYenCommission] = useState(0);
  const [homologationFee, setHomologationFee] = useState(0);
  const [margin, setMargin] = useState(75);
  const [exchangeRate, setExchangeRate] = useState(147.0);
  const [importType, setImportType] = useState("classic");
  const [totalCost, setTotalCost] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [importTax, setImportTax] = useState(0);
  const [vat, setVAT] = useState(0);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/EUR")
      .then((res) => res.json())
      .then((data) => {
        setExchangeRate(data.rates.JPY || 147.0);
      })
      .catch(() => setExchangeRate(147.0));
  }, []);

  useEffect(() => {
    const priceEur = yenPrice / exchangeRate;
    const transportEur = yenTransport / exchangeRate;
    const commissionEur = yenCommission / exchangeRate;
    const totalBeforeTax = priceEur + transportEur + commissionEur + homologationFee;
    
    const taxRate = importType === "classic" ? 0.10 : 0; // 10% pour import classique, 0% pour collection
    const vatRate = importType === "classic" ? 0.20 : 0.055; // 20% pour classique, 5.5% pour collection
    
    const taxAmount = totalBeforeTax * taxRate;
    const vatAmount = (totalBeforeTax + taxAmount) * vatRate;
    const total = totalBeforeTax + taxAmount + vatAmount;
    const selling = total * (1 + margin / 100);

    setImportTax(taxAmount.toFixed(2));
    setVAT(vatAmount.toFixed(2));
    setTotalCost(total.toFixed(2));
    setSellingPrice(selling.toFixed(2));
  }, [yenPrice, yenTransport, yenCommission, homologationFee, margin, exchangeRate, importType]);

  return (
    <div className="p-4 max-w-sm mx-auto bg-gray-200 shadow-lg rounded-lg">
      <img src="https://i.imgur.com/1mfo1A1.jpeg" alt="EPCC Logo" className="mx-auto mb-4 w-48" />
      <h2 className="text-xl font-bold mb-4">Calculateur de Coût d'Importation</h2>
      <label className="block">Type d'Importation</label>
      <select
        value={importType}
        onChange={(e) => setImportType(e.target.value)}
        className="border p-2 w-full mb-2 bg-white"
      >
        <option value="classic">Import Classique (TVA 20%, Douane 10%)</option>
        <option value="collection">Import Collection (TVA 5.5%)</option>
      </select>
      <label className="block">Prix d'Achat (JPY)</label>
      <input type="number" value={yenPrice} onChange={(e) => setYenPrice(Number(e.target.value))} className="border p-2 w-full mb-2 bg-white" />
      <label className="block">Frais de Transport (JPY)</label>
      <input type="number" value={yenTransport} onChange={(e) => setYenTransport(Number(e.target.value))} className="border p-2 w-full mb-2 bg-white" />
      <label className="block">Commissions (JPY)</label>
      <input type="number" value={yenCommission} onChange={(e) => setYenCommission(Number(e.target.value))} className="border p-2 w-full mb-2 bg-white" />
      <label className="block">Frais Homologation (€)</label>
      <input type="number" value={homologationFee} onChange={(e) => setHomologationFee(Number(e.target.value))} className="border p-2 w-full mb-2 bg-white" />
      <label className="block">Marge (%)</label>
      <input type="number" value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="border p-2 w-full mb-2 bg-white" />
      <div className="mt-4 p-2 bg-gray-100 rounded">
        <p><strong>Taux de Change:</strong> 1 EUR = {exchangeRate.toFixed(2)} JPY</p>
        <p><strong>Taxes Douanières:</strong> {importTax} €</p>
        <p><strong>TVA:</strong> {vat} €</p>
        <p><strong>Coût Total:</strong> {totalCost} €</p>
        <p><strong>Prix de Vente Conseillé:</strong> {sellingPrice} €</p>
      </div>
    </div>
  );
}
