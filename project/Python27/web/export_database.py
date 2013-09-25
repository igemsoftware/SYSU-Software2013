##
# @file export_database.py
# @brief export database data to csv
# @author Jianhong Li
# @version 1.0
# @date 2013-09-20
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.
#

import subprocess
import sqlite3
import sys
import os

# --------------------------------------------------------------------------
##
# @brief get all table names
#
# @param db_path  path to sqlite database file
#
# @returns   list of table names
#
# --------------------------------------------------------------------------
def read_tables(db_path):
  a = sqlite3.connect(db_path)
  c = a.cursor()
  c.execute("SELECT name FROM sqlite_master WHERE type = 'table'")
  result = [x[0] for x in c.fetchall()]
  return result

# --------------------------------------------------------------------------
##
# @brief read all tables and export to csv
#
# @param db_path  path to sqlite database file
# @param tables
#
# @returns   whether the function executes normally
#
# --------------------------------------------------------------------------
def export_csv(db_path, tables):
  try:
    options = "-header -csv"
    for table in tables:
      file_name = "csv/%s.csv" % table
      sql_cmd = "SELECT * FROM %s;" % table
      os.system("sqlite3 %s %s '%s' > %s"% (options, db_path, sql_cmd, file_name))
    return True
  except Exception:
    return False

if __name__ == "__main__":
  try:
    db_path = sys.argv[1]
  except IndexError:
    db_path = "igem.db"
  tables = read_tables(db_path)
  export_csv(db_path, tables)
