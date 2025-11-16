import sqlite3
from sqlite3 import Connection

# 数据库文件路径
DB_PATH = "data.sqlite"


# 连接数据库
def get_db_connection() -> Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # 使得可以通过列名访问数据
    return conn


# 初始化数据库，创建用户表
def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    ''')
    conn.commit()
    conn.close()


# 创建用户
def create_user(name: str, email: str):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute('''
            INSERT INTO users (name, email) VALUES (?, ?)
        ''', (name, email))
        conn.commit()
    except sqlite3.IntegrityError:
        return None  # 如果电子邮件已存在，返回None
    finally:
        conn.close()


# 查询用户 by ID
def get_user_by_id(user_id: int) -> dict:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()  # 获取一行数据
    conn.close()
    if user:
        return dict(user)  # 将结果转换为字典格式
    return None


# 查询所有用户
def get_all_users() -> list:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()  # 获取所有行数据
    conn.close()
    return [dict(user) for user in users]  # 返回字典列表

