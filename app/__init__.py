# Import flask and template operators
from flask import Flask, jsonify, render_template
from flask_cors import CORS

# Import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy

# Define the WSGI application object
app = Flask(__name__)
CORS(app)

# Configurations
app.config.from_object('config')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Define the database object which is imported
# by modules and controllers
db = SQLAlchemy(app)

# Import a module / component using its blueprint handler variable
from app.quiz.controllers import mod_ques

# Register blueprint(s)2
app.register_blueprint(mod_ques)

# Build the database:
db.create_all()


@app.route('/')
@app.route('/intro')
def intro():
    return render_template('Introduction.html')

@app.route('/theory')
def theory():
        return render_template('Theory.html')

@app.route('/objective')
def objective():
    return render_template('Objective.html')

@app.route('/experiment')
def experiment():
    sentencesA=['EOS','I','YOU','CAN','HIM','NEAR','SIT']
    sentencesB=['EOS','YOU','BOOK','A','CAR','I','CAN', 'READ','IN','THE','PARK']
    sentencesC=['']
    return render_template('Experiment.html' , sentenceA =sentencesA,sentenceB=sentencesB,sentenceC=sentencesC)

@app.route('/quiz')
def quiz():
    return render_template('Quizzes.html')

@app.route('/procedure')
def procedure():
    return render_template('Procedure.html')

@app.route('/manual')
def manual():
    return render_template('Manual.html')

@app.route('/furtherReadings')
def furtherReadings():
    return render_template('Further Readings.html')

@app.route('/feedback')
def feedback():
    return render_template('Feedback.html')

@app.route('/quiz_add')
def quizadd():
    return render_template('Quiz_add.html')

@app.route('/table1')
def table1():
    return render_template('table1.html')

@app.route('/table2')
def table2():
    return render_template('table2.html')
    
