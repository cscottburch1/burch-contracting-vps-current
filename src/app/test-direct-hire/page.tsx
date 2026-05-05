'use client';

import { useState } from 'react';

export default function DirectHireTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    };

    // Test 1: Check if API endpoint exists
    results.tests.push({ name: 'API Endpoint', status: 'testing...' });
    try {
      const res = await fetch('/api/employment/direct-hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Empty body to trigger validation
      });
      
      results.tests[0].status = res.status === 400 ? '✓ Pass' : `⚠ Unexpected status: ${res.status}`;
      results.tests[0].details = await res.json();
    } catch (err: any) {
      results.tests[0].status = '✗ Fail';
      results.tests[0].error = err.message;
    }

    // Test 2: Submit valid test application
    results.tests.push({ name: 'Valid Application Submission', status: 'testing...' });
    try {
      const testData = {
        first_name: 'Test',
        last_name: 'Applicant',
        email: 'test@example.com',
        phone: '864-555-0100',
        position: 'Carpenter',
        experience_level: 'Intermediate (2-5 years)',
        bio: 'This is a test application from the diagnostic tool.',
        formTimeTaken: 5000, // Simulate 5 seconds
        website: '', // Honeypot
      };

      const res = await fetch('/api/employment/direct-hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData)
      });
      
      results.tests[1].status = res.ok ? '✓ Pass' : '✗ Fail';
      results.tests[1].httpStatus = res.status;
      results.tests[1].details = await res.json();
    } catch (err: any) {
      results.tests[1].status = '✗ Fail';
      results.tests[1].error = err.message;
    }

    // Test 3: Check admin endpoint
    results.tests.push({ name: 'Admin Employees List', status: 'testing...' });
    try {
      const res = await fetch('/api/admin/employees');
      results.tests[2].status = res.ok ? '✓ Pass' : `⚠ Status: ${res.status}`;
      results.tests[2].httpStatus = res.status;
      
      if (res.ok) {
        const data = await res.json();
        results.tests[2].applicationCount = data.length;
        results.tests[2].details = data.slice(0, 3); // First 3 applications
      } else {
        results.tests[2].details = await res.json();
      }
    } catch (err: any) {
      results.tests[2].status = '✗ Fail';
      results.tests[2].error = err.message;
    }

    setTestResults(results);
    setTesting(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Direct Hire System Diagnostics
          </h1>
          <p className="text-gray-600 mb-6">
            This page tests the employment application system to identify any issues.
          </p>

          <button
            onClick={runTests}
            disabled={testing}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? 'Running Tests...' : 'Run Diagnostic Tests'}
          </button>
        </div>

        {testResults && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Results</h2>
            <p className="text-sm text-gray-500 mb-6">
              Completed at: {new Date(testResults.timestamp).toLocaleString()}
            </p>

            <div className="space-y-6">
              {testResults.tests.map((test: any, index: number) => (
                <div key={index} className="border-l-4 border-gray-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{test.name}</h3>
                    <span className={`text-sm font-bold ${
                      test.status.includes('Pass') ? 'text-green-600' : 
                      test.status.includes('Fail') ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      {test.status}
                    </span>
                  </div>

                  {test.httpStatus && (
                    <p className="text-sm text-gray-600 mb-2">
                      HTTP Status: {test.httpStatus}
                    </p>
                  )}

                  {test.applicationCount !== undefined && (
                    <p className="text-sm text-gray-600 mb-2">
                      Applications Found: {test.applicationCount}
                    </p>
                  )}

                  {test.error && (
                    <div className="bg-red-50 border border-red-200 rounded p-3 mb-2">
                      <p className="text-sm text-red-800 font-mono">{test.error}</p>
                    </div>
                  )}

                  {test.details && (
                    <details className="mt-2">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                        View Details
                      </summary>
                      <pre className="mt-2 bg-gray-50 p-4 rounded text-xs overflow-auto">
                        {JSON.stringify(test.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">What to Check:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• If API Endpoint fails, check if route file exists</li>
                <li>• If Valid Application fails with 500 error, database table may not exist</li>
                <li>• If Admin List fails with 401, you need to be logged in as admin</li>
                <li>• Check browser console (F12) for additional errors</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
