import React from 'react';

const RegistrationPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your registration logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">הרשמה</h1>
        
        <form /*onSubmit={handleSubmit}*/ className="space-y-4">
          <input
            type="text"
            placeholder="שם פרטי"
            className="w-full px-4 py-3 rounded-lg bg-blue-50/30 border-b-2 border-blue-200
                       text-right focus:outline-none focus:border-blue-400
                       transition duration-200 text-gray-700 placeholder-cyan-600"
            required
          />
          
          <input
            type="text"
            placeholder="שם משפחה"
            className="w-full px-4 py-3 rounded-lg bg-blue-50/30 border-b-2 border-blue-200
                       text-right focus:outline-none focus:border-blue-400
                       transition duration-200 text-gray-700 placeholder-cyan-600"
            required
          />
          
          <input
            type="text"
            placeholder="כתובת"
            className="w-full px-4 py-3 rounded-lg bg-blue-50/30 border-b-2 border-blue-200
                       text-right focus:outline-none focus:border-blue-400
                       transition duration-200 text-gray-700 placeholder-cyan-600"
            required
          />
          
          <input
            type="email"
            placeholder="אימייל"
            className="w-full px-4 py-3 rounded-lg bg-blue-50/30 border-b-2 border-blue-200
                       text-right focus:outline-none focus:border-blue-400
                       transition duration-200 text-gray-700 placeholder-cyan-600"
            required
          />

          <div className="flex justify-end space-x-4 text-right">
            <label className="flex items-center space-x-2">
              <input type="radio" name="gender" value="male" className="hidden" />
              <div className="w-8 h-8 text-cyan-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-10h2v6h-2zm0-4h2v2h-2z"/>
                </svg>
              </div>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="gender" value="female" className="hidden" />
              <div className="w-8 h-8 text-cyan-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-10h2v6h-2zm0-4h2v2h-2z"/>
                </svg>
              </div>
            </label>
          </div>

          <input
            type="tel"
            placeholder="טלפון"
            className="w-full px-4 py-3 rounded-lg bg-blue-50/30 border-b-2 border-blue-200
                       text-right focus:outline-none focus:border-blue-400
                       transition duration-200 text-gray-700 placeholder-cyan-600"
            required
          />
          
          <input
            type="date"
            placeholder="תאריך לידה"
            className="w-full px-4 py-3 rounded-lg bg-blue-50/30 border-b-2 border-blue-200
                       text-right focus:outline-none focus:border-blue-400
                       transition duration-200 text-cyan-600 placeholder-cyan-600"
            required
          />

          <input
            type="password"
            placeholder="סיסמא"
            className="w-full px-4 py-3 rounded-lg bg-blue-50/30 border-b-2 border-blue-200
                       text-right focus:outline-none focus:border-blue-400
                       transition duration-200 text-gray-700 placeholder-cyan-600"
            required
          />

          <div className="flex justify-end text-sm text-cyan-600">
            <label className="flex items-center space-x-2">
              <input type="checkbox" required className="accent-cyan-500" />
              <span>קראתי ואני מסכים לתנאים</span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-cyan-500 text-white py-3 rounded-lg font-medium
                     hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 
                     focus:ring-offset-2 transition duration-200"
          >
            הרשמה
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPage;
