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
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Background
Crime prediction is a critical task for law enforcement agencies and urban planners to allocate resources effectively and prevent criminal activities. Chicago, being one of the largest cities in the United States, faces various challenges related to crime, making it an ideal candidate for such predictive modeling efforts.

## Data
The data used in this project consists of historical crime records obtained from the Chicago Police Department. Additionally, socio-economic data such as population demographics, income levels, education levels, and environmental factors like weather conditions, time of day, and geographic locations are incorporated to enrich the predictive model.

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

## Deployment
The best-performing model will be deployed as a web application or API, allowing users to input various parameters and receive real-time crime predictions for different locations in Chicago.

## License
This project is licensed under the [MIT License](LICENSE).
