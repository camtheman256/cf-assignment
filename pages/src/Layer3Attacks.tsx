import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

type TrafficData = {
  timestamps: string[];
  values: string[];
};

type Traffic = {
  data: {
    total: TrafficData;
  };
  meta: any;
};

export default function Layer3Attacks() {
  const [data, setData] = useState<Traffic>();

  useEffect(() => {
    fetch("https://cf-assignment.camk.workers.dev/attack-layer3")
      .then((r) => r.json())
      .then((d) => {
        setData(d);
      });
  }, []);

  return (
    <div>
      {data ? (
        <Line
          data={{
            datasets: [
              {
                data: data?.data.total.timestamps.map((t, i) => ({
                  x: t,
                  y: data?.data.total.values[i],
                })),
                label: "Attack Volume",
                borderColor: "#000",
                backgroundColor: "#00000080",
              },
            ],
          }}
          options={{
            scales: {
              x: { type: "time" },
              y: { ticks: { format: { style: "percent" } } },
            },
            plugins: { title: { text: "Layer 3 DDoS Attacks", display: true } },
          }}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
