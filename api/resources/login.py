from flask import Flask, make_response, request, jsonify
from flask_restful import Resource, Api
from flaskext.mysql import MySQL
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from datetime import timedelta

mysql = MySQL()
app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'qm187606595'
app.config['MYSQL_DATABASE_DB'] = 'warningsystem'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

app.config["JWT_SECRET_KEY"] = "super-secret-for-jwt"  # Change this!

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=10)
jwt = JWTManager(app)

mysql.init_app(app)

api = Api(app)

class Login(Resource):
    def post(self):
        try:
            print(0)
            data = request.json
            username, password = data.get('username'), data.get('password')
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT id, username, password, role
                            FROM user_account
                            WHERE username=\"{}\";"""
                           .format(username))
            data = cursor.fetchall()
            if (len(data) == 0):
                return make_response("Account does not exist", 404)
            id, username, password_hash, role = data[0]
            auth_state = check_password_hash(password_hash, password)
            if auth_state:
                access_token = create_access_token(identity=username)
                return jsonify(access_token=access_token, id=id, username=username, role=role)
            else:
                return make_response('Wrong Password!', 403)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()