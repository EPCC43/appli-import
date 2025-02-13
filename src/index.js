import React from "react";
import ReactDOM from "react-dom/client"; // On importe bien ReactDOM.createRoot
import ImportCostCalculator from "./ImportCostCalculator"; // Vérifie bien le chemin et le nom du fichier

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ImportCostCalculator />
  </React.StrictMode>
);