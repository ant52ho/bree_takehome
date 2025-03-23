import { useState, useCallback } from "react";
import { User, CreateUserRequest } from "../types/user";
import { usersApi } from "../services/api";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (data: CreateUserRequest) => {
    try {
      setLoading(true);
      const newUser = await usersApi.create(data);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      const user = await usersApi.get(userId);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get user");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const userList = await usersApi.list();
      setUsers(userList);
      return userList;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    getUser,
    loadUsers,
  };
};
