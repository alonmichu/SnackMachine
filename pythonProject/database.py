from __future__ import annotations
import sqlite3


class SingletonMetaclass(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class Database(metaclass=SingletonMetaclass):
    def __init__(self, name: str):
        self.name = name

    def get_connection(self):
        return sqlite3.connect(self.name, check_same_thread=False)

    def get_cursor(self, connection):
        cursor = connection.cursor()
        return cursor

    def create_table(self, connection):
        cursor = self.get_cursor(connection)
        cursor.execute("CREATE TABLE IF NOT EXISTS snack ("
                       "id INT PRIMARY KEY, stock INT DEFAULT 0);")
        cursor.execute("CREATE TABLE IF NOT EXISTS configuration ("
                       "id INT AUTO_INCREMENT PRIMARY KEY, "
                       "name VARCHAR(50), characteristic VARCHAR(50) );")
        connection.commit()

    def drop_table(self, connection, table_name: str):
        cursor = self.get_cursor(connection)
        cursor.execute(f"DROP TABLE {table_name};")
        connection.commit()

    def set_default_characteristic(self, connection):
        cursor = self.get_cursor(connection)
        cursor.execute("INSERT INTO configuration (name, characteristic) "
                       "VALUES('max_stock', '10');")
        cursor.execute("INSERT INTO configuration (name, characteristic) "
                       "VALUES('cell_amount', '35');")
        connection.commit()

    def set_default_snack(self, connection):
        cursor = self.get_cursor(connection)
        for i in range(35):
            cursor.execute(f"INSERT INTO snack (id, stock) VALUES({i + 1}, 5);")
        connection.commit()

    def get_snacks(self, connection):
        cursor = self.get_cursor(connection)
        cursor.execute(f"SELECT * from snack;")
        res = cursor.fetchall()
        return res

    def set_max_stock(self, connection, max_stock: int):
        cursor = self.get_cursor(connection)
        cursor.execute(f"UPDATE configuration SET characteristic='{max_stock}' "
                       f"WHERE name='max_stock';")
        connection.commit()

    def get_max_stock(self, connection):
        cursor = self.get_cursor(connection)
        cursor.execute("SELECT characteristic from configuration WHERE name='max_stock';")
        res = cursor.fetchall()[0][0]
        return int(res)

    def set_cell_amount(self, connection, cell_amount: int):
        cursor = self.get_cursor(connection)
        cursor.execute(f"UPDATE configuration SET characteristic='{cell_amount}' "
                       f"WHERE name='cell_amount';")
        connection.commit()

    def get_cell_amount(self, connection):
        cursor = self.get_cursor(connection)
        cursor.execute("SELECT characteristic from configuration WHERE name='cell_amount';")
        res = cursor.fetchall()[0][0]
        return int(res)

    def add_snack(self, connection, snack_id: int, amount: int):
        cursor = self.get_cursor(connection)
        max_stock = self.get_max_stock(connection)
        current_stock = self.get_snack_amount(connection, snack_id)
        if current_stock + amount <= max_stock:
            cursor.execute(f"UPDATE snack SET stock={current_stock + amount} WHERE id={snack_id};")
            connection.commit()
        else:
            cursor.execute(f"UPDATE snack SET stock={max_stock} WHERE id={snack_id};")
            connection.commit()

    def buy_snack(self, connection, snack_id: int):
        cursor = self.get_cursor(connection)
        amount = self.get_snack_amount(connection, snack_id)
        if amount > 0:
            cursor.execute(f"UPDATE snack SET stock={amount - 1} "
                           f"WHERE id={snack_id};")
        else:
            return False
        connection.commit()
        return True

    def get_snack_amount(self, connection, snack_id: int):
        cursor = self.get_cursor(connection)
        cursor.execute(f"SELECT stock from snack WHERE id={snack_id};")
        res = cursor.fetchall()[0][0]
        return int(res)

    def is_available(self, connection, snack_id: int):
        res = self.get_snack_amount(connection, snack_id)
        return res > 0
