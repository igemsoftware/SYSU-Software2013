from collections import deque

class Struct1_SYSU_Software:
    Type = ''
    CopyNumber  = None
    MPPromoter  = None
    PoPS        = None
    LeakageRate = None
    TerEff      = None
    def SetData(self, ty, copynumber, mppromoter, pops, leakagerate, tereff):
        self.Type = ty
        self.CopyNumber  = copynumber
        self.MPPromoter  = mppromoter
        self.PoPS        = pops
        self.LeakageRate = leakagerate
        self.TerEff      = tereff

class Struct2_SYSU_Software:
    RIPS        = None
    DegRatemRNA = None
    DegRatePro  = None
    def SetData(self, rips, degratemrna, degratepro):
        self.RIPS        = rips
        self.DegRatemRNA = degratemrna
        self.DegRatePro  = degratepro

class Struct3_SYSU_Software:
    RIPS        = None
    DegRatemRNA = None
    DegRatePro  = None
    HillCoeff1  = None
    K1          = None
    def SetData(self, rips, degratemrna, degratepro, hillcoeff1, k1):
        self.RIPS        = rips
        self.DegRatemRNA = degratemrna
        self.DegRatePro  = degratepro
        self.HillCoeff1  = hillcoeff1
        self.K1          = k1

def SteadyState_Concen(database, proteins, circuit, start_pos):
    # circuit: [Promoter, RBS, ObjectGene, Terminator] * size
    # size = len(circuit)
    Plasmid    = {}
    ObjGene    = {}
    ObjConcen  = {}
    queue = deque([start_pos])
    while len(queue) != 0:
        n = queue.popleft()
        cur_group = circuit[n]["sbol"]
        promoter   = database.select_with_name('Promoter', cur_group[0]['name'])
        rbs        = database.select_with_name('RBS', cur_group[1]['name'])
        objectgene = {'DegRatemRNA': 0.00288, 'DegRatePro': 0.00288}
        terminator = database.select_with_name('Terminator', cur_group[-1]['name'])
        Plasmid[n] = Struct1_SYSU_Software()
        Plasmid[n].SetData(promoter["Type"], proteins[n]["copy"], promoter['MPPromoter'], promoter['PoPS'], promoter['LeakageRate'], terminator['Efficiency'])
        ObjGene[n] = Struct2_SYSU_Software()
        ObjGene[n].SetData(rbs['RIPS'], objectgene['DegRatemRNA'], objectgene['DegRatePro'])
        for i in circuit[n]["to"]:
            queue.append(i)

    queue = deque([start_pos])
    while len(queue) != 0:
        n = queue.popleft()
        if Plasmid[n].Type == 'Constitutive':
            ObjConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (Plasmid[n].PoPS        / ObjGene[n].DegRatemRNA) * (ObjGene[n].RIPS / ObjGene[n].DegRatePro)
        elif Plasmid[n].Type == 'Positive':
            ObjConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (Plasmid[n].LeakageRate / ObjGene[n].DegRatemRNA) * (ObjGene[n].RIPS / ObjGene[n].DegRatePro)
        elif Plasmid[n].Type == 'Negative':
            ObjConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (Plasmid[n].MPPromoter  / ObjGene[n].DegRatemRNA) * (ObjGene[n].RIPS / ObjGene[n].DegRatePro)
        for i in circuit[n]["to"]:
            queue.append(i)
    return ObjConcen

def SteadyState_Concen_ActRep(database, proteins, circuit, start_pos):
    # circuit: [Promoter, RBS1, ObjectGene, RBS2/None, RegulationGene(Activator/Repressor/None), Terminator] * size
    # size = len(circuit)
    Plasmid    = {}
    ObjGene    = {}
    ReguGene   = {}
    ObjConcen  = {}
    ReguConcen = {}
    queue = deque([start_pos])
    while len(queue) != 0:
        n = queue.popleft()
        cur_group = circuit[n]["sbol"]
        promoter   = database.select_with_name('Promoter', cur_group[0]['name'])
        rbs1       = database.select_with_name('RBS', cur_group[1]['name'])
        objectgene = {'DegRatemRNA': 0.00288, 'DegRatePro': 0.00288}
        terminator = database.select_with_name('Terminator', cur_group[-1]['name'])
        Plasmid[n] = Struct1_SYSU_Software()
        Plasmid[n].SetData(promoter['Type'], proteins[n]["copy"], promoter['MPPromoter'], promoter['PoPS'], promoter['LeakageRate'], terminator['Efficiency'])
        ObjGene[n] = Struct2_SYSU_Software()
        ObjGene[n].SetData(rbs1['RIPS'], objectgene['DegRatemRNA'], objectgene['DegRatePro'])
        for i in circuit[n]["to"]:
            queue.append(i)

    queue = deque([start_pos])
    while len(queue) != 0:
        n = queue.popleft()
        cur_group  = circuit[n]["sbol"]
        rbs2       = database.select_with_name('RBS', cur_group[3]['name'])
        if circuit[n]["to"] == []:
            continue
        next_type  = circuit[circuit[n]["to"][0]]["type"]
        if next_type == 'Positive':
            regugene = database.select_with_name('Activator', cur_group[4]['name'])
        elif next_type == 'Negative':
            regugene = database.select_with_name('Repressor', cur_group[4]['name'])
        regugene['DegRatemRNA'] = 0.00288
        regugene['DegRatePro']  = 0.00288
        ReguGene[n] = Struct3_SYSU_Software()
        ReguGene[n].SetData(rbs2['RIPS'], regugene['DegRatemRNA'], regugene['DegRatePro'], regugene['HillCoeff1'], regugene['K1'])
        for i in circuit[n]["to"]:
            queue.append(i)

    if Plasmid[start_pos].Type == 'Constitutive':
        ObjConcen [start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].PoPS        / ObjGene [start_pos].DegRatemRNA) * (ObjGene [start_pos].RIPS / ObjGene [start_pos].DegRatePro)
        ReguConcen[start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].PoPS        / ReguGene[start_pos].DegRatemRNA) * (ReguGene[start_pos].RIPS / ReguGene[start_pos].DegRatePro)
    elif Plasmid[start_pos].Type == 'Positive':
        ObjConcen [start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].LeakageRate / ObjGene [start_pos].DegRatemRNA) * (ObjGene [start_pos].RIPS / ObjGene [start_pos].DegRatePro)
        ReguConcen[start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].LeakageRate / ReguGene[start_pos].DegRatemRNA) * (ReguGene[start_pos].RIPS / ReguGene[start_pos].DegRatePro)
    elif Plasmid[start_pos].Type == 'Negative':
        ObjConcen [start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].MPPromoter  / ObjGene [start_pos].DegRatemRNA) * (ObjGene [start_pos].RIPS / ObjGene [start_pos].DegRatePro)
        ReguConcen[start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].MPPromoter  / ReguGene[start_pos].DegRatemRNA) * (ReguGene[start_pos].RIPS / ReguGene[start_pos].DegRatePro)

    queue = deque(circuit[start_pos]["to"])
    while len(queue) != 0:
        n = queue.popleft()
        cur_group  = circuit[n]["sbol"]
        last = circuit[n]["from"]
        if Plasmid[n].Type == 'Positive':
            ObjConcen [n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguGene[last].K1 / ReguConcen[last], ReguGene[last].HillCoeff1)) + Plasmid[n].LeakageRate) / ObjGene [n].DegRatemRNA) * (ObjGene [n].RIPS / ObjGene [n].DegRatePro)
            if circuit[n]["to"] == []:
                continue
            ReguConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguGene[last].K1 / ReguConcen[last], ReguGene[last].HillCoeff1)) + Plasmid[n].LeakageRate) / ReguGene[n].DegRatemRNA) * (ReguGene[n].RIPS / ReguGene[n].DegRatePro)
        elif Plasmid[n].Type == 'Negative':
            ObjConcen [n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguConcen[last] / ReguGene[last].K1, ReguGene[last].HillCoeff1)) + Plasmid[n].LeakageRate) / ObjGene [n].DegRatemRNA) * (ObjGene [n].RIPS / ObjGene [n].DegRatePro)
            if circuit[n]["to"] == []:
                continue
            ReguConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguConcen[last] / ReguGene[last].K1, ReguGene[last].HillCoeff1)) + Plasmid[n].LeakageRate) / ReguGene[n].DegRatemRNA) * (ReguGene[n].RIPS /ReguGene[n].DegRatePro)
        for i in circuit[n]["to"]:
            queue.append(i)
    return ObjConcen

def SteadyState_Concen_CorepInd(database, proteins, circuit, corepind, start_pos):
    # circuit: [Promoter, RBS1, ObjectGene, RBS2/None, RegulationGene(Activator/Repressor/None), Terminator] * size
    # concen: concentration of co-repressor or inducer
    # corepind: co-repressor or inducer, corepind[0] = None for circuit[0] is express without regulation
    size = len(circuit)
    Plasmid    = {}
    ObjGene    = {}
    ReguGene   = {}
    ObjConcen  = {}
    ReguConcen = {}
    queue = deque([start_pos])
    while len(queue) != 0:
        n = queue.popleft()
        cur_group  = circuit[n]["sbol"]
        promoter   = database.select_with_name('Promoter', cur_group[0]['name'])
        rbs1       = database.select_with_name('RBS', cur_group[1]['name'])
        objectgene = {'DegRatemRNA': 0.00288, 'DegRatePro': 0.00288}
        terminator = database.select_with_name('Terminator', cur_group[-1]['name'])
        Plasmid[n] = Struct1_SYSU_Software()
        copynumber = proteins[n]["copy"]
        Plasmid[n].SetData(promoter['Type'], copynumber, promoter['MPPromoter'], promoter['PoPS'], promoter['LeakageRate'], terminator['Efficiency'])
        ObjGene[n] = Struct2_SYSU_Software()
        ObjGene[n].SetData(rbs1['RIPS'], objectgene['DegRatemRNA'], objectgene['DegRatePro'])
        for i in circuit[n]["to"]:
            queue.append(i)

    queue = deque([start_pos])
    while len(queue) != 0:
        n = queue.popleft()
        cur_group  = circuit[n]["sbol"]
        rbs2       = database.select_with_name('RBS', cur_group[3]['name'])
        if circuit[n]["to"] == []:
            continue
        next_type  = circuit[circuit[n]["to"][0]]["type"]
        if next_type == 'Positive':
            regugene = database.select_with_name('Activator', cur_group[4]['name'])
        elif next_type == 'Negative':
            regugene = database.select_with_name('Repressor', cur_group[4]['name'])
        regugene['DegRatemRNA'] = 0.00288
        regugene['DegRatePro'] = 0.00288
        ReguGene[n] = Struct3_SYSU_Software()
        ReguGene[n].SetData(rbs2['RIPS'], regugene['DegRatemRNA'], regugene['DegRatePro'], regugene['HillCoeff1'], regugene['K1'])
        for i in circuit[n]["to"]:
            queue.append(i)

    CorepIndConst    = {}
    queue = deque(circuit[start_pos]["to"])
    while len(queue) != 0:
        n = queue.popleft()
        if corepind != {}:
            corepind = database.select_with_name('Corepressor_Inducer', corepind[n]['name'])
            CorepIndConst[n] = 1 + (proteins[n]["concen"] / corepind[n]['K2']) ** corepind[n]['HillCoeff2']
        else:
            CorepIndConst[n] = 1.0
        for i in circuit[n]["to"]:
            queue.append(i)

    if Plasmid[start_pos].Type == 'Constitutive':
        ObjConcen [start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].PoPS        / ObjGene [start_pos].DegRatemRNA) * (ObjGene [start_pos].RIPS / ObjGene [start_pos].DegRatePro)
        ReguConcen[start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].PoPS        / ReguGene[start_pos].DegRatemRNA) * (ReguGene[start_pos].RIPS / ReguGene[start_pos].DegRatePro)
    elif Plasmid[start_pos].Type == 'Positive':
        ObjConcen [start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].LeakageRate / ObjGene [start_pos].DegRatemRNA) * (ObjGene [start_pos].RIPS / ObjGene [start_pos].DegRatePro)
        ReguConcen[start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].LeakageRate / ReguGene[start_pos].DegRatemRNA) * (ReguGene[start_pos].RIPS / ReguGene[start_pos].DegRatePro)
    elif Plasmid[start_pos].Type == 'Negative':
        ObjConcen [start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].MPPromoter  / ObjGene [start_pos].DegRatemRNA) * (ObjGene [start_pos].RIPS / ObjGene [start_pos].DegRatePro)
        ReguConcen[start_pos] = Plasmid[start_pos].CopyNumber * Plasmid[start_pos].TerEff * (Plasmid[start_pos].MPPromoter  / ReguGene[start_pos].DegRatemRNA) * (ReguGene[start_pos].RIPS / ReguGene[start_pos].DegRatePro)

    queue = deque(circuit[start_pos]["to"])
    while len(queue) != 0:
        n = queue.popleft()
        cur_group  = circuit[n]["sbol"]
        last = circuit[n]["from"]
        if Plasmid[n].Type == 'Positive':
            ObjConcen [n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguGene[last].K1 * CorepIndConst[n] / ReguConcen[last], ReguGene[last].HillCoeff1)) + Plasmid[n].LeakageRate) / ObjGene [n].DegRatemRNA) * (ObjGene [n].RIPS / ObjGene [n].DegRatePro)
            if circuit[n]["to"] == []:
                continue
            ReguConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguGene[last].K1 * CorepIndConst[n] / ReguConcen[last], ReguGene[last].HillCoeff1)) + Plasmid[n].LeakageRate) / ReguGene[n].DegRatemRNA) * (ReguGene[n].RIPS / ReguGene[n].DegRatePro)
        elif Plasmid[n].Type == 'Negative':
            ObjConcen [n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguConcen[last] / ReguGene[last].K1 / CorepIndConst[n], ReguGene[last].HillCoeff1)) + Plasmid[n].LeakageRate) / ObjGene [n].DegRatemRNA) * (ObjGene [n].RIPS / ObjGene [n].DegRatePro)
            if circuit[n]["to"] == []:
                continue
            ReguConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguConcen[last] / ReguGene[last].K1 / CorepIndConst[n], ReguGene[last].HillCoeff1)) + Plasmid[n].LeakageRate) / ReguGene[n].DegRatemRNA) * (ReguGene[n].RIPS / ReguGene[n].DegRatePro)
        for i in circuit[n]["to"]:
            queue.append(i)
    return ObjConcen


if __name__ == "__main__":
  import database
  db = database.SqliteDatabase()
  circuit = {2: {'from': -1, 'sbol': [{'type': 'Regulatory', 'name':
    'BBa_I712074'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type': 'Coding',
      'name': 'BBa_C0060', 'id': 1}, {'type': 'RBS', 'name': 'BBa_J61104'},
    {'type': 'Coding', 'name': u'BBa_K518003', 'id': 2}, {'type': 'Terminator',
      'name': 'BBa_B0013'}], 'type': 'Constitutive', 'state': 'cis', 'to': [3,
        4]}, 3: {'from': 2, 'sbol': [{'type': 'Regulatory', 'name':
          'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type':
            'Coding', 'name': 'BBa_C0160', 'id': 3}, {'type': 'Terminator',
              'name': 'BBa_B0013'}], 'type': 'Negative', 'state': 'cis', 'to':
            []}, 4: {'from': 2, 'sbol': [{'type': 'Regulatory', 'name':
              'BBa_J64000'}, {'type': 'RBS', 'name': 'BBa_J61104'}, {'type':
                'Coding', 'name': 'BBa_C0178', 'id': 4}, {'type': 'Terminator',
                  'name': 'BBa_B0013'}], 'type': 'Negative', 'state': 'cis',
                'to': []}}

  proteins = {1: {'RiPs': 11.49, 'name': 'BBa_C0060',
    'before_regulated': 0, 'concen': 7.95908853, 'grp_id': 2, 'PoPs': 94.89,
    'repress_rate': 100, 'induce_rate': 0, 'after_induced': 0, 'copy': 3.0,
    'after_regulated': 0}, 2: {'RiPs': 11.49, 'name': u'BBa_K518003',
      'before_regulated': 0, 'concen': 7.95908853, 'grp_id': 2, 'PoPs': 94.89,
      'repress_rate': 100, 'induce_rate': 0, 'after_induced': 0, 'copy': 3.0,
      'after_regulated': 0}, 3: {'RiPs': 11.49, 'name': 'BBa_C0160',
        'before_regulated': 0, 'concen': 383.20873499999993, 'grp_id': 3,
        'PoPs': 55.55, 'repress_rate': 0.2998365890589771, 'induce_rate': 0,
        'after_induced': 0, 'copy': 3.0, 'after_regulated': 0}, 4: {'RiPs':
          11.49, 'name': 'BBa_C0178', 'before_regulated': 0, 'concen':
          383.20873499999993, 'grp_id': 4, 'PoPs': 55.55, 'repress_rate':
          0.2998365890589771, 'induce_rate': 0, 'after_induced': 0, 'copy':
          3.0, 'after_regulated': 0}}
  print SteadyState_Concen_CorepInd(db, proteins, circuit, {}, 2)
