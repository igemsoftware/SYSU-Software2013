# -*- coding: utf-8 -*-
import sqlite3 as sqlite
import os
from flask import Flask,url_for,request,render_template,redirect,abort,escape,session,Response
import database as db
import json
from websocket import handle_websocket
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
import user
import xmlParse

sql = db.SqliteDatabase()

app = Flask(__name__)
	
@app.route("/")
def login():
	return render_template('login.html')

@app.route("/demo")
def demo():
  return render_template('demo.html')

@app.route("/index")
def index():
	return render_template('index.html')

@app.route("/profile", methods=["GET", "POST"])
def profile():
  if request.method == 'GET':
    username = user.getLoginedUserName(sql)
    userInfo = user.getUserInfo(sql)
    return render_template('profile.html', username = username,
        userInfo = userInfo,
        flag = (username != "NULL"))
  else:
    pass

@app.route("/getdir/<pathname>")
def getDir(pathname):
	return json.dumps(xmlParse.get_allfiledirs('web\\'+pathname))

@app.route("/genecircuit")
def goToGeneCircuit():
	return render_template('genecircuit.html')

@app.route("/plasmid")
def goToPlasmid():
	return render_template('plasmid.html')

@app.route("/protocol")
def goToProtocol():
	return render_template('protocol.html')

@app.route("/simulation")
def goToSimulation():
	return render_template('simulation.html')

@app.route("/ws")
def webSocket():
  if request.environ.get('wsgi.websocket'):
    handle_websocket(request.environ["wsgi.websocket"], sql)
  return
	
if __name__ == "__main__":
    http_server = WSGIServer(('',5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
    #app.run(debug=True)
