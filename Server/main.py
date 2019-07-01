from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import json
import os
import sys
import datetime

app = Flask(__name__)
CORS(app)
filename = "data.txt"
app.filehandler = None
app.trackingList = []
app.isWorking = False

@app.route('/tracker', methods=['GET', 'POST'])
def track():
    if request.method == 'POST':
        if request.content_type == 'application/json':
            if not request.json:
                response = make_response("Bad format: JSON expected")
                response.status_code = 400
                return response
            if not 'data' in request.json:
                response = make_response('Bad format: JSON does not contain "data" property')
                response.status_code = 400
                return response   
            app.trackingList.append(request.json['data'])
        if request.content_type == 'text/plain':
            strData = request.get_data().decode("utf-8")
            lines = strData.split("\r\n")
            app.trackingList.extend(lines)
			
    
    return jsonify({'tracking': app.trackingList})

@app.route('/', methods=['GET'])
def index():
    index =  '<h1>Servidor de Analíticas para Usabilidad y análisis de Juegos</h1>'
    index = index + '<h3>por Jorge Algaba, Francisco Lopez-Bleda y Manuel Hernández</h3>'
    index = index + '<a href= https://github.com/usabilidadgang>Nuestro Github</a><br>'
    if os.path.exists('data.txt'):
        index = index + '''<table style="width:100%; border: 1px solid black; text-align: left;">\n
        <tr style = "border: 1px solid black;">\n
        <th style = "border: 1px solid black;">UserId</th>\n
        <th style = "border: 1px solid black;">TimeStamp</th>\n
        <th style = "border: 1px solid black;">Event Type</th>\n 
        <th style = "border: 1px solid black;">Event Info</tr>\n'''

        app.filehandler = open(filename, 'r+')
        trackinglist = app.filehandler.read().splitlines() 
        if(len(trackinglist) > 0):
            for item in trackinglist:
                try:
                    item = json.loads(item)
                    index = index + printJSON(item)
                except ValueError:
                    item = item.split(',')
                    if(len(item) <= 1):
                        continue
                    index = index + printCSV(item)  
                except:
                    print("Unknown exception:", sys.exc_info()[0])    
        index = index + '</table>'
        return index


def printJSON(item):
    returned = ''
    returned = returned + '<tr style = "border: 1px solid black;">'  
    returned = returned + '<td style = "border: 1px solid black;">'+ item['userId']+'</td>'
    date = datetime.datetime.fromtimestamp(int(item['timeStamp'])/1000).strftime('%Y/%m/%d %H:%M:%S')
    returned = returned + '<td style = "border: 1px solid black;">'+ date+'</td>'
    returned = returned + '<td style = "border: 1px solid black;">'+ str(item['eventType'])+'</td>'
    if('eventInfo' in item):
        string = json.dumps(item['eventInfo'])
        returned = returned + '<td style = \"border: 1px solid black;\">'+ string +'</td>'
    else:
        returned = returned + '<td style = "border: 1px solid black;">None</td>'
    returned = returned + '</tr>'
    return returned

def printCSV(item):
    returnedVal = ''
    returnedVal = returnedVal + '<tr style = "border: 1px solid black;">'  
    returnedVal = returnedVal + '<td style = "border: 1px solid black;">'+ item[0]+'</td>'
    date = datetime.datetime.fromtimestamp(int(item[2])/1000).strftime('%Y/%m/%d %H:%M:%S')
    returnedVal = returnedVal + '<td style = "border: 1px solid black;">'+ date+'</td>'
    returnedVal = returnedVal + '<td style = "border: 1px solid black;">'+ item[1]+'</td>'
    if(item[3] is not  '\"\"'):
        returnedVal = returnedVal + '<td style = "border: 1px solid black;">'+ item[3].replace('\"', ' ')+'</td>'
    else:
        returnedVal = returnedVal + '<td style = "border: 1px solid black;">None</td>'
    returnedVal = returnedVal + '</tr>'
    return returnedVal
def toFile(response):
    if response.status_code == 200 and request.method == 'POST':
        if app.isWorking and len(app.trackingList)>0:
            app.filehandler.write(app.trackingList[-1]+os.linesep)
            app.filehandler.flush()
        else:
            print("Could not write file: "+filename)

        if(len(app.trackingList) > 1024):
            i = 0
            while(os.path.exists('data'+str(i)+'.txt')):
                i = i + 1
            app.filehandler.close()
            os.rename('data.txt', str('data'+str(i)+'.txt'))
            setup()
            return response
    return response

def setup():
    print("Executing setup")
    try:
        if os.path.exists(filename):
            app.filehandler = open(filename, 'r+')
            app.trackingList = app.filehandler.read().splitlines() 
            app.isWorking = True
        else:
            app.filehandler = open(filename, 'w')
            app.trackingList = []
            app.isWorking = True
            print("Creating file: ", filename)
    except IOError:
        print(sys.exc_info()[0])
        print ("Could not read file: "+ filename)

app.before_first_request(setup)
app.after_request(toFile)



#PARA AWS
if __name__ == '__main__':
    app.run(ssl_context = ('//etc/letsencrypt/live/usabilidadanalytics.tk/cert.pem', '//etc/letsencrypt/live/usabilidadanalytics.tk/privkey.pem'), debug=False, threaded = True, host='0.0.0.0', port=443)

#PARA LOCAL
#if __name__ == '__main__':
    #app.run(debug=False, threaded = True, host='0.0.0.0', port=8080)



