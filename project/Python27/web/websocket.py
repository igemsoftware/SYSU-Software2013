# coding: utf-8
import json
from database import SqliteDatabase
import component_union
import sequence_serializer
import Simulate_Function
import user
import mlog
import xmlParse
import os
import group
import plasmid
import encrypt
import base64
import hashlib
import json
#import make_graph

logging = mlog.logging

class apis():
  def __init__(self, db):
    self.db = db
  def getRememberMeTicket(self,message):
    user.userSetRememberMe(self.db)
    return user.getRememberMeTicket(self.db,user.getLoginedUserName(self.db))
  def userLoginByTicket(self,message):
	return user.userLoginByTicket(self.db,message['username'],message['ticket'])
  def indexSaveToGeneCircuit(self,message):
    self.db.indexSave=message['data']
    return "index save success"
  def getBiobrickPath(self,message):
    return xmlParse.findFile(rootdir="web\\biobrick\\",key=message['data'])
  def getIndexSave(self,message):
    return group.dump_group(json.loads(self.db.indexSave),self.db)
  def generateRandomsessionKey(self,message):   
    if self.db.encrypt==None:     
      self.db.encrypt=encrypt.Encrypt()
    return {'n':encrypt.dec2hex(self.db.encrypt.getPublicKey().n),'e':encrypt.dec2hex(self.db.encrypt.getPublicKey().e)}  
  def get_part(self, message):
    return self.db.selectAllOfTable(tableName = message['table_name'])
  def userLogin(self,message):
    res=json.loads(self.db.encrypt.decrypt(message['data']))
    res['password']=encrypt.getPasswordSHA1(res['password'])
    return user.userLogin(self.db,name=res['name'],password=res['password'])
  def getDirList(self,message={'dir':'biobrick'}): 
    return xmlParse.get_allfiledirs(message['dir'])
  def getBiobrick(self,message={'path':'biobrick/Terminators/BBa_B0010.xml'}):
    return xmlParse.xmlBiobrick(message['path']).getJsonString()
  def getSimulationData(self,message):
    #content = make_graph.parse_data()
    return '1234'
  def saveUserData(self,message):
    message['data']=message['data'].replace('"','\'')
    if message.has_key("fileName") and message.has_key("fileType"):
      return user.saveUserData(self.db,message['data'],message['fileName'],message['fileType'])
    elif message.has_key("fileName"):
      return user.saveUserData(self.db,message['data'],message['fileName'],"default")
    elif message.has_key("fileType"):
      return user.saveUserData(self.db,message['data'],"default",message['fileType'])
    else:
      return user.saveUserData(self.db,message['data'],"default","default")
  def registAUser(self,message):
    if message['group_name']=='administrator':
      group_id=2
    elif message['group_name']=='guest':
      group_id=1    
    self.db.rememberUser(message['name'],message['password'])
    message['password']=encrypt.getPasswordSHA1(message['password'])
    ret= user.registAUser(self.db,name=message['name'],password=message['password'],email=message['email'],group_id=group_id,gender=message['gender'],question=message['question'],answer=message['answer'])
    return ret
  def getLoginedUserName(self,message):
    return user.getLoginedUserName(self.db)
  "ws.send(JSON.stringify({'request': 'getXmlJson','path':'web/biobrick/Terminators/BBa_B0010.xml'}));"
  def getXmlJson(self,message):
    xml=xmlParse.xmlBiobrick(path=message['path'])
    return xml.getJsonString()
  def loginOut(self,message):
    return user.userLogout(self.db)
  def getUserFileList(self,message):
    return user.getUserFileList(self.db)
  def deleteUserData(self,message):
    return {"name":message["name"],
        "result":user.deleteUserData(self.db,message["name"])}
  def updateUserInfo(self,message):
    return user.updateUserInfo(self.db, message["userInfo"])
  def updatePassword(self,message):
    ret= user.changeUserPassword(self.db, message["old"], message["new"])
    return ret
  def loadUserFile(self,message):
    if message.has_key("fileType"):
  	  return user.loadUserData(self.db,message['fileName'],message['fileType'])
    else:
      return user.loadUserData(self.db,message['fileName'],"default")
  def Simulate(self, message):
    isStochastic = message["isStochastic"]
    gene_circuit = group.js_formatter(message["gene_circuit"])
    corepind = message["corepind"]
    time = 6000
    if message.has_key("time"):
      time = message["time"]
    dt = 100
    if message.has_key("dt"):
      time = message["dt"]
    return Simulate_Function.Simulate(isStochastic,\
        gene_circuit, corepind, self.db, time, dt)
  def getGroup(self, message):
    return group.dump_group(message["data"], self.db)
  def getPlasmidSbol_deprecated(self, message):
    sbol = component_union.get_sbol(message["component"], rule)
    ret = sequence_serializer.format_to_json(sbol)
    return ret
  def updateGeneCircuit(self, message):
    ret = group.update_controller(self.db, message["data"])
    return ret
  def getUserQuestion(self,message):
    return user.getUserQuestion(self.db,message['userName']) 
  def forgetPasswordAndReset(self,message):
    self.db.rememberUser(message['userName'],message['password'])
    return user.resetUserPassword(self.db,message['userName'],message['answer'],message['password'])
  def getPlasmidSbol(self, message):
    if message.has_key("rule"):
      rule = message["rule"]
    else:
      rule = "RFC10"
    return plasmid.plasmid_sbol(self.db, json.loads(message['data']), rule)
  def changeRBS(self,message):
    return {"sbol":"[[{'type': 'Regulatory', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0060'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': u'BBa_K518003'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], [{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0160'}, {'type': 'Terminator', 'name': 'BBa_B0013'}], [{'type': 'Regulatory', 'name': 'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding', 'name': 'BBa_C0178'}, {'type': 'Terminator', 'name': 'BBa_B0013'}]]","PoPs":6,"RiPS":5,"copy":7,"repress_rate":0.15,"induce_rate":0.66}
  def loadSBOL(self,message):    
    return group.dump_sbol(json.loads(message['data']), self.db)

def handle_websocket(ws, db):
  logging.info("start handling websocket...")
  while True:
    message = ws.receive()
    if message is None:
      print "message is empty"
      break
    else:      
      message = json.loads(message)
      print message
      api = apis(db)
      try:
        result = getattr(api, message['request'])(message)
      except Exception as e:
        print e
        result = "ERROR!"
      logging.info("message is %s" % message)
      ret = json.dumps({'request':message['request'],'result': result})
      print ret
      logging.info("return %s" % ret)
      ws.send(ret)
