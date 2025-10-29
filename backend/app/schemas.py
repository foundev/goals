from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int


class TimeEntryBase(BaseModel):
    minutes: int = Field(..., gt=0)
    note: Optional[str] = None


class TimeEntryCreate(TimeEntryBase):
    pass


class TimeEntry(TimeEntryBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True


class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class Goal(GoalBase):
    id: int
    created_at: datetime
    updated_at: datetime
    total_minutes: int = 0
    time_entries: List[TimeEntry] = Field(default_factory=list)

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str = Field(..., min_length=8)


class User(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    created_at: datetime

    class Config:
        orm_mode = True
