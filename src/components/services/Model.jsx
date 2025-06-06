import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/slices/OrderSlices";
import { toast } from "react-toastify";
import { FaChair, FaSuitcase, FaArrowRight } from "react-icons/fa";

const BookingModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const service = location.state?.selectedService;

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [orderData, setOrderData] = useState({
    seatsBooked: 1,
    luggageQuantity: 0,
  });

  const handleChange = (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;
    setOrderData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const orderService = async (e) => {
    e.preventDefault();
    if (!service) return;

    if (orderData.seatsBooked < 1) {
      toast.error("Please book at least 1 seat");
      return;
    }

    if (orderData.seatsBooked > service.availableSeats) {
      toast.error("Not enough seats available");
      return;
    }

    const totalPrice = service.pricePerSeat * orderData.seatsBooked;

    try {
      const response = await createOrder({
        serviceId: serviceId,
        data: {
          seatsBooked: orderData.seatsBooked,
          luggageQuantity: orderData.luggageQuantity,
          totalPrice,
        },
      });

      if (response.error) {
        toast.error(response.error.data?.message || "Booking failed", {
          position: "top-center",
        });
      } else {
        toast.success("Booking successful!", { position: "top-center" });
        navigate("/my-orders");
      }
    } catch (error) {
      toast.error("Unexpected error occurred!", { position: "top-center" });
    }
  };

  if (!service) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-xl text-gray-500">Service not found.</p>
      </div>
    );
  }

  const totalPrice = service.pricePerSeat * orderData.seatsBooked;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-black text-white p-6">
          <h1 className="text-2xl font-bold">Complete Your Booking</h1>
          <div className="flex items-center mt-2 text-yellow-400">
            <span className="font-medium">{service.destinationFrom}</span>
            <FaArrowRight className="mx-2" />
            <span className="font-medium">{service.destinationTo}</span>
          </div>
        </div>

        {/* Service Overview */}
        <div className="relative p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 h-48 overflow-hidden rounded-lg">
              <img
                src={service.servicePic}
                alt={service.serviceName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400x300?text=Bus+Image";
                }}
              />
            </div>
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {service.serviceName}
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium">Departure</p>
                  <p>
                    {new Date(service.travelDate).toLocaleDateString()} at{" "}
                    {service.departureTime}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Arrival</p>
                  <p>{new Date(service.arrivalDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="font-medium">Transporter</p>
                  <p>{service.transporter?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Price per seat</p>
                  <p>${service.pricePerSeat}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={orderService} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label
                htmlFor="seatsBooked"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <FaChair className="mr-2 text-yellow-600" />
                Seats to Book*
              </label>
              <input
                type="number"
                id="seatsBooked"
                name="seatsBooked"
                min="1"
                max={service.availableSeats}
                required
                value={orderData.seatsBooked}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-2">
                {service.availableSeats} seats available
              </p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <label
                htmlFor="luggageQuantity"
                className="flex items-center text-sm font-medium text-gray-700 mb-2"
              >
                <FaSuitcase className="mr-2 text-yellow-600" />
                Luggage Quantity
              </label>
              <input
                type="number"
                id="luggageQuantity"
                name="luggageQuantity"
                min="0"
                value={orderData.luggageQuantity}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Total</h3>
              <div className="text-right">
                <p className="text-2xl font-bold text-yellow-600">
                  ${totalPrice.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {orderData.seatsBooked} seat{orderData.seatsBooked !== 1 && "s"} × ${service.pricePerSeat}
                </p>
              </div>
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
              Back
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
              {isLoading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;