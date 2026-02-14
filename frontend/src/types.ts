export type Website = {
  url: string;
  currentStatus: Status;
  history: Status[];
};

export type Status = {
  timestamp: Date;
  status: number;
  isHealthy: boolean;
  healthStatus: string;
  responseTime: number;
  error: string | null;
};
