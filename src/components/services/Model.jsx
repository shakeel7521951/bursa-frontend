import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/slices/OrderSlices";
import { toast } from "react-toastify";

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

    // Calculate total price using pricePerSeat from service object
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
      <p className="text-center text-gray-500 text-xl">Service not found.</p>
    );
  }

  const totalPrice = service.pricePerSeat * orderData.seatsBooked;

  return (
    <div className="flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-[550px] bg-white p-6 rounded-lg shadow-lg">
        <div className="relative flex flex-col items-center mb-6">
          <img
            src={service.servicePic}
            alt={service.serviceName}
            className="w-full h-[200px] object-cover rounded-lg"
          />
          <h2 className="absolute bottom-2 bg-black/60 text-white px-4 py-1 rounded text-xl font-semibold">
            {service.serviceName}
          </h2>
        </div>

        <form onSubmit={orderService}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="seatsBooked"
                className="text-sm font-medium text-gray-700"
              >
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
                className="mt-1 w-full border rounded-md px-4 py-2 text-sm"
              />
              <p className="text-md text-gray-500 mt-3">
                Available seats: {service.availableSeats}
              </p>
            </div>

            <div>
              <label
                htmlFor="luggageQuantity"
                className="text-sm font-medium text-gray-700"
              >
                Luggage Quantity (optional)
              </label>
              <input
                type="number"
                id="luggageQuantity"
                name="luggageQuantity"
                min="0"
                value={orderData.luggageQuantity}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 w-full border rounded-md px-4 py-2 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-semibold text-gray-700">Total Price</p>
            <p className="text-xl font-bold text-gray-900">
              ${totalPrice.toFixed(2)}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-full text-base font-bold transition ${
              isLoading
                ? "bg-yellow-300 cursor-not-allowed opacity-70"
                : "bg-[#FFEE02] hover:bg-yellow-400"
            }`}
          >
            {isLoading ? "Booking..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
