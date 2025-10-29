from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import auth, goals

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Goals Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(goals.router)


@app.get("/")
def read_root():
    return {"message": "Goals Tracker API is running"}
