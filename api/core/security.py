import logging
from passlib.context import CryptContext

logger = logging.getLogger(__name__)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto",)

def hash_password(password: str) -> str:
    logger.info("Password hashing successful.")
    return pwd_context.hash(password)

def verify_password(password: str, hash: str) -> bool:
    logger.warning("Password verification successful.")
    return pwd_context.verify(password, hash)