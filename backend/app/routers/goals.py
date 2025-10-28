from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models
from ..auth import get_current_user
from ..database import get_db
from ..schemas import Goal, GoalCreate, GoalUpdate, TimeEntry, TimeEntryCreate

router = APIRouter(prefix="/goals", tags=["goals"])


@router.get("/", response_model=list[Goal])
def list_goals(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
) -> list[Goal]:
    goals = (
        db.query(models.Goal)
        .filter(models.Goal.owner_id == current_user.id)
        .order_by(models.Goal.created_at.desc())
        .all()
    )
    return [serialize_goal(goal) for goal in goals]


@router.post("/", response_model=Goal, status_code=status.HTTP_201_CREATED)
def create_goal(
    goal_in: GoalCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Goal:
    goal = models.Goal(
        title=goal_in.title,
        description=goal_in.description,
        owner_id=current_user.id,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)
    return serialize_goal(goal)


@router.put("/{goal_id}", response_model=Goal)
def update_goal(
    goal_id: int,
    goal_in: GoalUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Goal:
    goal = (
        db.query(models.Goal)
        .filter(models.Goal.id == goal_id, models.Goal.owner_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    if goal_in.title is not None:
        goal.title = goal_in.title
    if goal_in.description is not None:
        goal.description = goal_in.description
    db.commit()
    db.refresh(goal)
    return serialize_goal(goal)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> None:
    goal = (
        db.query(models.Goal)
        .filter(models.Goal.id == goal_id, models.Goal.owner_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    db.delete(goal)
    db.commit()


@router.post("/{goal_id}/time", response_model=Goal, status_code=status.HTTP_201_CREATED)
def log_time(
    goal_id: int,
    time_entry_in: TimeEntryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> Goal:
    goal = (
        db.query(models.Goal)
        .filter(models.Goal.id == goal_id, models.Goal.owner_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    time_entry = models.TimeEntry(
        goal_id=goal.id,
        minutes=time_entry_in.minutes,
        note=time_entry_in.note,
    )
    db.add(time_entry)
    db.commit()
    db.refresh(goal)
    return serialize_goal(goal)


@router.get("/{goal_id}/time", response_model=list[TimeEntry])
def list_time_entries(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> list[TimeEntry]:
    goal = (
        db.query(models.Goal)
        .filter(models.Goal.id == goal_id, models.Goal.owner_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")
    return [TimeEntry.from_orm(entry) for entry in goal.time_entries]


def serialize_goal(goal: models.Goal) -> Goal:
    total_minutes = sum(entry.minutes for entry in goal.time_entries)
    goal_data = Goal.from_orm(goal)
    goal_data.total_minutes = total_minutes
    goal_data.time_entries = [TimeEntry.from_orm(entry) for entry in goal.time_entries]
    return goal_data
