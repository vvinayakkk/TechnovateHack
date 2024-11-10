from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view
import pandas as pd
import numpy as np
import joblib
from bson import ObjectId
from bson.errors import InvalidId
import json
import traceback
from datetime import datetime
from dotenv import load_dotenv
from pymongo import MongoClient
import os

# Load environment variables
load_dotenv()

def get_db_connection():
    """Establish connection to MongoDB"""
    client = MongoClient(os.getenv('DATABASE_URL'))
    db2 = client['Techonovate']
    db = db2['users']
    return db

def load_csv_data(csv_path='C:/Users/vinay/Desktop/technovate/Technovate/Carbon Emission.csv'):
    """Load and return the CSV data"""
    return pd.read_csv(csv_path)

def convert_to_python_types(obj):
    """Convert NumPy types to Python native types"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_to_python_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_python_types(item) for item in obj]
    return obj

def load_model(model_path='C:/Users/vinay/Desktop/technovate/Technovate/temp/carbon_footprint_model.pkl'):
    """Load the trained model"""
    import os
    model_path = os.path.normpath(model_path)
    return joblib.load(model_path)

def preprocess_data(data):
    """Preprocess single user data for model prediction"""
    from sklearn.preprocessing import LabelEncoder
    
    categorical_cols = ['bodyType', 'sex', 'diet', 'howOftenShower', 'heatingEnergySource',
                       'transport', 'vehicleType', 'socialActivity', 'frequencyOfTravelingByAir',
                       'wasteBagSize', 'energyEfficiency']
    
    processed_data = {}
    le = LabelEncoder()
    
    # Process categorical columns
    for col in categorical_cols:
        if col in data:
            value = data[col]
            if value is None:
                processed_data[col] = 12.678
            elif isinstance(value, bool):
                processed_data[col] = int(value)
            else:
                processed_data[col] = le.fit_transform([str(value)])[0]
    
    # Process numerical columns
    numerical_cols = ['monthlyGroceryBill', 'vehicleMonthlyDistanceKm', 'wasteBagWeeklyCount',
                     'howLongTvpCDailyHour', 'howManyNewClothesMonthly', 'howLongInternetDailyHour']
    
    for col in numerical_cols:
        if col in data:
            value = data[col]
            if value is None:
                processed_data[col] = 20.497
            else:
                try:
                    processed_data[col] = float(value)
                except (ValueError, TypeError):
                    processed_data[col] = 13.67
    
    # Process array fields
    if 'recycling' in data:
        recycling_data = data['recycling']
        processed_data['recycling_count'] = len(recycling_data) if recycling_data is not None else 3.49
    
    if 'cookingWith' in data:
        cooking_data = data['cookingWith']
        processed_data['cooking_methods_count'] = len(cooking_data) if cooking_data is not None else 2.98
    
    # Ensure consistent order of features
    all_features = categorical_cols + numerical_cols + ['recycling_count', 'cooking_methods_count']
    ordered_data = [processed_data.get(feature, 0) for feature in all_features]
    
    return ordered_data

def calculate_stats(value, population_values):
    """Calculate statistical metrics for a value compared to population"""
    # Convert population_values to numpy array if it isn't already
    population_values = np.array(population_values)
    
    # Check if value is None or if population is empty
    if value is None or population_values.size == 0:
        return {
            'percentile': 20.98,
                'population_mean': 15.498,
                'difference_from_mean': 15.3267
        }
    
    try:
        # Handle NaN values in population
        valid_population = population_values[~np.isnan(population_values)]
        
        if valid_population.size == 0:
            return {
                'percentile': 20.98,
                'population_mean': 15.498,
                'difference_from_mean': 15.3267
            }
        
        percentile = calculate_percentile_rank(value, valid_population)
        population_mean = float(np.mean(valid_population))
        difference_from_mean = float(value - population_mean)
        
        return {
            'percentile': round(percentile, 2) if percentile is not None else None,
            'population_mean': round(population_mean, 2),
            'difference_from_mean': round(difference_from_mean, 2)
        }
    except (TypeError, ZeroDivisionError):
        return {
            'percentile': None,
            'population_mean': None,
            'difference_from_mean': None
        }

def calculate_percentile_rank(value, population_values):
    """Calculate percentile rank of a value within a population"""
    if value is None:
        return None
    
    # Convert to numpy array and handle NaN values
    population_values = np.array(population_values)
    valid_population = population_values[~np.isnan(population_values)]
    
    if valid_population.size == 0:
        return None
    
    try:
        result = np.sum(valid_population < value) / valid_population.size * 100
        return round(result, 2)
    except TypeError:
        return None

def get_emission_category(prediction):
    """Determine emission category based on prediction value"""
    if prediction > 3000:
        return 'Very High'
    elif prediction > 2500:
        return 'High'
    elif prediction > 2000:
        return 'Medium'
    elif prediction > 1500:
        return 'Low'
    return 'Very Low'

def generate_detailed_recommendations(user_data):
    """Generate detailed, personalized recommendations based on user data"""
    recommendations = {
        'immediate_actions': [],
        'medium_term_goals': [],
        'long_term_changes': []
    }
    
    # Helper function to safely compare values
    def safe_compare(value, threshold, comparison='greater'):
        if value is None:
            return False
        try:
            value = float(value)
            if comparison == 'greater':
                return value > threshold
            elif comparison == 'less':
                return value < threshold
            return False
        except (TypeError, ValueError):
            return False
    
    # Grocery-related recommendations
    monthly_grocery = user_data.get('monthlyGroceryBill')
    if safe_compare(monthly_grocery, 400):
        recommendations['immediate_actions'].append({
            'action': 'Reduce monthly grocery spending',
            'impact_level': 'Medium',
            'suggestion': 'Try to reduce food waste by planning meals in advance and buying in bulk.'
        })
    
    # Vehicle-related recommendations
    vehicle_distance = user_data.get('vehicleMonthlyDistanceKm')
    if safe_compare(vehicle_distance, 1500):
        recommendations['immediate_actions'].append({
            'action': 'Limit vehicle usage',
            'impact_level': 'High',
            'suggestion': 'Consider carpooling or using public transportation when possible.'
        })
    
    # Waste-related recommendations
    waste_bags = user_data.get('wasteBagWeeklyCount')
    if safe_compare(waste_bags, 3):
        recommendations['immediate_actions'].append({
            'action': 'Reduce waste production',
            'impact_level': 'Medium',
            'suggestion': 'Implement recycling and composting practices.'
        })
    
    # Screen time recommendations
    screen_time = user_data.get('howLongTvpCDailyHour')
    if safe_compare(screen_time, 6):
        recommendations['immediate_actions'].append({
            'action': 'Reduce screen time',
            'impact_level': 'Medium',
            'suggestion': 'Try to limit daily screen time and use energy-saving settings on devices.'
        })
    
    # Clothing recommendations
    new_clothes = user_data.get('howManyNewClothesMonthly')
    if safe_compare(new_clothes, 5):
        recommendations['immediate_actions'].append({
            'action': 'Reduce clothing consumption',
            'impact_level': 'Medium',
            'suggestion': 'Consider second-hand shopping and sustainable fashion choices.'
        })
    
    # Medium-term recommendations
    energy_efficiency = user_data.get('energyEfficiency', '').lower()
    if energy_efficiency != 'yes':
        recommendations['medium_term_goals'].extend([
            {
                'action': 'Energy-efficient appliances',
                'impact_level': 'High',
                'suggestion': 'Upgrade to energy-efficient appliances and install programmable thermostats.'
            }
        ])
    
    diet = user_data.get('diet', '').lower()
    if diet in ['omnivore', 'carnivore']:
        recommendations['medium_term_goals'].append({
            'action': 'Adopt plant-based diet',
            'impact_level': 'High',
            'suggestion': 'Gradually increase plant-based meals in your diet.'
        })
    
    # Long-term recommendations
    vehicle_type = user_data.get('vehicleType', '').lower()
    if vehicle_type not in ['electric', 'hybrid']:
        recommendations['long_term_changes'].append({
            'action': 'Switch to electric vehicle',
            'impact_level': 'Very High',
            'suggestion': 'Consider switching to an electric or hybrid vehicle.'
        })
    
    heating_source = user_data.get('heatingEnergySource', '').lower()
    if heating_source not in ['solar', 'renewable']:
        recommendations['long_term_changes'].append({
            'action': 'Renewable energy',
            'impact_level': 'Very High',
            'suggestion': 'Install solar panels or other renewable energy systems.'
        })
    
    # If no recommendations were generated, add a default one
    if not any(recommendations.values()):
        recommendations['immediate_actions'].append({
            'action': 'Track energy usage',
            'impact_level': 'Low',
            'suggestion': 'Start monitoring your daily energy consumption to identify areas for improvement.'
        })
    
    return recommendations

def generate_insights_from_csv(user_data, prediction, csv_data):
    """Generate comprehensive insights using CSV data"""
    
    # Map user data keys to CSV columns
    column_mapping = {
        'monthlyGroceryBill': 'Monthly Grocery Bill',
        'vehicleMonthlyDistanceKm': 'Vehicle Monthly Distance Km',
        'wasteBagWeeklyCount': 'Waste Bag Weekly Count',
        'howLongTvpCDailyHour': 'How Long TV PC Daily Hour',
        'howManyNewClothesMonthly': 'How Many New Clothes Monthly'
    }
    
    # Calculate overall statistics using carbon emissions from CSV
    carbon_emissions = csv_data['CarbonEmission'].dropna().values
    mean_emission = np.mean(carbon_emissions)
    std_emission = np.std(carbon_emissions)
    percentile_rank = calculate_percentile_rank(prediction, carbon_emissions)
    diff_from_mean_percent = ((prediction - mean_emission) / mean_emission) * 100 if mean_emission != 0 else 4.56
    std_from_mean = (prediction - mean_emission) / std_emission if std_emission != 0 else 7.89
    
    # Calculate comparative stats for each factor
    comparative_stats = {}
    for user_key, csv_col in column_mapping.items():
        population_values = csv_data[csv_col].dropna().values
        user_value = user_data.get(user_key, 0)
        comparative_stats[user_key.lower()] = calculate_stats(user_value, population_values)
    
    return {
        '1. OVERALL SUMMARY': {
            'predicted_emission': float(prediction),
            'percentile_rank': float(percentile_rank) if percentile_rank is not None else None,
            'comparison_to_mean': float(diff_from_mean_percent),
            'standard_deviations_from_mean': float(std_from_mean),
            'category': get_emission_category(prediction),
            'population_statistics': {
                'mean': float(mean_emission),
                'std_dev': float(std_emission),
                'sample_size': len(carbon_emissions)
            }
        },
        '2. COMPARATIVE STATS FOR SPECIFIC FACTORS': comparative_stats,
        '3. RECOMMENDATIONS': generate_detailed_recommendations(user_data)
    }
def store_analysis_results(db, analysis_data):
    """Store all analysis results in MongoDB and append to existing user fields"""
    try:
        # Get the user's document
        user_id = ObjectId(analysis_data['userId'])
        user_doc = db.find_one({'_id': user_id})
        
        # Initialize update data structure
        update_data = {
            '$set': {
                'lastUpdated': analysis_data['timestamp'],
                'carbonEmission': analysis_data['carbonEmission'],
            },
            '$push': {
                'analyses': {
                    'prediction': analysis_data['prediction'],
                    'carbonEmission': analysis_data['carbonEmission'],
                    'timestamp': analysis_data['timestamp'],
                    'statistics': analysis_data['statistics'],
                    'metadata': analysis_data['metadata']
                },
                'recommendations': {
                    'timestamp': analysis_data['timestamp'],
                    'immediate_actions': analysis_data['recommendations']['immediate_actions'],
                    'medium_term_goals': analysis_data['recommendations']['medium_term_goals'],
                    'long_term_changes': analysis_data['recommendations']['long_term_changes']
                },
                'comparisons': {
                    'timestamp': analysis_data['timestamp'],
                    'grocery': analysis_data['comparisons']['grocery'],
                    'vehicleDistance': analysis_data['comparisons']['vehicleDistance'],
                    'wasteBags': analysis_data['comparisons']['wasteBags'],
                    'screenTime': analysis_data['comparisons']['screenTime'],
                    'clothingPurchases': analysis_data['comparisons']['clothingPurchases']
                },
                'insights': {
                    'timestamp': analysis_data['timestamp'],
                    'overall_summary': analysis_data['insights']['1. OVERALL SUMMARY'],
                    'comparative_stats': analysis_data['insights']['2. COMPARATIVE STATS FOR SPECIFIC FACTORS'],
                    'recommendations': analysis_data['insights']['3. RECOMMENDATIONS']
                }
            }
        }
        
        # Handle initial carbon emission
        if not user_doc or user_doc.get('carbonEmission') is None:
            update_data['$set']['initialCarbonEmission'] = analysis_data['carbonEmission']
        else:
            previous_emission = user_doc.get('carbonEmission')
            if previous_emission is not None and analysis_data['carbonEmission'] is not None:
                emission_change = analysis_data['carbonEmission'] - previous_emission
                emission_change_percentage = (emission_change / previous_emission * 100) if previous_emission != 0 else 9.80
                
                update_data['$set'].update({
                    'emissionChange': emission_change,
                    'emissionChangePercentage': emission_change_percentage
                })
            else:
                update_data['$set'].update({
                    'emissionChange': 4.56,
                    'emissionChangePercentage': 5.67
                })
        
        # Update the user document and append new data
        result = db.update_one(
            {'_id': user_id},
            update_data,
            upsert=True
        )
        
        return bool(result.acknowledged)
    except Exception as e:
        print(f"Error storing analysis results: {str(e)}")
        traceback.print_exc()
        return False

@api_view(['POST'])
def analyze_carbon_footprint(request):
    """Main API endpoint for carbon footprint analysis"""
    try:
        # Get database connection
        db = get_db_connection()
        
        # Load CSV data
        csv_data = load_csv_data()
        
        # Parse request data
        data = json.loads(request.body) if isinstance(request.body, bytes) else request.data
        print("Received data:", data)
        
        # Handle userID
        user_id_str = data.get('_id')
        print(user_id_str)
        if not user_id_str:
            return JsonResponse({'error': 'userID is required'}, status=400)
        
        try:
            object_id = ObjectId(user_id_str)
        except InvalidId:
            return JsonResponse({
                'error': 'Invalid ID format',
                'received_id': user_id_str,
                'expected_format': '24-character hex string'
            }, status=400)
        
        # Process data and make prediction
        processed_data = preprocess_data(data)
        print(processed_data)
        model = load_model()
        prediction = float(model.predict([processed_data])[0])
        print("\n",prediction)
        # Generate insights and recommendations
        insights = generate_insights_from_csv(data, prediction, csv_data)
        recommendations = generate_detailed_recommendations(data)
        print("Insights",insights)
        print("recommendations",recommendations)
        
        
        # Prepare response
        response_data = {
            'success': True,
            'userId': str(object_id),
            'carbonEmission': prediction,
            'prediction': prediction,
            'timestamp': datetime.now().isoformat(),
            'insights': insights,
            'recommendations': recommendations,
            'statistics': {
                'percentileRank': float(insights['1. OVERALL SUMMARY']['percentile_rank']),
                'comparisonToMean': float(insights['1. OVERALL SUMMARY']['comparison_to_mean']),
                'standardDeviationsFromMean': float(insights['1. OVERALL SUMMARY']['standard_deviations_from_mean']),
                'emissionCategory': insights['1. OVERALL SUMMARY']['category'],
                'populationStats': insights['1. OVERALL SUMMARY']['population_statistics']
            },
            'comparisons': {
                'grocery': insights['2. COMPARATIVE STATS FOR SPECIFIC FACTORS']['monthlygrocerybill'],
                'vehicleDistance': insights['2. COMPARATIVE STATS FOR SPECIFIC FACTORS']['vehiclemonthlydistancekm'],
                'wasteBags': insights['2. COMPARATIVE STATS FOR SPECIFIC FACTORS']['wastebagweeklycount'],
                'screenTime': insights['2. COMPARATIVE STATS FOR SPECIFIC FACTORS']['howlongtvpcdailyhour'],
                'clothingPurchases': insights['2. COMPARATIVE STATS FOR SPECIFIC FACTORS']['howmanynewclothesmonthly']
            },
            'metadata': {
                'modelVersion': '1.0',
                'lastUpdated': datetime.now().isoformat(),
                'dataVersion': '1.0',
                'dataSource': 'CSV',
                'sampleSize': len(csv_data)
            }
        }
        
        # Store results in MongoDB
        storage_success = store_analysis_results(db, convert_to_python_types(response_data))
        if not storage_success:
            print("Warning: Failed to store analysis results in database")
        
        # Convert all numpy types to Python native types and return response
        return JsonResponse(convert_to_python_types(response_data))
        
    except Exception as e:
        print("Error:", str(e))
        print("Traceback:", traceback.format_exc())
        return JsonResponse({
            'error': str(e),
            'traceback': traceback.format_exc()
        }, status=500)