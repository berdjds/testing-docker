"use client"
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

// Define proper interface for product
interface Product {
  id?: number;
  name: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string>("");

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      if (response.status === 200) {
        setProducts(response.data);
      }
    } catch (err) {
      setError("Failed to fetch products");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/"
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← Back to Home
          </Link>
          <Link
            href="/products/add"
            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
          >
            + Add New Product
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
          Our Products
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2" />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {product.name}
                </h2>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">ID: {product.id}</span>
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}