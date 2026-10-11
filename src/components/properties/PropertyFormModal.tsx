import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Tag, Image as ImageIcon, Sparkles, Upload, Loader2 } from 'lucide-react';
import { Property, PropertyInput } from '../../types/property';
import { uploadImageFile } from '../../services/uploadService';

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyInput) => Promise<void>;
  initialData?: Property | null;
}

export const PropertyFormModal: React.FC<PropertyFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState<PropertyInput>({
    title: '',
    location: '',
    area: '',
    price: 150000000,
    beds: 4,
    baths: 4,
    type: 'Sale',
    description: '',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    image_labels: ['Exterior View'],
    specs: ['Smart Automation', 'Swimming Pool', 'Solar & Inverter'],
    details: { 'Year Built': '2024', 'Title Document': "Governor's Consent" },
    featured: false,
  });

  const [newImageInput, setNewImageInput] = useState('');
  const [newLabelInput, setNewLabelInput] = useState('');
  const [newSpecInput, setNewSpecInput] = useState('');
  const [detailKeyInput, setDetailKeyInput] = useState('');
  const [detailValInput, setDetailValInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        location: initialData.location,
        area: initialData.area,
        price: initialData.price,
        beds: initialData.beds,
        baths: initialData.baths,
        type: initialData.type,
        description: initialData.description,
        images: initialData.images || [],
        image_labels: initialData.image_labels || [],
        specs: initialData.specs || [],
        details: initialData.details || {},
        featured: initialData.featured || false,
      });
    } else {
      setFormData({
        title: '',
        location: '',
        area: '',
        price: 250000000,
        beds: 4,
        baths: 5,
        type: 'Sale',
        description: '',
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
        image_labels: ['Exterior View'],
        specs: ['Smart Automation', 'Solar Backup', '24/7 Security'],
        details: { 'Year Built': '2024' },
        featured: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (!newImageInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newImageInput.trim()],
      image_labels: [...(prev.image_labels || []), newLabelInput.trim() || 'Room View'],
    }));
    setNewImageInput('');
    setNewLabelInput('');
  };

  const handleDeviceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedUrls: string[] = [];
      const labels: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = await uploadImageFile(file);
        uploadedUrls.push(url);

        // Friendly label from input or file name
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        labels.push(newLabelInput.trim() || cleanName || 'Room View');
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
        image_labels: [...(prev.image_labels || []), ...labels],
      }));
      setNewLabelInput('');
    } catch (err: any) {
      console.error('[handleDeviceUpload] Upload error:', err);
      setUploadError(err.message || 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      image_labels: (prev.image_labels || []).filter((_, i) => i !== index),
    }));
  };

  const handleAddSpec = () => {
    if (!newSpecInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      specs: [...prev.specs, newSpecInput.trim()],
    }));
    setNewSpecInput('');
  };

  const handleRemoveSpec = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  };

  const handleAddDetail = () => {
    if (!detailKeyInput.trim() || !detailValInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [detailKeyInput.trim()]: detailValInput.trim(),
      },
    }));
    setDetailKeyInput('');
    setDetailValInput('');
  };

  const handleRemoveDetail = (key: string) => {
    setFormData((prev) => {
      const updated = { ...prev.details };
      delete updated[key];
      return { ...prev, details: updated };
    });
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.description) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
            <h3 className="font-bold text-slate-100 text-lg">
              {initialData ? 'Edit Property Listing' : 'Add New Property Listing'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="property-form" onSubmit={handleSubmitForm} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-slate-400 font-medium mb-1">Property Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Magnificent 5-Bedroom Smart Villa"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Lekki Phase 1, Lagos"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Area / Neighborhood *</label>
              <input
                type="text"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="e.g. Lekki"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Price (₦ Naira) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              />
              <span className="text-[10px] text-gold-400/80 mt-1 block">
                Formatted: ₦{(formData.price || 0).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Bedrooms</label>
                <input
                  type="number"
                  min="0"
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-medium mb-1">Bathrooms</label>
                <input
                  type="number"
                  min="0"
                  value={formData.baths}
                  onChange={(e) => setFormData({ ...formData, baths: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Listing Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Sale' | 'Rent' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
              >
                <option value="Sale">For Sale</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-gold-500 rounded cursor-pointer"
              />
              <label htmlFor="featured" className="text-slate-200 font-medium cursor-pointer">
                Feature on Homepage Carousel
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the property features, architectural elegance, location benefits..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-slate-100 focus:outline-none focus:border-gold-500/50"
            />
          </div>

          {/* DYNAMIC IMAGE & LABEL MANAGER */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gold-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Image Gallery & Room Tags
              </span>
              <span className="text-[10px] text-slate-500">Upload from device or enter URL</span>
            </div>

            {/* Hidden device file input (laptop / phone) */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleDeviceUpload}
              className="hidden"
            />

            {/* List of existing images */}
            {formData.images.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {formData.images.map((imgUrl, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-2">
                    <img src={imgUrl} alt={`img-${idx}`} className="w-12 h-10 object-cover rounded border border-slate-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-400 truncate">{imgUrl}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded border border-gold-500/20">
                        <Tag className="w-2.5 h-2.5" />
                        {formData.image_labels?.[idx] || 'Room View'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 border border-dashed border-slate-800 rounded-lg text-slate-500 text-xs">
                No images added yet. Upload from device or add a URL below.
              </div>
            )}

            {uploadError && (
              <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
                {uploadError}
              </div>
            )}

            {/* Device Upload Section */}
            <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto flex-1 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 transition-all shadow-md text-xs disabled:opacity-50 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Uploading from Device...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-slate-950" />
                      <span>Upload from Device (Laptop / Phone)</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 text-center sm:text-left">
                Supports JPG, PNG, WEBP from your computer files, phone photo library, or camera.
              </p>
            </div>

            {/* Alternative: Add Image by URL */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="block text-[10px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">
                Or Add via Web URL
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="url"
                  value={newImageInput}
                  onChange={(e) => setNewImageInput(e.target.value)}
                  placeholder="Image URL (https://...)"
                  className="sm:col-span-6 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs"
                />
                <input
                  type="text"
                  value={newLabelInput}
                  onChange={(e) => setNewLabelInput(e.target.value)}
                  placeholder="Room Tag (e.g. Master Bedroom)"
                  className="sm:col-span-4 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="sm:col-span-2 bg-slate-800 hover:bg-slate-700 text-gold-400 font-semibold rounded-lg px-3 py-1.5 flex items-center justify-center gap-1 transition-colors text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add URL
                </button>
              </div>
            </div>
          </div>

          {/* Key Specs */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Key Specifications & Amenities</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.specs.map((spec, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full text-xs border border-slate-700">
                  {spec}
                  <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-slate-400 hover:text-rose-400">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecInput}
                onChange={(e) => setNewSpecInput(e.target.value)}
                placeholder="Add spec (e.g. 3-Car Garage)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-slate-100"
              />
              <button
                type="button"
                onClick={handleAddSpec}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-xl font-medium"
              >
                Add Spec
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="property-form"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold px-5 py-2 rounded-xl shadow-lg shadow-gold-500/20 transition-all"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Update Property' : 'Publish Property'}
          </button>
        </div>
      </div>
    </div>
  );
};
