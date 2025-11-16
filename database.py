# database.py
import sqlite3
import os

DB_FILE = "sql/data.sqlite"


def init_db():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            age INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def create_item_db(id, name, age):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("INSERT INTO items (id, name, age) VALUES (?, ?, ?)", (id, name, age))
    conn.commit()
    conn.close()


def get_all_items():
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("SELECT id, name, age FROM items")
    rows = cur.fetchall()
    conn.close()
    return rows


def update_item_db(id, name, age):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("UPDATE items SET name=?, age=? WHERE id=?", (name, age, id))
    conn.commit()
    updated = cur.rowcount
    conn.close()
    return updated


def delete_item_db(id):
    conn = sqlite3.connect(DB_FILE)
    cur = conn.cursor()
    cur.execute("DELETE FROM items WHERE id=?", (id,))
    conn.commit()
    deleted = cur.rowcount
    conn.close()
    return deleted

