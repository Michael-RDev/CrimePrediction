# ChiCrimeGo

## Overview
This project aims to predict crime occurrences in Chicago using machine learning techniques. By analyzing historical crime data along with various socio-economic and environmental factors, we aim to build a predictive model that can anticipate the likelihood of different types of crimes in different areas of Chicago.

## Table of Contents
- [Background](#background)
- [Data](#data)
- [Methodology](#methodology)
- [Model Inputs](#modelinputs)
- [Modeling](#modeling)
- [Evaluation](#evaluation)
- [Setup](#setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Background
Crime prediction is a critical task for law enforcement agencies and urban planners to allocate resources effectively and prevent criminal activities. Chicago, being one of the largest cities in the United States, faces various challenges related to crime, making it an ideal candidate for such predictive modeling efforts.

## Data
The data used in this project consists of historical crime records obtained from the Chicago Police Department. 

## Methodology

Research Paper: https://arxiv.org/pdf/2303.16310.pdf

1. **Data Collection**: Gather historical crime data from the Chicago Police Department and relevant socio-economic and environmental datasets.
2. **Data Preprocessing**: Clean the data, handle missing values, and engineer features.
3. **Feature Selection**: Identify significant features that contribute to crime prediction.
4. **Model Development**: Train various machine learning models such as logistic regression, random forest, and neural networks.
5. **Model Evaluation**: Evaluate model performance using metrics like accuracy, precision, recall, and F1-score.
6. **Model Deployment**: Deploy the best-performing model for real-time predictions.

## Model Inputs
Some of the inputs used for crime prediction include:
- Time of day
- Day of week

## Modeling
Several machine learning algorithms are explored, including:
- Support Vector Machine
- Random Forest Regression

Hyperparameter tuning and cross-validation techniques are employed to optimize model performance.

## Evaluation
The performance of each model is evaluated using metrics such as:
- Accuracy
- Precision
- Recall
- F1-score

## Setup

### Building a Crime Visualization and Prediction Web Application

Step 1: Download Dataset

1) Visit the Chicago Data Portal2
2) Download the dataset named "Crimes - 2001 to Present".
3) Save the dataset in a folder named data within your project directory.

Dataset Link: https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2/data

Step 2: Obtain Bing Maps API Key

1) Go to the Bing Maps Dev Center website (https://www.microsoft.com/en-us/maps/choose-your-bing-maps-api).
2) Sign in or create a Microsoft account if needed.
3) Generate a new API key for your project.
4) Keep the API key secure as it will be used to authenticate requests to the Bing Maps API.

Step 3: Replace API Key in Script

1) Clone the repository containing the project code.
2) Navigate to the static folder within the project directory.
3) Open the script.js file in a text editor.
4) Find line 1 where it says const API_KEY = 'YOUR_API_KEY_HERE';.
5) Replace 'YOUR_API_KEY_HERE' with your Bing Maps API key.
6) Save the changes to script.js.

Step 4: Environment Setup and Installation

Open a terminal or command prompt.
Navigate to the project directory.

Create a virtual environment. 
  * On Windows:
       ```bash
        python3 -m venv venv
       .venv/Scripts/activate
    ```
  * On macOS/Linux:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
Install the required packages:
```bash
pip install -r requirements.txt
```
Step 5: Model Training

1) Navigate to the training folder within the project directory.
2) Open the Jupyter Notebook files (*.ipynb) for training the models.
3) Follow the instructions within the notebooks to train the models using the downloaded dataset


Step 6: Running the Server

Go back to the root directory of the project.
Execute the **server.py** script:
```bash
python server.py
```

Once the server is running without errors, open a web browser and navigate to (http://Your_IP:5050) to access the application

Test all functionalities to ensure they work correctly



## Deployment
The best-performing model will be deployed as a web application or API, allowing users to input various parameters and receive real-time crime predictions for different locations in Chicago.

## License
This project is licensed under the [MIT License](LICENSE).
