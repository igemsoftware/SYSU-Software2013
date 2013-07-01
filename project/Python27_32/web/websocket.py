# coding: utf-8
import json
from database import SqliteDatabase

import mlog

logging = mlog.logging

class apis():
  db = SqliteDatabase()
  def __init__(self):
    db = SqliteDatabase()
  def get_part(self, message):
    return self.db.selectAllOfTable(tableName = message['table_name'])
  def getUserName_PasswordCorrect(self,message):
    return self.db.isUserNameAndPasswordCorrect(name=message['name'],password=message['password'])

def handle_websocket(ws):
  logging.info("start handling websocket...")
  #db = SqliteDatabase()
  while True:
    message = ws.receive()
    if message is None:
      break
    else:
      message = json.loads(message)
      api = apis()
      result = getattr(api, message['request'])(message)
      logging.info("message is %s" % message)
      ret = json.dumps({'result': result})
      logging.info("return %s" % ret)
      ws.send(ret)
