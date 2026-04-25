from sqlalchemy import Column, DateTime, Float, Integer, String

from .database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(String(64), nullable=False, index=True)
    station_id = Column(String(64), nullable=False, index=True)
    crop = Column(String(100), nullable=False)
    air_temperature = Column(Float, nullable=False)
    air_humidity = Column(Float, nullable=False)
    soil_temperature = Column(Float, nullable=False)
    soil_humidity = Column(Float, nullable=False)
    ph = Column(Float, nullable=False)
    nitrogen = Column(Float, nullable=False)
    phosphorus = Column(Float, nullable=False)
    potassium = Column(Float, nullable=False)
    battery_level = Column(Float, nullable=False)
    read_at = Column(DateTime(timezone=True), nullable=False, index=True)
