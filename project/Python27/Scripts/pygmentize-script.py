#!D:\Python27\python2.7.exe
# EASY-INSTALL-ENTRY-SCRIPT: 'Pygments==1.5','console_scripts','pygmentize'
__requires__ = 'Pygments==1.5'
import sys
from pkg_resources import load_entry_point

if __name__ == '__main__':
    sys.exit(
        load_entry_point('Pygments==1.5', 'console_scripts', 'pygmentize')()
    )
