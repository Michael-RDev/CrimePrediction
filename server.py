from flask import Flask, render_template, request, Response
from predict_data import predict_location, predict_type
from reverse_geo import find_location_from_location
import datetime
import json

from tqdm import tqdm

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('prediction.html')

def predict(start_data,end_data):
    yield "data: "+json.dumps({'type': 'progress', 'progress': 0})+"\n\n"
    location_predictions, output_times = predict_location(start_data, end_data)

    yield "data: "+json.dumps({"type":"progress","progress":0.3})+"\n\n"
    descriptions = predict_type(start_data, end_data)

    yield "data: "+json.dumps({"type":"progress","progress":0.5})+"\n\n"

    street_names = []
    
    for i,location in tqdm(enumerate(location_predictions), desc="Finding Street Names: "):
        street_names.append(find_location_from_location(location[0], location[1]))
        yield "data: "+json.dumps({"type":"progress","progress":0.5+(0.3*i/len(street_names))})+"\n\n"

    #input_array = [[input_street_name, (input_location[0], input_location[1]), inpust_time.timestamp()] for input_street_name, input_location, input_time in (zip(street_names, location_predictions, output_times))]

    yield "data: "+json.dumps({"type":"complete","progress":1,"data":[[street_name,lat,long,time.timestamp(),location,description,crimeType,arrest] for street_name,(lat,long),time,(location,description,crimeType,arrest) in zip(street_names,location_predictions,output_times,descriptions)]})+"\n\n"

@app.route('/api/predict', methods=['GET'])
def generate_predicted_crime_map():
    start_date = request.args.get("startDate")
    start_hour = request.args.get("startTime")
    end_date = request.args.get("endDate")
    end_hour = request.args.get("endTime")

    start_data = datetime.datetime.strptime(start_date + " " + start_hour, '%Y-%m-%d %H:%M')
    end_data = datetime.datetime.strptime(end_date + " " + end_hour, '%Y-%m-%d %H:%M')
    
    return Response(predict(start_data,end_data), mimetype="text/event-stream")

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5050)
