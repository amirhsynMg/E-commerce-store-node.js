import Product from "../models/products.module.js";
import User from "../models/user.module.js";
import Order from "../models/order.module.js";
// this function needs to get the total users and products and sales and revenue
export const getAnalyticsData = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const salesData = Order.aggregate([
      {
        $group: {
          _id: null, // groups all the documents together
          totalSales: { $sum: 1 }, // counts the number of orders in db
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {
      totalSales: 0,
      totalRevenue: 0,
    };

    return {
      users: totalUsers,
      Products: totalProducts,
      totalSales,
      totalRevenue,
    };
  } catch (error) {}
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            // check the createdAt fields
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          // group them
          _id: { $dataToString: { format: "%Y-%m-%d", data: "%createdAt" } },
          sales: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    // what the daily sales data will return
    // [
    //   {
    //   _id: "2024-08-18",
    //   sales :12,
    //   revenue : 1450.89
    //   }
    // and more for 7 days....
    // ]

    const dateArray = getDatesInRange(startDate, endDate);
    // ["2024-26-12", "2024-26-13" , ...]  what it returns

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item._id === date);

      return {
        date,
        sales: foundData.sales || 0,
        revenue: foundData.revenue || 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(currentDate.toString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
