"""create sensor_readings table

Revision ID: 20260425_0001
Revises:
Create Date: 2026-04-25 00:00:00
"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "20260425_0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "sensor_readings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("farm_id", sa.String(length=64), nullable=False),
        sa.Column("station_id", sa.String(length=64), nullable=False),
        sa.Column("crop", sa.String(length=100), nullable=False),
        sa.Column("air_temperature", sa.Float(), nullable=False),
        sa.Column("air_humidity", sa.Float(), nullable=False),
        sa.Column("soil_temperature", sa.Float(), nullable=False),
        sa.Column("soil_humidity", sa.Float(), nullable=False),
        sa.Column("ph", sa.Float(), nullable=False),
        sa.Column("nitrogen", sa.Float(), nullable=False),
        sa.Column("phosphorus", sa.Float(), nullable=False),
        sa.Column("potassium", sa.Float(), nullable=False),
        sa.Column("battery_level", sa.Float(), nullable=False),
        sa.Column("read_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_sensor_readings_id"), "sensor_readings", ["id"], unique=False)
    op.create_index(
        op.f("ix_sensor_readings_farm_id"), "sensor_readings", ["farm_id"], unique=False
    )
    op.create_index(
        op.f("ix_sensor_readings_station_id"), "sensor_readings", ["station_id"], unique=False
    )
    op.create_index(
        op.f("ix_sensor_readings_read_at"), "sensor_readings", ["read_at"], unique=False
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_sensor_readings_read_at"), table_name="sensor_readings")
    op.drop_index(op.f("ix_sensor_readings_station_id"), table_name="sensor_readings")
    op.drop_index(op.f("ix_sensor_readings_farm_id"), table_name="sensor_readings")
    op.drop_index(op.f("ix_sensor_readings_id"), table_name="sensor_readings")
    op.drop_table("sensor_readings")
