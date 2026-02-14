import type { Status } from "../types";
import {
  DataTable,
  DataTableSkeleton,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@carbon/react";

type HistoryTableProps = {
  history: Status[];
  loading: boolean;
};

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

export default function HistoryTable({ history, loading }: HistoryTableProps) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const headers = [
    { key: "timestamp", header: "Timestamp" },
    { key: "status", header: "Status" },
    { key: "isHealthy", header: "Healthy?" },
    { key: "healthStatus", header: "Health Status" },
    { key: "responseTime", header: "Response Time (ms)" },
    { key: "error", header: "Error" },
  ];
  const rows = sortedHistory.map((status, index) => ({
    id: index.toString(),
    timestamp: new Date(status.timestamp).toLocaleString(),
    status: status.status?.toString() || "N/A",
    isHealthy: status.isHealthy ? "Yes" : "No",
    healthStatus: status.healthStatus || "N/A",
    responseTime:
      status.responseTime?.toString() ||
      (status as any).response_time?.toString() ||
      "N/A",
    error: status.error || HTTP_ERROR_MESSAGES[status.status] || "-",
  }));

  return loading ? (
    <DataTableSkeleton
      headers={headers}
      rowCount={rows.length}
      showHeader={false}
      showToolbar={false}
    />
  ) : (
    <DataTable rows={rows} headers={headers}>
      {({
        rows,
        headers,
        getTableProps,
        getHeaderProps,
        getRowProps,
        getCellProps,
      }) => (
        <Table {...getTableProps()}>
          <TableHead>
            <TableRow>
              {headers.map((header) => {
                const { key, ...headerProps } = getHeaderProps({ header });
                return (
                  <TableHeader key={key} {...headerProps}>
                    {header.header}
                  </TableHeader>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const { key: rowKey, ...rowProps } = getRowProps({ row });
              return (
                <TableRow key={rowKey} {...rowProps}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...cellProps } = getCellProps({
                      cell,
                    });
                    return (
                      <TableCell key={cellKey} {...cellProps}>
                        {cell.value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </DataTable>
  );
}
