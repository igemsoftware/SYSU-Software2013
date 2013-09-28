##
# @file Simulate_Poisson.py
# @brief generate stochastic value for simulation result
# @author Jianhong Li
# @version 1.0
# @date 2013-09-02
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
# 

from math import log
from random import random

# --------------------------------------------------------------------------
##
# @brief generate random value that follows poisson distribution
#
# @param mean  the parameter of random value
#
# @returns   random value
#
# --------------------------------------------------------------------------
def PoissonRandom(mean):
    temp = 0
    n = -1
    while temp > -mean:
        temp += log(random())
        n += 1
    return n

# --------------------------------------------------------------------------
##
# @brief generate calculated random value
#
# @param mean  the parameter of random value
#
# @returns   random value
# 
# --------------------------------------------------------------------------
def Poissrnd(mean):
    if mean == 0: return 0
    else: return PoissonRandom(mean) / mean
