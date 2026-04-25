from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fildee Sensor API")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post(
    "/sensor-readings",
    response_model=schemas.SensorReadingResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_sensor_reading(
    payload: schemas.SensorReadingCreate,
    db: Session = Depends(get_db),
):
    reading = models.SensorReading(**payload.model_dump())
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


@app.get("/sensor-readings/latest", response_model=schemas.SensorReadingResponse)
def get_latest_sensor_reading(db: Session = Depends(get_db)):
    reading = (
        db.query(models.SensorReading)
        .order_by(models.SensorReading.read_at.desc(), models.SensorReading.id.desc())
        .first()
    )

    if not reading:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nenhuma leitura encontrada",
        )

    return reading
