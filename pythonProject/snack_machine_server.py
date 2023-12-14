from flask import Flask, render_template, url_for
import set_db
from flask_restful import Api, Resource, reqparse

app = Flask(__name__)
api = Api()


class Main(Resource):
    # обработка запроса на наличие снека
    def get(self, snack_id):
        inspector = set_db.snack_db.is_available(set_db.connection, snack_id)
        return inspector

    # обработка запросов на пополнение и покупку снеков
    def put(self, snack_id):
        parser = reqparse.RequestParser()
        parser.add_argument("change", type=int)
        changer = parser.parse_args()
        if changer.change > 0:
            set_db.snack_db.add_snack(set_db.connection, snack_id, changer.change)
        elif changer.change == 0:
            free_space = set_db.snack_db.get_max_stock(set_db.connection)
            free_space -= set_db.snack_db.get_snack_amount(set_db.connection, snack_id)
            return free_space
        else:
            set_db.snack_db.buy_snack(set_db.connection, snack_id)
        return changer


api.add_resource(Main, "/api/snacks/<int:snack_id>")
api.init_app(app)


@app.route('/')
def index():
    return render_template("snack_machine.html")


@app.route('/admin')
def admin():
    return render_template("admin.html")


if __name__ == "__main__":
    app.run(debug=True, port=3000, host="127.0.0.1")
