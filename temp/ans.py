import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import LabelEncoder

def load_model(model_path='carbon_footprint_model.pkl'):
    """Load the pre-trained model from joblib file."""
    return joblib.load(model_path)

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
    if isinstance(df_processed.get('Recycling', None), pd.Series):
        df_processed['Recycling_Count'] = df_processed['Recycling'].apply(len)
    else:
        df_processed['Recycling_Count'] = df_processed.apply(lambda x: len(x['Recycling']) if isinstance(x['Recycling'], list) else 0, axis=1)

    if isinstance(df_processed.get('Cooking_With', None), pd.Series):
        df_processed['Cooking_Methods_Count'] = df_processed['Cooking_With'].apply(len)
    else:
        df_processed['Cooking_Methods_Count'] = df_processed.apply(lambda x: len(x['Cooking_With']) if isinstance(x['Cooking_With'], list) else 0, axis=1)

    # Drop the original list columns
    df_processed = df_processed.drop(['Recycling', 'Cooking_With'], axis=1)

    return df_processed

def generate_detailed_insights(user_data, df, user_prediction):
    """
    Generate detailed insights with positive and negative factors impacting carbon footprint,
    as well as comparative stats for each relevant category.
    """
    insights = {
        'summary': {},
        'detailed_analysis': {},
        'positive_factors': {},
        'negative_factors': {},
        'recommendations': {},
        'comparative_stats': {},
    }

    # Overall Summary
    population_mean = df['CarbonEmission'].mean()
    population_std = df['CarbonEmission'].std()
    percentile = (df['CarbonEmission'] < user_prediction).mean() * 100

    insights['summary'] = {
        'predicted_emission': user_prediction,
        'percentile_rank': percentile,
        'comparison_to_mean': (user_prediction - population_mean) / population_mean * 100,
        'standard_deviations_from_mean': (user_prediction - population_std) / population_std,
        'emission_category': 'Very High' if percentile > 90 else 'High' if percentile > 75 
                            else 'Medium' if percentile > 25 else 'Low' if percentile > 10 else 'Very Low'
    }

    # Detailed Analysis of Each Factor with Comparative Stats
    comparative_stats = {
        'grocery': {
            'user_value': user_data['Monthly Grocery Bill'],
            'population_mean': df['Monthly Grocery Bill'].mean(),
            'population_std': df['Monthly Grocery Bill'].std(),
            'percentile': (df['Monthly Grocery Bill'] < user_data['Monthly Grocery Bill']).mean() * 100
        },
        'vehicle_distance': {
            'user_value': user_data['Vehicle Monthly Distance Km'],
            'population_mean': df['Vehicle Monthly Distance Km'].mean(),
            'population_std': df['Vehicle Monthly Distance Km'].std(),
            'percentile': (df['Vehicle Monthly Distance Km'] < user_data['Vehicle Monthly Distance Km']).mean() * 100
        },
        'waste_bags': {
            'user_value': user_data['Waste Bag Weekly Count'],
            'population_mean': df['Waste Bag Weekly Count'].mean(),
            'population_std': df['Waste Bag Weekly Count'].std(),
            'percentile': (df['Waste Bag Weekly Count'] < user_data['Waste Bag Weekly Count']).mean() * 100
        },
        'screen_time': {
            'user_value': user_data['How Long TV PC Daily Hour'],
            'population_mean': df['How Long TV PC Daily Hour'].mean(),
            'population_std': df['How Long TV PC Daily Hour'].std(),
            'percentile': (df['How Long TV PC Daily Hour'] < user_data['How Long TV PC Daily Hour']).mean() * 100
        },
        'clothing_purchases': {
            'user_value': user_data['How Many New Clothes Monthly'],
            'population_mean': df['How Many New Clothes Monthly'].mean(),
            'population_std': df['How Many New Clothes Monthly'].std(),
            'percentile': (df['How Many New Clothes Monthly'] < user_data['How Many New Clothes Monthly']).mean() * 100
        }
    }
    insights['comparative_stats'] = comparative_stats

    # Generate Recommendations
    recommendations = generate_recommendations(comparative_stats, df)
    insights['recommendations'] = recommendations

    return insights

def generate_recommendations(comparative_stats, df):
    """Generate detailed recommendations based on comparative stats."""
    recommendations = {
        'immediate_actions': [],
        'medium_term_goals': [],
        'long_term_changes': []
    }
    
    for factor, details in comparative_stats.items():
        if factor == 'grocery' and details['user_value'] > details['population_mean']:
            recommendations['immediate_actions'].append({
                'action': 'Reduce monthly grocery spending',
                'impact_level': 'Medium',
                'suggestion': 'Try to reduce food waste by planning meals in advance, buying in bulk for non-perishable items, '
                              'and choosing seasonal, local produce. Consider shopping at farmer\'s markets to minimize packaging waste.'
            })
        elif factor == 'vehicle_distance' and details['user_value'] > details['population_mean']:
            recommendations['immediate_actions'].append({
                'action': 'Limit vehicle usage',
                'impact_level': 'High',
                'suggestion': 'Reduce solo driving by carpooling or taking public transportation whenever possible. For short distances, '
                              'consider walking or biking to reduce emissions. Investigate alternative, eco-friendly commuting options like electric scooters.'
            })
        elif factor == 'waste_bags' and details['user_value'] > details['population_mean']:
            recommendations['immediate_actions'].append({
                'action': 'Reduce weekly waste production',
                'impact_level': 'Medium',
                'suggestion': 'Start with basic waste reduction habits, such as reusing items, buying products with minimal packaging, '
                              'and sorting waste into recyclables, compost, and landfill. Engage with local recycling programs or set up a compost bin at home.'
            })
        elif factor == 'screen_time' and details['user_value'] > details['population_mean']:
            recommendations['immediate_actions'].append({
                'action': 'Limit daily screen time',
                'impact_level': 'Low',
                'suggestion': 'Set screen time limits, especially for non-work-related activities. Consider replacing some screen time with outdoor activities, '
                              'reading, or other offline hobbies to save energy and promote well-being.'
            })
        elif factor == 'clothing_purchases' and details['user_value'] > details['population_mean']:
            recommendations['immediate_actions'].append({
                'action': 'Limit new clothing purchases',
                'impact_level': 'Medium',
                'suggestion': 'Adopt sustainable fashion habits by buying fewer, high-quality items or opting for second-hand clothing. '
                              'Explore upcycling or repairing existing clothes instead of purchasing new ones. '
                              'Consider participating in clothing swap events or donating unused items.'
            })

    # Add medium-term and long-term recommendations
    recommendations['medium_term_goals'] = [
        {
            'action': 'Invest in energy-efficient appliances',
            'impact_level': 'High',
            'suggestion': 'Upgrade household appliances to energy-efficient models and install programmable thermostats.'
        },
        {
            'action': 'Adopt a more plant-based diet',
            'impact_level': 'High',
            'suggestion': 'Gradually reduce meat and dairy consumption, focusing on plant-based meals.'
        }
    ]

    recommendations['long_term_changes'] = [
        {
            'action': 'Switch to an electric or hybrid vehicle',
            'impact_level': 'Very High',
            'suggestion': 'Consider switching to an electric or hybrid vehicle to reduce transportation emissions.'
        },
        {
            'action': 'Install renewable energy systems',
            'impact_level': 'Very High',
            'suggestion': 'Consider installing solar panels or other renewable energy systems.'
        }
    ]

    return recommendations

def print_insights(insights):
    """Print insights including overall summary, comparative stats, and recommendations."""
    print("\n======= CARBON FOOTPRINT INSIGHT REPORT =======")
    
    # Overall Summary
    print("\n1. OVERALL SUMMARY")
    print(f"Predicted Carbon Emission: {insights['summary']['predicted_emission']:.2f}")
    print(f"Percentile Rank: {insights['summary']['percentile_rank']:.1f}")
    print(f"Comparison to Mean: {insights['summary']['comparison_to_mean']:.2f}%")
    print(f"Standard Deviations from Mean: {insights['summary']['standard_deviations_from_mean']:.2f}")
    print(f"Category: {insights['summary']['emission_category']}")

    # Comparative Stats
    print("\n2. COMPARATIVE STATS FOR SPECIFIC FACTORS")
    for factor, details in insights['comparative_stats'].items():
        print(f"\n- {factor.replace('_', ' ').title()}")
        print(f"  Your Value: {details['user_value']}")
        print(f"  Population Mean: {details['population_mean']:.2f}")
        print(f"  Difference from Mean: {(details['user_value'] - details['population_mean']):.2f}")
        print(f"  Percentile Rank: {details['percentile']:.1f}")
        print(f"  Population Standard Deviation: {details['population_std']:.2f}")

    # Recommendations
    print("\n3. RECOMMENDATIONS")
    for action_type, actions in insights['recommendations'].items():
        print(f"\n{action_type.replace('_', ' ').title()}:")
        for action in actions:
            print(f"- {action['action']}")
            print(f"  Impact Level: {action['impact_level']}")
            print(f"  Suggestion: {action['suggestion']}")

def analyze_carbon_footprint(user_data):
    """Main function to analyze carbon footprint for a given user."""
    try:
        # Load model and data
        model = load_model('carbon_footprint_model.pkl')
        df = pd.read_csv(r"C:\Users\Asim\Downloads\Carbon Emission.csv\Carbon Emission.csv")
        
        # Prepare user data
        user_df = pd.DataFrame([user_data])
        
        # Preprocess both datasets
        df_processed = preprocess_data(df)
        user_df_processed = preprocess_data(user_df)
        
        # Get prediction
        features = [col for col in df_processed.columns if col != 'CarbonEmission']
        user_prediction = model.predict(user_df_processed[features])[0]
        
        # Generate and print insights
        insights = generate_detailed_insights(user_data, df, user_prediction)
        print_insights(insights)
        
        return {
            'success': True,
            'prediction': user_prediction,
            'insights': insights
        }
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

# Sample user data
sample_user = {
    'Body Type': 'Heavy',
    'Sex': 'Male',
    'Diet': 'meat-heavy',
    'How Often Shower': 'Twice daily',
    'Heating Energy Source': 'Coal',
    'Transport': 'private',
    'Vehicle Type': 'Gasoline',
    'Social Activity': 'Daily',
    'Monthly Grocery Bill': 800,
    'Frequency of Traveling by Air': 'Frequently',
    'Vehicle Monthly Distance Km': 3000,
    'Waste Bag Size': 'Large',
    'Waste Bag Weekly Count': 7,
    'How Long TV PC Daily Hour': 10,
    'How Many New Clothes Monthly': 5,
    'How Long Internet Daily Hour': 12,
    'Energy efficiency': 'No',
    'Recycling': [],
    'Cooking_With': ['Gas Stove', 'Electric Oven', 'Microwave'],
}

# Run the analysis if the script is run directly
if __name__ == "__main__":
    result = analyze_carbon_footprint(sample_user)
    if not result['success']:
        print(f"Analysis failed: {result['error']}")