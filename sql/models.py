import sqlite3


class Database:
    def __init__(self):
        self.conn = None
        self.cursor = None

    def database_init(self):
        self.conn = sqlite3.connect("data.sqlite")  # 数据库文件路径
        self.conn.row_factory = sqlite3.Row  # 允许通过列名访问数据
        self.cursor = self.conn.cursor()

    def create_field(self, name: str, age: int):
        self.database_init()
        try:
            self.cursor.execute('''
                INSERT INTO items (name, age) VALUES (?, ?)
            ''', (name, age))
            self.conn.commit()
        except sqlite3.IntegrityError:
            return None  # 如果电子邮件已存在
        finally:
            self.conn.close()

    def delete_field(self):
        self.database_init()

    def update_field(self):
        self.database_init()

    def search_name(self, user_id: int) -> dict:
        self.database_init()
        # self.cursor.execute('SELECT * FROM name WHERE id = ?', (user_id,))
        # user = self.cursor.fetchone()  # 获取一行数据
        # self.conn.close()
        # if user:
        #     return dict(user)  # 将结果转换为字典格式

    def search_all(self) -> list:
        self.database_init()
        self.cursor.execute('SELECT * FROM name')
        users = self.cursor.fetchall()  # 获取所有行数据
        self.conn.close()
        return [dict(user) for user in users]  # 返回字典列表


if __name__ == "__main__":
    d = Database()
    d.create_field("Mary", 27)
    d.create_field("Harry", 23)
    d.create_field("Cindy Pay", 33)
