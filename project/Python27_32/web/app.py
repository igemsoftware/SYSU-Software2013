# -*- coding: utf-8 -*-
import sqlite3 as sqlite
import os
from flask import Flask,url_for,request,render_template,redirect,abort,escape,session,Response
import database as db
import json
from websocket import handle_websocket
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler

app = Flask(__name__)
	
@app.route("/")
def login():
	return render_template('login.html')

@app.route("/index")
def index():
	return render_template('index.html')
#@app.route("/create_table")
#def create_table():
#	cx = sqlite.connect("web/test.db")
#	cu = cx.cursor()
#	#cu.execute("""create table tab_day( id integer primary key)""")

@app.route("/getdatademo")
def getDataDemo():	
	print request.method
	if request.method=='GET':
		sql=db.SqliteDatabase()	
		print sql.selectAllOfTable()
		return json.dumps(sql.selectAllOfTable())
	else:
		return "No"	

@app.route("/ws")
def webSocket():
  if request.environ.get('wsgi.websocket'):
    handle_websocket(request.environ["wsgi.websocket"])
  return
	
if __name__ == "__main__":
    http_server = WSGIServer(('',5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
    #app.run(debug=True)
