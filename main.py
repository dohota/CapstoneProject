from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database import (
    init_db,
    create_item_db,
    get_all_items,
    update_item_db,
    delete_item_db,
)

app = FastAPI() # docs_url=None, redoc_url=None, openapi_url=None)
# 允许前端本地开发环境的跨域访问（开发阶段用）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 注意生产环境应改为具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# 静态文件托管构建好的前端页面
app.mount("/static", StaticFiles(directory="static"), name="static")


app = FastAPI()

# 启动时创建表
init_db()


class Item(BaseModel):
    id: int
    name: str
    age: int

@app.get("/favicon.ico")
def get_favicon():
    return FileResponse("static/favicon.ico")


@app.get("/")
def read_index():
    return FileResponse("static/mainpage.html")


@app.get("/conlang")
def read_index():
    return FileResponse("static/conlang.html")


@app.get("/chess")
def read_index():
    return FileResponse("static/warchess.html")


@app.get("/world")
def read_index():
    return FileResponse("static/rimworld.html")


@app.get("/game")
def read_index():
    return FileResponse("static/smallgame.html")


@app.get("/intro/{item_id}")
async def read_item(item_id: int):
    return {"item_id": item_id}


# 创建数据库表
Base.metadata.create_all(bind=engine)


class PersonCreate(BaseModel):
    name: str
    age: int


# 获取数据库连接
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/intro")
def read_index():
    return FileResponse("static/personal.html")


def get_persons(db: Session = Depends(get_db)):
    return db.query(Person).all()

# search
#@app.get("/persons")


@app.post("/intro")
def create_person(person: PersonCreate, db: Session = Depends(get_db)):
    db_person = Person(name=person.name, age=person.age)
    db.add(db_person)
    db.commit()
    db.refresh(db_person)
    return db_person


@app.delete("/intro/{person_id}")
def delete_person(person_id: int, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == person_id).first()
    db.delete(person)
    db.commit()
    return {"message": "deleted"}


@app.put("/intro/{person_id}")
def update_person(person_id: int, person: PersonCreate, db: Session = Depends(get_db)):
    db_person = db.query(Person).filter(Person.id == person_id).first()
    db_person.name = person.name
    db_person.age = person.age
    db.commit()
    return db_person

