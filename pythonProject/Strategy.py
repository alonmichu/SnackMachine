from abc import ABC, abstractmethod


class Strategy(ABC):
    @abstractmethod
    def send_query(self, **options):
        pass


class Check(Strategy):
    def send_query(self, idx, snack_db, connection, dif):
        return snack_db.is_available(connection, idx)


class Add(Strategy):
    def send_query(self, idx, dif, snack_db, connection):
        return snack_db.add_snack(connection, idx, dif)


class CheckSpace(Strategy):
    def send_query(self, idx, snack_db, connection, dif):
        space = snack_db.get_max_stock(connection)
        space -= snack_db.get_snack_amount(connection, idx)
        return space


class Buy(Strategy):
    def send_query(self, idx, snack_db, connection, dif):
        return snack_db.buy_snack(connection, idx)


class Context:
    def __init__(self, check_strategy: Strategy, add_strategy: Strategy,
                 check_space_strategy: Strategy, buy_strategy: Strategy):
        self.add = add_strategy
        self.check = check_strategy
        self.check_space = check_space_strategy
        self.buy = buy_strategy

    def get_strategy(self, number):
        if number > 0:
            return self.add
        if number == 0:
            return self.check_space
        if number < 0:
            return self.buy
        return self.check
