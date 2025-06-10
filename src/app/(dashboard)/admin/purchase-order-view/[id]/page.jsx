'use client';

import Link from 'next/link';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function InvoiceDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`/api/purchase-order/${id}`);
        setOrder(res.data.data);
      } catch (error) {
        console.error('Failed to fetch purchase-order:', error);
        setError('Failed to fetch purchase order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link href="/admin/purchase-order-view">
          <button className="px-4 py-2 bg-gray-300 rounded">Back to Order List</button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto p-6">
        <p>Order not found</p>
        <Link href="/admin/purchase-order-view">
          <button className="mt-4 px-4 py-2 bg-gray-300 rounded">Back to Order List</button>
        </Link>
      </div>
    );
  }

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate totals
  const calculateItemTotals = () => {
    if (!order.items) return {};
    
    return order.items.reduce((acc, item) => {
      acc.totalQuantity += item.orderedQuantity || 0;
      acc.totalAmount += item.totalAmount || 0;
      acc.totalDiscount += item.discount || 0;
      acc.totalGST += item.gstAmount || 0;
      return acc;
    }, {
      totalQuantity: 0,
      totalAmount: 0,
      totalDiscount: 0,
      totalGST: 0
    });
  };

  const itemTotals = calculateItemTotals();

  return (
    <div className="container mx-auto p-6">
      <Link href="/admin/purchase-order-view">
        <button className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
          Back to Order List
        </button>
      </Link>
      
      <h1 className="text-3xl font-bold mb-6">Purchase Order Details</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Order Header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Order #{order.refNumber || 'N/A'}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              order.orderStatus === 'Open' ? 'bg-blue-100 text-blue-800' :
              order.orderStatus === 'Close' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {order.orderStatus}
            </span>
          </div>
          <p className="text-gray-600 mt-1">Created: {formatDate(order.createdAt)}</p>
        </div>
        
        {/* Order Information */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Supplier Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Supplier Code:</span> {order.supplierCode || 'N/A'}</p>
              <p><span className="font-medium">Supplier Name:</span> {order.supplierName}</p>
              <p><span className="font-medium">Contact Person:</span> {order.contactPerson || 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Order Dates</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Posting Date:</span> {formatDate(order.postingDate)}</p>
              <p><span className="font-medium">Document Date:</span> {formatDate(order.documentDate)}</p>
              <p><span className="font-medium">Valid Until:</span> {formatDate(order.validUntil)}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Status Information</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Payment Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                  order.paymentStatus === 'Partial' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.paymentStatus}
                </span>
              </p>
              <p>
                <span className="font-medium">Stock Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  order.stockStatus === 'Updated' ? 'bg-green-100 text-green-800' :
                  order.stockStatus === 'Adjusted' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.stockStatus}
                </span>
              </p>
              <p><span className="font-medium">Sales Employee:</span> {order.salesEmployee || 'N/A'}</p>
            </div>
          </div>
        </div>
        
        {/* Financial Summary */}
        <div className="px-6 py-4 bg-gray-50 border-t border-b">
          <h3 className="text-lg font-semibold mb-3">Financial Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-600">Total Before Discount</p>
              <p className="font-medium">₹{order.totalBeforeDiscount?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-gray-600">Freight Charges</p>
              <p className="font-medium">₹{order.freight?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-gray-600">GST Total</p>
              <p className="font-medium">₹{order.gstTotal?.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-gray-600">Grand Total</p>
              <p className="font-medium text-lg text-blue-700">₹{order.grandTotal?.toFixed(2) || '0.00'}</p>
            </div>
          </div>
        </div>
        
        {/* Items Section */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Order Items</h3>
            <p className="text-gray-600">{order.items?.length || 0} items</p>
          </div>
          
          {order.items && order.items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ordered Qty</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Received Qty</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GST</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{item.itemName}</div>
                        <div className="text-sm text-gray-500">{item.itemCode}</div>
                      </td>
                      <td className="px-4 py-3 text-center">{item.orderedQuantity}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.receivedQuantity === item.orderedQuantity ? 'bg-green-100 text-green-800' :
                          item.receivedQuantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.receivedQuantity || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">₹{item.unitPrice?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">₹{item.discount?.toFixed(2) || '0.00'}</td>
                      <td className="px-4 py-3 text-center">
                        <div>{item.gstRate}%</div>
                        <div className="text-xs text-gray-500">{item.taxOption}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium">₹{item.totalAmount?.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        {item.warehouseName ? (
                          <div>
                            <div>{item.warehouseName}</div>
                            <div className="text-xs text-gray-500">{item.warehouseCode}</div>
                          </div>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td className="px-4 py-3 text-right" colSpan="3">Totals:</td>
                    <td className="px-4 py-3 text-center">{itemTotals.totalQuantity}</td>
                    <td className="px-4 py-3 text-center">₹{itemTotals.totalDiscount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">₹{itemTotals.totalGST.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">₹{itemTotals.totalAmount.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500">No items found in this order</p>
            </div>
          )}
        </div>
        
        {/* Additional Information */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <h3 className="text-lg font-semibold mb-3">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Remarks:</p>
              <p className="text-gray-600 mt-1 bg-white p-3 rounded border">
                {order.remarks || 'No remarks provided'}
              </p>
            </div>
            <div>
              <p className="font-medium">Stock Information:</p>
              <div className="mt-1 space-y-1">
                <p>
                  <span className="text-gray-600">Stock Added:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    order.items?.some(i => i.stockAdded) ? 
                    'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.items?.some(i => i.stockAdded) ? 'Yes' : 'No'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Managed By:</span> 
                  {order.items?.[0]?.managedBy || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-4">
        <Link href={`/admin/purchase-order-view/new?editId=${order._id}`}>
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Edit Order
          </button>
        </Link>
        <Link href="/admin/purchase-order-view">
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">
            Back to List
          </button>
        </Link>
      </div>
    </div>
  );
}










// 'use client';

// import Link from 'next/link';
// import axios from 'axios';
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// export default function InvoiceDetail() {
//   const { id } = useParams();
//   const [order, setOrder] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await axios.get(`/api/purchase-order/${id}`);
//         console.log(res.data.data)
//         setOrder(res.data.data);
//       } catch (error) {
//         console.error('Failed to fetch purchase-order:', error);
//         setError('Failed to fetch purchase-order');
//       }
//     };

//     if (id) {
//         fetchOrder();
//     }
//   }, [id]);

//   if (error) {
//     return <p>{error}</p>;
//   }

//   if (!order) {
//     return <p>Loading...</p>;
//   }

//   return (
//     <div className="container mx-auto p-6">
//       <Link href="/admin/purchase-order-view">
//         <button className="mb-4 px-4 py-2 bg-gray-300 rounded">Back to Order List</button>
//       </Link>
//       <h1 className="text-3xl font-bold mb-6">Order Detail</h1>
//       <div className="bg-white shadow-md rounded p-6">
//         <p><strong>order Number:</strong> {order.orderNumber}</p>
//         <p><strong>Supplier Name:</strong> {order.supplierName}</p>
//         <p><strong>order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
//         <p><strong>Status:</strong> {order.status}</p>
//         <p><strong>Grand Total:</strong> {order.grandTotal}</p>
//         <p><strong>Remarks:</strong> {order.remarks}</p>
//         <h2 className="text-2xl font-semibold mt-6 mb-2">Items</h2>
//         {order.items && order.items.length > 0 ? (
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 <th className="border p-2">Item Name</th>
//                 <th className="border p-2">Quantity</th>
//                 <th className="border p-2">Unit Price</th>
//                 <th className="border p-2">Discount</th>
//                 <th className="border p-2">Total Amount</th>
//               </tr>
//             </thead>
//             <tbody>
//               {order.items.map((item, index) => (
//                 <tr key={index} className="text-center">
//                   <td className="border p-2">{item.itemName}</td>
//                   <td className="border p-2">{item.quantity}</td>
//                   <td className="border p-2">{item.unitPrice}</td>
//                   <td className="border p-2">{item.discount}</td>
//                   <td className="border p-2">{item.totalAmount}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         ) : (
//           <p>No items available.</p>
//         )}
//       </div>
//       <div className="mt-4">
//         <Link href={`/admin/purchase-order-view/new?editId=${order._id}`}>
//           <button className="px-4 py-2 bg-blue-600 text-white rounded">Edit order</button>
//         </Link>
//       </div>
//     </div>
//   );
// }
