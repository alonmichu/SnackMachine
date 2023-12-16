from database import Database
from pythonProject.Strategy import Check, Add, Strategy, CheckSpace, Buy, Context

snack_db = Database('snack_machine')
connection = snack_db.get_connection()
check_strategy = Check()
add_strategy = Add()
check_space_strategy = CheckSpace()
buy_strategy = Buy()
context = Context(check_strategy, add_strategy, check_space_strategy, buy_strategy)

# snack_db.create_table(connection)
# snack_db.set_default_characteristic(connection)
# print(snack_db.get_max_stock(connection))
# snack_db.set_default_snack(connection)
# print(snack_db.get_snacks(connection))
# print(snack_db.buy_snack(connection, 15))
# print(snack_db.get_snacks(connection))
# print(snack_db.add_snack(connection, 15, 5))
# print(snack_db.get_snacks(connection))
