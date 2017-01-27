import app.models.db
import urllib.request, json
import shutil
import os.path

class Movie:

#	def __init__(self):
#	
	#
	# 動画を登録する
	#
	def registerMovie(self, movieId):
		db =  app.models.db.DB()
		db.connect()
		# すでに登録されていないか
		row = db.c.execute("select count(*) from video where videoId='{}'".format(movieId)).fetchone()
		if(row[0] > 0):
			return 'exist'

		# コメント（日本語・英語）の保存
		# 例外処理
		url_ja = 'http://video.google.com/timedtext?lang=ja&v='+movieId+''
		url_en = 'http://video.google.com/timedtext?lang=en&v='+movieId+''
		file_name_ja = './stat/resource/'+movieId+'(ja).xml'
		file_name_en = './stat/resource/'+movieId+'(en).xml'
		print(url_ja)
		print(url_en)
		with urllib.request.urlopen(url_ja) as response_ja,urllib.request.urlopen(url_en) as response_en:
			# 日本語英語のスクリプトがあるか
			if((len(response_ja.read()) == 0) or (len(response_en.read()) == 0)):
				#なければ保存しない
				print("保存しない")
				return 'cantRegister'
		with urllib.request.urlopen(url_ja) as response_ja,urllib.request.urlopen(url_en) as response_en, open(file_name_ja, 'wb') as out_file_ja, open(file_name_en, 'wb') as out_file_en:
			shutil.copyfileobj(response_ja, out_file_ja)
			shutil.copyfileobj(response_en, out_file_en)
		print('保存完了')
		## サムネイルの取得保存
		url = 'http://img.youtube.com/vi/'+movieId+'/hqdefault.jpg'
		file_name = './stat/resource/'+movieId+'.jpg'
		with urllib.request.urlopen(url) as response, open(file_name, 'wb') as out_file:
			shutil.copyfileobj(response, out_file)
		# 動画ID、タイトルなどの取得
		url ='https://www.googleapis.com/youtube/v3/videos?id='+movieId+'&key=AIzaSyDKx2V5uSc_S8pZIVXnesr_WLTPE73h3w0&part=snippet,contentDetails,statistics,status'
		with urllib.request.urlopen(url) as r:
			root = json.loads(r.read().decode("utf-8"))
		title = root['items'][0]['snippet']['title']
		# DBへ保存
		row = db.c.execute("insert into video(videoId, title) values('{}','{}')".format(movieId, title)).fetchone()
		db.conn.commit()
		db.conn.close()
		return 'success'

	#
	# 動画一覧データを取得する
	#
	def getMovieList(self):
		db =  app.models.db.DB()
		db.connect()
		result = db.c.execute("select * from video").fetchall()
		for row in result:
			print(row[0], "  ",row[1], "  ", row[2])
		print(result)
		db.conn.close()
		return result

