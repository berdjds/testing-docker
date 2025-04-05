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
        <h1 className="text-4xl font-bold text-center mb-8 bg-blue-600 text-white py-3 px-6 rounded-lg inline-block mx-auto shadow-lg">
          Welcome to Our Application
        </h1>
        <p className="text-xl text-center mb-8 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md">
          This is a full-stack application built with Next.js, Node.js, and MySQL.
        </p>
        
        <div className="flex justify-center mb-8">
          <button
            onClick={checkApiStatus}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md transform hover:scale-105 active:scale-95"
          >
            Check API Status
          </button>
        </div>

        {apiStatus && (
          <div className="mb-8 p-5 bg-blue-100 rounded-lg max-w-md mx-auto shadow-md border border-blue-200">
            <h2 className="text-lg font-semibold mb-2 text-blue-700">API Status:</h2>
            <pre className="whitespace-pre-wrap bg-white p-4 rounded border border-blue-200 shadow-inner">{apiStatus}</pre>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md">Products</h2>

        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-blue-600 font-medium">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4 bg-red-50 rounded-lg border border-red-200 max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg overflow-hidden shadow-lg bg-white transform transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className="bg-blue-600 text-white p-3 font-bold text-lg">
                    Product {product.id}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800">{product.name}</h3>
                    <p className="text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {product.stock} in stock
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center col-span-3 p-6 bg-gray-50 rounded-lg border border-gray-200">No products available</p>
            )}
          </div>
        )}
      </main>
      <footer className="bg-blue-600 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Our Application. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
