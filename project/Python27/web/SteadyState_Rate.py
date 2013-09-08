from SteadyState_Concen import SteadyState_Concen

def ActRepRate(circuit, database):
    PlasID   = circuit['plasmids'][0]
    PlasSize = {}
    ProDict  = {}
    DictKey  = []
    Concen_None    = {}
    Concen_ActRep  = {}
    concen_actrep  = {}
    for n in range(len(PlasID)):
        PlasSize[PlasID[n]] = int(len(circuit['groups'][PlasID[n]]['sbol']) / 2 - 1)
    for n in range(len(PlasID)):
        group      = circuit['groups'][PlasID[n]]
        promoter   = database.select_with_name('Promoter', group['sbol'][0]['name'])
        terminator = database.select_with_name('Terminator', group['sbol'][-1]['name'])
        for k in range(PlasSize[PlasID[n]]):
            rbs   = database.select_with_name('RBS', group['sbol'][2*k+1]['name'])
            proid = group['sbol'][2*k+2]['id']
            DictKey.append(proid)
            dataset = {'Type':None, 'From':None, 'CopyNumber':None, 'MPPromoter':None, 'LeakageRate':None, 'Efficiency':None,
                       'MPRBS':None, 'DegRatemRNA':None, 'DegRatePro':None, 'Activator':None, 'Repressor':None,
                       'K1':None, 'HillCoeff1':None, 'Corepressor':None, 'Inducer':None, 'K2':None, 'HillCoeff2':None}
            dataset['Type']        = group['type']
            dataset['From']        = group['from']
            dataset['CopyNumber']  = circuit['proteins'][proid]['copy']
            dataset['MPPromoter']  = promoter['MPPromoter']
            dataset['LeakageRate'] = promoter['LeakageRate']
            dataset['Efficiency']        = terminator['Efficiency']
            dataset['MPRBS']     = rbs['MPRBS']
            dataset['DegRatemRNA'] = 0.00288
            dataset['DegRatePro']  = 0.00288
            if dataset['Type'] == 'Positive':
                activator = database.select_with_name('Activator', circuit['proteins'][dataset['From']]['name'])
                dataset['K1']         = activator['K1']
                dataset['HillCoeff1'] = activator['HillCoeff1']
            elif dataset['Type'] == 'Negative':
                repressor = database.select_with_name('Repressor', circuit['proteins'][dataset['From']]['name'])
                dataset['K1']         = repressor['K1']
                dataset['HillCoeff1'] = repressor['HillCoeff1']
            ProDict[proid] = dataset
    for n in range(len(DictKey)):
        Concen_None[DictKey[n]] = SteadyState_Concen(ProDict[DictKey[n]])
    for n in range(len(DictKey)):
        concen_actrep[DictKey[n]] = Concen_None[DictKey[n]]
    iteration = 0
    while True:
        iteration += 1
        for n in range(len(DictKey)):
            if ProDict[DictKey[n]]['Type'] == 'Constitutive':
                Concen_ActRep[DictKey[n]] = SteadyState_Concen(ProDict[DictKey[n]])
            elif ProDict[DictKey[n]]['Type'] == 'Positive':
                ProDict[DictKey[n]]['Activator'] = concen_actrep[ProDict[DictKey[n]]['From']]
                Concen_ActRep[DictKey[n]] = SteadyState_Concen(ProDict[DictKey[n]])
            elif ProDict[DictKey[n]]['Type'] == 'Negative':
                ProDict[DictKey[n]]['Repressor'] = concen_actrep[ProDict[DictKey[n]]['From']]
                Concen_ActRep[DictKey[n]] = SteadyState_Concen(ProDict[DictKey[n]])
        error = 0
        for n in range(len(DictKey)):
            error = max(error, (Concen_ActRep[DictKey[n]] - concen_actrep[DictKey[n]]) / Concen_ActRep[DictKey[n]])
        if error < 0.0001: break
        if iteration > 10: break
        for n in range(len(DictKey)):
            concen_actrep[DictKey[n]] = Concen_ActRep[DictKey[n]]
    Rate = {}
    for n in range(len(DictKey)):
        Rate[DictKey[n]] = Concen_ActRep[DictKey[n]] / Concen_None[DictKey[n]]
    return Rate

def CorepIndRate(circuit, corepind, database):
    PlasID   = circuit['plasmids'][0]
    PlasSize = {}
    ProDict  = {}
    DictKey  = []
    Concen_None    = {}
    Concen_ActRep  = {}
    concen_actrep  = {}
    for n in range(len(PlasID)):
        PlasSize[PlasID[n]] = int(len(circuit['groups'][PlasID[n]]['sbol']) / 2 - 1)
    for n in range(len(PlasID)):
        group      = circuit['groups'][PlasID[n]]
        promoter   = database.select_with_name('Promoter', group['sbol'][0]['name'])
        terminator = database.select_with_name('Terminator', group['sbol'][-1]['name'])
        for k in range(PlasSize[PlasID[n]]):
            rbs   = database.select_with_name('RBS', group['sbol'][2*k+1]['name'])
            proid = group['sbol'][2*k+2]['id']
            DictKey.append(proid)
            dataset = {'Type':None, 'From':None, 'CopyNumber':None, 'MPPromoter':None, 'LeakageRate':None, 'Efficiency':None,
                       'MPRBS':None, 'DegRatemRNA':None, 'DegRatePro':None, 'Activator':None, 'Repressor':None,
                       'K1':None, 'HillCoeff1':None, 'Corepressor':None, 'Inducer':None, 'K2':None, 'HillCoeff2':None}
            dataset['Type']        = group['type']
            dataset['From']        = group['from']
            dataset['CopyNumber']  = circuit['proteins'][proid]['copy']
            dataset['MPPromoter']  = promoter['MPPromoter']
            dataset['LeakageRate'] = promoter['LeakageRate']
            dataset['Efficiency']        = terminator['Efficiency']
            dataset['MPRBS']     = rbs['MPRBS']
            dataset['DegRatemRNA'] = 0.00288
            dataset['DegRatePro']  = 0.00288
            if dataset['Type'] == 'Positive':
                activator = database.select_with_name('Activator', circuit['proteins'][dataset['From']]['name'])
                dataset['K1']         = activator['K1']
                dataset['HillCoeff1'] = activator['HillCoeff1']
            elif dataset['Type'] == 'Negative':
                repressor = database.select_with_name('Repressor', circuit['proteins'][dataset['From']]['name'])
                dataset['K1']         = repressor['K1']
                dataset['HillCoeff1'] = repressor['HillCoeff1']
            if group['corep_ind_type'] == 'Corepressor':
                corepressor = database.select_with_name('Corepressor', circuit['groups'][grpid]['corepressor'])
                dataset['Corepressor'] = corepind[PlasID[n]]['concen']
                dataset['K2']          = corepressor['K2']
                dataset['HillCoeff2']  = corepressor['HillCoeff2']
            elif group['corep_ind_type'] == 'Inducer':
                inducer = database.select_with_name('Inducer', circuit['groups'][grpid]['inducer'])
                dataset['Inducer']    = corepind[PlasID[n]]['concen']
                dataset['K2']         = inducer['K2']
                dataset['HillCoeff2'] = inducer['HillCoeff2']
            ProDict[proid] = dataset
    for n in range(len(DictKey)):
        Concen_None[DictKey[n]] = SteadyState_Concen(ProDict[DictKey[n]])
    for n in range(len(DictKey)):
        concen_actrep[DictKey[n]] = Concen_None[DictKey[n]]
    iteration = 0
    while True:
        iteration += 1
        for n in range(len(DictKey)):
            if ProDict[DictKey[n]]['Type'] == 'Constitutive':
                Concen_ActRep[DictKey[n]] = SteadyState_Concen(ProDict[DictKey[n]])
            elif ProDict[DictKey[n]]['Type'] == 'Positive':
                ProDict[DictKey[n]]['Activator'] = concen_actrep[ProDict[DictKey[n]]['From']]
                Concen_ActRep[DictKey[n]] = SteadyState_Concen(ProDict[DictKey[n]])
            elif ProDict[DictKey[n]]['Type'] == 'Negative':
                ProDict[DictKey[n]]['Repressor'] = concen_actrep[ProDict[DictKey[n]]['From']]
                Concen_ActRep[DictKey[n]] = SteadyState_Concen(ProDict[DictKey[n]])
        error = 0
        for n in range(len(DictKey)):
            error = max(error, (Concen_ActRep[DictKey[n]] - concen_actrep[DictKey[n]]) / Concen_ActRep[DictKey[n]])
        if error < 0.0001: break
        if iteration > 10: break
        for n in range(len(DictKey)):
            concen_actrep[DictKey[n]] = Concen_ActRep[DictKey[n]]
    Rate = {}
    for n in range(len(DictKey)):
        Rate[DictKey[n]] = Concen_ActRep[DictKey[n]] / Concen_None[DictKey[n]]
    return Rate

if __name__ == "__main__":
  import database
  db = database.SqliteDatabase()
  gene_circuit = {'proteins': {1: {'RiPS': 11.49, 'name': 'BBa_C0060',
    'repress_rate': -1, 'concen': 0.1, 'grp_id': 4, 'pos': 2, 'PoPS':
    74.11999999999999, 'before_regulated': 62169.632399999995, 'K1': 'NaN',
    'induce_rate': -1, 'copy': 73.0, 'display': 'True'}, 2: {'RiPS': 11.49,
      'name': 'BBa_C0060', 'repress_rate': -1, 'concen': 0.1, 'grp_id': 4,
      'pos': 4, 'PoPS': 74.11999999999999, 'before_regulated':
      62169.632399999995, 'K1': 'NaN', 'induce_rate': -1, 'copy': 73.0,
      'display': 'True'}, 3: {'RiPS': 11.49, 'name': 'BBa_K518003',
        'repress_rate': -1, 'concen': 0.1, 'grp_id': 4, 'pos': 6, 'PoPS':
        74.11999999999999, 'before_regulated': 62169.632399999995, 'K1': 'NaN',
        'induce_rate': -1, 'copy': 73.0, 'display': 'False'}, 4: {'RiPS': 11.49,
          'name': 'BBa_K518003', 'repress_rate': -1, 'concen': 0.1, 'grp_id': 4,
          'pos': 8, 'PoPS': 74.11999999999999, 'before_regulated':
          62169.632399999995, 'K1': 'NaN', 'induce_rate': -1, 'copy': 73.0,
          'display': 'False'}, 5: {'RiPS': 11.49, 'name': 'BBa_C0160',
            'repress_rate': -1, 'concen': 0.1, 'grp_id': 5, 'pos': 2, 'PoPS':
            34.23, 'before_regulated': 28711.097099999995, 'K1':
            -2.4287510356503725, 'induce_rate': -1, 'copy': 73.0, 'display':
            'True'}, 6: {'RiPS': 11.49, 'name': 'BBa_C0178', 'repress_rate': -1,
              'concen': 0.1, 'grp_id': 7, 'pos': 2, 'PoPS': 94.89,
              'before_regulated': 79590.88530000001, 'K1': -2.4287510356503725,
              'induce_rate': -1, 'copy': 73.0, 'display': 'True'}, 7: {'RiPS':
                11.49, 'name': 'BBa_C0178', 'repress_rate': -1, 'concen': 0.1,
                'grp_id': 7, 'pos': 4, 'PoPS': 94.89, 'before_regulated':
                79590.88530000001, 'K1': -2.4287510356503725, 'induce_rate': -1,
                'copy': 73.0, 'display': 'True'}}, 'plasmids': [[4, 5, 7]],
              'groups': {4: {'from': -1, 'state': 'cis', 'corep_ind_type':
                'None', 'to': [5, 6], 'sbol': [{'type': 'Promoter', 'name':
                  u'BBa_I732021'}, {'type': 'RBS', 'name': 'BBa_J61104'},
                  {'type': 'Protein', 'name': 'BBa_C0060', 'id': 1}, {'type':
                    'RBS', 'name': 'BBa_J61104'}, {'type': 'Protein', 'name':
                      'BBa_C0060', 'id': 2}, {'type': 'RBS', 'name':
                        'BBa_J61104'}, {'type': 'Activator', 'name':
                          'BBa_K518003', 'id': 3}, {'type': 'RBS', 'name':
                            'BBa_J61104'}, {'type': 'Repressor', 'name':
                              'BBa_K518003', 'id': 4}, {'type': 'Terminator',
                                'name': 'BBa_B0013'}], 'type': 'Constitutive'},
                              5: {'from': 3, 'state': 'cis', 'corep_ind_type':
                                'None', 'to': [], 'sbol': [{'type': 'Promoter',
                                  'name': 'BBa_I712074'}, {'type': 'RBS',
                                    'name': 'BBa_J61104'}, {'type': 'Protein',
                                      'name': 'BBa_C0160', 'id': 5}, {'type':
                                        'Terminator', 'name': 'BBa_B0013'}],
                                      'type': 'Positive'}, 7: {'from': 4,
                                        'state': 'cis', 'corep_ind_type':
                                        'Negative', 'inducer': 'BBa_P0140',
                                        'to': [], 'sbol': [{'type': 'Promoter',
                                          'name': 'BBa_I712074'}, {'type':
                                            'RBS', 'name': 'BBa_J61104'},
                                          {'type': 'Protein', 'name':
                                            'BBa_C0178', 'id': 6}, {'type':
                                              'RBS', 'name': 'BBa_J61104'},
                                            {'type': 'Protein', 'name':
                                              'BBa_C0178', 'id': 7}, {'type':
                                                'Terminator', 'name':
                                                'BBa_B0013'}], 'type':
                                              'Negative'}}}
  print ActRepRate(gene_circuit, db)
