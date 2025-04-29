import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import ChartComponent from "./ChartComponent";
import CompanyList from "./CompanyList";
import Spinner from "./Spinner";

const App = () => {
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);

  const metrics = ["price", "volume", "ratios"];
  const [metric, setMetric] = useState("price");

  useEffect(() => {
    // Fetch CSV
    async function fetchData() {
      try {
        const response = await fetch("/dump.csv"); // place dump.csv inside /public folder
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching CSV:", error);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">
          Loading data, please wait...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <div class="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <CompanyList data={data} onSelectCompany={setSelectedCompany} />
      </div>
      <div class="absolute top-4 right-4 w-48">
        <label className="mt-4 block font-medium">Show:</label>
        <select
          className="mt-2 p-2 border rounded"
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
        >
          <option value="price">Price (OHLC)</option>
          <option value="volume">Volume</option>
          <option value="ratios">P/E, P/B, Div Yield</option>
        </select>
      </div>
      <div className="w-3/4 p-8">
        <ChartComponent
          company={selectedCompany}
          metric={metric}
          chartLoading={chartLoading}
          setChartLoading={setChartLoading}
        />
      </div>
    </div>
  );
};

export default App;
