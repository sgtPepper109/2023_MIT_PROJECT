import requests
import urllib.request
from flask import Flask, jsonify
from flask_cors import CORS
import simplejson
import json
app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def get_data():
    url = 'http://localhost:8080/operation/findLast'
    try:
        uResponse = requests.get(url)
    except requests.ConnectionError:
        return "Connection Error"
    JResponse = uResponse.text
    data = json.loads(JResponse)
    for i in data:
        print(i, data[i])
    return JResponse
        

if __name__ == "__main__":
    app.run()
