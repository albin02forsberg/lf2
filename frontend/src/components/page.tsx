import React from 'react';

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="text-2xl font-bold">MyApp</div>
        <nav>
          <a href="/login" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">Login</a>
          <a href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Sign Up</a>
        </nav>
      </header>
      <main className="flex-1">
        <section className="flex items-center justify-center py-20 text-center bg-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tighter">Welcome to MyApp</h1>
            <p className="mt-4 text-lg text-gray-500">
              The best place to manage your tasks and be more productive.
            </p>
            <div className="mt-8">
              <a href="/signup" className="px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Get Started
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="p-4 text-center text-gray-500 border-t">
        © 2024 MyApp. All rights reserved.
      </footer>
    </div>
  );
};

export default Page;
