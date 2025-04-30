// components/StockChart.jsx (updated)
import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

export default function StockChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy existing chart
    if (chartRef.current.chart) {
      chartRef.current.chart.destroy();
    }

    // Chart data configuration
    const chartData = {
      labels: ["Open", "High", "Low", "Close"],
      datasets: [
        {
          label: "Index Values",
          data: [
            data.open_index_value,
            data.high_index_value,
            data.low_index_value,
            data.closing_index_value,
          ],
          backgroundColor: [
            "rgba(59, 130, 246, 0.7)",
            "rgba(34, 197, 94, 0.7)",
            "rgba(239, 68, 68, 0.7)",
            "rgba(156, 163, 175, 0.7)",
          ],
          borderColor: [
            "rgba(59, 130, 246, 1)",
            "rgba(34, 197, 94, 1)",
            "rgba(239, 68, 68, 1)",
            "rgba(156, 163, 175, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    // Create new chart
    chartRef.current.chart = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || "";
                const value = context.parsed.y.toLocaleString();
                return `${label}: ${value}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: { display: true, text: "Index Value" },
            ticks: {
              callback: (value) => value.toLocaleString(),
            },
          },
        },
      },
    });

    return () => {
      if (chartRef?.current?.chart) {
        chartRef?.current?.chart?.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-96">
      <canvas ref={chartRef} />
    </div>
  );
}
