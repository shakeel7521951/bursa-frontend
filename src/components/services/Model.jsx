import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useCreateOrderMutation } from "../../redux/slices/OrderSlices";
import { toast } from "react-toastify";

const Modal = () => {
  const location = useLocation();
  const service = location.state?.service;
  const navigate = useNavigate();
  const { carId } = useParams();
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [user, setUser] = useState({
    date: "",
    time: "",
    from: "",
    to: "",
  });

  if (!service) {
    return <p className="text-center text-gray-500">Service not found.</p>;
  }

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const orderCar = async (e) => {
    e.preventDefault();
    const id = service._id;

    // Combine date and time into a single local date-time object
    const localDateTime = new Date(`${user.date}T${user.time}`);

    // Convert the local date and time to UTC
    const utcDateTime = new Date(localDateTime.getTime()).toISOString();

    const orderData = {
      data: {
        ...user,
        pickupDateTime: utcDateTime, // Send the UTC date and time correctly
      },
      price: service.price,
    };

    try {
      const response = await createOrder({ id, data: orderData });

      if (response.error) {
        toast.error(response.error.data?.message || "Something went wrong", {
          position: "top-center",
        });
      } else {
        toast.success(response.data?.message || "Order created successfully!", {
          position: "top-center",
        });
        navigate("/");
      }
    } catch (error) {
      toast.error("Unexpected error occurred!", { position: "top-center" });
    }
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white p-6 rounded-lg shadow-lg">
        <div
          key={carId}
          className="relative flex flex-col justify-center items-center gap-4 mb-4"
        >
          <h1 className="absolute text-3xl bottom-0 pb-4 font-semibold text-white">
            {service.serviceName}
          </h1>
          <img
            src={service.servicePic}
            alt={service.serviceName}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <form onSubmit={orderCar}>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="date"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={user.date}
                  onChange={handleChange}
                  id="date"
                  required
                  disabled={isLoading}
                  className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                />
              </div>
            </div>
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="time"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={user.time}
                  onChange={handleChange}
                  id="time"
                  required
                  disabled={isLoading}
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
                <div className="mb-5">
                  <input
                    type="text"
                    name="from"
                    value={user.from}
                    onChange={handleChange}
                    id="from"
                    required
                    disabled={isLoading}
                    placeholder="From"
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full px-3 sm:w-1/2">
                <div className="mb-5">
                  <input
                    type="text"
                    name="to"
                    value={user.to}
                    onChange={handleChange}
                    id="to"
                    required
                    disabled={isLoading}
                    placeholder="To"
                    className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-blue-500 focus:shadow-md"
                  />
                </div>
              </div>
              <div className="w-full flex justify-between px-3">
                <div className="text-2xl font-bold text-gray-800">
                  Total Price
                </div>
                <div className="text-3xl font-semibold text-gray-900">
                  {service.price}
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              aria-disabled={isLoading}
              className={`hover:shadow-md w-full rounded-full bg-[#FFEE02] py-3 px-8 text-center text-base font-semibold text-black outline-none transition duration-200 hover:bg-[#FFEE02] ${
                isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {isLoading ? "Booking..." : "Book your Car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
