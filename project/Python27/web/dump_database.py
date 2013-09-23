import subprocess
import sqlite3
import sys
import os

def read_tables(db_path):
  a = sqlite3.connect(db_path)
  c = a.cursor()
  c.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
  result = [x[0] for x in c.fetchall()]
  return result

def export_csv(db_path, tables):
  options = "-header -csv"
  for table in tables:
    file_name = "csv/%s.csv" % table
    sql_cmd = "SELECT * FROM %s;" % table
    os.system("sqlite3 %s %s '%s' > %s"% (options, db_path, sql_cmd, file_name))
    #subprocess.check_call(["sqlite3", db_path, options, sql_cmd],
        #shell=True)

if __name__ == "__main__":
  try:
    db_path = sys.argv[1]
  except IndexError:
    db_path = "igem.db"
  tables = read_tables(db_path)
  export_csv(db_path, tables)
