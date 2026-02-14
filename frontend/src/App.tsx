import { useState, useEffect } from "react";
import { GlobalTheme, Theme, Link, IconButton, Loading } from "@carbon/react";
import { Awake, Asleep } from "@carbon/icons-react";
import type { GlobalThemeProps } from "@carbon/react";
import type { Website } from "./types";
import DashboardTile from "./components/DashboardTile";
import "@carbon/charts-react/styles.css";
import "./App.scss";

export default function App() {
  const [globalTheme, setGlobalTheme] =
    useState<GlobalThemeProps["theme"]>("g100");
  const [headerTheme, setHeaderTheme] =
    useState<GlobalThemeProps["theme"]>("g10");
  const [websites, setWebsites] = useState<Website[]>([]);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTheme() {
    if (globalTheme === "g100") {
      setGlobalTheme("g10");
      setHeaderTheme("g100");
    } else {
      setGlobalTheme("g100");
      setHeaderTheme("g10");
    }
  }

  async function fetchWebsiteData() {
    setLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const response = await fetch("/api/get-status-history");
      const data = await response.json();
      setWebsites(data.websites);
    } catch (error) {
      console.error("Error fetching website data:", error);
      setError(
        "Failed to fetch dashboard data. Make sure the backend is running.",
      );
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  }

  useEffect(() => {
    setGlobalLoading(true);
    fetchWebsiteData();

    const interval = setInterval(() => {
      fetchWebsiteData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.carbonTheme = globalTheme;
  }, [globalTheme]);

  return (
    <GlobalTheme theme={globalTheme}>
      <div style={{ minHeight: "100vh" }}>
        <Theme
          theme={headerTheme}
          style={{ paddingTop: "10rem", marginBottom: "2rem" }}
        >
          <div className="app-header">
            <h1>Monitoring Dashboard</h1>
            <p>
              This dashboard displays the status of various websites I would
              <br />
              like to monitor. This is less of an actual tool and more of a
              <br />
              showcase of IBM's Carbon Design System. You can check out the
              <br />
              source code on{" "}
              <Link
                href="https://github.com/sipneat/ibm-carbon-dashboard"
                target="_blank"
              >
                GitHub
              </Link>
              .
            </p>
            <IconButton
              label={
                globalTheme === "g100"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              onClick={toggleTheme}
            >
              {globalTheme === "g100" ? <Awake /> : <Asleep />}
            </IconButton>
          </div>
        </Theme>
        {globalLoading ? (
          <Loading description="Loading dashboard data..." />
        ) : error ? (
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: "var(--cds-text-error)",
            }}
          >
            <p>{error}</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {websites.map((website, index) => (
              <DashboardTile
                key={index}
                title={website.url}
                website={website}
                theme={globalTheme}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>
    </GlobalTheme>
  );
}
