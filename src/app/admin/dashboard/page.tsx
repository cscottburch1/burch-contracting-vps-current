import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminSessionFromRequestCookie } from '@/lib/adminAuth';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;
  const session = getAdminSessionFromRequestCookie(sessionCookie);
  return session !== null;
}

export default async function AdminDashboard() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 mb-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Control Center</h1>
            <p className="text-lg text-gray-600">Manage your entire business from one place</p>
          </div>

          {/* Primary Workflow */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-blue-600">⚡</span>
              Primary Workflow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/admin/customers" className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 rounded-xl text-center hover:from-indigo-700 hover:to-indigo-800 transition transform hover:scale-105 shadow-lg">
                <div className="text-4xl mb-3">👥</div>
                <div className="text-xl font-bold mb-2">Customers</div>
                <div className="text-indigo-100 text-sm">Add customer → Create project → Track progress</div>
              </a>
              <a href="/admin/projects" className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-xl text-center hover:from-blue-700 hover:to-blue-800 transition transform hover:scale-105 shadow-lg">
                <div className="text-4xl mb-3">🏗️</div>
                <div className="text-xl font-bold mb-2">Project Tracker</div>
                <div className="text-blue-100 text-sm">View all projects, milestones & progress</div>
              </a>
              <a href="/admin/subcontractors" className="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-6 rounded-xl text-center hover:from-orange-700 hover:to-orange-800 transition transform hover:scale-105 shadow-lg">
                <div className="text-4xl mb-3">🔧</div>
                <div className="text-xl font-bold mb-2">Subcontractors</div>
                <div className="text-orange-100 text-sm">Manage subs, upload docs, assign projects</div>
              </a>
            </div>
          </div>

          {/* Sales & Documents */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-purple-600">📄</span>
              Sales & Documents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <a href="/admin/crm" className="bg-purple-600 text-white p-6 rounded-xl text-center hover:bg-purple-700 transition transform hover:scale-105 shadow-lg">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-lg font-bold">Leads / CRM</div>
              </a>
              <a href="/admin/calendar" className="bg-indigo-600 text-white p-6 rounded-xl text-center hover:bg-indigo-700 transition transform hover:scale-105 shadow-lg">
                <div className="text-3xl mb-2">📅</div>
                <div className="text-lg font-bold">Calendar</div>
              </a>
              <a href="/admin/proposals" className="bg-purple-500 text-white p-6 rounded-xl text-center hover:bg-purple-600 transition transform hover:scale-105 shadow-lg">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-lg font-bold">Proposals</div>
              </a>
              <a href="/admin/proposals/create" className="bg-blue-600 text-white p-6 rounded-xl text-center hover:bg-blue-700 transition transform hover:scale-105 shadow-lg">
                <div className="text-3xl mb-2">✍️</div>
                <div className="text-lg font-bold">New Proposal</div>
              </a>
              <a href="/admin/invoices" className="bg-green-600 text-white p-6 rounded-xl text-center hover:bg-green-700 transition transform hover:scale-105 shadow-lg">
                <div className="text-3xl mb-2">🧾</div>
                <div className="text-lg font-bold">Invoices</div>
              </a>
            </div>
          </div>

          {/* Communication & Settings */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <span className="text-green-600">💬</span>
              Communication & Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/admin/messages" className="bg-green-600 text-white p-6 rounded-xl text-center hover:bg-green-700 transition transform hover:scale-105 shadow-lg">
                <div className="text-3xl mb-2">💬</div>
                <div className="text-lg font-bold">Customer Messages</div>
              </a>
              <a href="/admin/settings" className="bg-gray-600 text-white p-6 rounded-xl text-center hover:bg-gray-700 transition transform hover:scale-105 shadow-lg">
                <div className="text-3xl mb-2">⚙️</div>
                <div className="text-lg font-bold">Team Settings</div>
              </a>
              <a href="/admin/tools" className="bg-teal-600 text-white p-6 rounded-xl text-center hover:bg-teal-700 transition transform hover:scale-105 shadow-lg">
                <div className="text-3xl mb-2">🛠️</div>
                <div className="text-lg font-bold">Admin Tools</div>
              </a>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <h3 className="font-bold text-lg mb-3 text-gray-900">💡 Quick Workflow Tips</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span><strong>Add Customer</strong> → Go to Customers, click &quot;+ Add Customer&quot; with all contact info</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span><strong>Create Project</strong> → Open customer profile, click &quot;+ Add Project&quot; button (auto-links to customer)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span><strong>Track Progress</strong> → Project automatically appears in Project Tracker and Customer Portal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span><strong>Assign Subs</strong> → Upload their docs in Subcontractors section, then assign to projects</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}