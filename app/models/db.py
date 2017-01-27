# import MySQLdb
# import ConfigParser

# config = ConfigParser.ConfigParser()
# config.read('config/db.cnf')

# dbhandle = MySQLdb.connect(
#   host = config.get('db', 'host'),
#   port = config.getint("db","port"), 
#   user = config.get('db', 'user'),
#   passwd = config.get('db', 'password'),
#   db = config.get('db', 'database'),
#   use_unicode=1
# )
# con = dbhandle.cursor(MySQLdb.cursors.DictCursor)

import sqlite3
class DB:

	def connect(self):
		self.conn = sqlite3.connect('./sqliteDb/video_info.sqlite')
		self.c = self.conn.cursor()
	def close(self):
		self.conn.close()
	def commit(self):
		self.conn.commit()