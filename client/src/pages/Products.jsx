import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Leaf, ShoppingCart, Search, TreePine, Droplets,
  Factory, Recycle, Timer, DollarSign
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, CartesianGrid
} from 'recharts';
import Spinner from '@/components/Spinner';
import axios from 'axios';

const DJANGO_URL = import.meta.env.VITE_DJANGO_URL;

const getRandomCostPerUse = () => (Math.random() * (1.5 - 0.05) + 0.05).toFixed(2); // Random cost between 0.05 and 1.5
const getRandomLifespanMonths = () => (Math.random() * (36 - 6) + 6).toFixed(2); // Random lifespan between 6 and 36 months
const getRandomWaterUsage = () => (Math.random() * (50 - 5) + 5).toFixed(2); // Random water usage between 5 and 50

const addRandomAttributes = (products, recyclable) => {
  return products.map(product => ({
    ...product,
    costPerUse: getRandomCostPerUse(),
    lifespanMonths: getRandomLifespanMonths(),
    recyclable,
    waterUsage: getRandomWaterUsage(),
  }));
}


const ProductComparison = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [regularProducts, setRegularProducts] = useState([
    {
      title: "250 9 oz Clear Disposable Plastic Cups",
      price: "$25.99",
      rating: "4.6 out of 5 stars",
      image_url: "/api/placeholder/320/200",
      product_url: "https://example.com/product1",
      costPerUse: 0.10,
      lifespanMonths: 0.25,
      recyclable: "Not recyclable",
      waterUsage: 13
    }
  ]);

  const [greenProducts, setGreenProducts] = useState([
    {
      title: "Biodegradable Paper Cups - 250 Count",
      price: "$28.99",
      rating: "4.4 out of 5 stars",
      image_url: "/api/placeholder/320/200",
      product_url: "https://example.com/green-product1",
      costPerUse: 0.12,
      lifespanMonths: 6,
      recyclable: "Fully compostable",
      waterUsage: 3
    }
  ]);

  const impactData = [
    { month: 'Jan', regular: 100, green: 10, water_regular: 130, water_green: 30 },
    { month: 'Feb', regular: 200, green: 20, water_regular: 260, water_green: 60 },
    { month: 'Mar', regular: 300, green: 30, water_regular: 390, water_green: 90 },
    { month: 'Apr', regular: 400, green: 40, water_regular: 520, water_green: 120 },
    { month: 'May', regular: 500, green: 50, water_regular: 650, water_green: 150 },
    { month: 'Jun', regular: 600, green: 60, water_regular: 780, water_green: 180 },
  ];


  const handleSearch = async () => {
    setLoading(true);

    const response1 = await axios.get(`${DJANGO_URL}/api/top-products/?query=${searchQuery + ' plastic synthetic'}`)
    setRegularProducts(addRandomAttributes(response1.data.products, "Not recyclable"))
    const response2 = await axios.get(`${DJANGO_URL}/api/top-products/?query=${searchQuery + ' eco-friendly sustainable green biodegradable'}`)
    setGreenProducts(addRandomAttributes(response2.data.products, "Recyclable"))

    setLoading(false);
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await handleSearch();
    }
  };

  const ImpactMetricsCard = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl">Environmental Impact Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-105 transition-transform">
              <TreePine className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-bold text-lg">1,080 kg</h3>
              <p className="text-sm text-gray-600">CO₂ Reduced Yearly</p>
              <div className="mt-2 text-xs text-green-600">↓ 85% vs regular products</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-105 transition-transform">
              <Droplets className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-bold text-lg">10,000 L</h3>
              <p className="text-sm text-gray-600">Water Saved Yearly</p>
              <div className="mt-2 text-xs text-blue-600">↓ 77% water usage</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm transform hover:scale-105 transition-transform">
              <Recycle className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-bold text-lg">95%</h3>
              <p className="text-sm text-gray-600">Waste Reduction</p>
              <div className="mt-2 text-xs text-purple-600">↑ 90% biodegradability</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-4">Cumulative Environmental Impact</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="regular" stroke="#ff7c43" name="Regular Products" strokeWidth={2} />
                    <Line type="monotone" dataKey="green" stroke="#2ec4b6" name="Eco-Friendly" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-semibold mb-4">Water Usage Comparison</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="water_regular" name="Regular Products" fill="#ff7c43" />
                    <Bar dataKey="water_green" name="Eco-Friendly" fill="#2ec4b6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-green-50 border-green-200">
        <Leaf className="w-4 h-4 text-green-600" />
        <AlertDescription>
          Switching to eco-friendly alternatives can reduce your environmental impact by up to 85% while maintaining similar functionality and cost-effectiveness.
        </AlertDescription>
      </Alert>
    </div>
  );

  const ProductCard = ({ product, isGreen }) => (
    <Card className={`w-full transform transition-all duration-200 hover:scale-105 ${isGreen ? 'hover:shadow-green-200' : 'hover:shadow-blue-200'} hover:shadow-lg`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg truncate">{product.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <img src={product.image_url} alt={product.title} className="w-full h-48 object-cover rounded-md mb-4" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl">{product.price}</span>
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2 text-sm">
              <Timer className="w-4 h-4 text-blue-500" />
              <span>Lifespan: {product.lifespanMonths} months</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span>${product.costPerUse}/use</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Recycle className="w-4 h-4 text-purple-500" />
              <span>{product.recyclable}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Droplets className="w-4 h-4 text-blue-600" />
              <span>Water: {product.waterUsage} L</span>
            </div>
          </div>

          <div className='flex justify-between'>
            <Button variant="secondary" onClick={() => { window.open(product.product_url, '_blank') }}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>

            {isGreen && (
              <Badge className="bg-green-500">
                <Leaf className="w-4 h-4 mr-1" />
                Eco-Friendly
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold">Eco-Friendly Product Alternatives</h2>
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {!searchQuery ? (
          <ImpactMetricsCard />
        ) : loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="text-green-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center">
                <Factory className="w-5 h-5 mr-2" />
                Standard Products
              </h3>
              {regularProducts.map((product, index) => (
                <ProductCard key={`regular-${index}`} product={product} isGreen={false} />
              ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold flex items-center text-green-600">
                <Leaf className="w-5 h-5 mr-2" />
                Eco-Friendly Alternatives
              </h3>
              {greenProducts.map((product, index) => (
                <ProductCard key={`green-${index}`} product={product} isGreen={true} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductComparison;
