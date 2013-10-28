#!/bin/sh

if which python > /dev/null;
then
  echo "Please install python first!"
  if uname -a| grep "Ubuntu";
  then
    sudo apt-get intall python
  fi
fi


if which pip > /dev/null;
then
  echo "Please install pip first!"
  if uname -a| grep "Ubuntu";
  then
    sudo apt-get intall pip
  fi
fi

sudo pip install -r requirements.txt
