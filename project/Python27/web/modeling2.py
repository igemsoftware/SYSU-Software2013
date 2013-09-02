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

def SteadyState_Concen(database, copynumber, circuit):
    # circuit: [Promoter, RBS, ObjectGene, Terminator] * size
    size = len(circuit)
    Plasmid    = [None] * size
    ObjGene    = [None] * size
    ObjConcen  = [None] * size
    for n in range(size):
        promoter   = database.select_with_name('Promoter', circuit[n][0]['Name'])
        rbs        = database.select_with_name('RBS', circuit[n][1]['Name'])
        objectgene = {'DegRatemRNA': 0.00288, 'DegRatePro': 0.00288}
        terminator = database.select_with_naem('Terminator', circuit[n][-1]['Name'])
        Plasmid[n] = Struct1_SYSU_Software()
        Plasmid[n].SetData(promoter['Type'], copynumber[n], promoter['MPPromoter'], promoter['PoPS'], promoter['LeakageRate'], terminator['TerEff'])
        ObjGene[n] = Struct2_SYSU_Software()
        ObjGene[n].SetData(rbs['RIPS'], objectgene['DegRatemRNA'], objectgene['DegRatePro'])
    for n in range(size):
        if Plasmid[n].Type == 'Constitutive':
            ObjConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (Plasmid[n].PoPS        / ObjGene[n].DegRatemRNA) * (ObjGene[n].RIPS / ObjGene[n].DegRatePro)
        elif Plasmid[n].Type == 'Positive':
            ObjConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (Plasmid[n].LeakageRate / ObjGene[n].DegRatemRNA) * (ObjGene[n].RIPS / ObjGene[n].DegRatePro)
        elif Plasmid[n].Type == 'Negative':
            ObjConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (Plasmid[n].MPPromoter  / ObjGene[n].DegRatemRNA) * (ObjGene[n].RIPS / ObjGene[n].DegRatePro)
    return ObjConcen

def SteadyState_Concen_ActRep(database, copynumber, circuit):
    # circuit: [Promoter, RBS1, ObjectGene, RBS2/None, RegulationGene(Activator/Repressor/None), Terminator] * size
    size = len(circuit)
    Plasmid    = [None] * size
    ObjGene    = [None] * size
    ReguGene   = [None] * (size - 1)
    ObjConcen  = [None] * size
    ReguConcen = [None] * (size - 1)
    for n in range(size):
        promoter   = database.select_with_name('Promoter', circuit[n][0]['Name'])
        rbs1       = database.select_with_name('RBS', circuit[n][1]['Name'])
        objectgene = {'DegRatemRNA': 0.00288, 'DegRatePro': 0.00288}
        terminator = database.select_with_name('Terminator', circuit[n][-1]['Name'])
        Plasmid[n] = Struct1_SYSU_Software()
        Plasmid[n].SetData(promoter['Type'], copynumber[n], promoter['MPPromoter'], promoter['PoPS'], promoter['LeakageRate'], terminator['TerEff'])
        ObjGene[n] = Struct2_SYSU_Software()
        ObjGene[n].SetData(rbs1['RIPS'], objectgene['DegRatemRNA'], objectgene['DegRatePro'])
    for n in range(size-1):
        rbs2       = database.select_with_name('RBS', circuit[n][ 3]['Name'])
        if Plasmid[n+1].Type == 'Positive':
            regugene = database.select_with_name('Activator', circuit[n][4]['Name'])
        elif Plasmid[n+1].Type == 'Negative':
            regugene = database.select_with_name('Repressor', circuit[n][4]['Name'])
        regugene['DegRatemRNA'] = 0.00288; regugene['DegRatePro'] = 0.00288
        ReguGene[n] = Struct3_SYSU_Software()
        ReguGene[n].SetData(rbs2['RIPS'], regugene['DegRatemRNA'], regugene['DegRatePro'], regugene['HillCoeff1'], regugene['K1'])
    if Plasmid[0].Type == 'Constitutive':
        ObjConcen [0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].PoPS        / ObjGene [0].DegRatemRNA) * (ObjGene [0].RIPS / ObjGene [0].DegRatePro)
        ReguConcen[0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].PoPS        / ReguGene[0].DegRatemRNA) * (ReguGene[0].RIPS / ReguGene[0].DegRatePro)
    elif Plasmid[0].Type == 'Positive':
        ObjConcen [0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].LeakageRate / ObjGene [0].DegRatemRNA) * (ObjGene [0].RIPS / ObjGene [0].DegRatePro)
        ReguConcen[0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].LeakageRate / ReguGene[0].DegRatemRNA) * (ReguGene[0].RIPS / ReguGene[0].DegRatePro)
    elif Plasmid[0].Type == 'Negative':
        ObjConcen [0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].MPPromoter  / ObjGene [0].DegRatemRNA) * (ObjGene [0].RIPS / ObjGene [0].DegRatePro)
        ReguConcen[0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].MPPromoter  / ReguGene[0].DegRatemRNA) * (ReguGene[0].RIPS / ReguGene[0].DegRatePro)
    for n in range(1, size):
        if Plasmid[n].Type == 'Positive':
            ObjConcen [n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguGene[n-1].K1 / ReguConcen[n-1], ReguGene[n-1].HillCoeff1)) + Plasmid[n].LeakageRate) / ObjGene [n].DegRatemRNA) * (ObjGene [n].RIPS / ObjGene [n].DegRatePro)
            if n == size-1: continue
            ReguConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguGene[n-1].K1 / ReguConcen[n-1], ReguGene[n-1].HillCoeff1)) + Plasmid[n].LeakageRate) / ReguGene[n].DegRatemRNA) * (ReguGene[n].RIPS / ReguGene[n].DegRatePro)
        elif Plasmid[n].Type == 'Negative':
            ObjConcen [n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguConcen[n-1] / ReguGene[n-1].K1, ReguGene[n-1].HillCoeff1)) + Plasmid[n].LeakageRate) / ObjGene [n].DegRatemRNA) * (ObjGene [n].RIPS / ObjGene [n].DegRatePro)
            if n == size-1: continue
            ReguConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguConcen[n-1] / ReguGene[n-1].K1, ReguGene[n-1].HillCoeff1)) + Plasmid[n].LeakageRate) / ReguGene[n].DegRatemRNA) * (ReguGene[n].RIPS /ReguGene[n].DegRatePro)
    return ObjConcen

def SteadyState_Concen_CorepInd(daatbase, copynumber, circuit, concen, corepind):
    # circuit: [Promoter, RBS1, ObjectGene, RBS2/None, RegulationGene(Activator/Repressor/None), Terminator] * size
    # concen: concentration of co-repressor or inducer
    # corepind: co-repressor or inducer, corepind[0] = None for circuit[0] is express without regulation
    size = len(circuit)
    Plasmid    = [None] * size
    ObjGene    = [None] * size
    ReguGene   = [None] * (size - 1)
    ObjConcen  = [None] * size
    ReguConcen = [None] * (size - 1)
    for n in range(size):
        promoter   = database.select_with_name('Promoter', circuit[n][0]['Name'])
        rbs1       = database.select_with_name('RBS', circuit[n][1]['Name'])
        objectgene = {'DegRatemRNA': 0.00288, 'DegRatePro': 0.00288}
        terminator = database.select_with_naem('Terminator', circuit[n][-1]['Name'])
        Plasmid[n] = Struct1_SYSU_Software()
        Plasmid[n].SetData(promoter['Type'], copynumber[n], promoter['MPPromoter'], promoter['PoPS'], promoter['LeakageRate'], terminator['TerEff'])
        ObjGene[n] = Struct2_SYSU_Software()
        ObjGene[n].SetData(rbs1['RIPS'], objectgene['DegRatemRNA'], objectgene['DegRatePro'])
    for n in range(size-1):
        rbs2       = database.select_with_name('RBS', circuit[n][3]['Name'])
        if Plasmid[n+1].Type == 'Positive':
            regugene = database.select_with_name('Activator', circuit[n][4]['Name'])
        elif Plasmid[n+1].Type == 'Negative':
            regugene = database.select_with_name('Repressor', circuit[n][4]['Name'])
        regugene['DegRatemRNA'] = 0.00288; regugene['DegRatePro'] = 0.00288
        ReguGene[n] = Struct3_SYSU_Software()
        ReguGene[n].SetData(rbs2['RIPS'], regugene['DegRatemRNA'], regugene['DegRatePro'], regugene['HillCoeff1'], regugene['K1'])
    CorepIndConst    = [None] * size
    for n in range(1, size):
        if corepind != None:
            corepind = database.select_with_name('Corepressor_Inducer', corepind[n]['Name'])
            CorepIndConst[n] = 1 + (concen[n] / corepind[n]['K2']) ** corepind[n]['HillCoeff2']
        else:
            CorepIndConst[n] = 1.0
    if Plasmid[0].Type == 'Constitutive':
        ObjConcen [0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].PoPS        / ObjGene [0].DegRatemRNA) * (ObjGene [0].RIPS / ObjGene [0].DegRatePro)
        ReguConcen[0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].PoPS        / ReguGene[0].DegRatemRNA) * (ReguGene[0].RIPS / ReguGene[0].DegRatePro)
    elif Plasmid[0].Type == 'Positive':
        ObjConcen [0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].LeakageRate / ObjGene [0].DegRatemRNA) * (ObjGene [0].RIPS / ObjGene [0].DegRatePro)
        ReguConcen[0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].LeakageRate / ReguGene[0].DegRatemRNA) * (ReguGene[0].RIPS / ReguGene[0].DegRatePro)
    elif Plasmid[0].Type == 'Negative':
        ObjConcen [0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].MPPromoter  / ObjGene [0].DegRatemRNA) * (ObjGene [0].RIPS / ObjGene [0].DegRatePro)
        ReguConcen[0] = Plasmid[0].CopyNumber * Plasmid[0].TerEff * (Plasmid[0].MPPromoter  / ReguGene[0].DegRatemRNA) * (ReguGene[0].RIPS / ReguGene[0].DegRatePro)
    for n in range(1, size):
        if Plasmid[n].Type == 'Positive':
            ObjConcen [n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguGene[n-1].K1 * CorepIndConst[n] / ReguConcen[n-1], ReguGene[n-1].HillCoeff1)) + Plasmid[n].LeakageRate) / ObjGene [n].DegRatemRNA) * (ObjGene [n].RIPS / ObjGene [n].DegRatePro)
            if n == size-1: continue
            ReguConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguGene[n-1].K1 * CorepIndConst[n] / ReguConcen[n-1], ReguGene[n-1].HillCoeff1)) + Plasmid[n].LeakageRate) / ReguGene[n].DegRatemRNA) * (ReguGene[n].RIPS / ReguGene[n].DegRatePro)
        elif Plasmid[n].Type == 'Negative':
            ObjConcen [n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguConcen[n-1] / ReguGene[n-1].K1 / CorepIndConst[n], ReguGene[n-1].HillCoeff1)) + Plasmid[n].LeakageRate) / ObjGene [n].DegRatemRNA) * (ObjGene [n].RIPS / ObjGene [n].DegRatePro)
            if n == size-2: continue
            ReguConcen[n] = Plasmid[n].CopyNumber * Plasmid[n].TerEff * (((Plasmid[n].MPPromoter - Plasmid[n].LeakageRate) / (1 + pow(ReguConcen[n-1] / ReguGene[n-1].K1 / CorepIndConst[n], ReguGene[n-1].HillCoeff1)) + Plasmid[n].LeakageRate) / ReguGene[n].DegRatemRNA) * (ReguGene[n].RIPS / ReguGene[n].DegRatePro)
    return ObjConcen
