# A very simple Flask Hello World app for you to get started with...
import os
import random
import string
from operator import itemgetter

import bcrypt
import mysql.connector
from flask import Flask, render_template, json, request, redirect, url_for, session
from flask_mail import Mail, Message
from mysql.connector.errors import IntegrityError
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY")

app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER")

app.config['MAIL_PORT'] = int(os.getenv("MAIL_PORT"))

app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")

app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")

app.config['MAIL_USE_TLS'] = True

app.config["MAIL_USE_SSL"] = False

mail = Mail(app)

@app.route("/", methods=["GET", "POST"])
def home():
    return redirect(url_for('index'))

@app.route("/ViesuSaraksts", methods=["GET", "POST"])
def index():
    mydb = mysql.connector.connect(
        host="database",
        port=3306,
        user="root",
        passwd="Kraujinieks123",
        database="db"
    )
    mycursor = mydb.cursor()
    if request.method == "GET":
        mycursor.execute("SELECT Autors, Komentars, Datums FROM Viesi")
        rez = mycursor.fetchall()
        mydb.close()
        return render_template("ViesuSaraksts.html", comments=rez, loggedIn=session.get("loggedIn"))
    autors = request.form["autors"]
    komentars = request.form["komentars"]
    sql = "INSERT INTO Viesi (Autors, Komentars) VALUES (%s, %s)"
    val = (autors, komentars)
    mycursor.execute(sql, val)
    mydb.commit()
    mydb.close()
    return redirect(url_for('index'))


@app.route("/login/", methods=["GET", "POST"])
def login():
    errors = []
    messages = []
    if request.method == "GET":
        if session.get("Errors") is not None:
            errors.append(session.get("Errors"))
            session.pop("Errors", None)
        if session.get("Message") is not None:
            messages.append(session.get("Message"))
            session.pop("Message", None)
        return render_template("loginPage.html", errors=errors, messages=messages)

    mydb = mysql.connector.connect(
        host="database",
        port=3306,
        user="root",
        passwd="Kraujinieks123",
        database="db"
    )
    mycursor = mydb.cursor()

    username = request.form["username"]
    password = request.form["password"]

    sql = "SELECT password, IsVerified FROM Auth WHERE username = %s"
    mycursor.execute(sql, (username,))
    rez = mycursor.fetchone()
    mydb.close()

    if not rez:
        errors.append("Invalid username or password.")
        return render_template("loginPage.html", errors=errors, messages=messages)
    if bcrypt.checkpw(password.encode('utf-8'), rez[0].encode('utf-8')):
        if not rez:
            errors.append("Your email address is not verified!")
            return render_template("loginPage.html", errors=errors, messages=messages)
        if len(rez) > 1:
            if rez[1]:
                session["loggedIn"] = True
                return redirect(url_for('index'))
        errors.append("Your email address is not verified!")
        return render_template("loginPage.html", errors=errors, messages=messages)
    else:
        errors.append("Invalid username or password.")
        return render_template("loginPage.html", errors=errors, messages=messages)


@app.route("/register/", methods=["GET", "POST"])
def register():
    errors = []
    messages = []
    if request.method == "GET":
        return render_template("registerPage.html", errors=errors, messages=messages)

    mydb = mysql.connector.connect(
        host="database",
        port=3306,
        user="root",
        passwd="Kraujinieks123",
        database="db"
    )
    mycursor = mydb.cursor()

    username = request.form["username"]
    password = request.form["password"]
    repeatedPassword = request.form["repeatedPassword"]
    email = request.form["email"]
    verificationKey = ''.join(random.choice(string.ascii_letters) for _ in range(20))
    validUntil = datetime.now() + timedelta(weeks=2)

    if password != repeatedPassword:
        errors.append("Passwords don't match!")
        return render_template("registerPage.html", errors=errors, messages=messages)
    hashed_password = (bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()))

    sqlAuth = "INSERT INTO Auth (username, password, email) VALUES (%s, %s, %s)"
    valAuth = (username, hashed_password, email)
    sqlVerificationTokens = "INSERT INTO VerificationTokens (token, userId, validUntil) values(%s, (SELECT MAX(ID) FROM Auth), %s)"
    valVerificationTokens = (verificationKey, validUntil)
    try:
        mycursor.execute(sqlAuth, valAuth)
        mycursor.execute(sqlVerificationTokens, valVerificationTokens)
        mydb.commit()
        mydb.close()

        # session["loggedIn"] = True
        sendVerificationEmail(email, verificationKey)

        return redirect(url_for('login'))
    except IntegrityError as e:  # kluda kas rodas ja ieskrien error, kurs paredz ka username un email kolonam jabut
        # unikalam
        mydb.rollback()
        mydb.close()
        errors.append("A user already exists with this username or email!")
        return render_template("registerPage.html", errors=errors, messages=messages)
    # return render_template("registerPage.html", errors = [], messages = [])


@app.route("/logout/", methods=["GET", "POST"])
def logout():
    session["loggedIn"] = False
    session.clear()
    return redirect(url_for('login'))

@app.route("/verify/", methods=["GET", "POST"])
def verify():
    token = request.args.get('token')
    print(token)
    mydb = mysql.connector.connect(
        host="database",
        port=3306,
        user="root",
        passwd="Kraujinieks123",
        database="db"
    )
    mycursor = mydb.cursor()
    sql = "SELECT validUntil, userId FROM VerificationTokens WHERE token = %s"
    mycursor.execute(sql, (token,))
    rez = mycursor.fetchone()
    date = datetime.now()

    if not rez:
        session["Errors"] = "Your verification token is invalid."
    elif rez[0] < datetime.now():
        session["Errors"] = "Your verification token is expired. A new token has been sent to your e-mail"
        userId = rez[1]
        sql = "SELECT email from Auth where id = %s"
        mycursor.execute(sql, (userId,))
        rez = mycursor.fetchone()
        email = rez[0]
        verificationKey = ''.join(random.choice(string.ascii_letters) for _ in range(20))
        sql = "INSERT INTO VerificationTokens (token, userId, validUntil) values (%s, %s, %s)"
        val = (verificationKey, userId, (datetime.now() + timedelta(weeks=2)))
        mycursor.execute(sql, val)
        mydb.commit()
        mydb.close()
        sendVerificationEmail(email, verificationKey)
    else:
        sql = "update Auth SET IsVerified = true where id = (SELECT userId from VerificationTokens where token = %s)"
        mycursor.execute(sql, (token,))
        Affected_rows = mycursor.rowcount
        mydb.commit()
        mydb.close()
        if Affected_rows == 0:
            session["Errors"] = "Your verification token is invalid."
        else:
            session["Message"] = "Your E-mail has successfully been verified. Please log in again!"
    return redirect(url_for('login'))


def sendVerificationEmail(email, verificationKey):
    try:
        messageBody = "Verify e-mail address using this link: http://localhost:8080/verify?token="
        msg = Message("Email address verification", sender="krauja03@gmail.com", recipients=[email])
        msg.body = messageBody + verificationKey + " \n This link is valid for 2 weeks."
        mail.send(msg)
        print("e-pasts nosūtīts")
        session["Message"] = "Check your e-mail! A verification link has been sent to you"
    except Exception:
        print("Neizdevās nosūtīt")
    return


if __name__ == "__main__":
    debug_mode = os.environ.get('FLASK_DEBUG', 'False').lower() == 'true'
    app.run(debug=debug_mode, host="0.0.0.0", port=8080, use_reloader=debug_mode)
