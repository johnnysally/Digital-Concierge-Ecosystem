import React from 'react';
import { useProperties } from '../../../hooks/useProperties';
import { Link } from 'react-router-dom';

export default function PropertyListPage() {
  const { data: properties, isLoading, error } = useProperties();

  if (isLoading) return <div className="p-6">Loading properties...</div>;
  if (error) return <div className="p-6 text-red-600">Error loading properties</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">Properties</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Your Properties</h1>
        </div>
        <Link to="/partners/accommodation/properties/new" className="rounded-full bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-700">
          Add Property
        </Link>
      </header>

      <div className="grid gap-4">
        {properties?.map((prop) => (
          <div key={prop.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{prop.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{prop.address?.city}, {prop.address?.region}</p>
                <p className="mt-2 text-sm text-slate-500">{prop.rooms?.length || 0} rooms</p>
              </div>
              <div className="flex gap-2">
                <Link to={`/partners/accommodation/properties/${prop.id}/edit`} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">Edit</Link>
                <button className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${prop.published ? 'bg-green-600' : 'bg-slate-400'}`}>
                  {prop.published ? 'Published' : 'Draft'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!properties || properties.length === 0) && (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
          <p className="text-slate-600">No properties yet. Create your first property to get started.</p>
        </div>
      )}
    </div>
  );
}
