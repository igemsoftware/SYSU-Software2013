#!/bin/sh
cd project/Python27/
python web/app.py &
cd ../..

LINK='http://127.0.0.1:5000'
echo "chromium $LINK"
if [ -n $BROWSER ];
then
  $BROWSER $LINK
elif which chromium > /dev/null;
then
  chromium --app=$LINK
elif which firefox > /dev/null;
then
  firefox $LINK
elif which chrome > /dev/null;
then
  chrome --app=$LINK
elif which opera > /dev/null;
then
  opera $LINK
else
  echo "No available browser found. Please manually open $LINK"
fi
