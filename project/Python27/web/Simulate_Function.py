from math import floor
from math import ceil
from Simulate_Class import InvalidParameter
from Simulate_Class import IllegalSetting
from Simulate_Class import DNA_Simulate
from Simulate_Class import mRNA_Simulate
from Simulate_Class import Protein_Simulate

def Simulate(isStochastic, circuit, corepind, database, time, dt):
    try:
        if time <=0 or dt <= 0:
            raise InvalidParameter
        timelen  = ceil(time / dt) + 1
        timeaxis = [None] * timelen
        operate  = {'grp_id':[], 'index':[]}
        DNAdict  = {}
        mRNAdict = {}
        Prodict  = {}
        dictkey  = []
        plasid   = circuit['plasmids'][0]
        plassize = {}
        plaspro  = {}
        for n in range(len(plasid)):
            plassize[plasid[n]] = int(len(circuit['groups'][plasid[n]]['sbol']) / 2 - 1)
        for n in range(len(plasid)):
            group      = circuit['groups'][plasid[n]]
            promoter   = database.select_with_name('Promoter', group['sbol'][0]['name'])
            terminator = database.select_with_name('Terminator', group['abol'][-1]['name'])
            plaspro[plasid[n]] = []
            for k in range(plassize[plasid[n]]):
                rbs   = database.select_with_name('RBS', group['sbol'][2*k+1]['name'])
                proid = group['sbol'][2*k+2]['id']
                plaspro[plasid[n]].append(proid)
                dictkey.append(proid)
                DNAdict [proid] = DNA_Simulate()
                mRNAdict[proid] = mRNA_Simulate()
                Prodict [proid] = Protein_Simulate()
                DNAdict [proid].SetData(ty = group['type'], copynumber = circuit['proteins'][proid]['copy'],
                                        tspromoter = promoter['MPPromoter'], leakagerate = promoter['LeakageRate'],
                                        tere = terminator['Efficiency'])
                mRNAdict[proid].SetData(transle = rbs['TranslE'], degrate = 0.00288)
                Prodict [proid].SetData(degrate = 0.00288)
                mRNAdict[proid].IniConcen(timelen, dt, ini = 0)
                Prodict [proid].IniConcen(timelen, dt, ini = 0)
                mRNAdict[proid].Connect(DNAdict [proid])
                Prodict [proid].Connect(mRNAdict[proid])
            if group['corep_ind_type'] == 'Corepressor' or group['corep_ind_type'] == 'Inducer':
                operate['grp_id'].append(plasid[n])
                operate['index'].append(floor(corepind[plasid[n]]['time'] / dt))
        for n in range(len(dictkey)):
            grpid = circuit['proteins'][dictkey[n]]['grp_id']
            Type = circuit['groups'][grpid]['type']
            iden = circuit['groups'][grpid]['from']
            if iden in dictkey:
                if Type == 'Positive':
                    activator = database.select_with_name('Activator', circuit['proteins'][dictkey[n]]['name'])
                    DNAdict[dictkey[n]].SetActivator(Prodict[iden], activator['K1'], activator['HillCoeff1'])
                elif Type == 'Negative':
                    repressor = database.select_with_name('Repressor', circuit['proteins'][dictkey[n]]['name'])
                    DNAdict[dictkey[n]].SetRepressor(Prodict[iden], repressor['K1'], repressor['HillCoeff1'])
        for t in range(timelen):
            for n in range(len(operate['index'])):
                if t != operate['index'][n]: continue
                grpid = operate['grp_id'][n]
                Type = circuit['groups'][grpid]['corep_ind_type']
                if Type == 'Corepressor':
                    corepressor = database.select_with_name('Corepressor', circuit['groups'][grpid]['corepressor'])
                    for k in range(plassize[grpid]):
                        proid = plaspro[grpid][k]
                        DNAdict[proid].SetCorepressor(corepind[grpid]['concen'], corepressor['K2'], corepressor['HillCoeff2'])
                elif Type == 'Inducer':
                    inducer = database.select_with_name('Inducer', circuit['groups'][grpid]['inducer'])
                    for k in range(plassize[grpid]):
                        proid = plaspro[grpid][k]
                        DNAdict[proid].SetInducer(corepind[grpid]['concen'], inducer['K2'], inducer['HillCoeff2'])
            timeaxis[t] = t * dt
            if t == 0: continue
            for n in range(len(dictkey)):
                if isStochastic:
                    mRNAdict[dictkey[n]].Compute_Concen(t, True)
                    Prodict [dictkey[n]].Compute_Concen(t, True)
                else:
                    mRNAdict[dictkey[n]].Compute_Concen(t, False)
                    Prodict [dictkey[n]].Compute_Concen(t, False)
        data = {}
        data['time'] = timeaxis
        for n in range(len(dictkey)):
            data[dictkey[n]] = Prodict[dictkey[n]].Concen
        return data
    except InvalidParameter:
        return 'Invalid Paramter!'
    except IllegalSetting:
        return 'Illegal Setting!'
    except Exception:
        return 'Something Unexpected Happened!'

if __name__ == "__main":
  gene_circuit = {u'proteins': {1: {u'concen': 0, u'grp_id': 4, u'pos': 2, u'repress_rate': 0.0, u'K1': None, u'copy': 73, u'PoPS': 93.08, u'name': u'BBa_C0060', u'before_regulated': 74743.24, u'RiPS': 11, u'induce_rate': -1}, 2: {u'concen': 0, u'grp_id': 4, u'pos': 4, u'repress_rate': 0.0, u'K1': None, u'copy': 73, u'PoPS': 93.08, u'name': u'BBa_C0060', u'before_regulated': 74743.24, u'RiPS': 11, u'induce_rate': -1}, 3: {u'concen': 0, u'grp_id': 4, u'pos': 6, u'repress_rate': 0.0, u'K1': None, u'copy': 73, u'PoPS': 93.08, u'name': u'BBa_K518003', u'before_regulated': 74743.24, u'RiPS': 11, u'induce_rate': -1}, 4: {u'concen': 0, u'grp_id': 4, u'pos': 8, u'repress_rate': 0.0, u'K1': None, u'copy': 73, u'PoPS': 93.08, u'name': u'BBa_K518003', u'before_regulated': 74743.24, u'RiPS': 11, u'induce_rate': -1}, 5: {u'concen': 0, u'grp_id': 5, u'pos': 2, u'repress_rate': 0.4428135474975083, u'K1': -2, u'copy': 73, u'PoPS': 34, u'name': u'BBa_C0160', u'before_regulated': 27302, u'RiPS': 11, u'induce_rate': -1}, 6: {u'concen': 0, u'grp_id': 7, u'pos': 2, u'repress_rate': -0.44281354749750823, u'K1': -2, u'copy': 73, u'PoPS': 95, u'name': u'BBa_C0178', u'before_regulated': 76285, u'RiPS': 11, u'induce_rate': -1}, 7: {u'concen': 0, u'grp_id': 7, u'pos': 4, u'repress_rate': -0.44281354749750823, u'K1': -2, u'copy': 73, u'PoPS': 95, u'name': u'BBa_C0178', u'before_regulated': 76285, u'RiPS': 11, u'induce_rate': -1}}, u'plasmids': [[4, 5, 7]], u'groups': {4: {u'from': -1, u'sbol': [{u'type': u'Signalling', u'name': u'BBa_K091117'}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Coding', u'name': u'BBa_C0060', u'id': 1}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Coding', u'name': u'BBa_C0060', u'id': 2}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Coding', u'name': u'BBa_K518003', u'id': 3}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Coding', u'name': u'BBa_K518003', u'id': 4}, {u'type': u'Terminator', u'name': u'BBa_B0013'}], u'corep_ind_type': u'None', u'to': [5, 6], u'state': u'cis', u'type': u'Constitutive'}, 5: {u'from': 3, u'sbol': [{u'type': u'Regulatory', u'name': u'BBa_I712074'}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Coding', u'name': u'BBa_C0160', u'id': 5}, {u'type': u'Terminator', u'name': u'BBa_B0013'}], u'corep_ind_type': u'None', u'to': [], u'state': u'cis', u'type': u'Positive'}, 7: {u'from': 4, u'sbol': [{u'type': u'Regulatory', u'name': u'BBa_I712074'}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Coding', u'name': u'BBa_C0178', u'id': 6}, {u'type': u'RBS', u'name': u'BBa_J61104'}, {u'type': u'Coding', u'name': u'BBa_C0178', u'id': 7}, {u'type': u'Terminator', u'name': u'BBa_B0013'}], u'corep_ind_type': u'Negative', u'inducer': u'BBa_P0140', u'to': [], u'state': u'cis', u'type': u'Negative'}}}

  import database
  db = database.SqliteDatabase()
  Simulate(isStochastic = False, circuit = gene_circuit, corepind, db)
