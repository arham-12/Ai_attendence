from app.db.models import Admin
from app.db.session import SessionLocal

db = SessionLocal()

admin = Admin(email="admin@gmail.com", password="admin")
db.add(admin)
db.commit()
# db.refresh(admin)