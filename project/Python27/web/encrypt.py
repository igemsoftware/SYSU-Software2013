#coding=utf-8
import rsa

class Encrypt:
	def __init__ (self):
		(pub_key, priv_key) = rsa.newkeys(256)
		self.publicKey=pub_key
		self.privateKey=priv_key
	def getPublicKey(self):
		return self.publicKey

if __name__ == "__main__":     
	(pub_key, priv_key) = rsa.key.newkeys(128)
	print pub_key
	#crypto =  rsa.encrypt('hello', pub_key)
	#print rsa.decrypt(crypto, priv_key)
	