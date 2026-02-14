import type { Website } from "../types";
import { AreaChart, LineChart } from "@carbon/charts-react";
import { ScaleTypes } from "@carbon/charts-react";
import type { GlobalThemeProps } from "@carbon/react";

type GraphsProps = {
  website: Website;
  theme: GlobalThemeProps["theme"];
  loading: boolean;
};

export default function Graphs({ website, theme, loading }: GraphsProps) {
  const healthStatus = website.currentStatus?.healthStatus || "unknown";
  const lineColor =
    healthStatus === "Healthy"
      ? "#24a148"
      : healthStatus === "Degraded"
        ? "#f1c21b"
        : "#da1e28";

  return (
    <div>
      <AreaChart
        data={website.history.map((entry) => ({
          group: "Response Time",
          date: new Date(entry.timestamp),
          value: entry.responseTime,
          loading: loading,
        }))}
        options={{
          theme: theme,
          axes: {
            left: {
              title: "Response Time (ms)",
              mapsTo: "value",
            },
            bottom: {
              title: "Time",
              scaleType: ScaleTypes.TIME,
              mapsTo: "date",
            },
          },
          legend: {
            clickable: false,
          },
          height: "400px",
          timeScale: {
            addSpaceOnEdges: 0,
          },
        }}
      />
      <LineChart
        data={website.history.map((entry) => ({
          group: "Status",
          date: new Date(entry.timestamp),
          value: entry.status,
          loading: loading,
        }))}
        options={{
          theme: theme,
          points: { enabled: false },
          color: {
            scale: {
              Status: lineColor,
            },
          },
          axes: {
            left: {
              title: "HTTP Status",
              mapsTo: "value",
            },
            bottom: {
              title: "Time",
              scaleType: ScaleTypes.TIME,
              mapsTo: "date",
            },
          },
          legend: {
            clickable: false,
          },
          height: "400px",
          timeScale: {
            addSpaceOnEdges: 0,
          },
        }}
      />
    </div>
  );
}
