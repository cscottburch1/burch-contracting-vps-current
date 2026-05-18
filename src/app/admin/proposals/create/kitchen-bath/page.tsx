'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Download, Mail, Save } from 'lucide-react';

interface LineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// Standard construction schedule of values categories for kitchen/bath remodeling
const CATEGORIES = [
  'Demolition & Preparation',
  'Rough Plumbing',
  'Rough Electrical',
  'Framing & Structural',
  'Drywall & Finishing',
  'Flooring',
  'Tile Work',
  'Cabinetry',
  'Countertops',
  'Plumbing Fixtures',
  'Electrical Fixtures & Lighting',
  'HVAC',
  'Painting',
  'Trim & Millwork',
  'Hardware & Accessories',
  'Appliances',
  'Cleanup & Disposal',
  'Project Management',
  'Permits & Inspections',
  'Contingency',
  'Overhead & Profit'
];

const UNITS = ['ea', 'sf', 'lf', 'lot', 'ls', 'hr', 'day'];

export default function KitchenBathProposalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [proposalDate, setProposalDate] = useState(new Date().toISOString().split('T')[0]);
  const [expirationDate, setExpirationDate] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', category: '', description: '', quantity: 1, unit: 'ea', unitPrice: 0, total: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [taxRate, setTaxRate] = useState(7.0);

  useEffect(() => {
    fetchCustomers();
    // Set default expiration date to 30 days from now
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 30);
    setExpirationDate(expDate.toISOString().split('T')[0]);
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const addLineItem = () => {
    const newId = (Math.max(...lineItems.map(item => parseInt(item.id))) + 1).toString();
    setLineItems([...lineItems, {
      id: newId,
      category: '',
      description: '',
      quantity: 1,
      unit: 'ea',
      unitPrice: 0,
      total: 0
    }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const generateProposalNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `KB-${year}${month}-${random}`;
  };

  const handleSaveProposal = async (status: 'draft' | 'sent') => {
    if (!selectedCustomerId) {
      toast.error('Please select a customer');
      return;
    }

    if (lineItems.some(item => !item.category || !item.description)) {
      toast.error('Please fill in all line item categories and descriptions');
      return;
    }

    setLoading(true);
    try {
      const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
      const proposalNumber = generateProposalNumber();
      
      const proposalData = {
        proposalNumber,
        customerId: selectedCustomerId,
        customerName: selectedCustomer?.name || '',
        customerEmail: selectedCustomer?.email || '',
        customerPhone: selectedCustomer?.phone || '',
        customerAddress: selectedCustomer?.address || '',
        proposalDate,
        expirationDate,
        items: lineItems,
        laborSubtotal: 0,
        serviceCharge: 0,
        subtotal: calculateSubtotal(),
        taxRate,
        tax: calculateTax(),
        total: calculateTotal(),
        notes,
        proposalType: 'Kitchen/Bath Remodeling',
        status
      };

      const res = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });

      if (!res.ok) {
        throw new Error('Failed to save proposal');
      }

      const data = await res.json();
      toast.success(`Proposal ${proposalNumber} saved successfully!`);
      router.push(`/admin/proposals/${data.proposalId}`);
    } catch (err) {
      console.error('Error saving proposal:', err);
      toast.error('Failed to save proposal');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailPDF = async () => {
    if (!selectedCustomerId) {
      toast.error('Please save the proposal first');
      return;
    }
    toast.info('Email PDF functionality will be implemented after saving the proposal');
  };

  const handleExportExcel = () => {
    const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
    
    // Create CSV content
    let csv = 'Burch Contracting - Kitchen/Bath Remodeling Proposal\n\n';
    csv += `Customer: ${selectedCustomer?.name || ''}\n`;
    csv += `Email: ${selectedCustomer?.email || ''}\n`;
    csv += `Phone: ${selectedCustomer?.phone || ''}\n`;
    csv += `Address: ${selectedCustomer?.address || ''}\n\n`;
    csv += `Proposal Date: ${proposalDate}\n`;
    csv += `Expiration Date: ${expirationDate}\n\n`;
    
    csv += 'Category,Description,Quantity,Unit,Unit Price,Total\n';
    
    lineItems.forEach(item => {
      csv += `"${item.category}","${item.description}",${item.quantity},${item.unit},${item.unitPrice.toFixed(2)},${item.total.toFixed(2)}\n`;
    });
    
    csv += `\nSubtotal,,,,,$${calculateSubtotal().toFixed(2)}\n`;
    csv += `Tax (${taxRate}%),,,,,$${calculateTax().toFixed(2)}\n`;
    csv += `Total,,,,,$${calculateTotal().toFixed(2)}\n\n`;
    csv += `Notes:\n"${notes}"\n`;

    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Kitchen-Bath-Proposal-${proposalDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Kitchen/Bath Remodeling Proposal</h1>
              <p className="text-gray-600">Create a detailed schedule of values with line items</p>
            </div>
            <button
              onClick={() => router.push('/admin/proposals/create')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {/* Customer Selection & Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select Customer *</label>
              <select
                value={selectedCustomerId || ''}
                onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Select Customer --</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Proposal Date *</label>
              <input
                type="date"
                value={proposalDate}
                onChange={(e) => setProposalDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Expiration Date *</label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2.5"
                required
              />
            </div>
          </div>

          {/* Customer Info Display */}
          {selectedCustomer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Customer Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <p className="font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-medium">{selectedCustomer.phone}</p>
                </div>
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="font-medium">{selectedCustomer.address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Line Items Table - Excel Style */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Schedule of Values</h3>
              <button
                onClick={addLineItem}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                + Add Line Item
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full bg-white" style={{ minWidth: '1200px' }}>
                <thead className="bg-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300" style={{ width: '5%' }}>
                      #
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300" style={{ width: '20%' }}>
                      Category
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300" style={{ width: '30%' }}>
                      Description
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300" style={{ width: '10%' }}>
                      Quantity
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300" style={{ width: '8%' }}>
                      Unit
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300" style={{ width: '12%' }}>
                      Unit Price
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider border-r border-gray-300" style={{ width: '12%' }}>
                      Total
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider" style={{ width: '5%' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lineItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-r border-gray-200 text-center text-sm font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <select
                          value={item.category}
                          onChange={(e) => updateLineItem(item.id, 'category', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select...</option>
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter description..."
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <select
                          value={item.unit}
                          onChange={(e) => updateLineItem(item.id, 'unit', e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-500"
                        >
                          {UNITS.map(unit => (
                            <option key={unit} value={unit}>{unit}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200">
                        <div className="flex items-center">
                          <span className="text-sm mr-1">$</span>
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:ring-2 focus:ring-blue-500"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </td>
                      <td className="px-3 py-2 border-r border-gray-200 text-right font-semibold text-sm">
                        ${item.total.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeLineItem(item.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-lg"
                          disabled={lineItems.length === 1}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t-2 border-gray-300">
                  <tr>
                    <td colSpan={6} className="px-3 py-3 text-right font-bold text-gray-700">
                      Subtotal:
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-lg">
                      ${calculateSubtotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={6} className="px-3 py-2 text-right font-bold text-gray-700">
                      <div className="flex items-center justify-end gap-2">
                        <span>Tax:</span>
                        <input
                          type="number"
                          value={taxRate}
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          className="w-16 border border-gray-300 rounded px-2 py-1 text-sm text-right"
                          min="0"
                          step="0.1"
                        />
                        <span>%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-lg">
                      ${calculateTax().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td colSpan={6} className="px-3 py-3 text-right font-bold text-gray-900 text-lg">
                      TOTAL:
                    </td>
                    <td className="px-3 py-3 text-right font-bold text-xl text-blue-600">
                      ${calculateTotal().toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes / Terms & Conditions</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3 h-32 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter any additional notes, terms, or conditions..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex gap-3">
              <button
                onClick={handleExportExcel}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold"
              >
                <Download size={20} />
                Export to Excel (CSV)
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleSaveProposal('draft')}
                disabled={loading}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition flex items-center gap-2 font-semibold disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                onClick={() => handleSaveProposal('sent')}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold disabled:opacity-50"
              >
                <Mail size={20} />
                {loading ? 'Saving...' : 'Save & Mark as Sent'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">ℹ️</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">How to use this proposal template:</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Select a customer from your CRM database</li>
                <li>• Add line items using the standard construction categories</li>
                <li>• Enter quantities, units, and unit prices - totals calculate automatically</li>
                <li>• Export to Excel/CSV for use in spreadsheet applications</li>
                <li>• Save as draft to continue editing later, or mark as sent to notify the customer</li>
                <li>• After saving, you can email a PDF version to the customer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
