#! /usr/bin/env python
from distutils.core import setup, Extension

module1 = Extension('graph', sources = ['graph.cpp'])

setup (name = 'igem2013', version = '1.0', description = 'This is a demo package', ext_modules = [module1]) 
