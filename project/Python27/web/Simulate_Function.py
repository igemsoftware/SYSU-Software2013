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
            terminator = database.select_with_name('terminator', group['sbol'][-1]['name'])
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
    gene_circuit = u'{"proteins":{"06f19df8-844f-cf01-56f9-eb39dcca4826":{"RiPS":0.336,"name":"BBa_C0070","before_regulated":6.4915199999999995,"concen":null,"grp_id":"19d6f6ed-a3db-d38a-9399-abe589a36b16","pos":2,"PoPS":0.84,"pops_option":[{"des":"asdfasdf","val":0.9,"type":"left"},{"des":"asdfasdfaaaaaaa\\naaaaaaaddddd","val":0.6,"type":"left"},{"des":"dddads1qwerqwerqwerqwer\\nfasdfasdfdd","val":0.2,"type":"right"}],"repress_rate":0,"K1":null,"induce_rate":0,"copy":23,"display":true},"2217f133-2061-4b53-9431-d5aa8ae76e1c":{"RiPS":0.336,"name":"BBa_C0076","before_regulated":1.8547200000000001,"concen":null,"grp_id":"2217f133-2061-4b53-9431-d5aa8ae76e1c","pos":2,"PoPS":0.24,"pops_option":[{"des":"asdfasdf","val":0.2,"type":"left"},{"des":"ddddddddddddd","val":0.5,"type":"left"},{"des":"ddddd","val":0.5,"type":"right"}],"repress_rate":-0.3010299956639812,"K1":-6.920818753952375,"induce_rate":-0.3010299956639812,"copy":23,"display":true},"19d6f6ed-a3db-d38a-9399-abe589a36b16":{"RiPS":0.336,"name":"BBa_K864201","before_regulated":6.4915199999999995,"concen":null,"grp_id":"19d6f6ed-a3db-d38a-9399-abe589a36b16","pos":4,"PoPS":0.84,"pops_option":[{"des":"asdfasdf","val":0.2,"type":"left"},{"des":"ddddd","val":0.5,"type":"left"},{"des":"ddddd","val":0.5,"type":"right"}],"repress_rate":0,"K1":null,"induce_rate":0,"copy":23,"display":false}},"plasmids":[["2217f133-2061-4b53-9431-d5aa8ae76e1c","19d6f6ed-a3db-d38a-9399-abe589a36b16"]],"groups":{"2217f133-2061-4b53-9431-d5aa8ae76e1c":{"from":"19d6f6ed-a3db-d38a-9399-abe589a36b16","state":"cis","corep_ind_type":"None","to":[],"sbol":[{"type":"Promoter","name":"BBa_I756014"},{"type":"RBS","name":"BBa_J61101"},{"type":"Protein","name":"BBa_C0076","id":"2217f133-2061-4b53-9431-d5aa8ae76e1c"},{"type":"Terminator","name":"BBa_B0012"}],"type":"Negative"},"19d6f6ed-a3db-d38a-9399-abe589a36b16":{"from":-1,"state":"cis","corep_ind_type":"None","to":["2217f133-2061-4b53-9431-d5aa8ae76e1c"],"sbol":[{"type":"Promoter","name":"BBa_I712074"},{"type":"RBS","name":"BBa_J61101"},{"type":"Protein","name":"BBa_C0070","id":"06f19df8-844f-cf01-56f9-eb39dcca4826"},{"type":"RBS","name":"BBa_J61101"},{"type":"Repressor","name":"BBa_K864201","id":"19d6f6ed-a3db-d38a-9399-abe589a36b16"},{"type":"Terminator","name":"BBa_B0012"}],"type":"Constitutive"}}}'
    import json
    gene_circuit = json.loads(gene_circuit)
    print Simulate(False, True, gene_circuit, corepind, db, 6000, 100)
