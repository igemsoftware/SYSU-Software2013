##
# @file Simulate_Class.py
# @brief  define Simulation data model and formulas
# @author Jianhong Li
# @version 1.0
# @date 2013-09-01
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.

from math import ceil
from Simulate_Poisson import Poissrnd

class InvalidParameter(Exception): pass
class IllegalSetting(Exception): pass

# --------------------------------------------------------------------------
##
# @brief  calculating DNA simulation result
# ----------------------------------------------------------------------------
class DNA_Simulate:
    Type = ""
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
    # --------------------------------------------------------------------------
    ##
    # @brief  Set data in class
    #
    # @param ty           type of data(constitutive, positive or negative)
    # @param copynumber   copy number of corresponding plasmid of component
    # @param tspromoter   TSPromoter of corresponding group of component
    # @param leakagerate  Leakage Rate of corresponding group of component
    # @param tere         terminator efficiency of corresponding group of component
    #
    # @returns   return nothing
    #
    # --------------------------------------------------------------------------
    def SetData(self, ty, copynumber, tspromoter, leakagerate, tere):
        if ty not in ['Constitutive', 'Positive', 'Negative']:
            raise InvalidParameter
        if copynumber <= 0 or tspromoter <= 0 or leakagerate < 0 or tere <=0:
            pass
            #raise InvalidParameter
        self.Type = ty
        self.CopyNumber  = copynumber
        self.TSPromoter  = tspromoter
        self.LeakageRate = leakagerate
        self.TerE        = tere
    # --------------------------------------------------------------------------
    ##
    # @brief  set activator in class
    #
    # @param activator   name of activator
    # @param k           K value of activator
    # @param hillcoeff   hill coefficiency of activator
    #
    # @returns   return nothing
    #
    # --------------------------------------------------------------------------
    def SetActivator(self, activator, k, hillcoeff):
        if self.Type != 'Positive':
            raise IllegalSetting
        if isinstance(activator, Protein_Simulate):
            if hillcoeff <= 0 or k <= 0:
                raise InvalidParameter
            self.Activator = activator
            self.HillCoeff = hillcoeff
            self.K         = k
            self.Repressor = None
        else:
            raise IllegalSetting
    # --------------------------------------------------------------------------
    ##
    # @brief  set repressor in class
    #
    # @param repressor   name of repressor
    # @param k           K value of repressor
    # @param hillcoeff   hill coefficiency of repressor
    #
    # @returns   return nothing
    #
    # --------------------------------------------------------------------------
    def SetRepressor(self, repressor, k, hillcoeff):
        if self.Type != 'Negative':
            raise IllegalSetting
        if isinstance(repressor, Protein_Simulate):
            if hillcoeff <= 0 or k <= 0:
                raise InvalidParameter
            self.Repressor = repressor
            self.HillCoeff = hillcoeff
            self.K         = k
            self.Activator = None
        else:
            raise IllegalSetting
    # --------------------------------------------------------------------------
    ##
    # @brief  set corepressor in class
    #
    # @param corepressor     name of corepressor
    # @param k               K value of corepressor
    # @param hillcoeff       hill coefficiency of corepressor
    #
    # @returns   return nothing
    #
    # --------------------------------------------------------------------------
    def SetCorepressor(self, corepressor, k, hillcoeff):
        if self.Activator == None and self.Repressor == None:
            raise IllegalSetting
        if corepressor < 0 or hillcoeff <= 0 or k <= 0:
            raise InvalidParameter
        self.CorepConst = pow(corepressor / k, hillcoeff)
        self.IndConst   = None
    # --------------------------------------------------------------------------
    ##
    # @brief  set inducer in class
    #
    # @param inducer     name of inducer
    # @param k           K value of inducer
    # @param hillcoeff   hill coefficiency of inducer
    #
    # @returns   return nothing
    #
    # --------------------------------------------------------------------------
    def SetInducer(self, inducer, k, hillcoeff):
        if self.Activator == None and self.Repressor == None:
            raise IllegalSetting
        if inducer < 0 or hillcoeff <= 0 or k <= 0:
            raise InvalidParameter
        self.IndConst   = pow(inducer / k, hillcoeff)
        self.CorepConst = None

# --------------------------------------------------------------------------
##
# @brief  calculating mRNA simulation result
#
# --------------------------------------------------------------------------
class mRNA_Simulate:
    Dt      = None
    TimeLen = None
    TimeDelay = None
    Concen  = []
    DNA     = None
    TranslE = None
    DegRate = None
    # --------------------------------------------------------------------------
    ##
    # @brief set data in mRNA_Simulate class
    #
    # @param transle   translate efficiency
    # @param degrate   degradation rate
    #
    # @returns   return nothing
    #
    # --------------------------------------------------------------------------
    def SetData(self, transle, degrate):
        if transle <=0 or degrate < 0:
            raise InvalidParameter
        self.TranslE = transle
        self.DegRate = degrate
    def Connect(self, dna):
        if isinstance(dna, DNA_Simulate):
            self.DNA = dna
        else:
            raise IllegalSetting
    def IniConcen(self, isDelay, timelen, dt, ini):
        if timelen <= 0 or dt <= 0 or ini < 0:
            raise InvalidParameter
        self.Dt        = dt
        self.TimeLen   = timelen
        self.Concen    = [0] * self.TimeLen
        self.Concen[0] = ini
        if isDelay:
            self.TimeDelay = int(ceil(40 / self.Dt)) # [Time-delay: 40s]
        else:
            self.TimeDelay = 1

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
                    production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - \
self.DNA.LeakageRate) * (1 - 1 / (1 + Activator) / (1 + self.DNA.IndConst))+\
                    self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
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
                    production = self.Dt * self.DNA.CopyNumber * \
                        (self.DNA.TSPromoter - self.DNA.LeakageRate) / (1 + Repressor) / (1 + self.DNA.CorepConst) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
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
            production  = production  * Poissrnd(production )
            degradation = degradation * Poissrnd(degradation)
        self.Concen[n] = self.Concen[n-1] + production - degradation

    #def Compute_Concen(self, n, isStochastic = False):
        #if self.DNA.Type == 'Constitutive':
            #production = self.Dt * self.DNA.CopyNumber * self.DNA.TSPromoter
        #elif self.DNA.Type == 'Positive':
            #if self.DNA.Activator and self.DNA.Activator.Concen[n-1]:
                #if self.DNA.CorepConst:
                    #Activator  = pow(self.DNA.Activator.Concen[n-1] / self.DNA.K / (1 + self.DNA.CorepConst), self.DNA.HillCoeff)
                    #production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - self.DNA.LeakageRate) * (1 - 1 / (1 + Activator)) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
                #elif self.DNA.IndConst:
                    #Activator  = pow(self.DNA.Activator.Concen[n-1] / self.DNA.K / (1 + self.DNA.IndConst), self.DNA.HillCoeff)
                    #production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - self.DNA.LeakageRate) * (1 - 1 / (1 + Activator) / (1 + self.DNA.IndConst))+ self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
                #else:
                    #Activator  = pow(self.DNA.Activator.Concen[n-1] / self.DNA.K, self.DNA.HillCoeff)
                    #production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - self.DNA.LeakageRate) * (1 - 1 / (1 + Activator)) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
            #else:
                #production = self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
        #elif self.DNA.Type == 'Negative':
            #if self.DNA.Repressor:
                #if self.DNA.CorepConst:
                    #Repressor  = pow(self.DNA.Repressor.Concen[n-1] / self.DNA.K / (1 + self.DNA.CorepConst), self.DNA.HillCoeff)
                    #production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - self.DNA.LeakageRate) / (1 + Repressor) / (1 + self.DNA.CorepConst) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
                #elif self.DNA.IndConst:
                    #Repressor  = pow(self.DNA.Repressor.Concen[n-1] / self.DNA.K / (1 + self.DNA.IndConst), self.DNA.HillCoeff)
                    #production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - self.DNA.LeakageRate) / (1 + Repressor) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
                #else:
                    #Repressor  = pow(self.DNA.Repressor.Concen[n-1] / self.DNA.K, self.DNA.HillCoeff)
                    #production = self.Dt * self.DNA.CopyNumber * (self.DNA.TSPromoter - self.DNA.LeakageRate) / (1 + Repressor) + self.Dt * self.DNA.CopyNumber * self.DNA.LeakageRate
            #else:
                #production = self.Dt * self.DNA.CopyNumber * self.DNA.TSPromoter
        #degradation = self.Dt * self.DegRate * self.Concen[n-1]
        #if isStochastic:
            #production  = production  * Poissrnd(production )
            #degradation = degradation * Poissrnd(degradation)
        #self.Concen[n] = self.Concen[n-1] + production - degradation

class Protein_Simulate:
    Dt        = None
    TimeLen   = None
    TimeDelay = None
    Concen    = []
    mRNA      = None
    DegRate   = None
    def SetData(self, degrate):
        if degrate < 0:
            raise InvalidParameter
        self.DegRate = degrate
    def IniConcen(self, isDelay, timelen, dt, ini):
        if timelen <= 0 or dt <= 0 or ini < 0:
            raise InvalidParameter
        self.Dt        = dt
        self.TimeLen   = timelen
        self.Concen    = [0] * self.TimeLen
        self.Concen[0] = ini
        if isDelay:
            self.TimeDelay = int(ceil(20 / self.Dt))
        else:
            self.TimeDelay = 1

    def Connect(self, mrna):
        if isinstance(mrna, mRNA_Simulate):
            self.mRNA = mrna
        else:
            raise IllegalSetting
    def Compute_Concen(self, n, isStochastic):
        production  = self.Dt * self.mRNA.TranslE * self.mRNA.DNA.TerE *\
        self.mRNA.Concen[n-self.TimeDelay]
        degradation = self.Dt * self.DegRate * self.Concen[n-1]
        if isStochastic:
            production  = production  * Poissrnd(production )
            degradation = degradation * Poissrnd(degradation)
        self.Concen[n] = self.Concen[n-1] + production - degradation
