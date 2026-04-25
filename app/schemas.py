from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class SensorReadingBase(BaseModel):
    farm_id: str = Field(min_length=1, max_length=64)
    station_id: str = Field(min_length=1, max_length=64)
    crop: str = Field(min_length=1, max_length=100)
    air_temperature: float = Field(ge=-80, le=80)
    air_humidity: float = Field(ge=0, le=100)
    soil_temperature: float = Field(ge=-30, le=80)
    soil_humidity: float = Field(ge=0, le=100)
    ph: float = Field(ge=0, le=14)
    nitrogen: float = Field(ge=0)
    phosphorus: float = Field(ge=0)
    potassium: float = Field(ge=0)
    battery_level: float = Field(ge=0, le=100)
    read_at: datetime

    @field_validator("read_at")
    @classmethod
    def validate_read_at_not_far_future(cls, value: datetime) -> datetime:
        # tolerância de 5 minutos para clock drift
        if value.timestamp() - datetime.now(value.tzinfo).timestamp() > 300:
            raise ValueError("read_at não pode estar muito no futuro")
        return value


class SensorReadingCreate(SensorReadingBase):
    pass


class SensorReadingResponse(SensorReadingBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
