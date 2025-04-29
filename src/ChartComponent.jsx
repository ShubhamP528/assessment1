// ChartComponent.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ChartComponent = React.memo(
  ({ company, metric, chartLoading, setChartLoading }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
      if (!company) return;
      setChartLoading(true);

      const timeout = setTimeout(() => {
        let data, options;
        if (metric === "price") {
          // OHLC bar chart
          const vals = [
            "open_index_value",
            "high_index_value",
            "low_index_value",
            "closing_index_value",
          ].map((k) => (isNaN(company[k]) ? null : company[k]));
          data = {
            labels: ["Open", "High", "Low", "Close"],
            datasets: [
              { label: "Price", data: vals, type: "bar", yAxisID: "y1" },
            ],
          };
          options = {
            responsive: true,
            scales: {
              y1: { beginAtZero: false, title: { display: true, text: "₹" } },
            },
          };
        } else if (metric === "volume") {
          // Volume bar
          const vol = isNaN(company.volume) ? 0 : company.volume;
          data = {
            labels: [company.index_date],
            datasets: [{ label: "Volume", data: [vol], type: "bar" }],
          };
          options = {
            responsive: true,
            scales: { y: { title: { display: true, text: "Shares" } } },
          };
        } else {
          // Ratios line chart with secondary axis
          const pe = isNaN(company.pe_ratio) ? null : company.pe_ratio;
          const pb = isNaN(company.pb_ratio) ? null : company.pb_ratio;
          const dy = isNaN(company.div_yield) ? null : company.div_yield;
          data = {
            labels: [company.index_date],
            datasets: [
              { label: "P/E", data: [pe], type: "line", yAxisID: "y2" },
              { label: "P/B", data: [pb], type: "line", yAxisID: "y2" },
              { label: "Div Yield %", data: [dy], type: "line", yAxisID: "y2" },
            ],
          };
          options = {
            responsive: true,
            scales: {
              y2: {
                position: "right",
                title: { display: true, text: "Ratio / %" },
                grid: { drawOnChartArea: false },
              },
            },
          };
        }

        setChartData({ data, options });
        setChartLoading(false);
      }, 200);

      return () => clearTimeout(timeout);
    }, [company, metric, setChartLoading]);

    if (!company)
      return <div className="text-center text-gray-500">Select a company</div>;
    if (chartLoading || !chartData)
      return (
        <div className="flex flex-col items-center justify-center h-full space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-400"></div>
          <p className="text-sm text-gray-500">Loading chart...</p>
        </div>
      );

    // choose component based on metric
    const ChartEl = metric === "price" || metric === "volume" ? Bar : Line;
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {company.index_name} —{" "}
          {metric.charAt(0).toUpperCase() + metric.slice(1)}
        </h2>
        <ChartEl data={chartData.data} options={chartData.options} />
      </div>
    );
  }
);

export default ChartComponent;
