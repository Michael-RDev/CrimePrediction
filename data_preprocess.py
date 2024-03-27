import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from datetime import datetime

# Load the data
data_file = pd.read_csv("../data/chicago_data.csv")

# Data Cleaning
data_file.dropna(inplace=True)  # Drop rows with missing values
data_file.drop_duplicates(inplace=True)  # Drop duplicate rows
data_file.drop(columns=['ID', 'Case Number'], inplace=True)  # Drop irrelevant columns

# Feature Engineering
data_file['Date'] = pd.to_datetime(data_file['Date'])  # Convert 'Date' column to datetime
data_file['Month'] = data_file['Date'].dt.month  # Extract month
data_file['Day'] = data_file['Date'].dt.day  # Extract day
data_file['Hour'] = data_file['Date'].dt.hour  # Extract hour
data_file.drop(columns=['Date'], inplace=True)  # Drop original 'Date' column

# Encoding Categorical Variables
label_encoders = {}
categorical_cols = ['Primary Type', 'Description', 'Location Description']
for col in categorical_cols:
    label_encoders[col] = LabelEncoder()
    data_file[col] = label_encoders[col].fit_transform(data_file[col])

# Splitting the Data
X = data_file.drop(columns=['Location'])
y = data_file['Location']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Model Training
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Model Evaluation
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)
