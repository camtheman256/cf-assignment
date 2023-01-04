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
    http: TrafficData;
  };
  meta: any;
};

export default function TrafficChange() {
  const [data, setData] = useState<Traffic>();

  useEffect(() => {
    fetch("https://cf-assignment.camk.workers.dev/traffic-change")
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
                label: "Total Traffic",
                borderColor: "#000",
                backgroundColor: "#00000080",
              },
              {
                data: data?.data.http.timestamps.map((t, i) => ({
                  x: t,
                  y: data?.data.http.values[i],
                })),
                label: "HTTP Traffic",
                borderColor: "#add8e6",
                backgroundColor: "#add8e680",
              },
            ],
          }}
          options={{
            scales: { x: { type: "time" } },
            plugins: { title: { text: "Internet Traffic", display: true } },
          }}
        />
      ) : (
        "Loading..."
      )}
    </div>
  );
}
