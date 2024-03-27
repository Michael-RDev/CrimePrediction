import pandas as pd
import joblib
from tqdm import tqdm
from datetime import datetime, timedelta
from threading import Thread
import numpy as np

def convert_to_datetime(date, hour):
    features = ["DayOfTheWeek", "Month", "Hour", "Year"]
    time_datetime = {
        "Date": [datetime.strptime(date + ' ' + hour, '%Y-%m-%d %H:%M')]
    }
    df = pd.DataFrame(time_datetime)
    df["Year"] = df["Date"].dt.year
    df["Month"] = df["Date"].dt.month
    df["DayOfTheWeek"] = df["Date"].dt.dayofweek
    df["Hour"] = df["Date"].dt.hour
    df_X = df[features]
    return df_X

def predict_type(start_date, end_date):
    label_encoder = joblib.load("models/label_encoders.pickle")
    type_model = joblib.load("models/typeLocation.pickle")

    time_stamps = []
    current_date = start_date
    while current_date <= end_date:
        time_stamps.append(current_date)
        current_date += timedelta(hours=1)
    
    input_data = pd.concat([convert_to_datetime(input_date.strftime('%Y-%m-%d'), input_date.strftime('%H:%M')) for input_date in tqdm(time_stamps, desc="Predicting Data: ")])

    model_predictions = type_model.predict(input_data)
    targets = ["Location Description", "Description", "Primary Type", "Arrest"]

    decoded_list = [label_encoder[col].inverse_transform(model_predictions[:, i]) for i, col in enumerate(targets)]

    result_array = np.array(decoded_list).T
    return result_array

def predict_location(start_date, end_date):
    location_model = joblib.load("models/latLong.pickle")

    time_stamps = []
    current_date = start_date
    while current_date <= end_date:
        time_stamps.append(current_date)
        current_date += timedelta(hours=1)

    input_data = pd.concat([convert_to_datetime(input_date.strftime('%Y-%m-%d'), input_date.strftime('%H:%M')) for input_date in tqdm(time_stamps, desc="Predicting Data: ")])

    location_predictions = location_model.predict(input_data)
    return location_predictions, time_stamps


if __name__ == "__main__":
    start_time_data = datetime.strptime("2024-02-08 08:00", '%Y-%m-%d %H:%M')
    end_time_data = datetime.strptime("2024-02-08 10:00", '%Y-%m-%d %H:%M')
    location_thread = Thread(target=predict_location, args=(start_time_data, end_time_data))
    type_thread = Thread(target=predict_type, args=(start_time_data, end_time_data))
    location_thread.start()
    type_thread.start()

    location_thread.join()
    type_thread.join()

