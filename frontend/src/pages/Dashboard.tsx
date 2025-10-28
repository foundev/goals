import { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import GoalCard from '../components/GoalCard';
import { useGoals } from '../hooks/useGoals';
import { Goal } from '../types';

const Dashboard = () => {
  const { goals, loading, createGoal, updateGoal, deleteGoal, logTime } = useGoals();
  const [isGoalDialogOpen, setGoalDialogOpen] = useState(false);
  const [goalForm, setGoalForm] = useState<{ id?: number; title: string; description: string }>(
    { title: '', description: '' }
  );
  const [isTimeDialogOpen, setTimeDialogOpen] = useState(false);
  const [timeForm, setTimeForm] = useState<{ id?: number; minutes: string; note: string }>(
    { minutes: '', note: '' }
  );

  const openGoalDialog = (goal?: Goal) => {
    if (goal) {
      setGoalForm({ id: goal.id, title: goal.title, description: goal.description ?? '' });
    } else {
      setGoalForm({ title: '', description: '' });
    }
    setGoalDialogOpen(true);
  };

  const openTimeDialog = (goal: Goal) => {
    setTimeForm({ id: goal.id, minutes: '', note: '' });
    setTimeDialogOpen(true);
  };

  const handleGoalSubmit = async () => {
    if (!goalForm.title.trim()) return;
    if (goalForm.id) {
      await updateGoal(goalForm.id, {
        title: goalForm.title,
        description: goalForm.description,
      });
    } else {
      await createGoal({ title: goalForm.title, description: goalForm.description });
    }
    setGoalDialogOpen(false);
  };

  const handleDeleteGoal = async (goalId: number) => {
    const goalToDelete = goals.find((goal) => goal.id === goalId);
    if (!goalToDelete) return;
    const confirmDelete = window.confirm(
      `Delete goal "${goalToDelete.title}" and all logged time?`
    );
    if (confirmDelete) {
      await deleteGoal(goalId);
    }
  };

  const handleTimeSubmit = async () => {
    if (!timeForm.id || !timeForm.minutes) return;
    await logTime(timeForm.id, {
      minutes: parseInt(timeForm.minutes, 10),
      note: timeForm.note,
    });
    setTimeDialogOpen(false);
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Your Goals</Typography>
        <Button variant="contained" onClick={() => openGoalDialog()}>
          Add Goal
        </Button>
      </Stack>

      {loading ? (
        <Stack alignItems="center" mt={4}>
          <CircularProgress />
        </Stack>
      ) : goals.length === 0 ? (
        <Typography color="text.secondary">Start by creating your first goal.</Typography>
      ) : (
        <Grid container spacing={2}>
          {goals.map((goal) => (
            <Grid item xs={12} key={goal.id}>
              <GoalCard
                goal={goal}
                onEdit={openGoalDialog}
                onDelete={handleDeleteGoal}
                onLogTime={openTimeDialog}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={isGoalDialogOpen} onClose={() => setGoalDialogOpen(false)} fullWidth>
        <DialogTitle>{goalForm.id ? 'Edit Goal' : 'Add Goal'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={goalForm.title}
              onChange={(event) => setGoalForm((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
            <TextField
              label="Description"
              value={goalForm.description}
              onChange={(event) =>
                setGoalForm((prev) => ({ ...prev, description: event.target.value }))
              }
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGoalDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGoalSubmit}>
            {goalForm.id ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isTimeDialogOpen} onClose={() => setTimeDialogOpen(false)} fullWidth>
        <DialogTitle>Log time</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Minutes"
              type="number"
              value={timeForm.minutes}
              onChange={(event) =>
                setTimeForm((prev) => ({ ...prev, minutes: event.target.value }))
              }
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Note"
              value={timeForm.note}
              onChange={(event) => setTimeForm((prev) => ({ ...prev, note: event.target.value }))}
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleTimeSubmit}>
            Log
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
