from flask import Flask, make_response, request
from flask_restful import Resource, Api
from flaskext.mysql import MySQL
from flask_cors import CORS  # , cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import uuid


mysql = MySQL()
app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'qm187606595'
app.config['MYSQL_DATABASE_DB'] = 'warningsystem'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'


mysql.init_app(app)

api = Api(app)


class CreateUserAccount(Resource):
    def post(self):
        try:
            data = request.form
            username = data.get('username')
            password = data.get('password')
            hashPassword = generate_password_hash(password)
            id = str(uuid.uuid4())
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""INSERT INTO user_account (id, username, password, role) 
                           VALUES ("{}", "{}", "{}", "{}")"""
                           .format(id, username, hashPassword, 'student'))
            con.commit()
            return make_response('Successfully registered.', 201)

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class EditUserPassword(Resource):
    def post(self):
        try:
            data = request.form
            username = data.get('username')
            oldPassword = data.get('old_password')
            newPassword = data.get('new_password')
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""select password from user_account 
                            where username=\"{}\";"""
                           .format(username))
            data = cursor.fetchall()
            password_hash = str(data[0][0])
            auth_state = check_password_hash(password_hash, oldPassword)
            if auth_state:
                hash_password = generate_password_hash(newPassword)
                cursor.execute("""UPDATE user_account 
                                SET password = \"{}\" 
                                WHERE username=\"{}\";
                                """.format(hash_password, username))
                con.commit()
                return make_response('Password changed!', 200)
            else:
                return make_response('Wrong Password!', 403)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class Login(Resource):
    def post(self):
        try:
            data = request.form
            username = data.get('username')
            password = data.get('password')
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""select password from user_account 
                            where username=\"{}\";"""
                           .format(username))
            data = cursor.fetchall()
            if (len(data) == 0):
                raise Exception("Account does not exist")
            password_hash = str(data[0][0])
            auth_state = check_password_hash(password_hash, password)
            if auth_state:
                return make_response('Login successfully!', 200)
            else:
                return make_response('Wrong Password!', 403)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetAllCourses(Resource):
    def get(self):
        try:
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(
                """SELECT name,courses.code_module,code_presentation, major, length FROM courses 
                inner join course_info
                on courses.code_module = course_info.code_module""")
            data = cursor.fetchall()
            courses = []
            for row in data:
                year = row[2][0:4]
                monthStart = "February" if (row[2][4] == "B") else "October"
                item = {
                    "name": row[0],
                    "codeModule": row[1],
                    "codePresentation": row[2],
                    "major": row[3],
                    "year": year,
                    "monthStart": monthStart,
                    "length": row[4],
                    "studentCount": 40,
                }
                courses.append(item)
            return courses

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            conn.close()


class GetStudentById(Resource):
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """select * from student_info 
                where id_student = \"{}\"; 
                """.format(id))
            data = cursor.fetchall()

            info = data[0]
            profile = {
                "id_student": info[0],
                "parents_id": info[2],
                "relationship_with_parents": info[3],
                "gender": "Male" if info[4] == "M" else "Female",
                "region": info[5],
                "highest_education": info[6],
                "imd_band": info[7],
                "age_band": info[8],
                "disability": info[9],
            }
            return profile

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetParentsById(Resource):
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """select * from parents
                where personal_id = {}; 
                """.format(id))
            data = cursor.fetchall()

            info = data[0]
            profile = {
                "personal_id": info[0],
                "email": info[2],
                "phone_number": info[3],
                "name": info[4],
                "gender": info[5],
                "highest_education": info[6],
                "job": info[7],
                "date_of_birth": info[8],
                "language": info[9],
                "region": info[10]
            }
            return profile

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetAllCoursesOfStudent(Resource):
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT t3.name, t1.code_module, t1.code_presentation, t3.major, t2.length, t2.id_educator
                    FROM student_register as t1
                    INNER JOIN courses as t2 ON t1.code_module = t2.code_module AND t1.code_presentation = t2.code_presentation
                    INNER JOIN course_info as t3 ON t2.code_module = t3.code_module
                    where t1.id_student = \"{}\"; 
                """.format(id))
            data = cursor.fetchall()
            cursor.close()
            courses = []
            for row in data:
                year = row[2][0:4]
                monthStart = "February" if (row[2][4] == "B") else "October"
                item = {
                    "name": row[0],
                    "codeModule": row[1],
                    "codePresentation": row[2],
                    "major": row[3],
                    "year": year,
                    "monthStart": monthStart,
                    "length": row[4],
                    "studentCount": 40,
                }
                courses.append(item)
            return courses

        except Exception as e:
            return make_response(str(e), 400)


class GetAllMaterialInCourse(Resource):
    def get(self, code_module, code_presentation):
        try:
            materials = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""
                SELECT id_site, activity_type, week_from, week_to 
                FROM material
                where code_module =\""""+code_module+"\"and code_presentation=\""+code_presentation+"\";"
                           )
            data = cursor.fetchall()
            for row in data:
                material = {
                    "id_site": row[0],
                    "activity_type": row[1],
                    "week_from": row[2],
                    "week_to": row[3],
                }
                materials.append(material)
            cursor.close()
            return materials

        except Exception as e:
            return {'error': str(e)}


class GetAllAssessmentInCourse(Resource):
    def get(self, code_module, code_presentation):
        try:
            assessments = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""
                SELECT id_assessment, assessment_type, date, weight
                FROM assessments
                where code_module =\""""+code_module+"\"and code_presentation=\""+code_presentation+"\";"
                           )
            data = cursor.fetchall()
            for row in data:
                assessment = {
                    "id_assessment": row[0],
                    "assessment_type": row[1],
                    "date": row[2],
                    "weight": row[3],
                }
                assessments.append(assessment)
            cursor.close()
            return assessments

        except Exception as e:
            return {'error': str(e)}


class GetAllMessages(Resource):
    def get(self, username):
        try:
            messages = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT id FROM user_account
                           WHERE username = \"{}\";
                           """.format(username))
            id = cursor.fetchall()[0][0]
            cursor.execute("""
                SELECT * from message
                WHERE sender_id=\"{}\" OR receiver_id=\"{}\";
                """.format(id, id)
                           )
            data = cursor.fetchall()
            for row in data:
                message = {
                    "sender_id": row[1],
                    "receiver_id": row[2],
                    "message": row[3],
                    "created_time": str(row[4]),
                }
                messages.append(message)
            return messages

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetAllWarning(Resource):
    def get(self, id):
        try:
            warnings = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT * FROM warning
                           WHERE id_student = \"{}\";
                           """.format(id))
            data = cursor.fetchall()
            for row in data:
                warning = {
                    "code_module": row[2],
                    "code_presentation": row[3],
                    "content": row[4],
                    "status": row[5],
                    "description": row[6],
                    "created_time": str(row[7]),
                }
                warnings.append(warning)
            return warnings

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


api.add_resource(GetAllCourses, '/')
api.add_resource(CreateUserAccount, '/create-user-account')
api.add_resource(EditUserPassword, '/edit-user-password')
api.add_resource(Login, '/login')
api.add_resource(GetStudentById, '/student/<id>')
api.add_resource(GetParentsById, '/parents/<id>')
api.add_resource(GetAllCoursesOfStudent, '/student-register/<id>')
api.add_resource(GetAllMaterialInCourse,
                 '/materials/<code_module>/<code_presentation>')
api.add_resource(GetAllAssessmentInCourse,
                 '/assessments/<code_module>/<code_presentation>')
api.add_resource(GetAllMessages,
                 '/message/<username>')
api.add_resource(GetAllWarning,
                 '/warning/<id>')


if __name__ == '__main__':
    app.run(debug=True)
