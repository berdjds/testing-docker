"use client";

import { useState, useEffect } from "react";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setApiStatus(JSON.stringify(data, null, 2));
    } catch (err) {
      setApiStatus("API not available. Please check server status.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <main className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8 bg-blue-500 text-white py-2 px-4 rounded-lg inline-block mx-auto">
          Welcome to Our Application
        </h1>
        <p className="text-xl text-center mb-8 bg-blue-500 text-white py-2 px-4 rounded-lg">
          This is a full-stack application built with Next.js, Node.js, and MySQL.
        </p>
        
        <div className="flex justify-center mb-8">
          <button
            onClick={checkApiStatus}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            Check API Status
          </button>
        </div>

        {apiStatus && (
          <div className="mb-8 p-4 bg-blue-100 rounded-lg max-w-md mx-auto shadow-md">
            <h2 className="text-lg font-semibold mb-2 text-blue-500">API Status:</h2>
            <pre className="whitespace-pre-wrap bg-blue-50 p-3 rounded border border-blue-200">{apiStatus}</pre>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6 bg-blue-500 text-white py-2 px-4 rounded-lg">Products</h2>

        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden shadow-lg bg-white transform transition-all hover:scale-105"
                >
                  <div className="bg-blue-500 text-white p-2 font-bold">
                    Product {product.id}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mb-4 bg-blue-50 p-2 rounded-lg">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-500">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3">No products available</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
