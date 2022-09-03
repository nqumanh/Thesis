from flask import Flask, make_response, request
from flask_restful import Resource, Api
from flaskext.mysql import MySQL
from flask_cors import CORS#, cross_origin
from werkzeug.security import generate_password_hash#, check_password_hash
import uuid


mysql = MySQL()
app = Flask(__name__)

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'qm187606595'
app.config['MYSQL_DATABASE_DB'] = 'warningsystem'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'


mysql.init_app(app)

api = Api(app)

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
            cursor.close()
            courses = []
            for row in data:
                year = row[2][0:4];
                monthStart = "February" if (row[2][4]=="B") else "October"
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
        
        
# class GetStudentById(Resource):
#     def get(self, id):
#         try: 
#             con = mysql.connect();
#             cursor = con.cursor()
#             cursor.execute(
#                 """SELECT t3.name, t1.code_module, t1.code_presentation, t3.major, t2.length, t2.id_educator
#                     FROM student_register as t1
#                     INNER JOIN courses as t2 ON t1.code_module = t2.code_module AND t1.code_presentation = t2.code_presentation
#                     INNER JOIN course_info as t3 ON t2.code_module = t3.code_module
#                     where t1.id_student = """+id+";")
#             data = cursor.fetchall()
#             cursor.close()
#             courses = []
#             for row in data:
#                 year = row[2][0:4];
#                 monthStart = "February" if (row[2][4]=="B") else "October"
#                 item = {
#                     "name": row[0], 
#                     "codeModule": row[1], 
#                     "codePresentation": row[2], 
#                     "major": row[3], 
#                     "year": year, 
#                     "monthStart": monthStart, 
#                     "length": row[4], 
#                     "studentCount": 40, 
#                 }
#                 courses.append(item)
#             return courses

#         except Exception as e:
#             return {'error': str(e)}
        
        
class GetAllCoursesOfStudent(Resource):
    def get(self, id):
        try: 
            con = mysql.connect();
            cursor = con.cursor()
            cursor.execute(
                """SELECT t3.name, t1.code_module, t1.code_presentation, t3.major, t2.length, t2.id_educator
                    FROM student_register as t1
                    INNER JOIN courses as t2 ON t1.code_module = t2.code_module AND t1.code_presentation = t2.code_presentation
                    INNER JOIN course_info as t3 ON t2.code_module = t3.code_module
                    where t1.id_student = """+id+";")
            data = cursor.fetchall()
            cursor.close()
            courses = []
            for row in data:
                year = row[2][0:4];
                monthStart = "February" if (row[2][4]=="B") else "October"
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


class GetAllMaterialInCourse(Resource):
    def get(self, code_module, code_presentation):
        try: 
            materials=[]
            con = mysql.connect();
            cursor = con.cursor()
            cursor.execute("""
                SELECT id_site, activity_type, week_from, week_to 
                FROM warningsystem.material
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
            assessments=[]
            con = mysql.connect();
            cursor = con.cursor()
            cursor.execute("""
                SELECT id_assessment, assessment_type, date, weight
                FROM warningsystem.assessments
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


class CreateUserAccount(Resource):
    def post(self):
        try:
            # Parse the arguments
            data = request.form
            username = data.get('username')
            password = data.get('password')
            hashPassword = generate_password_hash(password)
            id = str(uuid.uuid4())
            print('hashPassword', hashPassword)
            con = mysql.connect();
            cursor = con.cursor()
            cursor.execute("""INSERT INTO warningsystem.user_account (id, username, password, role) VALUES ("{}", "{}", "{}", "{}")""".format(id, username, hashPassword, 'student'))
            con.commit()
            cursor.close()
            return make_response('Successfully registered.', 201)

        except Exception as e:
            return {'error': str(e)}
        

api.add_resource(GetAllCourses, '/')
api.add_resource(CreateUserAccount, '/')
# api.add_resource(GetStudentById, '/student/<id>')
api.add_resource(GetAllCoursesOfStudent, '/student-register/<id>')
api.add_resource(GetAllMaterialInCourse, '/materials/<code_module>/<code_presentation>')
api.add_resource(GetAllAssessmentInCourse, '/assessments/<code_module>/<code_presentation>')

if __name__ == '__main__':  
    app.run(debug=True)