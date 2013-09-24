import re
import sys
import json

# --------------------------------------------------------------------------
##
# @brief format SBOL to json
#
# @param content  SBOL format string
#
# @returns   json corresponding to SBOL
#
# --------------------------------------------------------------------------
def format_to_json(content):
  content = re.sub("(\w*)\s*:\s*([^\[][^\n]*)\n",r'"\1":"\2",\n',content)
  content = re.sub("(\w*)\s*:\s*\[\n",r'"\1":[\n',content)
  content = re.sub(r'(\w*) \[\n', r'"\1":{\n', content)
  content = re.sub(r'(\s*)\]', r'\1}', content)
  content = re.sub(r',\n(\s*\})\n', r'\n\1\n', content)

  i = content.find("\"SequenceAnnotation")
  pos = 0
  while i != -1:
    content = content[:i] + '{' + content[i:]
    pos = i + 22
    stack = 1
    while stack != 0:
      pos += 1
      if content[pos] == '{':
        stack += 1
      elif content[pos] == '}':
        stack -= 1
    i = content.find("\"SequenceAnnotation", pos)
    pos += 1
    if i != -1:
      content = content[:pos] + '},' + content[pos:]
      i += 2
    else:
      content = content[:pos] + '}' + content[pos:]

  # TODO: hard coding, transfer "annotation" to an array
  pos += 1
  pos = content.find("}", pos)
  content = content[:pos] + '],' + content[(pos+1):]
  content = json.loads('{'+content+'}')
  return content

if __name__ == "__main__":
  fp = open(sys.argv[1])
  content = fp.read()
  print json.dumps(format_to_json(content))
