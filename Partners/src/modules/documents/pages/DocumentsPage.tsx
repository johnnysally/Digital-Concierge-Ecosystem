import React from 'react';

const docs = [
  { id: 'd1', name: 'License.pdf', uploaded: '2026-06-01' },
  { id: 'd2', name: 'Insurance.pdf', uploaded: '2026-05-12' },
];

export default function DocumentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Documents</h1>
      <p className="text-sm text-slate-600 mt-1">Upload and manage compliance documents.</p>

      <div className="mt-6">
        <div className="mb-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Upload Document</button>
        </div>
        <div className="bg-white rounded shadow">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Uploaded</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-t">
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">{d.uploaded}</td>
                  <td className="p-3">
                    <button className="px-3 py-1 bg-gray-100 rounded">Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
