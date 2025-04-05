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
    <div className="min-h-screen">
      {/* Header */}
      <header className="header-gradient shadow-lg py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-contrast-text">
            Media Caramel Based Application
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-[#102a47] rounded-xl shadow-xl p-6 mb-8 border-l-4 caramel-border">
          <p className="text-xl text-center text-contrast-text">
            This is a full-stack application built with Next.js, Node.js, and MySQL.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <button
            onClick={checkApiStatus}
            className="px-6 py-3 btn-caramel font-semibold rounded-lg shadow-md transform hover:scale-105 active:scale-95"
          >
            Check API Status
          </button>
        </div>

        {apiStatus && (
          <div className="mb-8 p-5 bg-[#102a47] rounded-lg max-w-md mx-auto shadow-md border border-[#1d3a5a]">
            <h2 className="text-lg font-semibold mb-2 text-caramel-light">API Status:</h2>
            <pre className="whitespace-pre-wrap bg-[#081b33] p-4 rounded border border-[#1d3a5a] shadow-inner text-secondary-text">{apiStatus}</pre>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-6 header-gradient text-contrast-text py-2 px-4 rounded-lg shadow-md">Products</h2>

        {loading ? (
          <div className="text-center p-8">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-caramel border-r-transparent"></div>
            <p className="mt-4 text-caramel-light font-medium">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-300 p-4 bg-[#261212] rounded-lg border border-red-500 max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="product-card border rounded-lg overflow-hidden shadow-lg bg-[#102a47] transform transition-all hover:shadow-xl"
                >
                  <div className="header-gradient text-contrast-text p-3 font-bold text-lg">
                    Product {product.id}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-caramel">{product.name}</h3>
                    <p className="text-secondary-text mb-4">{product.description || "No description available"}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-caramel-light">${product.price.toFixed(2)}</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.stock > 5 
                          ? "bg-green-900 text-green-300" 
                          : product.stock > 0 
                            ? "bg-yellow-900 text-yellow-300" 
                            : "bg-red-900 text-red-300"
                      }`}>
                        {product.stock > 5 
                          ? "In Stock" 
                          : product.stock > 0 
                            ? "Low Stock" 
                            : "Out of Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-secondary-text p-8 bg-[#102a47] rounded-lg">
                <p>No products available at this time.</p>
                <p className="mt-2 text-caramel">Check back later for new items!</p>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-16 header-gradient shadow-inner py-6">
        <div className="container mx-auto px-4 text-center text-contrast-text">
          <p> {new Date().getFullYear()} Media Caramel Based Application. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
