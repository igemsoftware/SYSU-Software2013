import urllib
from urllib2 import urlopen
import os
import sys
import re

if __name__ == "__main__":
  p_type = sys.argv[1]
  sub_type = sys.argv[2]
  file_path = "new_biobrick/%s/%s/" % (p_type, sub_type)
  try:
    os.makedirs(file_path)
  except:
    pass
  url = "http://parts.igem.org/%s/Catalog/%s" % (p_type, sub_type)
  p = urlopen(url)
  page = p.read()
  s = set()
  for m in re.finditer(r"BBa_[A-Z]\d*", page):
    s.add(m.group(0))
  for part in s:
    xml_url = "http://parts.igem.org/cgi/xml/part.cgi?part=%s" % part
    xml_file = urlopen(xml_url).read()
    fp = open(file_path + "%s.xml" % part, "w")
    fp.write(xml_file)
