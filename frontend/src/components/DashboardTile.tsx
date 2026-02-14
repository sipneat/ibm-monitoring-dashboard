import type { Website } from "../types";
import {
  ExpandableTile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  Link,
} from "@carbon/react";
import type { GlobalThemeProps } from "@carbon/react";
import HistoryTable from "./HistoryTable";
import Graphs from "./Graphs";

type DashboardTileProps = {
  title: string;
  website: Website;
  theme: GlobalThemeProps["theme"];
  loading: boolean;
};

export default function DashboardTile({
  title,
  website,
  theme,
  loading,
}: DashboardTileProps) {
  return (
    <ExpandableTile id={title}>
      <TileAboveTheFoldContent>
        <Link href={website.url} target="_blank">
          <h3>{title}</h3>
        </Link>
        <Graphs website={website} theme={theme} loading={loading} />
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          {title === "https://jakeesperson.com" && (
            <p>This is my personal portfolio website.</p>
          )}
          {title === "https://rookie-play.jakeesperson.com" && (
            <p>This is my self-hosted COEN 174 project</p>
          )}
          {title === "https://scuacm.com" && <p>This is my ACM club website</p>}
        </div>
        <h4 style={{ marginBottom: "1rem" }}>Status History</h4>
        <HistoryTable history={website.history} loading={loading} />
      </TileBelowTheFoldContent>
    </ExpandableTile>
  );
}
