from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from database import Base


class VerificationLog(Base):
    __tablename__ = "verification_logs"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False)
    input_text = Column(Text, nullable=True)
    verdict = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
