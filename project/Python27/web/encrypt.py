#coding=utf-8
import rsa
import string
from random import choice
'''generate random passwpord whose length is the param(length) default as 8''' 
def generate_passwd(length=8,chars=string.ascii_letters+string.digits): 
	return ''.join([choice(chars) for i in range(length)]) 

class Encrypt:
	def __init__ (self):
		(pub_key, priv_key) = rsa.newkeys(256)
		self.publicKey=pub_key
		self.privateKey=priv_key

if __name__ == "__main__":     
	(pub_key, priv_key) = rsa.key.newkeys(256)
	print rsa.encrypt(generate_passwd(), pub_key)
	#crypto =  rsa.encrypt('hello', pub_key)
	#print rsa.decrypt(crypto, priv_key)
	