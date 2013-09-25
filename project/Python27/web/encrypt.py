#coding=utf-8
##
# @file encrypt.py
# @brief  tools for encrypting
# @author Jiexin Guo
# @version 1.0
# @date 2013-07-28
# @copyright 2013 SYSU-Software. All rights reserved.
# This project is released under MIT License.

import rsa
import os,sys
import binascii
import hashlib
base = [str(x) for x in range(10)] + [ chr(x) for x in range(ord('A'),ord('A')+6)]
# --------------------------------------------------------------------------
##
# @brief		get the SHA1 digest of a string
#
# @param pwd	the string need to get its SHA1
#
# @returns   return the SHA1 digest of a string
#
# --------------------------------------------------------------------------
def getPasswordSHA1(pwd):
	if len(pwd)!=40:		
		m = hashlib.sha1()
		m.update(pwd)
		return m.hexdigest()
	else:
		return pwd

# --------------------------------------------------------------------------
##
# @brief				get a string of number to its hex value string
#
# @param string_num		string of number
#
# @returns   			return the hex string
#
# --------------------------------------------------------------------------
def dec2hex(string_num):
	num = int(string_num)
	mid = []
	while True:
		if num == 0: break
		num,rem = divmod(num, 16)
		mid.append(base[rem])
	return ''.join([str(x) for x in mid[::-1]])

# --------------------------------------------------------------------------
##
# @brief  the class that can provide RSA method
# ----------------------------------------------------------------------------
class Encrypt:
	def __init__ (self):
		(pub_key, priv_key) = rsa.newkeys(1024)
		self.publicKey=pub_key
		self.privateKey=priv_key

	# --------------------------------------------------------------------------
	##
	# @brief		get the public key
	#
	# @param self	
	#
	# @returns   	return the public key
	#
	# --------------------------------------------------------------------------
	def getPublicKey(self):
		return self.publicKey

	# --------------------------------------------------------------------------
	##
	# @brief		decrypt a string
	#
	# @param self	
	# @param crypto	the crypto string
	# 
	# @returns   	return the original string using the privateKey
	#
	# --------------------------------------------------------------------------
	def decrypt(self,crypto):
		crypto = binascii.a2b_hex(crypto)
		print crypto
		return rsa.decrypt(crypto,self.privateKey)

if __name__ == "__main__":     
	(pub_key, priv_key) = rsa.key.newkeys(128)
	print dec2hex(pub_key.n)
	print len('ba424b4defb0f99797400547324c4a9b7264ef8a')
	#crypto =  rsa.encrypt('hello', pub_key)
	#print rsa.decrypt(crypto, priv_key)
	