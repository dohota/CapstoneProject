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
            return None  # 如果age已存在
        finally:
            self.conn.close()

    def delete_field(self, user_id: int):
        self.database_init()
        try:
            # 执行删除语句
            self.cursor.execute("DELETE FROM items WHERE id = ?", (user_id,))
            self.conn.commit()  # 提交事务
            return self.cursor.rowcount  # 返回删除的行数
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return None
        finally:
            self.conn.close()

    def update_field(self,  user_id: int, name: str = None, age: int = None):
        self.database_init()
        try:
            # 构建更新字段的列表
            fields = []
            values = []

            if name is not None:
                fields.append("name = ?")
                values.append(name)
            if age is not None:
                fields.append("age = ?")
                values.append(age)

            if not fields:
                return 0  # 没有需要更新的字段

            values.append(user_id)  # WHERE 子句参数

            sql = f"UPDATE items SET {', '.join(fields)} WHERE id = ?"
            self.cursor.execute(sql, tuple(values))
            self.conn.commit()
            return self.cursor.rowcount  # 返回更新的行数
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return None
        finally:
            self.conn.close()

    def search_id(self, user_id: int) -> dict:
        self.database_init()
        self.cursor.execute('SELECT * FROM items WHERE id = ?', (user_id,))
        u = self.cursor.fetchone()  # 获取一行数据
        self.conn.close()
        if u:
            return dict(u)

    def search_all(self) -> list:
        self.database_init()
        self.cursor.execute('SELECT * FROM items')
        users = self.cursor.fetchall()  # 获取所有行数据
        self.conn.close()
        return [dict(user) for user in users]


# unit test
if __name__ == "__main__":
    d = Database()
    d.update_field(1, "haha", 66)
    d.delete_field(4)
