import re
import sys
import json

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
    stack = []
    stack.append(content[pos])
    while stack != []:
      pos += 1
      if content[pos] == '{':
        stack.append(content[pos])
      elif content[pos] == '}':
        stack.pop()
    i = content.find("\"SequenceAnnotation", pos)
    pos += 1
    if i != -1:
      content = content[:pos] + '},' + content[pos:]
    else:
      content = content[:pos] + '}' + content[pos:]

  # TODO: hard coding, transfer "annotation" to an array
  content = content[:pos] + '],' + content[(pos+1):]
  content = json.loads('{'+content+'}')
  return content

if __name__ == "__main__":
  fp = open(sys.argv[1])
  content = fp.read()
  print format_to_json(content)
