import { useState } from 'react';
import {  toast } from 'react-toastify';
import { useCreateTransportRequestMutation } from '../redux/slices/TransportRequestApi';
import { useNavigate } from 'react-router-dom';

const TransportRequestForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    departure: '',
    destination: '',
    date: '',
    passengers: '',
    category: '',
    notes: ''
  });

  const [createTransportRequest, { isLoading }] = useCreateTransportRequestMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createTransportRequest(formData).unwrap();
      navigate("/my-transport-requests")
      toast.success(res.message);
      setFormData({
        departure: '',
        destination: '',
        date: '',
        passengers: '',
        category: '',
        notes: ''
      });
    } catch (err) {
      console.log(err)
      const msg = err?.data?.message || "Failed to submit request. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-[#FECA09] overflow-hidden">

        {/* Header */}
        <div className="text-center bg-black py-6 px-4 rounded-t-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Request Transport</h2>
          <p className="text-[#FECA09] text-sm md:text-base mt-2">
            Fill out the form to request a ride
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-1">Departure City *</label>
              <input
                type="text"
                name="departure"
                value={formData.departure}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#FECA09]"
                placeholder="City of departure"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Destination City *</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#FECA09]"
                placeholder="Destination city"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Date of Travel *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#FECA09]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-1">Passengers *</label>
              <input
                type="number"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#FECA09]"
                placeholder="How many passengers?"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1">Service Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#FECA09]"
            >
              <option value="">Select category</option>
              <option value="Standard">Standard Transport</option>
              <option value="Express">Express Service</option>
              <option value="Pet Transport">Pet Transport</option>
              <option value="Oversized">Oversized Items</option>
              <option value="Luxury">Luxury Vehicle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1">Additional Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="e.g., I have luggage, a pet, or special needs."
              className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#FECA09]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#FECA09] text-black font-bold text-lg py-3 rounded-md transition-transform transform hover:-translate-y-0.5 shadow-lg ${isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-400'}`}
            >
              {isLoading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransportRequestForm;
