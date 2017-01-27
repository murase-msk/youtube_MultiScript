from bottle import route, run, install, template
from bottle_sqlite import SQLitePlugin
sqlite_plugin = SQLitePlugin(dbfile='./sqliteDb/video_info.sqlite')
install(sqlite_plugin)



@route('/insert/<videoId>/<title>')
def insert(videoId, title, db):
    print(videoId, title)
    row = db.execute("insert into video(videoId, title) values('{}','{}')".format(videoId, title)).fetchone()
    return "insert ok"

@route('/show')
def show(db):
    result = db.execute('SELECT * from video').fetchall()
    print('aaaa');
#    print(row[0]+"###"+row[1]+"###"+row[2])

    for row in result:
        print(row[0], row[1], row[2])

    # if row:
    #     return template('showitem', page=row)
    return "ok"



@route('/hello')
def hello():
    return "Hello World!"

run(host='localhost', port=8080, debug=True, reloader=True)