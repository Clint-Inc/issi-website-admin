import React, { useState } from 'react';
import { Plus, Search, Building2, Edit3, Trash2, Tag, Star, Eye, Layers } from 'lucide-react';
import { Property, PropertyInput } from '../types/property';
import { PropertyFormModal } from '../components/properties/PropertyFormModal';

interface PropertiesPageProps {
  properties: Property[];
  searchQuery: string;
  onCreateProperty: (input: PropertyInput) => Promise<void>;
  onUpdateProperty: (id: string, input: Partial<PropertyInput>) => Promise<void>;
  onDeleteProperty: (id: string) => Promise<void>;
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  properties,
  searchQuery,
  onCreateProperty,
  onUpdateProperty,
  onDeleteProperty,
}) => {
  const [filterType, setFilterType] = useState<'All' | 'Sale' | 'Rent' | 'Featured'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.area.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'Sale') return p.type === 'Sale';
    if (filterType === 'Rent') return p.type === 'Rent';
    if (filterType === 'Featured') return p.featured;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingProperty(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (data: PropertyInput) => {
    if (editingProperty) {
      await onUpdateProperty(editingProperty.id, data);
    } else {
      await onCreateProperty(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {(['All', 'Sale', 'Rent', 'Featured'] as const).map((ft) => (
            <button
              key={ft}
              onClick={() => setFilterType(ft)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filterType === ft
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {ft === 'Featured' ? '⭐ Featured' : ft}
            </button>
          ))}
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                viewMode === 'grid' ? 'bg-slate-800 text-gold-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                viewMode === 'table' ? 'bg-slate-800 text-gold-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-lg shadow-gold-500/20 text-xs flex items-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </button>
        </div>
      </div>

      {/* PROPERTY LISTINGS DISPLAY */}
      {filteredProperties.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No properties found</h3>
          <p className="text-xs text-slate-400">Try adjusting your search query or filter tags.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition-all duration-300"
            >
              {/* Image & Badges */}
              <div className="relative h-48 bg-slate-950 overflow-hidden">
                <img
                  src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full shadow-lg ${
                      prop.type === 'Sale'
                        ? 'bg-gold-500 text-slate-950'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {prop.type}
                  </span>
                  {prop.featured && (
                    <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/90 text-slate-950 rounded-full shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-slate-950" /> Featured
                    </span>
                  )}
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-800">
                  <span className="text-sm font-black text-gold-400">
                    ₦{prop.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <h3 className="font-bold text-slate-100 text-sm line-clamp-1 group-hover:text-gold-400 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{prop.location}</p>
                </div>

                {/* Specs Pill Summary */}
                <div className="flex items-center gap-3 text-xs text-slate-400 border-y border-slate-800/80 py-2.5">
                  <span>🛏️ {prop.beds} Beds</span>
                  <span>&bull;</span>
                  <span>🛁 {prop.baths} Baths</span>
                  <span>&bull;</span>
                  <span className="truncate">{prop.area}</span>
                </div>

                {/* Image Tags Preview */}
                {prop.image_labels && prop.image_labels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {prop.image_labels.map((lbl, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-medium bg-slate-800 text-gold-400 px-2 py-0.5 rounded border border-slate-700/60"
                      >
                        🏷️ {lbl}
                      </span>
                    ))}
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleOpenEdit(prop)}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-gold-400 font-semibold transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Listing</span>
                  </button>

                  <button
                    onClick={() => onDeleteProperty(prop.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Property</th>
                <th className="p-4">Location</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price (₦)</th>
                <th className="p-4">Bed / Bath</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={prop.images[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'}
                      alt={prop.title}
                      className="w-12 h-10 object-cover rounded-lg border border-slate-700 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-100">{prop.title}</p>
                      <p className="text-[10px] text-slate-500">{prop.area}</p>
                    </div>
                  </td>
                  <td className="p-4">{prop.location}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        prop.type === 'Sale' ? 'bg-gold-500/20 text-gold-400' : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {prop.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-gold-400">₦{prop.price.toLocaleString()}</td>
                  <td className="p-4">
                    {prop.beds} beds &bull; {prop.baths} baths
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 text-slate-400 hover:text-gold-400 hover:bg-slate-800 rounded-lg"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProperty(prop.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Property Form Modal */}
      <PropertyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingProperty}
      />
    </div>
  );
};
