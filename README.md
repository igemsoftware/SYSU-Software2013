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

前端使用了javascript实现，后台运用python的flask框架以及websocket，数据库则使用sqlite。另外还自带了cefsharp浏览器（基于chromium内核，用c#语言编写）。

对于所有的密码传送使用rsa算法进行加密，以及sha-1算法进行摘要，不保存明文密码。

如果你清除了浏览器缓存，重新打开主页时可能会报错，酸辛一下就好了。

<img src="http://ww4.sinaimg.cn/mw690/b8700d2fgw1e6eirqqn66j207l0840t0.jpg" width="273" height="292" />
