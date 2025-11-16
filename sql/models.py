import sqlite3


class Database:
    def __init__(self):
        self.db_path = "data.sqlite"# 数据库文件路径
        self.conn = None
        self.cursor = None

    def connect(self) -> None:
        self.conn = sqlite3.connect(self.db_path)
        self.conn.row_factory = sqlite3.Row  # 允许通过列名访问数据
        self.cursor = self.conn.cursor()
        #return conn

    def close(self) -> None:
        if self.conn:
            self.conn.close()

    def create_user(self,name: str, email: str):
        try:
            self.cursor.execute('''
                INSERT INTO users (name, email) VALUES (?, ?)
            ''', (name, email))
            self.conn.commit()
        except sqlite3.IntegrityError:
            return None  # 如果电子邮件已存在
        finally:
            self.conn.close()

    def get_user_by_id(self,user_id: int) -> dict:
        self.cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
        user = self.cursor.fetchone()  # 获取一行数据
        self.conn.close()
        if user:
            return dict(user)  # 将结果转换为字典格式

    def get_all_users(self) -> list:
        self.cursor.execute('SELECT * FROM users')
        users = self.cursor.fetchall()  # 获取所有行数据
        self.conn.close()
        return [dict(user) for user in users]  # 返回字典列表
