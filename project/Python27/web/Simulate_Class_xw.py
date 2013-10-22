from math import ceil
from Simulate_Poisson import PoissonRandom
class InvalidParameter(Exception): pass
class IllegalSetting(Exception): pass

class DNA_Simulate:
    Type        = ''
    CopyNumber  = None
    TSPromoter  = None
    LeakageRate = None
    TerE        = None
    Activator   = None
    Repressor   = None
    HillCoeff   = None
    K           = None
    CorepConst  = None
    IndConst    = None
    def SetData(self, ty, copynumber, tspromoter, leakagerate, tere):
        if ty not in ['Constitutive', 'Positive', 'Negative']: raise InvalidParameter
        if copynumber <= 0 or tspromoter <= 0 or leakagerate < 0 or tere <=0: raise InvalidParameter
        (self.Type, self.CopyNumber, self.TSPromoter, self.LeakageRate, self.TerE) = (ty, copynumber, 
tspromoter, leakagerate, tere)
    def SetActivator(self, activator, k, hillcoeff):
        if self.Type != 'Positive': raise IllegalSetting
        if isinstance(activator, Protein_Simulate):
            if hillcoeff <= 0 or k <= 0: raise InvalidParameter
            (self.Activator, self.HillCoeff, self.K) = (activator, hillcoeff, k)
            self.Repressor = None
        else: raise IllegalSetting
    def SetRepressor(self, repressor, k, hillcoeff):
        if self.Type != 'Negative': raise IllegalSetting
        if isinstance(repressor, Protein_Simulate):
            if hillcoeff <= 0 or k <= 0: raise InvalidParameter
            (self.Repressor, self.HillCoeff, self.K) = (repressor, hillcoeff, k)
            self.Activator = None
        else: raise IllegalSetting
    def SetCorepressor(self, corepressor, k, hillcoeff):
        if self.Activator == None and self.Repressor == None: raise IllegalSetting
        if corepressor < 0 or hillcoeff <= 0 or k <= 0: raise InvalidParameter
        self.CorepConst = pow(corepressor / k, hillcoeff)
        self.IndConst   = None
    def SetInducer(self, inducer, k, hillcoeff):
        if self.Activator == None and self.Repressor == None: raise IllegalSetting
        if inducer < 0 or hillcoeff <= 0 or k <= 0: raise InvalidParameter
        self.IndConst   = pow(inducer / k, hillcoeff)
        self.CorepConst = None

class mRNA_Simulate:
    Dt        = None
    TimeLen   = None
    TimeDelay = None
    DNA       = None
    TranslE   = None
    DegRate   = None
    Concen    = list()
    def SetData(self, transle, degrate):
        if transle <=0 or degrate < 0: raise InvalidParameter
        (self.TranslE, self.DegRate) = (transle, degrate)
    def Connect(self, dna):
        if isinstance(dna, DNA_Simulate): self.DNA = dna
        else: raise IllegalSetting
    def IniConcen(self, isDelay, timelen, dt, ini):
        if timelen <= 0 or dt <= 0 or ini < 0: raise InvalidParameter
        (self.Dt, self.TimeLen) = (dt, timelen)
        self.Concen    = [0] * self.TimeLen
        self.Concen[0] = ini
        if isDelay: self.TimeDelay = ceil(40 / self.Dt) # [Time-delay: 40s]
        else: self.TimeDelay = 1
    def Compute_Concen(self, n, isStochastic = False):
        if self.DNA.Type == 'Constitutive':
            production = self.Dt * self.DNA.CopyNumber * self.DNA.TSPromoter
        elif self.DNA.Type == 'Positive':
            if self.DNA.Activator and self.DNA.Activator.Concen[n-1]:
                if self.DNA.CorepConst:
                    Activator  = pow(self.DNA.Activator.Concen[n-self.TimeDelay] / self.DNA.K / (1 + 
self.DNA.CorepConst), self.DNA.HillCoeff)
                    production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - 
self.DNA.LeakageRate) * (1 - 1 / (1 + Activator)) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
                elif self.DNA.IndConst:
                    Activator  = pow(self.DNA.Activator.Concen[n-self.TimeDelay] / self.DNA.K / (1 + 
self.DNA.IndConst), self.DNA.HillCoeff)
                    production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - 
self.DNA.LeakageRate) * (1 - 1 / (1 + Activator) / (1 + self.DNA.IndConst))+ self.Dt * 
self.DNA.CopyNumber * self.DNA.LeakageRate
                else:
                    Activator  = pow(self.DNA.Activator.Concen[n-self.TimeDelay] / self.DNA.K, 
self.DNA.HillCoeff)
                    production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - 
self.DNA.LeakageRate) * (1 - 1 / (1 + Activator)) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
            else:
                production = self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
        elif self.DNA.Type == 'Negative':
            if self.DNA.Repressor:
                if self.DNA.CorepConst:
                    Repressor  = pow(self.DNA.Repressor.Concen[n-self.TimeDelay] / self.DNA.K / (1 + 
self.DNA.CorepConst), self.DNA.HillCoeff)
                    production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - 
self.DNA.LeakageRate) / (1 + Repressor) / (1 + self.DNA.CorepConst) + self.Dt * self.DNA.CopyNumber * 
self.DNA.LeakageRate
                elif self.DNA.IndConst:
                    Repressor  = pow(self.DNA.Repressor.Concen[n-self.TimeDelay] / self.DNA.K / (1 + 
self.DNA.IndConst), self.DNA.HillCoeff)
                    production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - 
self.DNA.LeakageRate) / (1 + Repressor) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
                else:
                    Repressor  = pow(self.DNA.Repressor.Concen[n-self.TimeDelay] / self.DNA.K, 
self.DNA.HillCoeff)
                    production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - 
self.DNA.LeakageRate) / (1 + Repressor) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
            else:
                production = self.Dt * self.DNA.CopyNumber * self.DNA.TSPromoter
        degradation = self.Dt * self.DegRate * self.Concen[n-1]
        if isStochastic:
            production  = PoissonRandom(production )
            degradation = PoissonRandom(degradation)
        self.Concen[n] = self.Concen[n-1] + production - degradation

class Protein_Simulate:
    Dt        = None
    TimeLen   = None
    TimeDelay = None
    mRNA      = None
    DegRate   = None
    Concen    = list()
    def SetData(self, degrate):
        if degrate < 0: raise InvalidParameter
        self.DegRate = degrate
    def IniConcen(self, isDelay, timelen, dt, ini):
        if timelen <= 0 or dt <= 0 or ini < 0: raise InvalidParameter
        (self.Dt, self.TimeLen) = (dt, timelen)
        self.Concen    = [0] * self.TimeLen
        self.Concen[0] = ini
        if isDelay: self.TimeDelay = ceil(20 / self.Dt) # [Time-delay: 20s]
        else: self.TimeDelay = 1
    def Connect(self, mrna):
        if isinstance(mrna, mRNA_Simulate): self.mRNA = mrna
        else: raise IllegalSetting
    def Compute_Concen(self, n, isStochastic):
        production  = self.Dt * self.mRNA.TranslE * self.mRNA.DNA.TerE * 
self.mRNA.Concen[n-self.TimeDelay]
        degradation = self.Dt * self.DegRate * self.Concen[n-1]
        if isStochastic:
            production  = PoissonRandom(production )
            degradation = PoissonRandom(degradation)
        self.Concen[n] = self.Concen[n-1] + production - degradation

