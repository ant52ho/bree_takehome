import { useState, useCallback } from "react";
import {
  Application,
  CancelApplicationRequest,
  CreateApplicationRequest,
  DisburseApplicationRequest,
  RejectApplicationRequest,
  RepayApplicationRequest,
} from "../types/application";
import { applicationsApi } from "../services/api";

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createApplication = useCallback(
    async (data: CreateApplicationRequest) => {
      try {
        setLoading(true);
        const newApplication = await applicationsApi.create(data);
        setApplications((prev) => [...prev, newApplication]);
        return newApplication;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create application"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const disburseApplication = useCallback(
    async (data: DisburseApplicationRequest) => {
      try {
        setLoading(true);
        const updatedApplication = await applicationsApi.disburse(data);
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationId === updatedApplication.applicationId
              ? updatedApplication
              : app
          )
        );
        return updatedApplication;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to disburse application"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const repayApplication = useCallback(
    async (data: RepayApplicationRequest) => {
      try {
        setLoading(true);
        const updatedApplication = await applicationsApi.repay(data);
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationId === updatedApplication.applicationId
              ? updatedApplication
              : app
          )
        );
        return updatedApplication;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to repay application"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const cancelApplication = useCallback(
    async (data: CancelApplicationRequest) => {
      try {
        setLoading(true);
        const updatedApplication = await applicationsApi.cancel(data);
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationId === updatedApplication.applicationId
              ? updatedApplication
              : app
          )
        );
        return updatedApplication;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to cancel application"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const rejectApplication = useCallback(
    async (data: RejectApplicationRequest) => {
      try {
        setLoading(true);
        const updatedApplication = await applicationsApi.reject(data);
        setApplications((prev) =>
          prev.map((app) =>
            app.applicationId === updatedApplication.applicationId
              ? updatedApplication
              : app
          )
        );
        return updatedApplication;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to reject application"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      const history = await applicationsApi.list();
      setApplications(history);
      return history;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load application history"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applications,
    loading,
    error,
    createApplication,
    disburseApplication,
    repayApplication,
    cancelApplication,
    rejectApplication,
    loadApplications,
  };
};
