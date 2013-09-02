#!G:\igem2013_sysu_oschina\project\Python27_32\python2.7.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'rsa==3.1.1','console_scripts','pyrsa-priv2pub'
__requires__ = 'rsa==3.1.1'
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.exit(
        load_entry_point('rsa==3.1.1', 'console_scripts', 'pyrsa-priv2pub')()
    )
