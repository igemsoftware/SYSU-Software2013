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
        timelen  = int(ceil(time / dt) + 1)
        timeaxis = [None] * timelen
        operate  = {'grp_id':[], 'index':[]}
        DNAdict  = {}
        mRNAdict = {}
        Prodict  = {}
        dictkey  = []
        pro_name = []
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
                mRNAdict[proid].SetData(transle = rbs['MPRBS'], degrate = 0.00288)
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
                    activator = database.select_with_name('Activator', circuit['proteins'][iden]['name'])
                    DNAdict[dictkey[n]].SetActivator(Prodict[iden], activator['K1'], activator['HillCoeff1'])
                elif Type == 'Negative':
                    repressor = database.select_with_name('Repressor', circuit['proteins'][iden]['name'])
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
                        DNAdict[proid].SetCorepressor(circuit['proteins'][proid]['concen'], corepressor['K2'], corepressor['HillCoeff2'])
                elif Type == 'Inducer':
                    inducer = database.select_with_name('Inducer', circuit['groups'][grpid]['corep_ind'])
                    for k in range(plassize[grpid]):
                        proid = plaspro[grpid][k]
                        DNAdict[proid].SetInducer(circuit['proteins'][proid]['concen'], inducer['K2'], inducer['HillCoeff2'])
            timeaxis[t] = t * dt
            if t == 0: continue
            for n in range(len(dictkey)):
                if isStochastic:
                    mRNAdict[dictkey[n]].Compute_Concen(t, True)
                    Prodict [dictkey[n]].Compute_Concen(t, True)
                else:
                    mRNAdict[dictkey[n]].Compute_Concen(t, False)
                    Prodict [dictkey[n]].Compute_Concen(t, False)
        ret = {}
        data = {}
        ret['dt'] = dt
        ret['time'] = time
        for n in range(len(dictkey)):
            data[pro_name[n] + "," + str(dictkey[n])] = Prodict[dictkey[n]].Concen
        ret['data'] = data
        return ret
    except InvalidParameter:
        return 'Invalid Paramter!'
    except IllegalSetting:
        return 'Illegal Setting!'
    except Exception as e:
        print e
        return 'Something Unexpected Happened!'

if __name__ == "__main__":
    gene_circuit = {'proteins': {1: {'RiPS': 11.49, 'name': 'BBa_C0060',
      'before_regulated': 27889.1025, 'concen': 0.1, 'grp_id': 4, 'pos': 2,
      'PoPS': 33.25, 'repress_rate': 0.0, 'K1': None, 'induce_rate': 0.0,
      'copy': 73.0, 'display': 'True'}, 2: {'RiPS': 11.49, 'name': 'BBa_C0060',
        'before_regulated': 27889.1025, 'concen': 0.1, 'grp_id': 4, 'pos': 4,
        'PoPS': 33.25, 'repress_rate': 0.0, 'K1': None, 'induce_rate': 0.0,
        'copy': 73.0, 'display': 'True'}, 3: {'RiPS': 11.49, 'name':
          'BBa_K518003', 'before_regulated': 27889.1025, 'concen': 0.1,
          'grp_id': 4, 'pos': 6, 'PoPS': 33.25, 'repress_rate': 0.0, 'K1': None,
          'induce_rate': 0.0, 'copy': 73.0, 'display': 'False'}, 4: {'RiPS':
            11.49, 'name': 'BBa_K142002', 'before_regulated': 27889.1025,
            'concen': 0.1, 'grp_id': 4, 'pos': 8, 'PoPS': 33.25, 'repress_rate':
            0.0, 'K1': None, 'induce_rate': 0.0, 'copy': 73.0, 'display':
            'False'}, 5: {'RiPS': 11.49, 'name': 'BBa_C0160',
              'before_regulated': 28711.097099999995, 'concen': 0.1, 'grp_id':
              5, 'pos': 2, 'PoPS': 34.23, 'repress_rate': 0.44273640573799977,
              'K1': 3.041392685158225, 'induce_rate': 0.44273640573799977,
              'copy': 73.0, 'display': 'True'}, 6: {'RiPS': 11.49, 'name':
                'BBa_C0178', 'before_regulated': 79590.88530000001, 'concen':
                0.1, 'grp_id': 7, 'pos': 2, 'PoPS': 94.89, 'repress_rate':
                -0.4428135474974744, 'K1': -2.451703061628793, 'induce_rate':
                -0.4428135474886069, 'copy': 73.0, 'display': 'True'}, 7:
              {'RiPS': 11.49, 'name': 'BBa_C0178', 'before_regulated':
                79590.88530000001, 'concen': 0.1, 'grp_id': 7, 'pos': 4, 'PoPS':
                94.89, 'repress_rate': -0.4428135474974744, 'K1':
                -2.451703061628793, 'induce_rate': -0.4428135474886069, 'copy':
                73.0, 'display': 'True'}}, 'plasmids': [[4, 5], [7]], 'groups': {4: {'from': -1, 'state': 'cis', 'corep_ind_type': 'None', 'to': [5, 6], 'sbol': [{'type': 'Promoter', 'name': u'BBa_K091146'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Protein', 'name': 'BBa_C0060', 'id': 1}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Protein', 'name': 'BBa_C0060', 'id': 2}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Activator', 'name': 'BBa_K518003', 'id': 3}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Repressor', 'name': 'BBa_K142002', 'id': 4}, {'type': 'Terminator', 'name': 'BBa_B0013'}], 'type': 'Constitutive'}, 5: {'from': 3, 'state': 'cis', 'corep_ind_type': 'None', 'to': [], 'sbol': [{'type': 'Promoter', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Protein', 'name': 'BBa_C0160', 'id': 5}, {'type': 'Terminator', 'name': 'BBa_B0013'}], 'type': 'Positive'}, 7: {'from': 4, 'state': 'cis', 'corep_ind_type': 'Inducer', 'to': [], 'sbol': [{'type': 'Promoter', 'name': 'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Protein', 'name': 'BBa_C0178', 'id': 6}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Protein', 'name': 'BBa_C0178', 'id': 7}, {'type': 'Terminator', 'name': 'BBa_B0013'}], 'corep_ind': u'Ind_0140', 'type': 'Negative'}}}

    import database
    db = database.SqliteDatabase()
    #corepind = {5: {"time": 20},
    #            7: {"time": 60}}
    corepind = {}
    print Simulate(False, gene_circuit, corepind, db, 6000, 100)
