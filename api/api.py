from re import X
from flask import Flask, make_response, request, jsonify
from flask_restful import Resource, Api
from flaskext.mysql import MySQL
from flask_cors import CORS  # , cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from functools import reduce
import numpy as np
# from sklearn.linear_model import LinearRegression
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn import svm
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
from sklearn.model_selection import cross_val_score
from sklearn.metrics import mean_squared_error
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from sklearn import metrics
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn import svm
from sklearn.svm import LinearSVC
# from flask_jwt_extended import get_jwt_identity
from datetime import timedelta
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import cross_validate
from imblearn.ensemble import BalancedBaggingClassifier
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier
from imblearn.ensemble import BalancedRandomForestClassifier

mysql = MySQL()
app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'
# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'qm187606595'
app.config['MYSQL_DATABASE_DB'] = 'warningsystem'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'

app.config["JWT_SECRET_KEY"] = "super-super-secret"  # Change this!

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

mysql.init_app(app)

api = Api(app)


class GetAssessmentsEachCourse(Resource):
    def get(self, code_module, code_presentation):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""
                SELECT id_assessment, weight FROM assessments
                WHERE code_module = \'{}\' AND code_presentation = \'{}\'
            """.format(code_module, code_presentation))
            assessments = cursor.fetchall()
            cursor.execute("""
                SELECT id_student FROM student_register
                WHERE code_module = \'{}\' AND code_presentation = \'{}\'
            """.format(code_module, code_presentation))
            students = cursor.fetchall()
            student_assessments = []
            for student in students:
                student_assessment = []
                for assessment in assessments:
                    cursor.execute("""
                        SELECT score FROM student_assessments
                        WHERE id_student = \'{}\' AND id_assessment = \'{}\'
                    """.format(student[0], assessment[0]))
                    data = cursor.fetchone()
                    score = 0
                    if data:
                        if data[0] != '?':
                            score = int(data[0])
                    student_assessment += [assessment[1], score]
                student_assessments.append(
                    [student[0], code_module, code_presentation]+student_assessment)
            for row in student_assessments:
                cursor.execute("""
                    INSERT INTO prediction_scores
                    VALUES (\'{}\',\'{}\',\'{}\',{});
                """.format(row[0], row[1], row[2], ','.join(list(map(lambda x: str(x), row[3:])))))
            con.commit()
            return 1
        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class PredictByInteractions(Resource):
    def get(self, code_module, code_presentation):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""
                SELECT id_student FROM student_register
                WHERE code_module = \'{}\' AND code_presentation = \'{}\'
            """.format(code_module, code_presentation))
            students = cursor.fetchall()
            student_interaction = []
            for row in students:
                codeModule, codePresentation, idStudent = code_module, code_presentation, row[
                    0]
                cursor.execute("""
                    SELECT SUM(sum_click) FROM student_interaction
                    WHERE code_module = '{}' AND code_presentation='{}' AND id_student='{}';
                    """.format(codeModule, codePresentation, idStudent)
                               )
                data = cursor.fetchall()[0][0]
                totalClicks = int(data) if data != None else 0
                cursor.execute("""
                    SELECT COUNT(*) FROM (
                        SELECT COUNT(date) FROM student_interaction
                        WHERE code_module = '{}' AND code_presentation='{}' AND id_student='{}'
                        group by date
                    ) AS NUM_OF_INTERACTION_DATE
                """.format(codeModule, codePresentation, idStudent)
                )
                interactionFrequency = cursor.fetchall()[0][0]
                student_interaction.append(
                    [idStudent, codeModule, codePresentation, totalClicks, interactionFrequency])
            for row in student_interaction:
                cursor.execute("""
                    INSERT INTO prediction_interaction
                    VALUES (\'{}\',\'{}\',\'{}\',{});
                """.format(row[0], row[1], row[2], ','.join(list(map(lambda x: str(x), row[3:])))))
            con.commit()
            return len(student_interaction)
        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class PredictExamResult(Resource):
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""
                SELECT * FROM assessments
                INNER JOIN student_assessments
                ON assessments.id_assessment = student_assessments.id_assessment
                WHERE assessment_type = \"Exam\" AND DATE !=\"?\";
                            """
                           )
            data = cursor.fetchall()
            results = []
            for row in data:
                result = {
                    "code_module": row[1],
                    "code_presentation": row[2],
                    "id_student": row[7],
                    "score": row[9]
                }
                results.append(result)
            for result in results:
                cursor.execute("""
                    select score, weight from student_assessments as a
                    inner join assessments as b on a.id_assessment = b.id_assessment
                    where id_student = \"{}\" AND assessment_type!=\"Exam\" AND code_module=\"{}\" AND code_presentation=\"{}\";
                               """.format(result['id_student'], result['code_module'], result['code_presentation']))
                data = cursor.fetchall()
                comp_score = reduce(lambda avg, ele: avg +
                                    float(ele[0])*float(ele[1])/100 if ele[0] != '?' else avg, list(data), 0)
                result['comp_score'] = comp_score
            X = np.array(list(map(lambda x: [x['comp_score']], results)))
            # 2094
            y = np.array(
                list(map(lambda x: 1 if float(x['score']) >= 40 else 0, results)))
            # X_train, X_test, y_train, y_test = train_test_split(
            #     X, y, test_size=0.2, random_state=0)

            # classifier = svm.SVC()
            # classifier = svm.LinearSVC()
            classifier = RandomForestClassifier()
            # classifier = LogisticRegression()
            classifier.fit(X, y)
            # print(classifier.score(X, y))  #Accuracy
            predicted = classifier.predict(np.array(X).reshape(-1, 1))

            Accuracy = metrics.accuracy_score(y, predicted)
            Precision = metrics.precision_score(y, predicted)
            Sensitivity_recall = metrics.recall_score(y, predicted)
            Specificity = metrics.recall_score(y, predicted, pos_label=0)
            F1_score = metrics.f1_score(y, predicted)

            print({"Accuracy": Accuracy, "Precision": Precision, "Sensitivity_recall":
                  Sensitivity_recall, "Specificity": Specificity, "F1_score": F1_score})
            #
            # print(len(list(filter(lambda x: x == 0, predicted))))

            # y_pred = classifier.predict(X_test)

            return 1

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class DynamicPredict(Resource):
    def get(self, code_module, code_presentation):
        try:
            con = mysql.connect()
            cursor = con.cursor()

            test_set = []
            # get assessment format of target course
            cursor.execute("""
            SELECT assessment_type, weight, number, id_assessment FROM assessments
            WHERE code_module = "{}" AND code_presentation = "{}";
            """.format(code_module, code_presentation))
            data = cursor.fetchall()
            currentAssessmentFormat = []
            for row in data:
                currentAssessmentFormat.append(
                    {"type": row[0], "weight": row[1], "number": row[2], "id": row[3]})

            # get test_set
            students = []
            cursor.execute("""
                SELECT id_student, final_result FROM student_register
                WHERE code_module = "{}" AND code_presentation = "{}";
            """.format(code_module, code_presentation))
            data = cursor.fetchall()
            for row in data:
                students.append(
                    {"id": row[0], "result": 1 if row[1] in ["Pass", "Distinction"] else 0})
            for student in students:
                result = []
                for assessment in currentAssessmentFormat:
                    cursor.execute("""
                            SELECT score FROM student_assessments
                            WHERE id_student="{}" AND id_assessment="{}";
                        """.format(student["id"], assessment["id"]))
                    data = cursor.fetchone()
                    score = 0
                    if data is None:
                        score = 0
                    else:
                        score = 0 if data[0] == '?' else (int)(data[0])
                    typ = 0
                    if assessment["type"] == "TMA":
                        typ = 1
                    elif assessment["type"] == "CMA":
                        typ = 2
                    else:
                        typ = 3
                    if typ == 3:
                        continue
                    result.extend([typ, assessment["weight"], score])
                result.append(student["result"])
                test_set.append(result)

            # get other courses with same code_module
            cursor.execute("""
            SELECT code_presentation FROM courses
            WHERE code_module = "{}" AND code_presentation <> "{}";
            """.format(code_module, code_presentation))
            courses = cursor.fetchall()

            train_set = []
            for course in courses:
                # get all students registered in each course
                preStudents = []
                cursor.execute("""
                    SELECT id_student, final_result FROM student_register
                    WHERE code_module = "{}" AND code_presentation = "{}";
                """.format(code_module, course[0]))
                data = cursor.fetchall()
                for row in data:
                    preStudents.append(
                        {"id": row[0], "result": 1 if row[1] in ["Pass", "Distinction"] else 0})

                # get assessments which fit with assessment format of target course
                assessments = []
                for assessment in currentAssessmentFormat:
                    cursor.execute("""
                        SELECT id_assessment FROM assessments
                        WHERE code_module = "{}"
                            AND code_presentation = "{}"
                            AND assessment_type="{}"
                            AND weight="{}"
                            AND number="{}";
                    """.format(code_module, course[0], assessment["type"], assessment["weight"], assessment["number"]))
                    idAssessment = cursor.fetchone()
                    if idAssessment is not None:
                        assessments.append(
                            {"id": idAssessment[0], "type": assessment["type"], "weight": assessment["weight"]})

                # get student assessment for train set
                for student in preStudents:
                    result = []
                    for assessment in assessments:
                        cursor.execute("""
                            SELECT score FROM student_assessments
                            WHERE id_student="{}" AND id_assessment="{}";
                        """.format(student["id"], assessment["id"]))
                        data = cursor.fetchone()
                        score = 0
                        if data is None:
                            score = 0
                        else:
                            score = 0 if data[0] == '?' else (int)(data[0])
                        typ = 0
                        if assessment["type"] == "TMA":
                            typ = 1
                        elif assessment["type"] == "CMA":
                            typ = 2
                        else:
                            typ = 3
                        if typ == 3:
                            continue
                        result.extend([typ, assessment["weight"], score])
                    result.append(student["result"])
                    train_set.append(result)

            X_train = np.array(train_set)[:, :-1]
            y_train = np.array(train_set)[:, -1]
            X_test = np.array(test_set)[:, :-1]
            y_test = np.array(test_set)[:, -1]

            


            # SMOTE-Bagging
            # smote_bagging = BalancedBaggingClassifier(sampler=SMOTE())
            # cv_results = cross_validate(smote_bagging, X_train, y_train, scoring="balanced_accuracy")
            # print(cv_results)

            smote_bagging = BalancedRandomForestClassifier(max_depth=2, random_state=0).fit(X_train, y_train)
            # clf = LogisticRegression(max_iter=100).fit(X_train, y_train)
            # clf = BaggingClassifier(
            #             n_estimators=10, random_state=0).fit(X_train, y_train)
            clf = RandomForestClassifier().fit(X_train, y_train)
            # clf = svm.SVC().fit(X_train, y_train)
            # clf = make_pipeline(StandardScaler(), LinearSVC()
            #                     ).fit(X_train, y_train)
            # clf = make_pipeline(StandardScaler(), SVC(
            #     gamma='auto')).fit(X_train, y_train)

            predicted = clf.predict(X_test)
            predicted1 = smote_bagging.predict(X_test)
            
            prob_predicted = clf.predict_proba(X_test)

            # (True Positive + True Negative) / Total Predictions
            Accuracy = metrics.accuracy_score(y_test, predicted)
            # True Positive / (True Positive + False Positive)
            Precision = metrics.precision_score(y_test, predicted)
            # True Positive / (True Positive + False Negative)
            Sensitivity_recall = metrics.recall_score(y_test, predicted)
            # True Negative / (True Negative + False Positive)
            Specificity = metrics.recall_score(y_test, predicted, pos_label=0)
            # 2 * ((Precision * Sensitivity) / (Precision + Sensitivity))   HAMONIC mean of precision and recall
            F1_score = metrics.f1_score(y_test, predicted)
            # (True Positive + True Negative) / Total Predictions
            Accuracy1 = metrics.accuracy_score(y_test, predicted1)
            # True Positive / (True Positive + False Positive)
            Precision1 = metrics.precision_score(y_test, predicted1)
            # True Positive / (True Positive + False Negative)
            Sensitivity_recall1 = metrics.recall_score(y_test, predicted1)
            # True Negative / (True Negative + False Positive)
            Specificity1 = metrics.recall_score(y_test, predicted1, pos_label=0)
            # 2 * ((Precision * Sensitivity) / (Precision + Sensitivity))   HAMONIC mean of precision and recall
            F1_score1 = metrics.f1_score(y_test, predicted1)

            print("Accuracy:          ", Accuracy)
            print("Precision:         ", Precision)
            print("Sensitivity_recall:", Sensitivity_recall)
            print("Specificity:       ", Specificity)
            print("F1_score:          ", F1_score)
            print("Accuracy:          ", Accuracy1)
            print("Precision:         ", Precision1)
            print("Sensitivity_recall:", Sensitivity_recall1)
            print("Specificity:       ", Specificity1)
            print("F1_score:          ", F1_score1)

            print(metrics.confusion_matrix(y_test, predicted))
            # print(len(prob_predicted))
            # print(len(students))
            predictions = []
            count = 0
            for i in range(len(students)):
                prediction = {
                    'id_student': student["id"],
                    'created_date': 100,
                    'is_risk': predicted[i],
                    'probability': prob_predicted[i][predicted[i]]
                }
                predictions.append(prediction)
                if prediction['is_risk'] == 0:
                    count += 1

            print(len(prob_predicted), count)

            for prediction in predictions:
                cursor.execute("""
                            INSERT INTO predictions (id_student, code_module, code_presentation, created_date, is_risk, probability)
                            VALUES (\'{}\', \'{}\',\'{}\', {}, {}, {});
                        """.format(prediction["id_student"], code_module, code_presentation, prediction["created_date"], prediction["is_risk"], prediction["probability"]))

            con.commit()
            return 1
        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class Predict(Resource):
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT weight1, score1,
                weight2, score2,
                weight3, score3,
                weight4, score4,
                weight5, score5,
                weight6, score6,
                weight7, score7,
                weight8, score8,
                weight9, score9
                FROM prediction_scores_and_interaction;
                            """
            )
            data = cursor.fetchall()
            students = []
            exams = []
            for row in data:
                students.append(list(row)[:-2])
                exams.append(list(row)[-1])
            #     comp_score = reduce(lambda avg, ele: avg +
            #                         float(ele[0])*float(ele[1])/100 if ele[0] != '?' else avg, list(data), 0)
            #     result['comp_score'] = comp_score
            X = np.array(students)
            y = np.array(list(map(lambda x: 0 if x < 40 else 1, exams)))
            # # 2094

            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0., random_state=0)

            # classifier = svm.SVC() #all-92%

            classifier = svm.LinearSVC()
            # classifier = RandomForestClassifier()
            # classifier = LogisticRegression()

            # classifier.fit(X, y)
            classifier.fit(X_train, y_train)

            # predicted = classifier.predict(np.array(X))
            predicted = classifier.predict(np.array(X_test))

            # y_test = y

            # print(len(list(filter(lambda x: x == 0, predicted))))
            # print(len(list(filter(lambda x: x == 1, predicted))))
            # print(len(list(filter(lambda x: x == 0, y))))
            # print(len(list(filter(lambda x: x == 1, y))))

            # (True Positive + True Negative) / Total Predictions
            # Score = classifier.score(X, y)
            # Score = classifier.score(X_test, y_test)

            # (True Positive + True Negative) / Total Predictions
            Accuracy = metrics.accuracy_score(y_test, predicted)

            # True Positive / (True Positive + False Positive)
            Precision = metrics.precision_score(y_test, predicted)

            # True Positive / (True Positive + False Negative)
            Sensitivity_recall = metrics.recall_score(y_test, predicted)

            # True Negative / (True Negative + False Positive)
            Specificity = metrics.recall_score(y_test, predicted, pos_label=0)

            # 2 * ((Precision * Sensitivity) / (Precision + Sensitivity))   HAMONIC mean of precision and recall
            F1_score = metrics.f1_score(y_test, predicted)

            # print({"Score": Score, "Accuracy": Accuracy, "Precision": Precision, "Sensitivity_recall":
            #       Sensitivity_recall, "Specificity": Specificity, "F1_score": F1_score})
            # print("Score:             ", Score)
            print("Accuracy:          ", Accuracy)
            print("Precision:         ", Precision)
            print("Sensitivity_recall:", Sensitivity_recall)
            print("Specificity:       ", Specificity)
            print("F1_score:          ", F1_score)

            # print(len(list(filter(lambda x: x == 0, predicted))))

            # y_pred = classifier.predict(X_test)

            return 1

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class EditUserPassword(Resource):
    @jwt_required()
    def post(self):
        try:
            data = request.form
            username, oldPassword, newPassword = data.get(
                'username'), data.get('old_password'), data.get('new_password')
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT password 
                            FROM user_account
                            WHERE username=\"{}\";"""
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


class GetAllCourses(Resource):
    @jwt_required()
    def get(self):
        try:
            conn = mysql.connect()
            cursor = conn.cursor()
            cursor.execute(
                """SELECT name,courses.code_module,code_presentation, major, length 
                FROM courses
                JOIN course_info
                ON courses.code_module = course_info.code_module""")
            data = cursor.fetchall()
            courses = []
            for idx, row in enumerate(data):
                year = row[2][0:4]
                monthStart = "February" if (row[2][4] == "B") else "October"
                item = {
                    "id": idx,
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
    @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT id_student, parents_id, relationship_with_parents, gender, region, highest_education, imd_band, age_band, disability 
                FROM student_info
                WHERE id_student = \"{}\";
                """.format(id))
            info = cursor.fetchall()[0]
            profile = {
                "id_student": info[0],
                "parents_id": info[1],
                "relationship_with_parents": info[2],
                "gender": "Male" if info[3] == "M" else "Female",
                "region": info[4],
                "highest_education": info[5],
                "imd_band": info[6],
                "age_band": info[7],
                "disability": info[8],
            }
            return profile

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetParentsById(Resource):
    @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT personal_id, email, phone_number, name, gender, highest_education, job, date_of_birth, language, region
                FROM parents
                WHERE personal_id = {};
                """.format(id))
            info = cursor.fetchall()[0]
            profile = {
                "personal_id": info[0],
                "email": info[1],
                "phone_number": info[2],
                "name": info[3],
                "gender": info[4],
                "highest_education": info[5],
                "job": info[6],
                "date_of_birth": info[7],
                "language": info[8],
                "region": info[9]
            }
            return profile

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetAllCoursesOfStudent(Resource):
    # @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """ SELECT t3.name, t1.code_module, t1.code_presentation, t3.major, t2.length, t2.id_educator
                    FROM student_register AS t1
                    JOIN courses AS t2 
                    ON t1.code_module = t2.code_module AND t1.code_presentation = t2.code_presentation
                    JOIN course_info AS t3 
                    ON t2.code_module = t3.code_module
                    WHERE t1.id_student = \"{}\";
                """.format(id))
            data = cursor.fetchall()
            cursor.close()
            courses = []
            for idx, row in enumerate(data):
                year = row[2][0:4]
                monthStart = "February" if (row[2][4] == "B") else "October"
                item = {
                    "id": idx,
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
    @jwt_required()
    def get(self, code_module, code_presentation):
        try:
            materials = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT id_site, activity_type, week_from, week_to
                FROM material
                WHERE code_module =\"{}\" AND code_presentation=\"{}\";
                """.format(code_module, code_presentation)
                           )
            data = cursor.fetchall()
            for row in data:
                material = {
                    "id": row[0],
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
    @jwt_required()
    def get(self, code_module, code_presentation):
        try:
            assessments = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT id_assessment, assessment_type, date, weight
                FROM assessments
                WHERE code_module =\"{}\" AND code_presentation=\"{}\";
                """.format(code_module, code_presentation)
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
            return assessments

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetAllStudents(Resource):
    @jwt_required()
    def get(self, code_module, code_presentation):
        try:
            students = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT i.id_student, name, gender, highest_education, imd_band, age_band, disability, num_of_prev_attempts 
                FROM student_register r
                JOIN student_info i
                ON r.id_student = i.id_student
                WHERE code_module =\"{}\" AND code_presentation=\"{}\";
                """.format(code_module, code_presentation)
                           )
            data = cursor.fetchall()
            for row in data:
                student = {
                    "id": row[0],
                    "name": row[1],
                    "gender": row[2],
                    "highest_education": row[3],
                    "imd_band": row[4],
                    "age_band": row[5],
                    "disability": row[6],
                    "num_of_prev_attempts": row[7]
                }
                students.append(student)
            return students

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetAllMessages(Resource):
    @jwt_required()
    def get(self, username):
        try:
            messages = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT id FROM user_account
                           WHERE username = \"{}\";
                           """.format(username))
            id = cursor.fetchall()[0][0]
            cursor.execute(
                """SELECT
                    (SELECT username from user_account 
                        WHERE id=sender_id) 
                    AS sender,
	                (SELECT username from user_account 
                        WHERE id=receiver_id
                    ) AS receiver,
                    message,
                    created_time
                FROM message
                WHERE sender_id=\"{}\" OR receiver_id=\"{}\"
                ORDER BY created_time;
                """.format(id, id)
            )
            data = cursor.fetchall()
            for row in data:
                message = {
                    "sender_id": row[0],
                    "receiver_id": row[1],
                    "message": row[2],
                    "created_time": str(row[3]),
                }
                messages.append(message)
            return messages

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetAllWarning(Resource):
    @jwt_required()
    def get(self, id):
        try:
            warnings = []
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT code_module, code_presentation, content, status, description, created_time
                            FROM warning
                            WHERE id_student = \"{}\"
                            ORDER BY created_time DESC;
                            """.format(id))
            data = cursor.fetchall()
            for row in data:
                warning = {
                    "code_module": row[0],
                    "code_presentation": row[1],
                    "content": row[2],
                    "status": row[3],
                    "description": row[4],
                    "created_time": str(row[5]),
                }
                warnings.append(warning)
            return warnings

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetCoursesOfEducator(Resource):
    @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT course_info.name,
                        courses.code_module,
                        courses.code_presentation,
                        course_info.major,
                        courses.length
                    FROM courses
                    JOIN course_info 
                    ON courses.code_module = course_info.code_module
                    WHERE courses.id_educator = \"{}\";
                """.format(id))
            data = cursor.fetchall()
            print(data)
            courses = []
            for idx, row in enumerate(data):
                item = {
                    "id": idx,
                    "name": row[0],
                    "codeModule": row[1],
                    "codePresentation": row[2],
                    'year': row[2][0:4],
                    'monthStart': "February" if (row[2][4] == "B") else "October",
                    "major": row[3],
                    "length": row[4],
                }
                courses.append(item)

            return courses

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetContacts(Resource):
    @jwt_required()
    def post(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            content = request.json["listId"]
            for i in range(len(content)):
                cursor.execute("""SELECT name 
                               FROM educator
                               WHERE id_system= \"{}\"
                               """.format(content[i]))
                data = cursor.fetchall()[0][0]
                content[i] = data
            return content
        finally:
            cursor.close()
            con.close()


class GetStudentAssessment(Resource):
    # @jwt_required()
    def get(self, id, code_module, code_presentation):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT assessment_type, date_submitted, score, weight 
                FROM student_assessments AS a
                JOIN assessments AS b 
                ON a.id_assessment = b.id_assessment
                WHERE id_student = \"{}\";
                """.format(id)
                           )
            assessments = []
            data = cursor.fetchall()
            for row in data:
                assessment = {
                    'assessment_type': row[0],
                    'date_submitted': row[1],
                    'score': row[2],
                    'weight': row[3]
                }
                assessments.append(assessment)
            return assessments

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetEducatorName(Resource):
    @jwt_required()
    def get(self, username):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT name FROM educator as e
                INNER JOIN user_account as a ON e.id_system = a.id
                WHERE username = \'{}\';
            """.format(username))
            name = cursor.fetchone()[0]
            return jsonify(name=name)
        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetStudentName(Resource):
    @jwt_required()
    def get(self, username):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT name FROM student_info AS s
                JOIN user_account AS a 
                ON s.id_system = a.id
                WHERE username = \'{}\';
            """.format(username))
            name = cursor.fetchone()[0]
            return jsonify(name=name)
        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetNameByUsername(Resource):
    def get(self, username):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT id FROM user_account
                WHERE username = \'{}\';
            """.format(username))
            id_system = cursor.fetchone()[0]
            table = 'parents' if username[0] == '2' else 'student_info' if username[0] == '1' else 'educator'
            cursor.execute(
                """SELECT name FROM {}
                WHERE id_system = \'{}\';
            """.format(table, id_system))
            name = cursor.fetchone()[0]
            return jsonify(name=name)
        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


# __________________________________________________________________


# admin

api.add_resource(PredictExamResult, '/predict-exam-result')  # test

api.add_resource(GetAssessmentsEachCourse,
                 '/get-assessments-each-course/<code_module>/<code_presentation>')
api.add_resource(PredictByInteractions,
                 '/predict-by-interactions/<code_module>/<code_presentation>')
api.add_resource(Predict, '/predict')
api.add_resource(
    DynamicPredict, '/dynamic-predict/<code_module>/<code_presentation>')

# all users
api.add_resource(Login, '/login')
api.add_resource(GetNameByUsername, '/get-name-by-username/<username>')
api.add_resource(EditUserPassword, '/edit-user-password')
api.add_resource(GetAllMessages,
                 '/message/<username>')
api.add_resource(GetContacts, '/get-contacts')


# student
api.add_resource(GetStudentName, '/get-student-name/<username>')
api.add_resource(GetAllCoursesOfStudent, '/student-register/<id>')
api.add_resource(GetStudentById, '/student/<id>')
api.add_resource(GetAllWarning,
                 '/warning/<id>')
api.add_resource(GetStudentAssessment,
                 '/student-assessment/<id>/<code_module>/<code_presentation>')

# educator
api.add_resource(GetEducatorName, '/get-educator-name/<username>')
api.add_resource(GetCoursesOfEducator,
                 '/get-courses-of-educator/<id>')
api.add_resource(GetAllMaterialInCourse,
                 '/materials/<code_module>/<code_presentation>')
api.add_resource(GetAllAssessmentInCourse,
                 '/assessments/<code_module>/<code_presentation>')
api.add_resource(GetAllStudents,
                 '/view-all-students/<code_module>/<code_presentation>')

# parents
api.add_resource(GetParentsById, '/parents/<id>')


if __name__ == '__main__':
    app.run(debug=True)
