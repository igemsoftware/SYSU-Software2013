##
# @file Simulate_Function.py
# @brief Simulate the curve of protein concen in a time period
# @author Jianhong Li
# @version 1.0
# @date 2013-09-02
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
# 

from math import floor
from math import ceil
from Simulate_Class import InvalidParameter
from Simulate_Class import IllegalSetting
from Simulate_Class import DNA_Simulate
from Simulate_Class import mRNA_Simulate
from Simulate_Class import Protein_Simulate

# --------------------------------------------------------------------------
##
# @brief Simulate the curve of protein concen in a time period
#
# @param isStochastic  whether to add a stochastic optimization
# @param circuit       the gene circuit to simulate
# @param corepind      the time to add corepressor and inducer
# @param database      database instance
# @param time          time period to simulate
# @param dt            a time delta for two points in the curve
#
# @returns             simulation result
#
# --------------------------------------------------------------------------
def Simulate(isStochastic, isDelay, circuit, corepind, database, time, dt):
    try:
        cnt = 0
        if time <=0 or dt <= 0:
            raise InvalidParameter
        timelen  = int(ceil(time / dt) + 1)
        timeaxis = [None] * timelen
        operate  = {'grp_id':[], 'index':[]}
        DNAdict  = {}
        mRNAdict = {}
        Prodict  = {}
        dictkey  = []
        pro_name = []
        DegRate = 0.00288
        for i in circuit["proteins"]:
          if i not in corepind:
            corepind[i] = {"time": time}
        plasid   = [x for sublist in circuit['plasmids'] for x in sublist]
        # the number of proteins in a group
        plassize = {}
        plaspro  = {}
        for n in range(len(plasid)):
            plassize[plasid[n]] = int(len(circuit['groups'][plasid[n]]['sbol']) / 2 - 1)
        for n in range(len(plasid)):
            group      = circuit['groups'][plasid[n]]
            promoter   = database.select_with_name('Promoter', group['sbol'][0]['name'])
            terminator = database.select_with_name('Terminator', group['sbol'][-1]['name'])
            plaspro[plasid[n]] = []
            for k in range(plassize[plasid[n]]):
                rbs   = database.select_with_name('RBS', group['sbol'][2*k+1]['name'])
                proid = group['sbol'][2*k+2]['id']
                plaspro[plasid[n]].append(proid)
                dictkey.append(proid)
                pro_name.append(circuit['proteins'][proid]['name'])
                DNAdict [proid] = DNA_Simulate()
                mRNAdict[proid] = mRNA_Simulate()
                Prodict [proid] = Protein_Simulate()
                DNAdict [proid].SetData(ty = group['type'], copynumber = circuit['proteins'][proid]['copy'],
                                        tspromoter = promoter['MPPromoter'], leakagerate = promoter['LeakageRate'],
                                        tere = terminator['Efficiency'])
                mRNAdict[proid].SetData(transle = rbs['MPRBS'], degrate = DegRate)
                Prodict [proid].SetData(degrate = DegRate)
                mRNAdict[proid].IniConcen(isDelay, timelen, dt, ini = 0)
                Prodict [proid].IniConcen(isDelay, timelen, dt, ini = 0)
                mRNAdict[proid].Connect(DNAdict [proid])
                Prodict [proid].Connect(mRNAdict[proid])
            if group['corep_ind_type'] == 'Corepressor' or group['corep_ind_type'] == 'Inducer':
                operate['grp_id'].append(plasid[n])
                print floor(corepind[plasid[n]]['time'] / dt)
                operate['index'].append(floor(corepind[plasid[n]]['time'] / dt))
        for n in range(len(dictkey)):
            grpid = circuit['proteins'][dictkey[n]]['grp_id']
            Type = circuit['groups'][grpid]['type']
            iden = circuit['groups'][grpid]['from']
            regulator = None
            if iden in dictkey:
                if Type == 'Positive':
                    activator = database.select_with_name('Activator', circuit['proteins'][iden]['name'])
                    regulator = activator
                    DNAdict[dictkey[n]].SetActivator(Prodict[iden], activator['K1'], activator['HillCoeff1'])
                elif Type == 'Negative':
                    repressor = database.select_with_name('Repressor', circuit['proteins'][iden]['name'])
                    regulator = repressor
                    DNAdict[dictkey[n]].SetRepressor(Prodict[iden], repressor['K1'], repressor['HillCoeff1'])
        for t in range(timelen):
            for n in range(len(operate['index'])):
                if t != operate['index'][n]: continue
                grpid = operate['grp_id'][n]
                Type = circuit['groups'][grpid]['corep_ind_type']
                print "grpid: %s" % grpid
                promoter = circuit['groups'][grpid]['sbol'][0]['name']
                prev_node = circuit['groups'][grpid]['from']
                if prev_node != -1:
                    regulator = circuit['proteins'][prev_node]['name']
                if Type == 'Corepressor':
                    #corepressor = database.select_with_name('Corepressor', circuit['groups'][grpid]['corep_ind'])
                    corepressor = database.find_cor_ind('Corepressed',\
                        regulator, promoter)
                    for k in range(plassize[grpid]):
                        proid = plaspro[grpid][k]
                        concen = circuit['proteins'][proid]['concen']
                        K2 = corepressor['K2']
                        HillCoeff2 = corepressor['HillCoeff2']
                        DNAdict[proid].SetCorepressor(concen, K2, HillCoeff2)
                elif Type == 'Inducer':
                    print regulator
                    print promoter
                    inducer = database.find_cor_ind('Induced',\
                        regulator, promoter)
                    for k in range(plassize[grpid]):
                        proid = plaspro[grpid][k]
                        concen = circuit['proteins'][proid]['concen']
                        K2 = inducer['K2']
                        HillCoeff2 = inducer['HillCoeff2']
                        DNAdict[proid].SetInducer(concen, K2, HillCoeff2)
            timeaxis[t] = t * dt
            if t == 0: continue
            for n in range(len(dictkey)):
                mRNAdict[dictkey[n]].Compute_Concen(t, isStochastic)
                Prodict [dictkey[n]].Compute_Concen(t, isStochastic)
        ret = {}
        data = {}
        ret['dt'] = dt
        ret['time'] = time
        for n in range(len(dictkey)):
            data[pro_name[n] + "," + str(cnt)] = Prodict[dictkey[n]].Concen
            cnt += 1
        for i in data:
          data[i] = [float('%0.3f'%x) for x in data[i]]
        ret['data'] = data
        return ret
    #except InvalidParameter as e:
        #print e
        #return 'Invalid Paramter!'
    except IllegalSetting as e:
        print e
        return 'Illegal Setting!'
    #except Exception as e:
        #return 'Something Unexpected Happened!'

if __name__ == "__main__":

    import database
    db = database.SqliteDatabase()
    #corepind = {5: {"time": 20},
    #            7: {"time": 60}}
    corepind = {}
    gene_circuit = u'{"proteins":{"3be9a5f7-893b-5831-11b2-bff8b0b1903d":{"RiPS":0.336,"name":"BBa_C0178","repress_rate":-0.30102999202430636,"concen":0.1,"grp_id":"3be9a5f7-893b-5831-11b2-bff8b0b1903d","pos":2,"PoPS":0.14,"before_regulated":1.0819200000000002,"K1":-2.886056647693163,"induce_rate":-5.829870629263188e-11,"copy":23,"display":true},"5a5c3e16-e365-480b-230a-d981fdbe8f59":{"RiPS":0.336,"name":"BBa_C0160","repress_rate":0,"concen":null,"grp_id":"b485eb93-4480-1cf6-229f-2d79090be63e","pos":2,"PoPS":0.84,"before_regulated":6.4915199999999995,"K1":null,"induce_rate":0,"copy":23,"display":true},"b485eb93-4480-1cf6-229f-2d79090be63e":{"RiPS":0.336,"name":"BBa_C0012","repress_rate":0,"concen":null,"grp_id":"b485eb93-4480-1cf6-229f-2d79090be63e","pos":4,"PoPS":0.84,"before_regulated":6.4915199999999995,"K1":null,"induce_rate":0,"copy":23,"display":false}},"plasmids":[["3be9a5f7-893b-5831-11b2-bff8b0b1903d","b485eb93-4480-1cf6-229f-2d79090be63e"]],"groups":{"3be9a5f7-893b-5831-11b2-bff8b0b1903d":{"from":"b485eb93-4480-1cf6-229f-2d79090be63e","state":"cis","corep_ind_type":"Inducer","to":[],"sbol":[{"type":"Promoter","name":"BBa_K091110"},{"type":"RBS","name":"BBa_J61104"},{"type":"Protein","name":"BBa_C0178","id":"3be9a5f7-893b-5831-11b2-bff8b0b1903d"},{"type":"Terminator","name":"BBa_B0013"}],"type":"Negative","id":"3be9a5f7-893b-5831-11b2-bff8b0b1903d"},"b485eb93-4480-1cf6-229f-2d79090be63e":{"from":-1,"state":"cis","corep_ind_type":"None","to":["3be9a5f7-893b-5831-11b2-bff8b0b1903d"],"sbol":[{"type":"Promoter","name":"BBa_I712074"},{"type":"RBS","name":"BBa_J61104"},{"type":"Protein","name":"BBa_C0160","id":"5a5c3e16-e365-480b-230a-d981fdbe8f59"},{"type":"RBS","name":"BBa_J61104"},{"type":"Repressor","name":"BBa_C0012","id":"b485eb93-4480-1cf6-229f-2d79090be63e"},{"type":"Terminator","name":"BBa_B0013"}],"type":"Constitutive","id":"b485eb93-4480-1cf6-229f-2d79090be63e"}}}'
    import json
    gene_circuit = json.loads(gene_circuit)
    print Simulate(False, True, gene_circuit, corepind, db, 6000, 100)
