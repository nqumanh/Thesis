from email.message import EmailMessage
import base64
from googleapiclient.errors import HttpError
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
import os.path
from re import X
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
from sklearn import metrics
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn import svm
from sklearn.svm import LinearSVC
# from flask_jwt_extended import get_jwt_identity
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import cross_validate
from imblearn.ensemble import BalancedBaggingClassifier
from sklearn.ensemble import BaggingClassifier
from sklearn.tree import DecisionTreeClassifier
from imblearn.pipeline import make_pipeline as make_pipeline_with_sampler
from imblearn.under_sampling import RandomUnderSampler
from imblearn.ensemble import BalancedRandomForestClassifier
from imblearn.over_sampling import RandomOverSampler
from datetime import datetime

from flask import Flask, make_response, request, jsonify
from flask_restful import Resource, Api
from flaskext.mysql import MySQL
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from datetime import timedelta

from api.resources.login import Login

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


# If modifying these scopes, delete the file token.json.
SCOPES = ['https://mail.google.com/']

creds = None
# The file token.json stores the user's access and refresh tokens, and is
# created automatically when the authorization flow completes for the first
# time.
if os.path.exists('token.json'):
    creds = Credentials.from_authorized_user_file('token.json', SCOPES)
# If there are no (valid) credentials available, let the user log in.
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(
            'credentials.json', SCOPES)
        creds = flow.run_local_server(port=0)
    # Save the credentials for the next run
    with open('token.json', 'w') as token:
        token.write(creds.to_json())


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

            # lr_clf = make_pipeline_with_sampler(
            #     preprocessor_linear,
            #     RandomUnderSampler(random_state=42),
            #     LogisticRegression(max_iter=1000),
            # )
            # smote_bagging
            clf = BalancedRandomForestClassifier(
                max_depth=2, random_state=0).fit(X_train, y_train)
            # ros = RandomOverSampler()
            # X_resampled, y_resampled = ros.fit_resample(X_train, y_train)
            # clf = svm.SVC().fit(X_resampled, y_resampled)

            # clf = LogisticRegression(max_iter=100).fit(X_train, y_train)
            # clf = BaggingClassifier(
            #             n_estimators=10, random_state=0).fit(X_train, y_train)
            # clf = RandomForestClassifier().fit(X_train, y_train)
            # clf = svm.SVC().fit(X_train, y_train)
            # clf = make_pipeline(StandardScaler(), LinearSVC()
            #                     ).fit(X_train, y_train)
            # clf = make_pipeline(StandardScaler(), SVC(
            #     gamma='auto')).fit(X_train, y_train)

            predicted = clf.predict(X_test)
            # predicted1 = smote_bagging.predict(X_test)

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

            print("Accuracy:          ", Accuracy)
            print("Precision:         ", Precision)
            print("Sensitivity_recall:", Sensitivity_recall)
            print("Specificity:       ", Specificity)
            print("F1_score:          ", F1_score)

            print(metrics.confusion_matrix(y_test, predicted))
            # print(len(prob_predicted))
            # print(len(students))
            predictions = []
            for i in range(len(students)):
                prediction = {
                    'id_student': students[i]["id"],
                    'is_risk': predicted[i],
                    'probability': prob_predicted[i][predicted[i]]
                }
                predictions.append(prediction)

            cursor.execute("SET FOREIGN_KEY_CHECKS=0;")
            cursor.execute("""
                            DELETE FROM predictions
                            WHERE code_module = \'{}\' AND code_presentation = \'{}\';
            """.format(code_module, code_presentation))
            cursor.execute("SET FOREIGN_KEY_CHECKS=1;")

            now = datetime.now().strftime('%Y-%m-%d %H:%M')

            for prediction in predictions:
                cursor.execute("""
                            INSERT INTO predictions (id_student, code_module, code_presentation, is_risk, probability, is_warned, isParentsWarned, CreatedTime)
                            VALUES ('{}', '{}','{}', {}, {}, 0, 0, '{}');
                        """.format(prediction["id_student"], code_module, code_presentation, prediction["is_risk"], prediction["probability"], now))

            con.commit()
            return make_response("Predict successfully!", 200)
        except Exception as e:
            return make_response(str(e), 400)
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

            # True Negative / (True Negative + False Positive)
            Specificity = metrics.recall_score(y_test, predicted, pos_label=0)

            # True Positive / (True Positive + False Positive)
            Precision = metrics.precision_score(y_test, predicted)

            # True Positive / (True Positive + False Negative)
            Sensitivity_recall = metrics.recall_score(y_test, predicted)

            # 2 * ((Precision * recall) / (Precision + recall))   HAMONIC mean of precision and recall
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


class CreateChannel(Resource):
    # @jwt_required()
    def post(self):
        try:
            data = request.json
            Id, AdminId, Name, participantsStr = data.get('id'), data.get(
                'adminId'), data.get('name'), data.get('participants')
            con = mysql.connect()
            cursor = con.cursor()
            participants = participantsStr.split(" ")
            cursor.execute("""INSERT INTO message_channel (Id, AdminId, Name)
            VALUES (\'{}\',{},{});"""
                           .format(
                               Id,
                               'NULL' if AdminId == '' else "\'{}\'".format(
                                   AdminId),
                               'NULL' if Name == '' else "\'{}\'".format(Name),
                           ))
            for participant in participants:
                cursor.execute("""INSERT INTO message_participants (ChannelId, UserId)
                VALUES (\'{}\',\'{}\');"""
                               .format(Id, participant))
            con.commit()
            return make_response('Create a new channel successfully!', 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class CreateMessage(Resource):
    # @jwt_required()
    def post(self):
        try:
            data = request.json
            ChannelId, SenderId, Message = data.get('channelId'), data.get(
                'senderId'), data.get('message')
            con = mysql.connect()
            cursor = con.cursor()
            CreatedTime = datetime.now().strftime('%Y-%m-%d %H:%M')
            cursor.execute("""INSERT INTO messages (ChannelId, SenderId, Message, CreatedTime)
            VALUES ('{}','{}',"{}",'{}');"""
                           .format(ChannelId, SenderId, Message, CreatedTime))

            con.commit()
            cursor.execute(
                """SELECT Id, ChannelId, SenderId, Message, CreatedTime
                FROM messages
                WHERE ChannelId='{}' AND CreatedTime='{}';"""
                .format(ChannelId, CreatedTime))
            mes = cursor.fetchone()
            return make_response({
                'id': mes[0],
                'channelId': mes[1],
                'senderId': mes[2],
                'message': mes[3],
                'createdTime': mes[4],
            }, 200)

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


class GetCourseByCode(Resource):
    def get(self):
        try:
            conn = mysql.connect()
            cursor = conn.cursor()
            args = request.args
            CodeModule, CodePresentation = args.get(
                'CodeModule'), args.get('CodePresentation')
            print(CodeModule)
            cursor.execute(
                """SELECT i.name, c.code_module, code_presentation, i.major, length, id_system, e.name
                FROM courses c
                JOIN course_info i
                    ON i.code_module = c.code_module
                JOIN educator e
                    ON c.id_educator = e.id_educator
                WHERE c.code_module ='{}' AND c.code_presentation='{}';
                """.format(CodeModule, CodePresentation)
            )
            data = cursor.fetchall()[0]
            year = data[2][0:4]
            monthStart = "February" if (data[2][4] == "B") else "October"
            print(data[0])
            return {
                "name": data[0],
                "codeModule": data[1],
                "codePresentation": data[2],
                "major": data[3],
                "year": year,
                "monthStart": monthStart,
                "length": data[4],
                "educatorSystemId": data[5],
                "educatorName": data[6]
            }

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            conn.close()


class GetStudentInfoById(Resource):
    @ jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT id_student, parents_id, relationship_with_parents, gender, region, highest_education, imd_band, age_band, disability, name,email
                FROM student_info
                WHERE id_student = \"{}\";
                """.format(id))
            info = cursor.fetchall()[0]
            profile = {
                "studentId": info[0],
                "parents_id": info[1],
                "relationship_with_parents": info[2],
                "gender": "Male" if info[3] == "M" else "Female",
                "region": info[4],
                "highestEducation": info[5],
                "imd_band": info[6],
                "age_band": info[7],
                "disability": info[8],
                "name": info[9],
                "email": info[10],
            }
            return profile

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetStudentById(Resource):
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            id = args.get("id")
            cursor.execute(
                """SELECT s.id_student, s.id_system, s.parents_id, s.name, s.relationship_with_parents,
                    s.gender, s.region, s.highest_education, s.imd_band, s.age_band, s.disability, s.email,
                    p.name, p.email, p.phone_number, p.job, p.id_system
                FROM student_info s
                JOIN parents p
                    ON s.parents_id = p.personal_id
                WHERE id_student = \"{}\";
                """.format(id))
            info = cursor.fetchall()[0]
            profile = {
                "studentId": info[0],
                "systemId": info[1],
                "parentsId": info[2],
                "name": info[3],
                "parentsRelationship": info[4],
                "gender": "Male" if info[5] == "M" else "Female",
                "region": info[6],
                "highestEducation": info[7],
                "imdBand": info[8],
                "ageBand": info[9],
                "disability": info[10],
                "email": info[11],
                "parentsName": info[12],
                "parentsEmail": info[13],
                "parentsPhonenumber": info[14],
                "parentsJob": info[15],
                "parentsSystemId": info[16],
            }
            return make_response(profile, 200)

        except Exception as e:
            return make_response(str(e), 404)
        finally:
            cursor.close()
            con.close()


class GetParentsById(Resource):
    @ jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT personal_id, email, phone_number, name, gender, highest_education, job, date_of_birth, language, region
                FROM parents
                WHERE personal_id = {};
                """.format(id))
            info = cursor.fetchall()
            info = info[0]
            profile = {
                "id": info[0],
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
    @ jwt_required()
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
    @ jwt_required()
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
    @ jwt_required()
    def get(self, code_module, code_presentation):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            students = []
            cursor.execute("""SELECT i.id_student, name, gender, highest_education, imd_band, age_band, disability, num_of_prev_attempts, is_risk, is_warned, id_system, Email
                FROM student_register r
                JOIN student_info i
                ON r.id_student = i.id_student
                LEFT JOIN predictions p
                ON r.id_student = p.id_student AND r.code_module = p.code_module AND r.code_presentation = p.code_presentation
                WHERE r.code_module =\"{}\" AND r.code_presentation=\"{}\";
                """.format(code_module, code_presentation)
                           )
            data = cursor.fetchall()
            for row in data:
                student = {
                    "id": row[0],
                    "name": row[1],
                    "gender": "Male" if row[2] == "M" else "Female",
                    "highest_education": row[3],
                    "imd_band": row[4],
                    "age_band": row[5],
                    "disability": "No" if row[6] == "N" else "Yes",
                    "num_of_prev_attempts": row[7],
                    "is_risk": "Yes" if row[8] == 0 else "No",
                    "is_warned": row[9],
                    "systemId": row[10],
                    "email": row[11],
                }
                students.append(student)
            return students

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class WarnAllStudents(Resource):
    @ jwt_required()
    def put(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            data = request.json
            CodeModule, CodePresentation, Content = data.get(
                'CodeModule'), data.get('CodePresentation'), data.get('Content')

            cursor.execute("""SELECT i.id_student, Email, i.id_system
                                FROM predictions p
                                JOIN student_info i
                                    ON i.id_student = p.id_student
                                WHERE is_risk = 0
                                    AND code_module =\"{}\"
                                    AND code_presentation=\"{}\"
                                    AND is_warned = 0;
                                """.format(CodeModule, CodePresentation)
                           )

            predictions = cursor.fetchall()

            emails = list(map(lambda x: x[1], list(predictions)))[:5]
            # can be 100

            now = datetime.now().strftime('%Y-%m-%d %H:%M')
            for prediction in predictions:
                cursor.execute("""INSERT INTO warnings (ReceiverId, StudentId, CodeModule, CodePresentation, Content, CreatedTime)
                                VALUES ('{}', '{}', '{}', '{}', '{}', '{}');"""
                               .format(prediction[2], prediction[0], CodeModule, CodePresentation, Content, now))

            cursor.execute("""UPDATE predictions
                SET is_warned = 1
                WHERE is_risk = 0 AND code_module ='{}' AND code_presentation='{}' AND is_warned = 0;
                """.format(CodeModule, CodePresentation)
                           )

            con.commit()

            service = build('gmail', 'v1', credentials=creds)

            message = EmailMessage()

            message.set_content(Content)

            message['To'] = emails
            message['From'] = """EARLY WARNING SYSTEM <nqumanh@gmail.com>"""
            message['Subject'] = """WARNING FROM {} - {}""".format(
                CodeModule, CodePresentation)

            # encoded message
            encoded_message = base64.urlsafe_b64encode(message.as_bytes()) \
                .decode()

            create_message = {
                'raw': encoded_message
            }
            service.users().messages().send(userId="me", body=create_message).execute()

            students = []
            cursor.execute("""SELECT i.id_student, name, gender, highest_education, imd_band, age_band, disability, num_of_prev_attempts, is_risk, is_warned
                FROM student_register r
                JOIN student_info i
                    ON r.id_student = i.id_student
                LEFT JOIN predictions p
                    ON r.id_student = p.id_student AND r.code_module = p.code_module AND r.code_presentation = p.code_presentation
                WHERE r.code_module ='{}' AND r.code_presentation='{}';
                """.format(CodeModule, CodePresentation)
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
                    "num_of_prev_attempts": row[7],
                    "is_risk": "Yes" if row[8] == 0 else "No",
                    "is_warned": row[9]
                }
                students.append(student)

            return make_response(students, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class WarnStudent(Resource):
    @ jwt_required()
    def post(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            data = request.json
            code_module, code_presentation, id, email, content = data.get('codeModule'), data.get(
                'codePresentation'), data.get('id'), data.get('email'), data.get('content')

            cursor.execute("""UPDATE predictions
                SET is_warned = 1
                WHERE is_risk = 0
                AND id_student = \"{}\"
                AND code_module = \"{}\"
                AND code_presentation = \"{}\";
                """.format(id, code_module, code_presentation)
                           )

            cursor.execute("""SELECT id_system FROM student_info
                        WHERE id_student = '{}';"""
                           .format(id))
            data = cursor.fetchone()

            now = datetime.now().strftime('%Y-%m-%d %H:%M')
            cursor.execute("""INSERT INTO warnings (ReceiverId, StudentId, CodeModule, CodePresentation, Content, CreatedTime)
                            VALUES ('{}', '{}', '{}', '{}', '{}', '{}');"""
                           .format(data[0], id, code_module, code_presentation, content, now))
            con.commit()

            service = build('gmail', 'v1', credentials=creds)

            message = EmailMessage()

            message.set_content(content)

            message['To'] = email
            message['From'] = """EARLY WARNING SYSTEM <nqumanh@gmail.com>"""
            message['Subject'] = """WARNING FROM {} - {}""".format(
                code_module, code_presentation)

            # encoded message
            encoded_message = base64.urlsafe_b64encode(message.as_bytes()) \
                .decode()

            create_message = {
                'raw': encoded_message
            }
            service.users().messages().send(userId="me", body=create_message).execute()

            cursor.execute("""SELECT s.id_student, s.name, is_risk, probability, is_warned, IsParentsWarned
                FROM predictions p
                JOIN student_info s
                ON p.id_student = s.id_student
                WHERE p.id_student = \"{}\"
                AND code_module = \"{}\"
                AND code_presentation = \"{}\";
                """.format(id, code_module, code_presentation)
                           )
            data = cursor.fetchone()

            return make_response({
                "id": data[0],
                "name": data[1],
                "isRisk": "Yes" if data[2] == 0 else "No",
                "probability": str(data[3]),
                "isWarned": data[4],
                "isParentsWarned": data[5],
            }, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class WarnParents(Resource):
    @ jwt_required()
    def post(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            data = request.json
            ParentsSystemId, StudentId, CodeModule, CodePresentation, ParentsEmail, Content = data.get('ParentsSystemId'), data.get(
                'StudentId'), data.get('CodeModule'), data.get('CodePresentation'), data.get('ParentsEmail'), data.get('Content')
            cursor.execute("""UPDATE predictions
                SET isParentsWarned = 1
                WHERE id_student = \"{}\"
                    AND code_module = \"{}\"
                    AND code_presentation = \"{}\";
                """.format(StudentId, CodeModule, CodePresentation)
                           )
            now = datetime.now().strftime('%Y-%m-%d %H:%M')
            cursor.execute("""INSERT INTO warnings (ReceiverId, StudentId, CodeModule, CodePresentation, Content, CreatedTime)
                            VALUES ('{}', '{}', '{}', '{}', '{}', '{}');"""
                           .format(ParentsSystemId, StudentId, CodeModule, CodePresentation, Content, now))
            con.commit()

            service = build('gmail', 'v1', credentials=creds)

            message = EmailMessage()

            message.set_content(Content)

            message['To'] = ParentsEmail
            message['From'] = """EARLY WARNING SYSTEM <nqumanh@gmail.com>"""
            message['Subject'] = """WARNING FROM {} - {}""".format(
                CodeModule, CodePresentation)

            # encoded message
            encoded_message = base64.urlsafe_b64encode(message.as_bytes()) \
                .decode()

            create_message = {
                'raw': encoded_message
            }
            service.users().messages().send(userId="me", body=create_message).execute()

            cursor.execute("""SELECT s.id_student, s.name, is_risk, probability, is_warned, IsParentsWarned
                FROM predictions p
                JOIN student_info s
                ON p.id_student = s.id_student
                WHERE p.id_student = \"{}\"
                AND code_module = \"{}\"
                AND code_presentation = \"{}\";
                """.format(StudentId, CodeModule, CodePresentation)
                           )
            data = cursor.fetchone()
            print(data)
            return make_response({
                "id": data[0],
                "name": data[1],
                "isRisk": "Yes" if data[2] == 0 else "No",
                "probability": str(data[3]),
                "isWarned": data[4],
                "isParentsWarned": data[5],
            }, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetAllMessages(Resource):
    @ jwt_required()
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


class GetWarnings(Resource):
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            ReceiverId = args.get("ReceiverId")
            cursor.execute("""SELECT w.Id, w.CodeModule, w.CodePresentation, w.Content, w.Feedback, w.ResponseTime, w.CreatedTime, i.name, w.StudentId
                            FROM warnings w
                            JOIN student_register r
                                ON w.StudentId = r.id_student AND w.CodeModule = r.code_module AND w.CodePresentation = r.code_presentation
                            JOIN student_info i
                                ON r.id_student = i.id_student
                            WHERE ReceiverId = '{}'
                            ORDER BY CreatedTime DESC;
                            """.format(ReceiverId))
            data = cursor.fetchall()
            warnings = []
            for row in data:
                warning = {
                    "id": row[0],
                    "codeModule": row[1],
                    "codePresentation": row[2],
                    "content": row[3],
                    "feedback": row[4],
                    "responseTime": str(row[5]) if row[5] else '',
                    "createdTime": str(row[6]),
                    "studentName": row[7],
                    "studentId": row[8],
                }
                warnings.append(warning)
            return make_response(warnings, 200)

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


class GetNumberOfCoursesOfEducator(Resource):
    @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT COUNT(*) FROM courses
                    WHERE courses.id_educator = \"{}\";
                """.format(id))
            data = cursor.fetchone()
            return data

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetNumberOfStudentsOfEducator(Resource):
    @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT COUNT(*) FROM student_register s
                JOIN courses c
                ON c.code_module = s.code_module AND c.code_presentation = s.code_presentation
                WHERE id_educator = \'{}\'
                """.format(id))
            data = cursor.fetchone()
            return data

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetNumberOfAtRiskStudentsOfEducator(Resource):
    @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT COUNT(*) FROM student_register s
                JOIN courses c
                ON c.code_module = s.code_module AND c.code_presentation = s.code_presentation
                LEFT JOIN predictions p
                ON s.id_student = p.id_student AND s.code_module = p.code_module AND s.code_presentation = p.code_presentation
                WHERE id_educator = \'{}\' AND is_risk = 0
                """.format(id))
            data = cursor.fetchone()
            return data

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetNumberOfAssessmentsOfEducator(Resource):
    @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT COUNT(*) FROM assessments a
                JOIN courses c
                ON c.code_module = a.code_module AND c.code_presentation = a.code_presentation
                WHERE id_educator = \'{}\'
                """.format(id))
            data = cursor.fetchone()
            return data

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetNumberOfAssessmentTypesOfEducator(Resource):
    # @jwt_required()
    def get(self, id):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute(
                """SELECT COUNT(*) FROM assessments a
                JOIN courses c
                ON c.code_module = a.code_module AND c.code_presentation = a.code_presentation
                WHERE id_educator = \'{}\' AND assessment_type = \'TMA\'
                """.format(id))
            tma = cursor.fetchone()[0]
            cursor.execute(
                """SELECT COUNT(*) FROM assessments a
                JOIN courses c
                ON c.code_module = a.code_module AND c.code_presentation = a.code_presentation
                WHERE id_educator = \'{}\' AND assessment_type = \'CMA\'
                """.format(id))
            cma = cursor.fetchone()[0]
            cursor.execute(
                """SELECT COUNT(*) FROM assessments a
                JOIN courses c
                ON c.code_module = a.code_module AND c.code_presentation = a.code_presentation
                WHERE id_educator = \'{}\' AND assessment_type = \'Exam\'
                """.format(id))
            exm = cursor.fetchone()[0]
            sum = tma + cma + exm
            return {
                'tma': round(tma/sum*100),
                'cma': round(cma/sum*100),
                'exam': 100 - round(tma/sum*100) - round(cma/sum*100),
            }

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
    @jwt_required()
    def get(self, id, code_module, code_presentation):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT a.id_assessment, assessment_type, date_submitted, score, weight
                FROM student_assessments AS s
                JOIN assessments AS a
                ON a.id_assessment = s.id_assessment
                WHERE id_student = \'{}\' AND a.code_module = \'{}\' AND a.code_presentation = \'{}\';
                """.format(id, code_module, code_presentation)
                           )
            assessments = []
            data = cursor.fetchall()
            for idx, row in enumerate(data):
                assessment = {
                    'id': idx,
                    'id_assessment': row[0],
                    'assessment_type': row[1],
                    'date_submitted': row[2],
                    'score': row[3],
                    'weight': row[4]
                }
                assessments.append(assessment)
            return assessments

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetAssessmentStatisticsInCourse(Resource):
    @jwt_required()
    def get(self, code_module, code_presentation):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT id_assessment, assessment_type, date
                FROM assessments
                WHERE code_module = \'{}\' AND code_presentation = \'{}\' AND assessment_type <> 'Exam'
                ORDER BY 0+date;
                """.format(code_module, code_presentation)
                           )
            data = cursor.fetchall()

            cursor.execute("""SELECT COUNT(*) FROM student_register
                WHERE code_module = \'{}\' AND code_presentation = \'{}\';
                """.format(code_module, code_presentation)
                           )
            total = cursor.fetchone()[0]

            assessments = []
            for row in data:
                cursor.execute("""SELECT COUNT(*) FROM student_assessments
                    WHERE id_assessment = \'{}\' AND score >= 40;
                """.format(row[0])
                )
                good = cursor.fetchone()[0]

                assessment = {
                    'assessment_type': row[1],
                    'date': row[2],
                    'good': good,
                    'bad': total-good,
                }
                assessments.append(assessment)

            return assessments

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetPredictionOnStudent(Resource):
    @jwt_required()
    def get(self, id, code_module, code_presentation):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            cursor.execute("""SELECT s.id_student, s.name, is_risk, probability, is_warned, IsParentsWarned
                FROM predictions p
                JOIN student_info s
                    ON p.id_student = s.id_student
                WHERE p.id_student = \"{}\"
                    AND code_module = \"{}\"
                    AND code_presentation = \"{}\";
                """.format(id, code_module, code_presentation)
                           )
            data = cursor.fetchone()
            return {
                "isRisk": "Yes" if data[2] == 0 else "No",
                "probability": str(data[3]),
                "isWarned": data[4],
                "isParentsWarned": data[5],
            } if data else {
                "isRisk": "No",
                "probability": 1,
                "isWarned": 0,
                "isParentsWarned": 0,
            }

        except Exception as e:
            return {'error': str(e)}
        finally:
            cursor.close()
            con.close()


class GetEducatorName(Resource):
    @ jwt_required()
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
    @ jwt_required()
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
    @ jwt_required()
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


class GetAllChannelsByUserId(Resource):
    @ jwt_required()
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            id = args.get("id")
            cursor.execute("""SELECT ChannelId FROM message_participants
                           WHERE UserId = '{}';
                           """.format(id))
            channelList = cursor.fetchall()
            channels = []
            for row in channelList:
                # cursor.execute("""SELECT SenderId, Message, CreatedTime, AdminId, Name
                #             FROM message_participants p
                #             JOIN message_channel c
                #             ON p.ChannelId = c.ChannelId
                #             WHERE p.ChannelId = '{}'
                #             ORDER BY CreatedTime
                #             """.format(row[0]))
                # # LIMIT 1;
                # lastMessage = cursor.fetchall()[0]
                # lastMessage = ['']*5
                # lastSender = lastMessage[0][0]
                cursor.execute("""SELECT UserId, role
                                FROM message_participants p
                                JOIN user_account a
                                    ON p.UserId = a.id
                                WHERE ChannelId = '{}' AND UserId <> '{}';
                           """.format(row[0], id))
                account = cursor.fetchone()

                if account is None:
                    continue

                user = {'id': account[0], 'name': ''}

                if account[1] == "student":
                    cursor.execute("""SELECT name
                                FROM student_info
                                WHERE id_system = '{}';
                           """.format(user["id"]))
                    user["name"] = cursor.fetchone()[0]
                elif account[1] == "educator":
                    cursor.execute("""SELECT name
                                FROM educator
                                WHERE id_system = '{}';
                           """.format(user["id"]))
                    user["name"] = cursor.fetchone()[0]
                else:
                    cursor.execute("""SELECT name
                                FROM parents
                                WHERE id_system = '{}';
                           """.format(user["id"]))
                    user["name"] = cursor.fetchone()[0]

                channel = {
                    "id": row[0],
                    "name": user["name"],
                    "userId": user["id"],
                    "lastSender": id,
                    "message": '',
                    "createdTime": '',
                }
                channels.append(channel)

            return make_response(channels, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetAllMessagesByChannelId(Resource):
    @ jwt_required()
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            id = args.get("id")
            cursor.execute("""SELECT Id, SenderId, Message, CreatedTime FROM messages
                           WHERE ChannelId = \"{}\";
                           """.format(id))
            data = cursor.fetchall()
            messages = []
            for row in data:
                message = {
                    "id": row[0],
                    "senderId": row[1],
                    "message": row[2],
                    "createdTime": row[3],
                }
                messages.append(message)

            return make_response(messages, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class AddFeedbackToWarning(Resource):
    @jwt_required()
    def put(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            data = request.json
            Id, Feedback = data.get("Id"), data.get("Feedback")
            now = datetime.now().strftime('%Y-%m-%d %H:%M')

            cursor.execute("""UPDATE warnings
                            SET Feedback = '{}', ResponseTime = '{}'
                            WHERE Id = {};
                           """.format(Feedback, now, Id))
            con.commit()
            cursor.execute("""SELECT w.Id, w.CodeModule, w.CodePresentation, w.Content, w.Feedback, w.ResponseTime, w.CreatedTime, i.id_student, i.name
                            FROM warnings w
                            JOIN student_register r
                                ON w.StudentId = r.id_student AND w.CodeModule = r.code_module AND w.CodePresentation = r.code_presentation
                            JOIN student_info i
                                ON r.id_student = i.id_student
                            WHERE Id = {};
                            """.format(Id))
            data = cursor.fetchone()
            warning = {
                "id": data[0],
                "codeModule": data[1],
                "codePresentation": data[2],
                "content": data[3],
                "feedback": data[4],
                "responseTime": str(data[5]),
                "createdTime": str(data[6]),
                "studentId": data[7],
                "studentName": data[8]
            }
            return make_response(warning, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetNumberOfCoursesOfStudent(Resource):
    @jwt_required()
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            id = args.get('id')
            cursor.execute("""
                SELECT COUNT(*) FROM student_register
                WHERE id_student = '{}';
            """.format(id))
            numberOfCourses = str(cursor.fetchone()[0])
            return make_response(numberOfCourses, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetResponseWarningPercentage(Resource):
    @jwt_required()
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            ReceiverId = args.get('ReceiverId')
            cursor.execute("""
                SELECT COUNT(*) FROM warnings
                WHERE ReceiverId = '{}';
            """.format(ReceiverId))

            totalWarning = cursor.fetchone()[0]

            cursor.execute("""
                SELECT COUNT(*) FROM warnings
                WHERE ReceiverId = '{}' AND Feedback is not NULL;
            """.format(ReceiverId))

            totalResponse = cursor.fetchone()[0]
            print(totalResponse)

            return make_response({"percent": 100 if totalWarning == 0 else round(totalResponse*100/totalWarning, 2)}, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetNumberOfAssessmentsOfStudent(Resource):
    @jwt_required()
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            id = args.get('id')
            cursor.execute("""
                SELECT COUNT(*) FROM student_assessments a
                WHERE id_student = '{}';
            """.format(id))

            totalSubmission = cursor.fetchone()[0]

            cursor.execute("""
                SELECT COUNT(*) FROM assessments a
                JOIN courses c
                    ON a.code_module = c.code_module AND a.code_presentation = c.code_presentation
                JOIN student_register s
                    ON a.code_module = s.code_module AND a.code_presentation = s.code_presentation
                WHERE id_student = '{}' AND assessment_type = \'TMA\';
            """.format(id))
            tma = cursor.fetchone()[0]
            cursor.execute("""
                SELECT COUNT(*) FROM assessments a
                JOIN courses c
                    ON a.code_module = c.code_module AND a.code_presentation = c.code_presentation
                JOIN student_register s
                    ON a.code_module = s.code_module AND a.code_presentation = s.code_presentation
                WHERE id_student = '{}' AND assessment_type = \'CMA\';
            """.format(id))
            cma = cursor.fetchone()[0]
            cursor.execute("""
                SELECT COUNT(*) FROM assessments a
                JOIN courses c
                    ON a.code_module = c.code_module AND a.code_presentation = c.code_presentation
                JOIN student_register s
                    ON a.code_module = s.code_module AND a.code_presentation = s.code_presentation
                WHERE id_student = '{}' AND assessment_type = \'Exam\';
            """.format(id))
            exm = cursor.fetchone()[0]
            sum = tma + cma + exm

            return make_response({
                'tma': round(tma/sum*100),
                'cma': round(cma/sum*100),
                'exam': 100 - round(tma/sum*100) - round(cma/sum*100),
                "totalSubmission": totalSubmission
            }, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetCourseListOfStudentByParentsId(Resource):
    @jwt_required()
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            Id = args.get('Id')
            cursor.execute("""SELECT i.name, i.code_module, c.code_presentation, i.major, c.length, r.id_student, s.name
                FROM student_register r
                JOIN student_info s
                    ON r.id_student = s.id_student
                JOIN courses c
                    ON r.code_module = c.code_module AND r.code_presentation = c.code_presentation
                LEFT JOIN course_info i
                    ON c.code_module = i.code_module
                WHERE s.parents_id = '{}';
            """.format(Id))
            data = cursor.fetchall()
            courses = []
            for i, row in enumerate(data):
                course = {
                    "id": i,
                    "name": row[0],
                    "codeModule": row[1],
                    "codePresentation": row[2],
                    "major": row[3],
                    "year": row[2][:4],
                    "monthStart": "February" if (row[2][4] == "B") else "October",
                    "length": row[4],
                    "studentId": row[5],
                    "studentName": row[6],
                }
                courses.append(course)

            return make_response(courses, 200)
        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetStudentAssessments(Resource):
    @jwt_required()
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            StudentId, CodeModule, CodePresentation = args.get(
                "StudentId"), args.get("CodeModule"), args.get("CodePresentation")
            cursor.execute("""SELECT a.id_assessment, assessment_type, date_submitted, score, weight
                FROM student_assessments AS s
                JOIN assessments AS a
                ON a.id_assessment = s.id_assessment
                WHERE id_student = \'{}\' AND a.code_module = \'{}\' AND a.code_presentation = \'{}\';
                """.format(StudentId, CodeModule, CodePresentation)
                           )
            assessments = []
            data = cursor.fetchall()
            for idx, row in enumerate(data):
                assessment = {
                    'id': idx,
                    'id_assessment': row[0],
                    'assessment_type': row[1],
                    'date_submitted': row[2],
                    'score': row[3],
                    'weight': row[4]
                }
                assessments.append(assessment)
            assessments = sorted(
                assessments, key=lambda x: int(x['date_submitted']))

            return make_response(assessments, 200)

        except Exception as e:
            return make_response(str(e), 400)
        finally:
            cursor.close()
            con.close()


class GetSentWarnings(Resource):
    @jwt_required()
    def get(self):
        try:
            con = mysql.connect()
            cursor = con.cursor()
            args = request.args
            CodeModule, CodePresentation = args.get(
                'CodeModule'), args.get('CodePresentation')

            warnings = []
            cursor.execute("""SELECT w.Id, a.role, s.name, s.id_student, w.Content, w.Feedback, w.ResponseTime, w.CreatedTime
                FROM warnings w
                JOIN user_account a
                    ON w.ReceiverId = a.id
                JOIN student_register r
                    ON w.StudentId = r.id_student AND 
                        w.CodeModule = r.code_module AND
                        w.CodePresentation = r.code_presentation
                JOIN student_info s
                    ON r.id_student = s.id_student
                WHERE CodeModule = '{}' AND CodePresentation = '{}';
                """.format(CodeModule, CodePresentation))

            data = cursor.fetchall()
            for row in data:
                warning = {
                    'id': row[0],
                    'role': row[1].capitalize(),
                    'studentName': row[2],
                    'studentId': row[3],
                    'content': row[4],
                    'feedback': row[5],
                    'responseTime': row[6].strftime("%m/%d/%Y, %H:%M") if row[6] else row[6],
                    'createdTime': row[7].strftime("%m/%d/%Y, %H:%M"),
                }
                warnings.append(warning)

            return make_response(warnings, 200)

        except Exception as e:
            return make_response(str(e), 400)
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
api.add_resource(CreateChannel, '/create-channel')
api.add_resource(CreateMessage, '/create-message')
api.add_resource(GetNameByUsername, '/get-name-by-username/<username>')
api.add_resource(EditUserPassword, '/edit-user-password')
api.add_resource(GetAllMessages,
                 '/message/<username>')
api.add_resource(GetContacts, '/get-contacts')
api.add_resource(GetAllChannelsByUserId, '/GetChannels')
api.add_resource(GetAllMessagesByChannelId, '/get-messages')
api.add_resource(GetStudentById, '/GetStudentById')
api.add_resource(GetStudentAssessments, '/GetStudentAssessments')

# student
api.add_resource(GetStudentName, '/get-student-name/<username>')
api.add_resource(GetAllCoursesOfStudent, '/student-register/<id>')
api.add_resource(GetStudentInfoById, '/student/<id>')
api.add_resource(GetWarnings,
                 '/GetWarnings')
api.add_resource(GetStudentAssessment,
                 '/student-assessment/<id>/<code_module>/<code_presentation>')
api.add_resource(GetPredictionOnStudent,
                 '/predict-student/<id>/<code_module>/<code_presentation>')
api.add_resource(AddFeedbackToWarning, '/AddFeedbackToWarning')
api.add_resource(GetNumberOfCoursesOfStudent, '/GetNumberOfCoursesOfStudent')
api.add_resource(GetResponseWarningPercentage,
                 '/GetResponseWarningPercentage')
api.add_resource(GetNumberOfAssessmentsOfStudent,
                 '/GetNumberOfAssessmentsOfStudent')
api.add_resource(GetCourseByCode, '/GetCourseByCode')

# educator
api.add_resource(GetEducatorName, '/get-educator-name/<username>')
api.add_resource(GetCoursesOfEducator,
                 '/get-courses-of-educator/<id>')
api.add_resource(GetNumberOfCoursesOfEducator,
                 '/get-number-of-courses-of-educator/<id>')
api.add_resource(GetNumberOfStudentsOfEducator,
                 '/get-number-of-students-of-educator/<id>')
api.add_resource(GetNumberOfAtRiskStudentsOfEducator,
                 '/get-number-of-at-risk-students-of-educator/<id>')
api.add_resource(GetNumberOfAssessmentsOfEducator,
                 '/get-number-of-assessments-of-educator/<id>')
api.add_resource(GetNumberOfAssessmentTypesOfEducator,
                 '/get-number-of-assessment-types-of-educator/<id>')
api.add_resource(GetAllMaterialInCourse,
                 '/materials/<code_module>/<code_presentation>')
api.add_resource(GetAllAssessmentInCourse,
                 '/assessments/<code_module>/<code_presentation>')
api.add_resource(GetAssessmentStatisticsInCourse,
                 '/get-assessment-statistics-in-course/<code_module>/<code_presentation>')
api.add_resource(GetAllStudents,
                 '/view-all-students/<code_module>/<code_presentation>')
api.add_resource(WarnAllStudents,
                 '/warn-all-students')
api.add_resource(WarnStudent,
                 '/warn-student')
api.add_resource(WarnParents, '/WarnParents')
api.add_resource(GetSentWarnings, '/GetSentWarnings')

# parents
api.add_resource(GetParentsById, '/parents/<id>')
api.add_resource(GetCourseListOfStudentByParentsId,
                 '/GetCourseListOfStudentByParentsId')


if __name__ == '__main__':
    app.run(debug=True)
