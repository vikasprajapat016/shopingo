import { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = import.meta.env.VITE_API_URL;

  const cancelOrder = async (orderId) => {
  try {
    await axios.patch(
      `${import.meta.env.VITE_API_URL}/orders/cancel/${orderId}`,
      {},
      { withCredentials: true }
    );

    // Update UI immediately (no refetch needed)
    setOrders(prev =>
      prev.map(order =>
        order._id === orderId
          ? { ...order, orderStatus: "CANCELLED" }
          : order
      )
    );
  } catch (error) {
    alert(error.response?.data?.message || "Cancel failed");
  }
};


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/orders/my`, {
          withCredentials: true,
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statusColor = status => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-xl font-semibold">My Orders</h1>
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-28 bg-gray-200 animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 text-center">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">
        <h1 className="text-xl font-semibold mb-2">
          My Orders
        </h1>
        <p>You haven’t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">My Orders</h1>

      {orders.map(order => (
        <div
          key={order._id}
          className="border rounded-lg p-4 space-y-4"
        >
          {/* ORDER HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">
                Order ID
              </p>
              <p className="font-medium">
                #{order._id.slice(-6)}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                order.orderStatus
              )}`}
            >
              {order.orderStatus}
            </span>
          </div>

          {/* ITEMS */}
          <div className="divide-y">
            {order.items.map(item => (
              <div
                key={item.product}
                className="flex gap-4 py-3 items-center"
              >
{                console.log(item.thumbnail)
}                <img
                  src={`${API}/${item.thumbnail}`}
                  alt={item.title}
                  className="w-14 h-14 rounded object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">
                    {item.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-medium">
                  ₹{item.price}
                </p>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center pt-3 border-t">
           <div className="">
             <p className="text-sm text-gray-500">
              Ordered on{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p></div>
          <div className=" flex gap-8">
              <p className="text-lg font-semibold">
              Total: ₹{order.totalAmount}
            </p>

            {order.orderStatus === "PENDING" && (
  <button
    onClick={() => cancelOrder(order._id)}
      disabled={["SHIPPED", "DELIVERED"].includes(order.orderStatus)}

    className="text-white bg-red-500 hover:bg-red-700 cursor-pointer px-3 py-1 rounded-md"
  >
    Cancel Order
  </button>
)}

          </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
