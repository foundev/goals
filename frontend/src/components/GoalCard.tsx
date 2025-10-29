import {
  Card,
  CardActions,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Chip,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Goal } from '../types';

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: number) => void | Promise<void>;
  onLogTime: (goal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onLogTime }) => {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <div>
            <Typography variant="h6" gutterBottom>
              {goal.title}
            </Typography>
            {goal.description && (
              <Typography variant="body2" color="text.secondary">
                {goal.description}
              </Typography>
            )}
          </div>
          <Chip color="primary" label={`${goal.total_minutes} min`} icon={<AccessTimeIcon />} />
        </Stack>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Tooltip title="Log time">
          <IconButton color="primary" onClick={() => onLogTime(goal)}>
            <AccessTimeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(goal)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => onDelete(goal.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default GoalCard;
