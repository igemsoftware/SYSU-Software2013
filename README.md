#C.A.S.T designer
iGEM-SOFTWARE-2013
==================
This is the project of igem 2013 by SYSU-Software.

## Introduction
Synthetic Biology, depending on interdisciplinary knowledge and experience, cooperates wet and dry experiments to engineer the artificial biological systems. Here, our team has developed an integrated tool, CAST (Computer Aided Synbio Tool), to address specific technical challenges in synthetic biology. Our software can automatically perform the regulatory networks and gene circuits designing with Biobricks and other regulatory elements, modeling, vector designing and proposal build. User can also optimize or alter the default methods to fulfill some further demands. All of the designed elements, networks and vectors can be stored in database to be shared through CAST. In addition, we incorporated wetlab experimentation into our project to validate our new simulation model that work with standard dynamic characteristic. Altogether, the combination of the design automation, innovative models and algorithms, and wetlab validation makes complex biological systems accessible to researchers who want rapid, intuitive, and high-quality accomplish their designs.

## Supported OS
* Windows XP or higher
* Mac OS X
* Linux

## Detail
We use pure javascript to implement the front end,and use flask framework (especially the websocket protocol for data transfer)for the back end,which is written in python.Next we use sqlite as the database.By the way,we have provided a brower so called cefsharp,which is based on chromium core and written in c#

## Installation
For Windows users, to start using CAST designer, you need to enter `project`
directory and choose 32-bit or 64-bit version of python. Our bat file in
`python` directory will automatically start the server and you can run CAST
designer locally on your computer.

For unix-like operating system users, you may need to confirm that all the
dependencies all correctly installed on your computer. You shall have your `pip`
installed on your computer, and then use `pip` to install other dependencies.  
The following commands show how to install these requirements in ubuntu.
```
sudo apt-get install pip
sudo pip install -r requirements.txt
```

Our project is based on flask framework, you can easily turn the project into a
server version with `uwsgi`.

## Safety
We have used rsa algorithm to encrypt any password transferation,and use sha-a algorithm for information digesting,never save plain password.

## License
This project is released under MIT License. See LICENSE for the content.
