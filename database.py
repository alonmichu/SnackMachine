from __future__ import annotations
from typing import Any, Mapping


class Database:
    def __init__(self, name: str):
        self._name = name
        self.create_database(name)

    def create_database(self, name: str):
        pass

    def drop_database(self, name: str):
        pass

    def create_table(self, table: str):
        pass

    def drop_table(self, table: str):
        pass

    def add_column(self, columns: {str: str}):
        pass

    def drop_column(self, columns: str | [str]):
        pass

    def select(self, table: str, parameters: {str: Any} = None):
        pass

    def add_line(self, table: str, lines: Mapping[{str: Any}] | {str: Any}):
        pass

    def read_line(self, table: str, line_id: int | [int] = None):
        pass
