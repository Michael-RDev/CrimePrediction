import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from keras.models import Sequential
from keras.layers import Conv1D, MaxPool1D, Flatten, Dense
from keras.losses import SparseCategoricalCrossentropy
import numpy as np

data_path = "F:\CrimePrediction\data\chicago_data.csv"
data_file = pd.read_csv(data_path)

regulation = 100  # how much data you want to read
data_file = data_file[:regulation]

data_file.dropna(axis=0, inplace=True)
data_file.drop_duplicates(inplace=True)
data_file.drop(columns=['ID', 'Case Number'], inplace=True)

# Feature extraction
data_file["Date"] = pd.to_datetime(data_file["Date"])
data_file["DayOfTheWeek"] = data_file["Date"].dt.dayofweek
data_file['Month'] = data_file['Date'].dt.month
data_file['Day'] = data_file['Date'].dt.day
data_file['Hour'] = data_file['Date'].dt.hour
data_file.drop(columns=['Date'], inplace=True)
data_file.head()

features = ["DayOfTheWeek", "Month", "Hour", "Year"]
targets = ["Location Description", "Description", "Primary Type", "Arrest"]

label_encoders = {}

for col in targets:
    label_encoders[col] = LabelEncoder()
    data_file[col] = label_encoders[col].fit_transform(data_file[col])

numerical_features = ["Hour", "Year"]
scaler = StandardScaler()
data_file[numerical_features] = scaler.fit_transform(data_file[numerical_features])

sequence_len = 10

def create_temporal_sequence(data, sequence_length):
    sequences = []
    for i in range(len(data) - sequence_length):
        sequence = data.iloc[i: i + sequence_length]
        sequences.append(sequence.values)
    return np.array(sequences)

X = create_temporal_sequence(data_file[features], sequence_len)
y = data_file[targets].values[sequence_len:]
y = y[sequence_len - 1:]

y = y.reshape(-1, 1)

X_train, X_test, y_train, y_test = train_test_split(X, y, random_state=42, test_size=0.2)

X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], X_train.shape[2], 1))
X_test = X_test.reshape((X_test.shape[0], X_test.shape[1], X_test.shape[2], 1))

print("X_train shape:", X_train.shape)
print("X_test shape:", X_test.shape)
print("y_train shape:", y_train.shape)
print("y_test shape:", y_test.shape)

def Temporal_CNN(input_shape: tuple):
    model = Sequential()
    model.add(Conv1D(filters=64, kernel_size=3, activation='relu', input_shape=input_shape, padding='same'))
    model.add(MaxPool1D(3, 3))
    # model.add(Conv1D(filters=64, kernel_size=3, activation='relu', padding='same'))
    # model.add(MaxPool1D(1,1))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dense(1, activation='softmax'))
    return model

model = Temporal_CNN((X_train.shape[1], X_train.shape[2], 1))

loss_function = SparseCategoricalCrossentropy()

model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])

model.fit(X_train, y_train, epochs=10, batch_size=32)
