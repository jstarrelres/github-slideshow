from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.main import app, get_db

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    return TestClient(app)


def make_payload(read_at: datetime | None = None):
    return {
        "farm_id": "farm-1",
        "station_id": "station-7",
        "crop": "soy",
        "air_temperature": 29.5,
        "air_humidity": 63.2,
        "soil_temperature": 24.0,
        "soil_humidity": 48.5,
        "ph": 6.4,
        "nitrogen": 11.2,
        "phosphorus": 4.5,
        "potassium": 7.9,
        "battery_level": 76.8,
        "read_at": (read_at or datetime.now(timezone.utc)).isoformat(),
    }


def test_create_sensor_reading(client):
    response = client.post("/sensor-readings", json=make_payload())

    assert response.status_code == 201
    data = response.json()
    assert data["id"] > 0
    assert data["farm_id"] == "farm-1"


def test_create_sensor_reading_validation_error(client):
    payload = make_payload()
    payload["air_humidity"] = 120

    response = client.post("/sensor-readings", json=payload)

    assert response.status_code == 422


def test_get_latest_sensor_reading(client):
    older = datetime.now(timezone.utc) - timedelta(hours=1)
    newer = datetime.now(timezone.utc)

    client.post("/sensor-readings", json=make_payload(read_at=older))
    client.post("/sensor-readings", json=make_payload(read_at=newer))

    response = client.get("/sensor-readings/latest")

    assert response.status_code == 200
    data = response.json()
    assert data["read_at"] == newer.isoformat()


def test_get_latest_sensor_reading_not_found(client):
    response = client.get("/sensor-readings/latest")

    assert response.status_code == 404
