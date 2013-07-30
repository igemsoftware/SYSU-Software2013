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
		cu.execute('insert into RBS (Name,Number,RiPS) values("%s","%s",%s)'%(data[i]['Name'],data[i]['Number'],data[i]['RiPS']))
		cx.commit()	
	print cu.fetchall()

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
		cu.execute('insert into repressor (Name,Number,Nd,Kd,Kx) values("%s","%s",%s,%s,%s)'%(data[i]['Name'],data[i]['Number'],data[i]['Nd'],data[i]['Kd'],data[i]['Kx']))
		cx.commit()	
	cu.execute("select * from repressor")
	print cu.fetchall()

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
		cu.execute('insert into plasmid_backbone(Name,Number,rho) values("%s","%s",%s)'%(data[i]['Name'],data[i]['Number'],data[i]['rho']))
		cx.commit()
	cu.execute("select * from plasmid_backbone")
	print cu.fetchall()

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
		cu.execute('insert into promoter (Name,Number,MaxProduction,LeakageRateEpsilon,Kd,Regulated,Repressor,Source) values("%s","%s",%s,%s,%s,"%s","%s","%s")'%(data[i]['Name'],data[i]['Number'],data[i]['MaxProduction'],data[i]['LeakageRateEpsilon'],data[i]['Kd'],data[i]['Regulated'],data[i]['Repressor'],data[i]['Source']))
		cx.commit()
	cu.execute("select * from promoter")
	print cu.fetchall()

if __name__=="__main__":
	#convertpromoterCsvToDatabase()
	#convertRBSCsvToDatabase()
	#convertrepressorCsvToDatabase()
	#convertterminatorCsvToDatabase()
	convertplasmid_backboneCsvToDatabase()
			