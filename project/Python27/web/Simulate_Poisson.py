from math import log
from random import random

def PoissonRandom(mean):
    temp = 0
    n = -1
    while temp > -mean:
        temp += log(random())
        n += 1
    return n

def Poissrnd(mean):
    if mean == 0: return 0
    else: return PoissonRandom(mean) / mean
