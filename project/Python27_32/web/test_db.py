import sqlite3
from group import find_file

a = sqlite3.connect("../igem.db")
c = a.cursor()
c.execute("SELECT Number FROM repressor")
fl = c.fetchall()
fl = [n[0] for n in fl]
for i in fl:
  if find_file(i+".xml", ".") is None:
    print i
