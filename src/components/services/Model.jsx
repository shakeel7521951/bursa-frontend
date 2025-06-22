import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/slices/OrderSlices";
import { toast } from "react-toastify";
import { 
  FaChair, FaSuitcase, FaArrowRight, FaUser, 
  FaBox, FaCar, FaTruck, FaHome, FaDog,
  FaWeightHanging, FaCouch, FaPaw,
  FaMapMarkerAlt, FaCalendarAlt, FaRoute,
  FaInfoCircle
} from "react-icons/fa";

const BookingModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const service = location.state?.service;
  
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
  // Initialize form state based on service category
  const initialFormState = {
    passenger: { seatsBooked: 1, luggageQuantity: 0 },
    parcel: { quantity: 1, weight: 0 },
    car_towing: { vehicleDetails: '', specialRequirements: '' },
    vehicle_trailer: { vehicleType: '', trailerRequirements: '' },
    furniture: { itemCount: 1, dimensions: '', fragileItems: false },
    animal: { animalCount: 1, specialNeeds: '', cageRequired: false }
  };

  const [orderData, setOrderData] = useState(
    initialFormState[service?.serviceCategory] || { seatsBooked: 1 }
  );

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : 
                 e.target.type === 'number' ? Number(e.target.value) : 
                 e.target.value;
    setOrderData(prev => ({ ...prev, [e.target.name]: value }));
  };

  const getCategoryIcon = () => {
    const icons = {
      passenger: <FaUser className="text-yellow-500 mr-2" />,
      parcel: <FaBox className="text-yellow-500 mr-2" />,
      car_towing: <FaCar className="text-yellow-500 mr-2" />,
      vehicle_trailer: <FaTruck className="text-yellow-500 mr-2" />,
      furniture: <FaCouch className="text-yellow-500 mr-2" />,
      animal: <FaPaw className="text-yellow-500 mr-2" />
    };
    return icons[service?.serviceCategory] || <FaUser className="text-yellow-500 mr-2" />;
  };

  // Function to render route cities
  const renderRouteCities = () => {
    if (!service?.routeCities || service.routeCities.length === 0) return null;
    
    return (
      <div className="mt-4">
        <div className="flex items-center text-gray-700 mb-2">
          <FaRoute className="mr-2 text-yellow-600" />
          <span className="font-medium">Orașe pe traseu:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {service.routeCities.map((city, index) => (
            <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
              <FaMapMarkerAlt className="mr-1 text-yellow-500" />
              {city}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Function to render availability days
  const renderAvailabilityDays = () => {
    if (!service?.availabilityDays) return null;
    
    return (
      <div className="mt-4">
        <div className="flex items-center text-gray-700 mb-2">
          <FaCalendarAlt className="mr-2 text-yellow-600" />
          <span className="font-medium">Zile disponibile:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {service.availabilityDays.italy && (
            <div>
              <p className="text-sm font-medium">Italia:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {service.availabilityDays.italy.map((day, index) => (
                  <span key={`italy-${index}`} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
          {service.availabilityDays.romania && (
            <div>
              <p className="text-sm font-medium">România:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {service.availabilityDays.romania.map((day, index) => (
                  <span key={`romania-${index}`} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                    {day}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBookingFields = () => {
    switch(service?.serviceCategory) {
      case 'passenger':
        return (
          <>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaChair className="mr-2 text-yellow-600" />
                Locuri de rezervat*
              </label>
              <input
                type="number"
                name="seatsBooked"
                min="1"
                max={service.availableSeats || 1}
                required
                value={orderData.seatsBooked}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                {service.availableSeats || 0} locuri disponibile
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaSuitcase className="mr-2 text-yellow-600" />
                Număr bagaje
              </label>
              <input
                type="number"
                name="luggageQuantity"
                min="0"
                value={orderData.luggageQuantity}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Maxim 2 bucăți per loc
              </p>
            </div>
          </>
        );

      case 'parcel':
        return (
          <>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaBox className="mr-2 text-yellow-600" />
                Număr de colete*
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                required
                value={orderData.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaWeightHanging className="mr-2 text-yellow-600" />
                Greutate totală (kg)
              </label>
              <input
                type="number"
                name="weight"
                min="0"
                step="0.1"
                value={orderData.weight}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                Capacitate maximă: {service.parcelLoadCapacity} kg
              </p>
            </div>
          </>
        );

      case 'car_towing':
        return (
          <>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaCar className="mr-2 text-yellow-600" />
                Detalii vehicul*
              </label>
              <input
                type="text"
                name="vehicleDetails"
                placeholder="Marca, model și stare"
                required
                value={orderData.vehicleDetails}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Cerințe speciale
              </label>
              <textarea
                name="specialRequirements"
                placeholder="Orice cerințe speciale de remorcare"
                value={orderData.specialRequirements}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                rows="3"
              />
            </div>
          </>
        );

      case 'vehicle_trailer':
        return (
          <>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaTruck className="mr-2 text-yellow-600" />
                Tip vehicul*
              </label>
              <select
                name="vehicleType"
                value={orderData.vehicleType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              >
                <option value="">Selectați tipul vehiculului</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="truck">Camion</option>
                <option value="van">Dubă</option>
              </select>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Cerințe remorcă
              </label>
              <select
                name="trailerRequirements"
                value={orderData.trailerRequirements}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="">Selectați cerințele</option>
                <option value="flatbed">Platformă</option>
                <option value="enclosed">Închisă</option>
                <option value="lowboy">Lowboy</option>
              </select>
            </div>
          </>
        );

      case 'furniture':
        return (
          <>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaCouch className="mr-2 text-yellow-600" />
                Număr de articole*
              </label>
              <input
                type="number"
                name="itemCount"
                min="1"
                required
                value={orderData.itemCount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Dimensiuni aproximative
              </label>
              <input
                type="text"
                name="dimensions"
                placeholder="ex. 2m x 1.5m x 0.5m"
                value={orderData.dimensions}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 col-span-2 flex items-center">
              <input
                type="checkbox"
                name="fragileItems"
                checked={orderData.fragileItems}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Conține obiecte fragile
              </label>
            </div>
          </>
        );

      case 'animal':
        return (
          <>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <FaPaw className="mr-2 text-yellow-600" />
                Număr de animale*
              </label>
              <input
                type="number"
                name="animalCount"
                min="1"
                required
                value={orderData.animalCount}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Tip animal
              </label>
              <select
                name="animalType"
                value={orderData.animalType || service.animalType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              >
                <option value="dog">Câine</option>
                <option value="cat">Pisică</option>
                <option value="bird">Pasăre</option>
                <option value="livestock">Animal de fermă</option>
                <option value="other">Altul</option>
              </select>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 col-span-2">
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Necesități speciale
              </label>
              <textarea
                name="specialNeeds"
                placeholder="Orice cerințe speciale pentru animale"
                value={orderData.specialNeeds}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                rows="2"
              />
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 col-span-2 flex items-center">
              <input
                type="checkbox"
                name="cageRequired"
                checked={orderData.cageRequired}
                onChange={handleChange}
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Este necesară cușcă/transportor
              </label>
            </div>
          </>
        );

      default:
        return (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 col-span-2">
            <p className="text-gray-700">Vă rugăm să ne contactați direct pentru rezervarea acestui serviciu.</p>
          </div>
        );
    }
  };

  const calculateTotalPrice = () => {
    switch(service?.serviceCategory) {
      case 'passenger':
        return (service.price || 0) * (orderData.seatsBooked || 1);
      case 'parcel':
        return (service.price || 0) * (orderData.quantity || 1);
      case 'furniture':
        return (service.price || 0) * (orderData.itemCount || 1);
      case 'animal':
        return (service.price || 0) * (orderData.animalCount || 1);
      default:
        return service.price || 0;
    }
  };

  const orderService = async (e) => {
    e.preventDefault();
    if (!service) return;

    // Category-specific validation
    switch(service.serviceCategory) {
      case 'passenger':
        if (orderData.seatsBooked < 1) {
          toast.error("Vă rugăm să rezervați cel puțin 1 loc");
          return;
        }
        if (orderData.seatsBooked > service.availableSeats) {
          toast.error(`Doar ${service.availableSeats} locuri disponibile`);
          return;
        }
        break;
      case 'parcel':
        if (orderData.quantity < 1) {
          toast.error("Vă rugăm să rezervați cel puțin 1 colet");
          return;
        }
        if (orderData.weight > service.parcelLoadCapacity) {
          toast.error(`Capacitatea maximă este de ${service.parcelLoadCapacity} kg`);
          return;
        }
        break;
      case 'furniture':
        if (orderData.itemCount < 1) {
          toast.error("Vă rugăm să specificați cel puțin 1 articol");
          return;
        }
        break;
      case 'animal':
        if (orderData.animalCount < 1) {
          toast.error("Vă rugăm să specificați cel puțin 1 animal");
          return;
        }
        break;
    }

    const totalPrice = calculateTotalPrice();

    try {
      const response = await createOrder({
        serviceId,
        data: {
          ...orderData,
          totalPrice,
          serviceCategory: service.serviceCategory,
          serviceName: service.serviceName,
          transporter: service.transporter?._id
        }
      });

      if (response.error) {
        toast.error(response.error.data?.message || "Rezervarea a eșuat");
      } else {
        toast.success("Rezervare efectuată cu succes!");
        navigate("/my-orders");
      }
    } catch (error) {
      toast.error("A apărut o eroare neașteptată!");
    }
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-gray-500">Serviciul nu a fost găsit.</p>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const displayPrice = (price) => `$${(price || 0).toFixed(2)}`;

  const getPriceDescription = () => {
    switch(service.serviceCategory) {
      case 'passenger':
        return `${orderData.seatsBooked} loc${orderData.seatsBooked !== 1 ? "uri" : ""} × ${displayPrice(service.price)}`;
      case 'parcel':
        return `${orderData.quantity} colet${orderData.quantity !== 1 ? "e" : ""} × ${displayPrice(service.price)}`;
      case 'furniture':
        return `${orderData.itemCount} articol${orderData.itemCount !== 1 ? "e" : ""} × ${displayPrice(service.price)}`;
      case 'animal':
        return `${orderData.animalCount} animal${orderData.animalCount !== 1 ? "e" : ""} × ${displayPrice(service.price)}`;
      default:
        return displayPrice(service.price);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-black text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Finalizați rezervarea</h1>
              <div className="flex items-center mt-2 text-yellow-400">
                <span className="font-medium">{service.destinationFrom}</span>
                <FaArrowRight className="mx-2" />
                <span className="font-medium">{service.destinationTo}</span>
              </div>
            </div>
            <div className="flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
              {getCategoryIcon()}
              <span className="capitalize">
                {service.serviceCategory?.replace('_', ' ') || 'serviciu'}
              </span>
            </div>
          </div>
        </div>

        {/* Service Overview */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={service.servicePic}
                alt={service.serviceName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300?text=Transport+Image";
                }}
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {service.serviceName || 'Serviciu fără nume'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium">Plecare</p>
                  <p>
                    {service.travelDate ? new Date(service.travelDate).toLocaleDateString('ro-RO', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'} la {service.departureTime || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Sosire</p>
                  <p>
                    {service.arrivalDate ? new Date(service.arrivalDate).toLocaleDateString('ro-RO', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Transportator</p>
                  <p>{service.transporter?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Disponibilitate</p>
                  <p>
                    {service.serviceCategory === 'parcel' 
                      ? `${service.parcelLoadCapacity} kg capacitate` 
                      : service.serviceCategory === 'passenger'
                      ? `${service.availableSeats || 0} locuri`
                      : service.serviceCategory === 'furniture'
                      ? 'Preț la cerere'
                      : service.serviceCategory === 'animal'
                      ? 'Preț la cerere'
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Display route cities */}
              {renderRouteCities()}

              {/* Display availability days */}
              {renderAvailabilityDays()}

              {/* Additional service information */}
              {service.animalType && (
                <div className="mt-4">
                  <div className="flex items-center text-gray-700 mb-2">
                    <FaInfoCircle className="mr-2 text-yellow-600" />
                    <span className="font-medium">Tip animal:</span>
                  </div>
                  <p className="capitalize">{service.animalType}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={orderService} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {renderBookingFields()}
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Total</h3>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">
                  {displayPrice(totalPrice)}
                </p>
                <p className="text-sm text-gray-500">
                  {getPriceDescription()}
                </p>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="mt-1 mr-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Sunt de acord cu Termenii și Condițiile și înțeleg că rezervările nu sunt rambursabile.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors flex-1"
            >
              Înapoi
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg font-bold text-black transition-colors flex-1 ${
                isLoading
                  ? "bg-yellow-300 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 shadow-md"
              }`}
            >
              {isLoading ? "Se procesează..." : "Confirmă rezervarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;