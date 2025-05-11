import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUpdateOrderMutation } from "../redux/slices/OrderSlices";

const UpdateOrder = () => {
  const location = useLocation();
  const order = location.state?.order;
  const { carId } = useParams();
  const navigate = useNavigate();
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  const [user, setUser] = useState({
    pickupDate: "",
    pickupTime: "",
    pickupLocation: "",
    dropoffLocation: "",
  });

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    if (order) {
      setUser({
        pickupDate: order.pickupDate?.split("T")[0] || "",
        pickupTime: order.pickupTime
          ? new Date(order.pickupTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
          : "",
        pickupLocation: order.pickupLocation || "",
        dropoffLocation: order.dropoffLocation || "",
      });
    }
  }, [order]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const orderCar = async (e) => {
    e.preventDefault();
    if (!order?._id) {
      toast.error("Order ID is missing!");
      return;
    }

    // Combine date and time into a single datetime object
    const pickupDateTime = new Date(`${user.pickupDate}T${user.pickupTime}`);
    const currentDateTime = new Date();

    // Validate if the selected date and time are in the future
    if (pickupDateTime <= currentDateTime) {
      toast.error("Please select a future date and time.");
      return;
    }

    // Convert to UTC before saving
    const pickupTimeUTC = pickupDateTime.toISOString();

    try {
      const response = await updateOrder({
        orderId: order._id,
        data: { ...user, pickupTime: pickupTimeUTC },
      }).unwrap();
      toast.success(response.message, { position: "top-center" });
      navigate("/my-orders");
    } catch (error) {
      toast.error(error.data?.message || "Failed to update order!");
    }
  };

  if (!order) {
    return <div className="text-center text-red-600 text-lg">Order details not found!</div>;
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white p-6 rounded-lg shadow-lg">
        <div key={carId} className="relative flex flex-col justify-center items-center gap-4 mb-4">
          <h1 className="absolute text-3xl bottom-0 pb-4 font-semibold text-white">
            {order?.serviceId?.serviceName}
          </h1>
          <img
            src={order?.serviceId?.servicePic}
            alt={order?.serviceId?.serviceName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <form onSubmit={orderCar}>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label htmlFor="pickupDate" className="mb-3 block text-base font-medium text-[#07074D]">
                  Date
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={user.pickupDate}
                  onChange={handleChange}
                  id="pickupDate"
                  min={getTodayDate()}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>
            </div>
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label htmlFor="pickupTime" className="mb-3 block text-base font-medium text-[#07074D]">
                  Time
                </label>
                <input
                  type="time"
                  name="pickupTime"
                  value={user.pickupTime}
                  onChange={handleChange}
                  id="pickupTime"
                  min={user.pickupDate === getTodayDate() ? getCurrentTime() : "00:00"}
                  required
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="mb-5 pt-3">
            <label className="mb-5 block text-base font-semibold text-[#07074D] sm:text-xl">
              Address Details
            </label>
            <div className="-mx-3 flex flex-wrap">
              <div className="w-full px-3 sm:w-1/2">
                <input
                  type="text"
                  name="pickupLocation"
                  value={user.pickupLocation}
                  onChange={handleChange}
                  id="pickupLocation"
                  required
                  placeholder="From"
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <input
                  type="text"
                  name="dropoffLocation"
                  value={user.dropoffLocation}
                  onChange={handleChange}
                  id="dropoffLocation"
                  required
                  placeholder="To"
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>
            </div>
          </div>

          <div className="w-full flex justify-between px-3 mb-5">
            <div className="text-2xl font-bold text-gray-800">Total Price</div>
            <div className="text-3xl font-semibold text-gray-900">${order.price?.toFixed(2) || "0.00"}</div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full cursor-pointer rounded-md py-3 px-8 text-center text-base font-semibold text-white outline-none transition duration-200 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"}`}
          >
            {isLoading ? "Updating..." : "Update Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateOrder;