# -*- coding:utf-8 -*-

import sys
sys.path.append('libs')

from bottle import route, post, request, redirect, jinja2_template as template
# URL解析
from urllib.parse import urlparse, parse_qs
import urllib.request
# sqlite
# from bottle import install
# from bottle_sqlite import SQLitePlugin
# sqlite_plugin = SQLitePlugin(dbfile='./sqliteDb/video_info.sqlite')
# install(sqlite_plugin)

import app.models.movie
model = app.models.movie.Movie()

#一覧ページ
@route('/')
@route('/<page:int>')
def index(page=1):
#	result = model.load(page)
	return template('index')

# 一覧ページ
@route('/list')
def list():
	result = model.getMovieList()
#	return "ok"
	return template('list', result=result)

# 個別ページ
@route('/watch/<videoId>')
def watch(videoId):
	return template('watch', videoId=videoId)


# 登録ページ
@post('/new')
def new():
	movieUrl = request.forms.get('url')
	parse = urlparse(movieUrl)
	query = parse.query
	print(parse.path)
	print(parse.netloc)
	# youtubeを指定しているか確認
	if(parse.netloc != "www.youtube.com"):
		print("www.youtube.comを指定してください")
		errorDic = {'error':True, 'errorTyle':"locError",'message':"www.youtube.comを指定してください"}
		return template('index', error=errorDic)
	# 正しいURLか
	try:
		r = urllib.request.urlopen(movieUrl)
	except:
		print("urlが正しくありません")
		errorDic = {'error':True, 'errorType':"urlError",'message':"URLが正しくありません"}
		return template('index', error=errorDic)

	dict = parse_qs(query)
	# 登録処理
	result = model.registerMovie(dict.get('v')[0])
	# 登録結果に応じて処理する
	if(result == 'success'):
	# 登録成功したので、登録された動画ページへ
		redirect("/")
	elif(result == 'cantRegister'):
	# 登録できない
		print("日本語と英語のスクリプトがありません")
		errorDic = {'error':True, 'errorType':"notExistScript",'message':"日本語と英語のスクリプトがありません"}
		return template('index', error=errorDic)
	elif(result == 'exist'):
		# すでに登録済み
		print("すでに登録済み")
		errorDic = {'error':True, 'errorType':"urlError",'message':"すでに登録済み"}
		return template('index', error=errorDic)
	else:
		pass
