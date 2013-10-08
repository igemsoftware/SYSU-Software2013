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
def Simulate(isStochastic, circuit, corepind, database, time, dt):
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
        DegRate = .00288
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
                mRNAdict[proid].IniConcen(timelen, dt, ini = 0)
                Prodict [proid].IniConcen(timelen, dt, ini = 0)
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
            print grpid, iden
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
                if Type == 'Corepressor':
                    #corepressor = database.select_with_name('Corepressor', circuit['groups'][grpid]['corep_ind'])
                    corepressor = database.find_cor_ind('Corepressed',\
                        regulator["Number"], promoter["Number"])
                    for k in range(plassize[grpid]):
                        proid = plaspro[grpid][k]
                        DNAdict[proid].SetCorepressor(circuit['proteins'][proid]['concen'], corepressor['K2'], corepressor['HillCoeff2'])
                elif Type == 'Inducer':
                    print regulator
                    print promoter
                    inducer = database.find_cor_ind('Induced',\
                        regulator["Number"], promoter["Number"])
                    for k in range(plassize[grpid]):
                        proid = plaspro[grpid][k]
                        DNAdict[proid].SetInducer(circuit['proteins'][proid]['concen'], inducer['K2'], inducer['HillCoeff2'])
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
    gene_circuit = u'{"proteins":{"bded614c-10a0-cdee-f498-ae6b8ded26c2":{"RiPS":0.336,"name":"BBa_K112004","before_regulated":20.60352,"concen":null,"grp_id":"2da34a2a-8ca4-1373-a682-c2b58006ad08","pos":2,"PoPS":0.84,"repress_rate":0,"K1":null,"induce_rate":0,"copy":73,"display":true},"e0e28453-468c-5042-fbeb-094339f39860":{"RiPS":0.336,"name":"BBa_K112002","before_regulated":3.4339200000000005,"concen":0.1,"grp_id":"e0e28453-468c-5042-fbeb-094339f39860","pos":2,"PoPS":0.14,"repress_rate":-0.30102999566398064,"K1":0.7481880270062004,"induce_rate":-1.6808077821628082e-9,"copy":73,"display":true},"2da34a2a-8ca4-1373-a682-c2b58006ad08":{"RiPS":0.336,"name":"BBa_C0040","before_regulated":20.60352,"concen":null,"grp_id":"2da34a2a-8ca4-1373-a682-c2b58006ad08","pos":4,"PoPS":0.84,"repress_rate":0,"K1":null,"induce_rate":0,"copy":73,"display":false}},"plasmids":[["e0e28453-468c-5042-fbeb-094339f39860","2da34a2a-8ca4-1373-a682-c2b58006ad08"]],"groups":{"e0e28453-468c-5042-fbeb-094339f39860":{"from":"2da34a2a-8ca4-1373-a682-c2b58006ad08","state":"cis","corep_ind_type":"Inducer","to":[],"sbol":[{"type":"Promoter","name":"BBa_R0040"},{"type":"RBS","name":"BBa_J61104"},{"type":"Protein","name":"BBa_K112002","id":"e0e28453-468c-5042-fbeb-094339f39860"},{"type":"Terminator","name":"BBa_B0013"}],"type":"Negative"},"2da34a2a-8ca4-1373-a682-c2b58006ad08":{"from":-1,"state":"cis","corep_ind_type":"None","to":["e0e28453-468c-5042-fbeb-094339f39860"],"sbol":[{"type":"Promoter","name":"BBa_I712074"},{"type":"RBS","name":"BBa_J61104"},{"type":"Protein","name":"BBa_K112004","id":"bded614c-10a0-cdee-f498-ae6b8ded26c2"},{"type":"RBS","name":"BBa_J61104"},{"type":"Repressor","name":"BBa_C0040","id":"2da34a2a-8ca4-1373-a682-c2b58006ad08"},{"type":"Terminator","name":"BBa_B0013"}],"type":"Constitutive"}}}'
    import json
    gene_circuit = json.loads(gene_circuit)
    print Simulate(False, gene_circuit, corepind, db, 6000, 100)
