// App.jsx
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import Papa from "papaparse";
import CompanyList from "./CompanyList";
import StockChart from "./StockChart";

export default function App() {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/dump.csv");
        const csv = await response.text();

        Papa.parse(csv, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (result) => {
            const dataMap = {};
            const companyNames = [];

            result.data.forEach((company) => {
              // Clean and transform data
              const cleanedData = Object.fromEntries(
                Object.entries(company).map(([key, value]) => {
                  // Handle NaN values and empty strings
                  if (value === "NaN" || value === "") return [key, null];
                  if (typeof value === "string" && !isNaN(value)) {
                    return [key, parseFloat(value)];
                  }
                  return [key, value];
                })
              );

              const companyName = cleanedData.index_name;
              if (companyName && !dataMap[companyName]) {
                dataMap[companyName] = cleanedData;
                companyNames.push(companyName);
              }
            });

            setCompanyData(dataMap);
            setCompanies(companyNames);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentCompanyData =
    companyData && selectedCompany ? companyData[selectedCompany] : null;

  return (
    // <div className="bg-red-60">Hello</div>
    <div className="min-h-screen bg-gray-100">
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 hover:text-gray-800"
        >
          <FiMenu size={24} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div
          className={`w-full md:w-64 bg-white shadow-lg md:shadow-none fixed md:relative h-screen md:h-full transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
        >
          <CompanyList
            companies={companies}
            selectedCompany={selectedCompany}
            onSelectCompany={setSelectedCompany}
            closeMenu={() => setIsMenuOpen(false)}
            loading={loading}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8">
          {loading ? (
            <div className="text-center text-gray-500 mt-20">
              Loading data...
            </div>
          ) : currentCompanyData ? (
            <div>
              <h1 className="text-2xl font-bold mb-4 text-gray-800">
                {selectedCompany}
              </h1>
              <StockChart data={currentCompanyData} />

              <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Detailed Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <MetricItem
                    label="Date"
                    value={currentCompanyData.index_date}
                  />
                  <MetricItem
                    label="Points Change"
                    value={currentCompanyData.points_change}
                  />
                  <MetricItem
                    label="Change %"
                    value={currentCompanyData.change_percent}
                  />
                  <MetricItem
                    label="PE Ratio"
                    value={currentCompanyData.pe_ratio}
                  />
                  <MetricItem
                    label="PB Ratio"
                    value={currentCompanyData.pb_ratio}
                  />
                  <MetricItem
                    label="Div Yield"
                    value={currentCompanyData.div_yield}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-20">
              {companies.length > 0
                ? "Select a company from the list to view details"
                : "No company data available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const MetricItem = ({ label, value }) => {
  const displayValue =
    value === null || value === undefined || Number.isNaN(value)
      ? "N/A"
      : typeof value === "number"
      ? value.toLocaleString()
      : value;

  return (
    <div className="bg-gray-50 p-3 rounded">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium text-gray-800">{displayValue}</div>
    </div>
  );
};
