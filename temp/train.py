# train_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

# Load data
df = pd.read_csv(r'C:/Users/vinay/Desktop/technovate/Technovate/Carbon Emission.csv')

# Preprocess data
def preprocess_data(df):
    """Preprocess the data for analysis and modeling"""
    df_processed = df.copy()

    # Handle categorical variables
    le = LabelEncoder()
    categorical_cols = ['Body Type', 'Sex', 'Diet', 'How Often Shower', 'Heating Energy Source',
                       'Transport', 'Vehicle Type', 'Social Activity', 'Frequency of Traveling by Air',
                       'Waste Bag Size', 'Energy efficiency']

    for col in categorical_cols:
        df_processed[col] = le.fit_transform(df_processed[col].astype(str))

    # Handle list columns
    df_processed['Recycling_Count'] = df_processed['Recycling'].apply(len)
    df_processed['Cooking_Methods_Count'] = df_processed['Cooking_With'].apply(len)

    # Drop the original list columns
    df_processed = df_processed.drop(['Recycling', 'Cooking_With'], axis=1)

    return df_processed

# Preprocess the training data
df_processed = preprocess_data(df)

# Prepare features and target variable
features = [col for col in df_processed.columns if col != 'CarbonEmission']
X = df_processed[features]
y = df_processed['CarbonEmission']

# Train the Random Forest Regressor model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

# Save the trained model to a .pkl file
joblib.dump(model, 'carbon_footprint_model.pkl')

print("Model training complete and saved successfully as 'carbon_footprint_model.pkl'.")
