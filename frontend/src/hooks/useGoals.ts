import { useCallback, useEffect, useState } from 'react';

import { API } from '../context/AuthContext';
import type { Goal } from '../types';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get<Goal[]>('/goals/');
      setGoals(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGoal = useCallback(
    async (payload: { title: string; description?: string }) => {
      const { data } = await API.post<Goal>('/goals/', payload);
      setGoals((prev) => [data, ...prev]);
    },
    []
  );

  const updateGoal = useCallback(
    async (goalId: number, payload: { title?: string; description?: string }) => {
      const { data } = await API.put<Goal>(`/goals/${goalId}`, payload);
      setGoals((prev) => prev.map((goal) => (goal.id === goalId ? data : goal)));
    },
    []
  );

  const deleteGoal = useCallback(async (goalId: number) => {
    await API.delete(`/goals/${goalId}`);
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
  }, []);

  const logTime = useCallback(
    async (goalId: number, payload: { minutes: number; note?: string }) => {
      const { data } = await API.post<Goal>(`/goals/${goalId}/time`, payload);
      setGoals((prev) => prev.map((goal) => (goal.id === goalId ? data : goal)));
    },
    []
  );

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  return { goals, loading, fetchGoals, createGoal, updateGoal, deleteGoal, logTime };
};
