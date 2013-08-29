#coding=utf-8
import rsa
  
if __name__ == "__main__":     
	(pub_key, priv_key) = rsa.newkeys(256)
	crypto =  rsa.encrypt('hello', pub_key)
	print rsa.decrypt(crypto, priv_key)
	