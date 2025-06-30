// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Suspense } from "react";
// import axios from "axios";
// import ItemSection from "@/components/ItemSection";
// import SupplierSearch from "@/components/SupplierSearch";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// /*───────────────────────────────
//   Batch-selection modal
// ───────────────────────────────*/
// function BatchModal({ itemsbatch, onClose, onUpdateBatch }) {
//   const {
//     item,
//     warehouse,
//     itemName,
//     quantity: parentQty,
//   } = itemsbatch;

//   const [inventory, setInventory]         = useState(null);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [qty, setQty]                     = useState(parentQty === 1 ? 1 : 1);
//   const [hasConfirmed, setHasConfirmed]   = useState(false);

//   /* fetch inventory once ids are known */
//   useEffect(() => {
//     if (!item || !warehouse) {
//       setInventory({ batches: [] });
//       return;
//     }
//     (async () => {
//       try {
//         const res = await fetch(`/api/inventory/${item}/${warehouse}`);
//         if (!res.ok) throw new Error("Inventory fetch failed");
//         setInventory(await res.json());
//       } catch (err) {
//         console.error(err);
//         setInventory({ batches: [] });
//       }
//     })();
//   }, [item, warehouse]);

//   const handleConfirm = () => {
//     if (hasConfirmed) return;
//     const finalQty = parentQty === 1 ? 1 : qty;

//     if (!selectedBatch || finalQty <= 0) {
//       toast.error("Please select a batch and enter a valid quantity");
//       return;
//     }
//     if (finalQty > selectedBatch.quantity) {
//       toast.error("Entered quantity exceeds available batch quantity");
//       return;
//     }
//     setHasConfirmed(true);
//     onUpdateBatch(selectedBatch, finalQty);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="p-6 w-full max-w-xl bg-white rounded-xl relative">
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-xl font-bold"
//         >
//           &times;
//         </button>

//         <h2 className="text-2xl font-bold mb-4">
//           Select Batch for {itemName}
//         </h2>

//         {!inventory ? (
//           <p>Loading…</p>
//         ) : inventory.batches.length === 0 ? (
//           <p>No batches available</p>
//         ) : (
//           <>
//             <label className="block mt-4">Select Batch:</label>
//             <select
//               className="border p-2 rounded w-full"
//               onChange={(e) =>
//                 setSelectedBatch(
//                   e.target.value ? JSON.parse(e.target.value) : null,
//                 )
//               }
//             >
//               <option value="">— Select —</option>
//               {inventory.batches.map((b, i) => (
//                 <option key={i} value={JSON.stringify(b)}>
//                   {b.batchNumber} – {b.quantity} available
//                 </option>
//               ))}
//             </select>

//             {selectedBatch && (
//               <div className="mt-4 p-4 border rounded bg-gray-100 text-sm space-y-1">
//                 <p><strong>Batch #:</strong> {selectedBatch.batchNumber}</p>
//                 <p><strong>Expiry:</strong> {new Date(selectedBatch.expiryDate).toDateString()}</p>
//                 <p><strong>Manufacturer:</strong> {selectedBatch.manufacturer}</p>
//                 <p><strong>Unit Price:</strong> ₹{selectedBatch.unitPrice}</p>

//                 <label className="block mt-2">Quantity:</label>
//                 <input
//                   type="number"
//                   min="1"
//                   max={selectedBatch.quantity}
//                   value={parentQty === 1 ? 1 : qty}
//                   onChange={(e) => parentQty !== 1 && setQty(+e.target.value)}
//                   disabled={parentQty === 1}
//                   className="border p-2 rounded w-full"
//                 />

//                 <p className="mt-2">
//                   <strong>Total:</strong> ₹
//                   {(
//                     (parentQty === 1 ? 1 : qty) * selectedBatch.unitPrice
//                   ).toFixed(2)}
//                 </p>
//               </div>
//             )}

//             <button
//               onClick={handleConfirm}
//               className="mt-4 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded w-full"
//             >
//               Confirm Batch
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /*───────────────────────────────
//   Initial state
// ───────────────────────────────*/
// const initialState = {
//   /* supplier */
//   supplier:        null,
//   supplierCode:    "",
//   supplierName:    "",
//   supplierContact: "",

//   /* meta */
//   refNumber:   "",
//   salesEmployee: "",
//   status: "Pending",
//   postingDate:  "",
//   validUntil:   "",
//   documentDate: "",

//   /* lines */
//   items: [
//     {
//       item: "",
//       itemCode: "",
//       itemId: "",
//       itemName: "",
//       itemDescription: "",
//       quantity: 0,
//       allowedQuantity: 0,
//       unitPrice: 0,
//       discount: 0,
//       freight: 0,
//       gstType: 0,
//       priceAfterDiscount: 0,
//       totalAmount: 0,
//       gstAmount: 0,
//       igstAmount: 0,
//       tdsAmount: 0,
//       batches: [],
//       warehouse: "",
//       warehouseName: "",
//       warehouseCode: "",
//       warehouseId: "",
//       taxOption: "GST",
//       managedByBatch: true,
//     },
//   ],

//   /* totals */
//   freight: 0,
//   rounding: 0,
//   totalDownPayment: 0,
//   appliedAmounts: 0,
//   totalBeforeDiscount: 0,
//   gstTotal: 0,
//   grandTotal: 0,
//   openBalance: 0,
//   remarks: "",

//   fromQuote: false,
// };

// const fmtDate = (d) => (!d ? "" : new Date(d).toISOString().slice(0, 10));

// /*───────────────────────────────
//   Wrapper – keeps Suspense clean
// ───────────────────────────────*/
// export default function DebitNoteFormWrapper() {
//   return (
//     <Suspense fallback={<div className="py-10 text-center">Loading…</div>}>
//       <DebitNoteForm />
//     </Suspense>
//   );
// }

// /*───────────────────────────────
//   Main component
// ───────────────────────────────*/
// function DebitNoteForm() {
//   const router       = useRouter();
//   const searchParams = useSearchParams();
//   const editId       = searchParams.get("editId");

//   const [data, setData]                    = useState(initialState);
//   const [modalIdx, setModalIdx]            = useState(null);

//   const [copied, setCopied]                = useState(false);
//   const [copiedFromInvoice, setCopyInv]    = useState(false);

//   /*──────── totals ────────*/
//   useEffect(() => {
//     const totBefore = data.items.reduce((s, it) => {
//       const up  = +it.unitPrice  || 0;
//       const dis = +it.discount   || 0;
//       const qty = +it.quantity   || 0;
//       return s + (up - dis) * qty;
//     }, 0);

//     const gstTot = data.items.reduce((s, it) => {
//       if (it.taxOption === "IGST") return s + (+it.igstAmount || 0);
//       return s + (+it.gstAmount || 0);
//     }, 0);

//     const linesTot = data.items.reduce(
//       (s, it) => s + (+it.totalAmount || 0),
//       0,
//     );

//     const grand = linesTot
//       + gstTot
//       + (+data.freight  || 0)
//       + (+data.rounding || 0);

//     const openBal = grand
//       - (+data.totalDownPayment || 0)
//       - (+data.appliedAmounts   || 0);

//     setData((p) => ({
//       ...p,
//       totalBeforeDiscount: totBefore,
//       gstTotal:            gstTot,
//       grandTotal:          grand,
//       openBalance:         openBal,
//     }));
//   }, [
//     data.items,
//     data.freight,
//     data.rounding,
//     data.totalDownPayment,
//     data.appliedAmounts,
//   ]);

//   /*──────── submit ────────*/
//   const handleSubmit = async () => {
//     try {
//       const { supplier, ...rest } = data;
//       const payload = { ...rest, ...(supplier ? { supplier } : {}) };

//       if (editId) {
//         await axios.put(`/api/debit-note/${editId}`, payload);
//         toast.success("Debit-note updated");
//       } else {
//         await axios.post("/api/debit-note", payload);
//         toast.success("Debit-note created");
//         setData(initialState);
//       }
//       router.push("/admin/debit-note");
//     } catch (err) {
//       console.error(err);
//       toast.error(editId ? "Update failed" : "Create failed");
//     }
//   };

//   /*──────── load copied or edited record ────────*/
//   useEffect(() => {
//     let draft = null;

//     /* from Invoice */
//     const inv = sessionStorage.getItem("invoiceData");
//     if (inv) {
//       draft = JSON.parse(inv);
//       sessionStorage.removeItem("invoiceData");
//       setCopyInv(true);                // flag for auto-modal
//     }

//     /* from SO / Delivery */
//     const so  = sessionStorage.getItem("debitNoteData");
//     const del = sessionStorage.getItem("DebitNoteData");
//     if (so) {
//       draft = JSON.parse(so);
//       sessionStorage.removeItem("debitNoteData");
//     } else if (del) {
//       draft = JSON.parse(del);
//       sessionStorage.removeItem("DebitNoteData");
//     }

//     if (draft) {
//       setData(draft);
//       setCopied(true);
//     }
//   }, []);

//   /* auto-open batch modal when invoice copied */
//   useEffect(() => {
//     if (copiedFromInvoice && data.items.length > 0) {
//       setModalIdx(0);
//     }
//   }, [copiedFromInvoice, data.items.length]);

//   /* edit existing */
//   useEffect(() => {
//     if (!editId) return;
//     axios
//       .get(`/api/debit-note/${editId}`)
//       .then((res) => {
//         if (res.data.success) {
//           const r = res.data.data;
//           setData({
//             ...r,
//             postingDate:  fmtDate(r.postingDate),
//             validUntil:   fmtDate(r.validUntil),
//             documentDate: fmtDate(r.documentDate),
//           });
//         }
//       })
//       .catch((err) => {
//         console.error(err);
//         toast.error("Failed to load debit-note");
//       });
//   }, [editId]);

//   /*──────── field handlers ────────*/
//   const onSupplierSelect = useCallback((s) => {
//     setData((p) => ({
//       ...p,
//       supplier:        s._id,
//       supplierCode:    s.supplierCode || "",
//       supplierName:    s.supplierName || "",
//       supplierContact: s.contactPersonName || "",
//     }));
//   }, []);

//   const onInput = useCallback((e) => {
//     const { name, value } = e.target;
//     setData((p) => ({ ...p, [name]: value }));
//   }, []);

//   const onItemChange = useCallback((i, e) => {
//     const { name, value } = e.target;
//     setData((p) => {
//       const items = [...p.items];
//       items[i] = { ...items[i], [name]: value };
//       return { ...p, items };
//     });
//   }, []);

//   const addItem = () =>
//     setData((p) => ({ ...p, items: [...p.items, { ...initialState.items[0] }] }));

//   const removeItem = (i) =>
//     setData((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

//   /*──────── batch helpers ────────*/
//   const updateBatch = (batch, qty) => {
//     setData((p) => {
//       const items = [...p.items];
//       const it    = { ...items[modalIdx] };

//       const allocated = it.batches.reduce(
//         (s, b) => s + (b.allocatedQuantity || 0),
//         0,
//       );
//       if (allocated + qty > it.quantity) {
//         toast.error("Allocated quantity exceeds item quantity");
//         return p;
//       }

//       const idx = it.batches.findIndex((b) => b.batchCode === batch.batchNumber);
//       if (idx !== -1) {
//         it.batches[idx].allocatedQuantity += qty;
//       } else {
//         it.batches.push({
//           batchCode:        batch.batchNumber,
//           expiryDate:       batch.expiryDate,
//           manufacturer:     batch.manufacturer,
//           allocatedQuantity:qty,
//           availableQuantity:batch.quantity,
//         });
//       }
//       items[modalIdx] = it;
//       return { ...p, items };
//     });
//   };

//   /*──────── render ────────*/
//   return (
//     <div className="m-11 p-5 shadow-xl">
//       <h1 className="text-2xl font-bold mb-4">
//         {editId ? "Edit Debit Note" : "Create Debit Note"}
//       </h1>

//       {/* Supplier & header */}
//       <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
//         <div className="basis-full md:basis-1/2 space-y-4 px-2">
//           <label className="block mb-2 font-medium">Supplier Code</label>
//           <input
//             readOnly
//             className="w-full p-2 border rounded bg-gray-100"
//             value={data.supplierCode}
//           />

//           <label className="block mb-2 font-medium">Supplier Name</label>
//           {copied ? (
//             <input
//               name="supplierName"
//               value={data.supplierName}
//               onChange={onInput}
//               className="w-full p-2 border rounded"
//             />
//           ) : (
//             <SupplierSearch onSelectSupplier={onSupplierSelect} />
//           )}

//           <label className="block mb-2 font-medium">Supplier Contact</label>
//           <input
//             readOnly
//             className="w-full p-2 border rounded bg-gray-100"
//             value={data.supplierContact}
//           />

//           <label className="block mb-2 font-medium">Debit-Note #</label>
//           <input
//             name="refNumber"
//             value={data.refNumber}
//             onChange={onInput}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div className="basis-full md:basis-1/2 space-y-4 px-2">
//           <label className="block mb-2 font-medium">Status</label>
//           <select
//             name="status"
//             value={data.status}
//             onChange={onInput}
//             className="w-full p-2 border rounded"
//           >
//             <option value="">— select —</option>
//             <option value="Pending">Pending</option>
//             <option value="Confirmed">Confirmed</option>
//           </select>

//           {["postingDate", "validUntil", "documentDate"].map((f) => (
//             <div key={f}>
//               <label className="block mb-2 font-medium">
//                 {f === "postingDate"
//                   ? "Posting Date"
//                   : f === "validUntil"
//                   ? "Valid Until"
//                   : "Document Date"}
//               </label>
//               <input
//                 type="date"
//                 name={f}
//                 value={data[f]}
//                 onChange={onInput}
//                 className="w-full p-2 border rounded"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Items */}
//       <h2 className="text-xl font-semibold mt-6">Items</h2>
//       <div className="m-10 p-5 border rounded-lg shadow-lg">
//         <ItemSection
//           items={data.items}
//           onItemChange={onItemChange}
//           onAddItem={addItem}
//           removeItemRow={removeItem}
//           setFormData={setData}
//         />
//       </div>

//       {/* Batch selection */}
//       <div className="mb-6">
//         <h2 className="text-xl font-semibold">Batch Selection</h2>
//         {data.items.map((it, i) =>
//           !it.managedByBatch ? null : (
//             <div key={i} className="border p-2 my-2">
//               <div className="flex justify-between items-center">
//                 <span>{it.itemName || `Item ${i + 1}`}</span>
//                 <button
//                   onClick={() => setModalIdx(i)}
//                   className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded"
//                 >
//                   Select Batch
//                 </button>
//               </div>
//               {it.batches.length > 0 && (
//                 <div className="mt-2 text-xs">
//                   <p className="font-medium">Allocated Batches:</p>
//                   <ul className="list-disc ml-5">
//                     {it.batches.map((b, j) => (
//                       <li key={j}>
//                         {b.batchCode}: {b.allocatedQuantity} allocated&nbsp;
//                         (Available {b.availableQuantity})
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           ),
//         )}
//       </div>

//       {/* Remarks & employee */}
//       <div className="grid md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
//         <div>
//           <label className="block mb-2 font-medium">Sales Employee</label>
//           <input
//             name="salesEmployee"
//             value={data.salesEmployee}
//             onChange={onInput}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//         <div>
//           <label className="block mb-2 font-medium">Remarks</label>
//           <textarea
//             name="remarks"
//             value={data.remarks}
//             onChange={onInput}
//             className="w-full p-2 border rounded"
//           />
//         </div>
//       </div>

//       {/* Summary */}
//       <div className="grid md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
//         {[
//           ["Total Before Discount", "totalBeforeDiscount", true],
//           ["Rounding", "rounding", false],
//           ["GST Total", "gstTotal", true],
//           ["Grand Total", "grandTotal", true],
//         ].map(([label, field, readOnly]) => (
//           <div key={field}>
//             <label className="block mb-2 font-medium">{label}</label>
//             <input
//               name={field}
//               type="number"
//               value={Number(data[field]).toFixed(2)}
//               onChange={onInput}
//               readOnly={readOnly}
//               className={`w-full p-2 border rounded ${
//                 readOnly ? "bg-gray-100" : ""
//               }`}
//             />
//           </div>
//         ))}
//       </div>

//       {/* CTA buttons */}
//       <div className="flex flex-wrap gap-4 p-8 m-8 border rounded-lg shadow-lg">
//         <button
//           onClick={handleSubmit}
//           className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded"
//         >
//           {editId ? "Update" : "Add"}
//         </button>

//         <button
//           onClick={() => {
//             setData(initialState);
//             router.push("/admin/debit-note");
//           }}
//           className="px-4 py-2 bg-gray-400 hover:bg-gray-300 text-white rounded"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={() => {
//             sessionStorage.setItem("debitNoteData", JSON.stringify(data));
//             toast.info("Form data copied!");
//           }}
//           className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
//         >
//           Copy From
//         </button>
//       </div>

//       {/* Modal */}
//       {modalIdx !== null && (
//         <BatchModal
//           itemsbatch={data.items[modalIdx]}
//           onClose={() => setModalIdx(null)}
//           onUpdateBatch={updateBatch}
//         />
//       )}

//       <ToastContainer />
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash, FaCopy, FaEye , FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function SalesDeliveryList() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/sales-delivery");
      console.log("Fetched orders:", res.data);
      // Expecting an object with a success flag and a data array.
    //   if (res.data.success) {
    //     setOrders(res.data);
    //   }
    setOrders(res.data);
    } catch (error) {
      console.error("Error fetching sales delivery:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await axios.delete(`/api/sales-delivery/${id}`);
      if (res.data.success) {
        alert("Deleted successfully");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error deleting sales delivery:", error);
      alert("Failed to delete order");
    }
  };

  const handleCopyTo = (order, destination) => {
    if (destination === "GRN") {
      sessionStorage.setItem("grnData", JSON.stringify(order));
      router.push("/admin/GRN");
    } else if (destination === "Invoice") {
      const invoiceWithId = {...order,sourceId:order._id, sourceModel: "Delivery" }
      sessionStorage.setItem("InvoiceData", JSON.stringify(invoiceWithId));
      router.push("/admin/sales-invoice-view/new");
    } 
    // else if (destination === "Debit-Note") {
    //   sessionStorage.setItem("debitNoteData", JSON.stringify(order));
    //   router.push("/admin/debit-note");
    // }
  };

  const CopyToDropdown = ({ handleCopyTo, order }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const onSelect = (option) => {
      handleCopyTo(order, option);
      setIsOpen(false);
    };
    return (
      <div className="relative inline-block text-left">
        <button
          onClick={toggleDropdown}
          className="flex items-center px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-500 transition duration-200"
          title="Copy To"
        >
          <FaCopy className="mr-1" />
          <span className="hidden sm:inline"></span>
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={() => onSelect("GRN")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                GRN
              </button>
              <button
                onClick={() => onSelect("Invoice")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Invoice
              </button>
            
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Sales Delivery</h1>
      <div className="flex justify-end mb-4">
        <Link href="/admin/delivery-view/new">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition duration-200">
            <FaEdit className="mr-2" />
            Create New Delivery
          </button>
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b">Customer Code</th>
              <th className="py-3 px-4 border-b">Customer Name</th>
              <th className="py-3 px-4 border-b">Order Date</th>
              <th className="py-3 px-4 border-b">Remarks</th>
              <th className="py-3 px-4 border-b">Grand Total</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 border-b text-center">{order.customerCode}</td>
                <td className="py-3 px-4 border-b text-center">{order.customerName}</td>
                <td className="py-3 px-4 border-b text-center">
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : ""}
                </td>
                <td className="py-3 px-4 border-b text-center">{order.remarks}</td>
                <td className="py-3 px-4 border-b text-center">{order.grandTotal}</td>
                <td className="py-3 px-4 border-b">
                  <div className="flex justify-center space-x-2">
                    {/* View Button */}
                    <Link href={`/admin/delivery-view/${order._id}`}>
                      <button
                        className="flex items-center px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition duration-200"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                    </Link>
                    {/* Edit Button */}
                    <Link href={`/admin/delivery-view/new?editId=${order._id}`}>
                      <button
                        className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </Link>
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="flex items-center px-2 py-1 bg-red-600 text-white rounded hover:bg-red-500 transition duration-200"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    {/* Copy To Dropdown */}
                    <CopyToDropdown handleCopyTo={handleCopyTo} order={order} />
                    {/* Email Button */}  
                    <Link href={`/admin/delivery-view/${order._id}/send-email`}>
                      <button
                        className="flex items-center px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition duration-200"
                        title="Send Email"
                      >
                        <FaEnvelope />
                      </button>
                    </Link>
                    {/* WhatsApp Button */}
                    <Link href={`/admin/delivery-view/${order._id}/send-whatsapp`}>
                      <button
                        className="flex items-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition duration-200"
                        title="Send WhatsApp"
                      >
                        <FaWhatsapp />
                      </button>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No purchase orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
