# coding=gbk
'''
@author Jiexin Guo

a set of methods that using json or the changing of class that related to json

Copyright (C) 2013-2014 sysu-software. All Rights Reserved.
'''

import json
import csv
import database
import sqlite3 as sqlite
import os
import random
from  xml.dom import  minidom
"turn a selection of the database 's result to the encoded json"
def turnSelectionResultToJson(description=[],result=[]):
    dict= {}
    obj=[]
    for line in result:        
        for item in range(len(line)):
            dict.setdefault(description[item][0],line[item])   
        obj.append(dict.copy())
        dict.clear()
    return json.dumps(obj)

'''
{u'desp': u'as you know', u'type': u'pre', u'id': 123, u'name': u'test1'} 
to 
type = 'pre'  and desp = 'as you know'  and id = '123'  and name = 'test1'

the kind of dictionery to string that of sql "where" parse
'''
def changeADictToStringThatCanUseBySql(dict={}):
    command=[]
    for (key,value) in dict.items():
        command.append(str(key+' = '+"'"+str(value)+"' "))    
    toReturn=''
    for item in range(len(command)):
        if item<len(command)-1:
            toReturn+=command[item]+' and '
        else:
            toReturn+=command[item]
    return toReturn

def turnStringDoubleQuoteToSingleQuote(oldStr):
	return oldStr.replace("\"", "\'")

def convertRBSCsvToDatabase():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\RBS.csv','rb')
	reader = csv.reader(csvfile)
	i=0
	data={}
	standard=[]
	for line in reader:		
		if(i==0):
			standard=line
		else:
			data[i-1]={}
			for j in range(len(standard)):
				data[i-1][standard[j]]=line[j]			
		i=i+1
	csvfile.close()
	cx = sqlite.connect('igem.db')
	cu = cx.cursor()
	for i in range(len(data)):
		cu.execute('insert into RBS (Name,Number,MPRBS) values("%s","%s",%s)'%(data[i]['Name'],data[i]['Number'],data[i]['MPRBS']))
		cx.commit()	
	print cu.fetchall()
	cu.close()
	cx.close()

def convertrepressorCsvToDatabase():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\repressor.csv','rb')
	reader = csv.reader(csvfile)
	i=0
	data={}
	standard=[]
	for line in reader:		
		if(i==0):
			standard=line
		else:
			data[i-1]={}
			for j in range(len(standard)):
				data[i-1][standard[j]]=line[j]			
		i=i+1
	csvfile.close()
	cx = sqlite.connect('igem.db')
	cu = cx.cursor()
	for i in range(len(data)):
		cu.execute('insert into repressor (Name,Number,HillCoeff1,K1,K2) values("%s","%s",%s,%s,%s)'%(data[i]['Name'],data[i]['Number'],data[i]['HillCoeff1'],data[i]['K1'],data[i]['K2']))
		cx.commit()	
	cu.execute("select * from repressor")
	print cu.fetchall()
	cu.close()
	cx.close()

def convertterminatorCsvToDatabase():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\terminator.csv','rb')
	reader = csv.reader(csvfile)
	i=0
	data={}
	standard=[]
	for line in reader:		
		if(i==0):
			standard=line
		else:
			data[i-1]={}
			for j in range(len(standard)):
				data[i-1][standard[j]]=line[j]			
		i=i+1
	csvfile.close()
	cx = sqlite.connect('igem.db')
	cu = cx.cursor()
	for i in range(len(data)):
		cu.execute('insert into terminator(Name,Number,Efficiency) values("%s","%s",%s)'%(data[i]['Name'],data[i]['Number'],data[i]['Efficiency']))
		cx.commit()
	cu.execute("select * from terminator")
	print cu.fetchall()
	cu.close()
	cx.close()

def convertplasmid_backboneCsvToDatabase():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\plasmid_backbone.csv','rb')
	reader = csv.reader(csvfile)
	i=0
	data={}
	standard=[]
	for line in reader:		
		if(i==0):
			standard=line
		else:
			data[i-1]={}
			for j in range(len(standard)):
				data[i-1][standard[j]]=line[j]			
		i=i+1
	csvfile.close()
	cx = sqlite.connect('igem.db')
	cu = cx.cursor()
	for i in range(len(data)):
		cu.execute('insert into plasmid_backbone(Name,Number,CopyNumber) values("%s","%s",%s)'%(data[i]['Name'],data[i]['Number'],data[i]['CopyNumber']))
		cx.commit()
	cu.execute("select * from plasmid_backbone")
	print cu.fetchall()
	cu.close()
	cx.close()

def convertProteinCsvToDatabase():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\Protein_test.csv','rb')
	reader = csv.reader(csvfile)
	i=0
	data={}
	standard=[]
	for line in reader:		
		if(i==0):
			standard=line
		else:
			data[i-1]={}
			for j in range(len(standard)):
				data[i-1][standard[j]]=line[j]			
		i=i+1
	csvfile.close()
	cx = sqlite.connect('igem.db')
	cu = cx.cursor()
	for i in range(len(data)):
		cu.execute('insert into Protein(Name,Number,DegRatemRNA, DegRatePro) values("%s","%s",%s,%s)'%(data[i]['Name'],data[i]['Number'],data[i]['DegRatemRNA'],data[i]['DegRatePro']))
		cx.commit()
	cu.execute("select * from plasmid_backbone")
	print cu.fetchall()
	cu.close()
	cx.close()

def convertpromoterCsvToDatabase():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\promoter.csv','rb')
	reader = csv.reader(csvfile)
	i=0
	data={}
	standard=[]
	for line in reader:		
		if(i==0):
			standard=line
		else:
			data[i-1]={}
			for j in range(len(standard)):
				data[i-1][standard[j]]=line[j]
			if (data[i-1]['Regulated'].lower()=='true'):
				data[i-1]['Regulated']=1
			elif(data[i-1]['Regulated'].lower()=='false'):
				data[i-1]['Regulated']=0
		i=i+1
	csvfile.close()
	cx = sqlite.connect('igem.db')
	cu = cx.cursor()
	for i in range(len(data)):
		cu.execute('insert into promoter (Name,Number,MPPromoter,LeakageRate,K1,Regulated,Repressor,Source,Activator) values("%s","%s",%s,%s,%s,"%s","%s","%s")'%(data[i]['Name'],data[i]['Number'],data[i]['MPPromoter'],data[i]['LeakageRate'],data[i]['K1'],data[i]['Regulated'],data[i]['Repressor'],data[i]['Source'],data[i]['Activator']))
		cx.commit()
	cu.execute("select * from promoter")
	print cu.fetchall()
	cu.close()
	cx.close()

def createRandomDataInRBS():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\RBS_test.csv', 'wb')
	writer = csv.writer(csvfile)
	writer.writerow(['Name', 'Number', 'MPRBS'])
	for filename in os.listdir(r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Ribosome Binding Sites\Constitutive prokaryotic RBS\Anderson RBS library'):
		writer.writerow(['Anderson RBS Family',os.path.splitext(filename)[0],round(random.random(),4)])
	csvfile.close()

def createRandomDataInTerminators():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\terminator_test.csv', 'wb')
	writer = csv.writer(csvfile)
	writer.writerow(['Name', 'Number', 'Efficiency'])
	for filename in os.listdir(r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Terminators'):
		writer.writerow(['Tet',os.path.splitext(filename)[0],round(random.random(),4)])
	csvfile.close()

def createRandomDataInplasmid_backbone():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\plasmid_backbone_test.csv', 'wb')
	writer = csv.writer(csvfile)
	writer.writerow(['Name', 'Number', 'CopyNumber'])
	for filename in os.listdir(r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Plasmid backbones\Assembly'):
		writer.writerow(['pTAK10'+os.path.splitext(filename)[0][len(os.path.splitext(filename)[0])-1],os.path.splitext(filename)[0],round(random.randint(1, 100),4)])
	csvfile.close()

def createRandomDataInrepressor():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\repressor_test.csv', 'wb')
	writer = csv.writer(csvfile)
	writer.writerow(['Name', 'Number', 'HillCoeff1','K1','K2'])
	for filename in os.listdir(r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Protein coding sequences\Transcriptional regulators'):
		data=['LacI',os.path.splitext(filename)[0],random.randint(0,100000),random.randint(100,10000),random.randint(100,10000)]
		writer.writerow(data)
	csvfile.close()

def appendDirToListProtein(root,writer):
	for filename in os.listdir(root):
		if os.path.isdir(os.path.join(root,filename)):
			appendDirToListProtein(os.path.join(root,filename),writer)
		else:
			data=[bioBrickGetpartshortname(os.path.join(root,filename)),os.path.splitext(filename)[0],round(random.random(),4),round(random.random(),4)]
			writer.writerow(data)

def createRandomDataInProtein():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\Protein_test.csv', 'wb')
	writer = csv.writer(csvfile)
	writer.writerow(['Name', 'Number', 'DegRatemRNA','DegRatePro'])
	root=r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Protein coding sequences'
	for filename in os.listdir(root):
		if os.path.isdir(os.path.join(root,filename)):
			appendDirToListProtein(os.path.join(root,filename),writer)
	else:		
		data=[bioBrickGetpartshortname(os.path.join(root,filename)),os.path.splitext(filename)[0],round(random.random(),4),round(random.random(),4)]
		writer.writerow(data)
	csvfile.close()

def createRandomDataInProteinSpecial():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\Protein_test2.csv', 'wb')
	writer = csv.writer(csvfile)
	root=r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Protein coding sequences\Transcriptional regulators'
	for filename in os.listdir(root):	
		data=[bioBrickGetpartshortname(os.path.join(root,filename)),os.path.splitext(filename)[0],round(random.random(),4),round(random.random(),4)]
		writer.writerow(data)
	csvfile.close()

def bioBrickGetpartshortname(path):
	doc = minidom.parse(path)
	root = doc.documentElement
	node = root.getElementsByTagName("part_list")[0].getElementsByTagName("part")  
	nodeValue=node[0].getElementsByTagName("part_short_name")[0].childNodes[0].nodeValue
	return nodeValue
	
def createRandomDataInpromoter():
	csvfile = file('C:\Users\Administrator\Desktop\IGEM\\promoter_test.csv', 'wb')
	writer = csv.writer(csvfile)
	writer.writerow(['Name', 'Number', 'MPPromoter','LeakageRate','K1','Regulated','Repressor','Source','Activator'])
	for filename in os.listdir(r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Promoters\Cell signalling'):
		data=['LuxR',os.path.splitext(filename)[0],round(random.random(),4),round(random.random(),4),random.randint(100,10000),1,'LuxR','Paper','null']
		writer.writerow(data)	
	for filename in os.listdir(r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Promoters\Constitutive promoters'):
		data=['TetO',os.path.splitext(filename)[0],round(random.random(),4),round(random.random(),4),random.randint(100,10000),0,'null','Paper','null']
		writer.writerow(data)
	csvfile.close()

def createExpression_valueTable():
	cx = sqlite.connect('igem.db')
	cu = cx.cursor()
	cu.execute("select * from promoter")
	temp1 = turnSelectionResultToJson(cu.description,cu.fetchall())
	promoterTable = json.loads(temp1)
	cu.execute("select * from plasmid_backbone")
	temp1 = turnSelectionResultToJson(cu.description,cu.fetchall())
	plasmid_backboneTable = json.loads(temp1)
	size=0
	for promoter in promoterTable:
		for plasmid_backbone in plasmid_backboneTable:			
			cu.execute('insert into expression_value(Number,Promoter,PlasmidBackbone, ExpressionValue) values("%s","%s","%s",%s)'%(size,promoter['Number'],plasmid_backbone['Number'],round(promoter['MPPromoter']*plasmid_backbone['CopyNumber'],4)))
			size+=1
			cx.commit()	
	cu.close()
	cx.close()

if __name__=="__main__":
	#convertpromoterCsvToDatabase()
	#convertRBSCsvToDatabase()
	#convertrepressorCsvToDatabase()
	#convertterminatorCsvToDatabase()
	#convertplasmid_backboneCsvToDatabase()
	#createRandomDataInRBS()
	#createRandomDataInplasmid_backbone()
	#createRandomDataInpromoter()
	#createRandomDataInProtein()
	#bioBrickGetpartshortname(r'G:\igem2013_sysu_oschina\project\Python27\web\biobrick\Protein coding sequences\Transcriptional regulators\BBa_C0071.xml')
	createRandomDataInProteinSpecial()
	#createRandomDataInProtein()
	#convertProteinCsvToDatabase()
	#createExpression_valueTable()