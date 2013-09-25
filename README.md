#C.A.S.T designer
iGEM-SOFTWARE-2013
==================
This is the project of igem 2013 by SYSU-Software.

## Introduction
Accurate simulation and gene circuit design are essential but difficult parts in synthetic biology.Here, we designed CAST to cover the workflow from beginning to end, users can focus on function design and the gene circuit would be automatically designed. Furthermore, we developed a new simulation model that work with standard dynamic characteristic and verified by wetlab experiments. Moreover, we build an expandable database that users can contribute their own dynamic information which would lead to more accurate and sufficient dynamic information of all the Biobricks. Finally, our software is designed as an easy deployed server so that it can be used on personal purpose or shared by a whole lab or institution. 

## Supported OS
* Windows 7
* Mac OS X
* Linux

## Detail
We use pure javascript to implement the front end,and use flask framework (especially the websocket protocol for data transfer)for the back end,which is written in python.Next we use sqlite as the database.By the way,we have provided a brower so called cefsharp,which is base on chromium core and written in c#

## Safety
We have used rsa algorithm to encrypt any password transferation,and use sha-a algorithm for information digesting,never save plain password.

## FAQ
Q:Sometime after I have cleaned up the browser 's cache ,it will return 500 error when I open the page?<br>
A:Just press the F5 to refresh the page ,or you can reboot the server.

## More information
<br>See our school at http://www.sysu.edu.cn/2012/cn/index.htm
<br>You can open the AUTHORS file to get the contact information of us.
<p>If you have any questions,please contact me.
<br>My E-mail is 1036479561@qq.com.
<font color="red"><del>Girls better.</del></font></p>
<img src="http://ww4.sinaimg.cn/mw690/b8700d2fgw1e67vo2hdmsj206d052glm.jpg" width="60" height="70" />
<img src="http://ww4.sinaimg.cn/mw690/b8700d2fgw1e6eirqqn66j207l0840t0.jpg" width="273" height="292" />
