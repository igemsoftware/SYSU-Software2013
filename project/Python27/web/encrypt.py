#coding=utf-8
import rsa
import os,sys
import binascii
base = [str(x) for x in range(10)] + [ chr(x) for x in range(ord('A'),ord('A')+6)]


def dec2hex(string_num):
	num = int(string_num)
	mid = []
	while True:
		if num == 0: break
		num,rem = divmod(num, 16)
		mid.append(base[rem])
	return ''.join([str(x) for x in mid[::-1]])

class Encrypt:
	def __init__ (self):
		(pub_key, priv_key) = rsa.newkeys(1024)
		self.publicKey=pub_key
		self.privateKey=priv_key
	def getPublicKey(self):
		return self.publicKey
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
	