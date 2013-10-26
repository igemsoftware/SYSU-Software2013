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
import string
from sharedFile import sharedFiles

sql = db.SqliteDatabase()

app = Flask(__name__)
	
@app.route("/")
def login():
	if user.isUserLogined(sql):
		user.userLogout(sql)
	return render_template('login.html')

@app.route("/login")
def login2():
	if user.isUserLogined(sql):
		user.userLogout(sql)
	return render_template('login.html')

@app.route("/register")
def register():	
	return render_template('register.html')
	
@app.route("/index")
def index():
	if user.isUserLogined(sql):
		return render_template('index.html')
	else:
		return redirect(url_for('login'))
		
@app.route("/createnewpart")
def createnewpart():
	if user.isUserLogined(sql):
		return render_template('createNewPart.html')
	else:
		return redirect(url_for('login'))	

@app.route("/profile", methods=["GET", "POST"])
def profile():
  if not user.isUserLogined(sql):
    return redirect(url_for('login'))	
  if request.method == 'GET':
    username = user.getLoginedUserName(sql)
    userInfo = user.getUserInfo(sql)
    return render_template('profile.html', username = username,
        userInfo = userInfo,
        flag = (username != "NULL"))
  else:
    pass

@app.route("/file_manager")
def file_manager():
  if not user.isUserLogined(sql):
    return redirect(url_for('login'))	
  filelist = sql.getUserFileNameList()
  shared=sharedFiles(sql)
  sharedFileList=shared.getSharedFileList()  
  yoursharedfiles=shared.getUserSharedFileList(user.getLoginedUserName(sql))
  for file in filelist:
    for shareF in yoursharedfiles:
      if file['fileType']==shareF['fileType'] and file['fileName']==shareF['fileName'] and shareF['name']==user.getLoginedUserName(sql):
        file['shared']=True
  for file in filelist:
  	if not 'shared' in file:
  	  file['shared']=False  
  print sql.getUserPartByLoginuser()
  return render_template('file_manager.html', filelist = filelist,sharedFileList = sharedFileList,userpart=sql.getUserPartByLoginuser())

@app.route("/genecircuit")
def goToGeneCircuit():
	if user.isUserLogined(sql):
		return render_template('genecircuit.html')
	else:
		return redirect(url_for('login'))

@app.route("/plasmid")
def goToPlasmid():
	if user.isUserLogined(sql):
		return render_template('plasmid.html')
	else:
		return redirect(url_for('login'))

@app.route("/protocol")
def goToProtocol():
	if user.isUserLogined(sql):
		return render_template('protocol.html')
	else:
		return redirect(url_for('login'))

@app.route("/simulation")
def goToSimulation():
	if user.isUserLogined(sql):
		return render_template('simulation.html')
	else:
		return redirect(url_for('login'))

@app.route("/doc")
def documentation():
  return render_template("html/index.html")

@app.route("/ws")
def webSocket():
  if request.environ.get('wsgi.websocket'):
    handle_websocket(request.environ["wsgi.websocket"], sql)
  return

if __name__ == "__main__":
    http_server = WSGIServer(('0.0.0.0',5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
    # app.run(debug=True)
