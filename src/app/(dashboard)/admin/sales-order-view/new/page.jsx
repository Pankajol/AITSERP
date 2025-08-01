




// "use client";

// import { useState, useEffect, useCallback, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";
// import ItemSection from "@/components/ItemSection";
// import CustomerSearch from "@/components/CustomerSearch";
// import CustomerAddressSelector from "@/components/CustomerAddressSelector";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { jwtDecode } from "jwt-decode";

// // Initial state with full set of fields
// const initialOrderState = {
//   customerCode: "",
//   customerName: "",
//   contactPerson: "",
//   refNumber: "",
//   salesEmployee: "",
//   status: "Open",
//   statusStages: "ETD Confirmation from plant", // Default status stage
//   orderDate: "",
//   expectedDeliveryDate: "",
//   billingAddress: null,
//   shippingAddress: null,
//   items: [{
//     item: "", itemCode: "", itemId: "", itemName: "", itemDescription: "",
//     quantity: 0, allowedQuantity: 0, receivedQuantity: 0,
//     unitPrice: 0, discount: 0, freight: 0,
//     taxOption: "GST", priceAfterDiscount: 0, totalAmount: 0,
//     gstAmount: 0, gstRate: 0, cgstAmount: 0, sgstAmount: 0,
//     igstAmount: 0, managedBy: "", batches: [], errorMessage: "",
//     warehouse: "", warehouseName: "", warehouseCode: "", warehouseId: "",
//     managedByBatch: true,
//   }],
//   remarks: "",
//   freight: 0, rounding: 0, totalDownPayment: 0, appliedAmounts: 0,
//   totalBeforeDiscount: 0, gstTotal: 0, grandTotal: 0,
//   openBalance: 0, fromQuote: false,
// };

// // Helper functions
// const round = (num, d = 2) => {
//   const n = Number(num);
//   return isNaN(n) ? 0 : Number(n.toFixed(d));
// };

// function formatDate(d) {
//   if (!d) return "";
//   const date = new Date(d);
//   return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
// }

// const computeItemValues = (item) => {
//   const qty = parseFloat(item.quantity) || 0;
//   const price = parseFloat(item.unitPrice) || 0;
//   const disc = parseFloat(item.discount) || 0;
//   const fr = parseFloat(item.freight) || 0;
//   const pad = round(price - disc);
//   const total = round(qty * pad + fr);

//   if (item.taxOption === "GST") {
//     const gstRate = parseFloat(item.gstRate) || 0;
//     const cgst = round(total * (gstRate / 200));
//     const sgst = cgst;
//     return { priceAfterDiscount: pad, totalAmount: total, gstAmount: cgst + sgst, cgstAmount: cgst, sgstAmount: sgst, igstAmount: 0 };
//   }
//   const igst = round(total * ((parseFloat(item.gstRate) || 0) / 100));
//   return { priceAfterDiscount: pad, totalAmount: total, gstAmount: 0, cgstAmount: 0, sgstAmount: 0, igstAmount: igst };
// };

// export default function SalesOrderPage() {
//   return (
//     <Suspense fallback={<div className="p-4">Loading...</div>}>
//       <SalesOrderForm />
//     </Suspense>
//   );
// }

// function SalesOrderForm() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const editId = params.get("editId");
//    const [attachments, setAttachments] = useState([]);
//   const [formData, setFormData] = useState(initialOrderState);
//   const [loading, setLoading] = useState(false);
//   const [isCopied, setIsCopied] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedCustomer, setSelectedCustomer] = useState(null);
//   const [existingFiles, setExistingFiles] = useState([]);
//   const [removedFiles, setRemovedFiles] = useState([]);
//   const [isNewCustomer, setIsNewCustomer] = useState(false);
//   const base = "w-full p-2 border rounded";
//   /* ---------- handlers ---------- */

 

//   // ---- Auth parsing ----
//   const [isAdmin, setIsAdmin] = useState(false);


//   //  
// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token) return;
//   try {
//     const d = jwtDecode(token); // ✅ correct method
//     const roles = Array.isArray(d?.roles) ? d.roles : [];
//     const roleStr = d?.role ?? d?.userRole ?? null;
//     const isCompany = d?.type === "company" && !!d?.companyName;
//     const isAdminRole = roleStr === "Sales Manager" || roles.includes("admin") || roles.includes("sales manager");
//     setIsAdmin(isAdminRole || isCompany);
//   } catch (e) {
//     console.error("JWT decode error", e);
//   }
// }, []);

//   const isReadOnly = !!editId && !isAdmin; // locked when editing & not admin/company


//   // called when CustomerSearch reports “no match”
//   const onSearchNotFound = searchText => {
//     // pre‑fill the name so the user doesn’t re‑type it
//     setFormData(prev => ({ ...prev, customerName: searchText }));
//     setIsNewCustomer(true);
//   };

//   const handleNewCustomerToggle = () => setIsNewCustomer(prev => !prev);



//   useEffect(() => {
//      const key = "salesOrderData";
//      const stored = sessionStorage.getItem(key);
//      if (!stored) return;
//      try {
//        setFormData(JSON.parse(stored));
//        setIsCopied(true);
//      } catch (err) {
//        console.error("Bad JSON in sessionStorage", err);
//      } finally {
//        sessionStorage.removeItem(key);
//      }
//    }, []);

//   // Load existing order if editing
//   useEffect(() => {
//     if (editId && /^[0-9a-fA-F]{24}$/.test(editId)) {
//       setLoading(true);
//       axios.get(`/api/sales-order/${editId}`)
//         .then(res => {
//           const record = res.data.data;
//           const items = Array.isArray(record.items)
//             ? record.items.map(i => ({
//                 ...initialOrderState.items[0], ...i,
//                 item: i.item?._id || i.item || "",
//                 warehouse: i.warehouse?._id || i.warehouse || "",
//                 taxOption: i.taxOption || "GST",
//               }))
//             : [...initialOrderState.items];
          
//           // Set form data
//           setFormData({
//             ...initialOrderState,
//             ...record,
//             items,
//             billingAddress: record.billingAddress || null,
//             shippingAddress: record.shippingAddress || null,
//             orderDate: formatDate(record.orderDate),
//             expectedDeliveryDate: formatDate(record.expectedDeliveryDate),
//           });
          
//           // Set selected customer for address component
//           if (record.customerCode || record.customerName) {
//             setSelectedCustomer({
//               _id: record.customer || record.customerCode,
//               customerCode: record.customerCode,
//               customerName: record.customerName,
//               contactPersonName: record.contactPerson
//             });
//           }
//         })
//         .catch(err => setError(err.message || "Failed to load"))
//         .finally(() => setLoading(false));
//     }
//   }, [editId]);

//     // const onCustomer = useCallback((c) => {
//     //   setFormData((p) => ({
//     //     ...p,
//     //     customerCode: c.customerCode ?? "",
//     //     customerName: c.customerName ?? "",
//     //     contactPerson: c.contactPersonName ?? "",
//     //   }));
//     // }, []);

//   // Recalculate totals
//   useEffect(() => {
//     const items = Array.isArray(formData.items) ? formData.items : [];
//     const totalBeforeDiscount = items.reduce((s, i) => s + (i.unitPrice * i.quantity - i.discount), 0);
//     const gstTotal = items.reduce((s, i) => s + i.gstAmount, 0);
//     const grandTotal = totalBeforeDiscount + gstTotal + formData.freight + formData.rounding;
//     const openBalance = grandTotal - (formData.totalDownPayment + formData.appliedAmounts);

//     setFormData(prev => ({
//       ...prev,
//       totalBeforeDiscount: round(totalBeforeDiscount),
//       gstTotal: round(gstTotal),
//       grandTotal: round(grandTotal),
//       openBalance: round(openBalance),
//     }));
//   }, [formData.items, formData.freight, formData.rounding, formData.totalDownPayment, formData.appliedAmounts]);

//   // Handlers
//   const onCustomer = useCallback(c => {
//     setSelectedCustomer(c);
//     setFormData(prev => ({
//       ...prev,
//        customer: c._id || "",
//       customerName: c.customerName,
//       customerCode: c.customerCode,
//       contactPerson: c.contactPersonName,
//       billingAddress: null,
//       shippingAddress: null,
//     }));
//   }, []);

//   const handleChange = useCallback(e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   }, []);

//   const handleItemChange = useCallback((idx, e) => {
//     const { name, value } = e.target;
//     setFormData(prev => {
//       const arr = Array.isArray(prev.items) ? [...prev.items] : [];
//       const newVal = ["quantity","allowedQuantity","receivedQuantity","unitPrice","discount","freight","gstRate"].includes(name)
//         ? parseFloat(value) || 0
//         : value;
//       arr[idx] = { ...arr[idx], [name]: newVal, ...computeItemValues({ ...arr[idx], [name]: newVal }) };
//       return { ...prev, items: arr };
//     });
//   }, []);

//     const onInput = useCallback((e) => {
//       const { name, value } = e.target;
//       setFormData((p) => ({ ...p, [name]: value }));
//     }, []);

//   const addItemRow = () => {
//     setFormData(prev => {
//       const arr = Array.isArray(prev.items) ? prev.items : [];
//       return { ...prev, items: [...arr, { ...initialOrderState.items[0] }] };
//     });
//   };

//   const removeItemRow = idx => {
//     setFormData(prev => {
//       const arr = Array.isArray(prev.items) ? prev.items : [];
//       return { ...prev, items: arr.filter((_, i) => i !== idx) };
//     });
//   };



// const handleSubmit = async () => {
//   if (!formData.customerCode || !formData.customerName) {
//     toast.error("Select a customer");
//     return;
//   }

//   setSubmitting(true);
//   try {
//     const token = localStorage.getItem("token");
//     if (!token) throw new Error("Not authenticated");

//     const headers = { Authorization: `Bearer ${token}` };

//     // 🛠 Fix: wrap string addresses into object
//     if (typeof formData.shippingAddress === "string") {
//       formData.shippingAddress = { address1: formData.shippingAddress };
//     }
//     if (typeof formData.billingAddress === "string") {
//       formData.billingAddress = { address1: formData.billingAddress };
//     }

//     // 📦 Utility: builds FormData
//     const buildFormData = (data, newFiles = [], removed = []) => {
//       const fd = new FormData();
//       fd.append("orderData", JSON.stringify(data));
//       newFiles.forEach((f) => fd.append("newFiles", f));
//       if (removed.length > 0) {
//         fd.append("removedFiles", JSON.stringify(removed));
//       }
//       return fd;
//     };

//     // ───────── 🛠 EDIT MODE ─────────
//     if (editId) {
//       if (!isAdmin) {
//         // non-admins → only update stage
//         await axios.put(
//           `/api/sales-order/${editId}`,
//           { status: formData.status, statusStages: formData.statusStages },
//           { headers }
//         );
//         toast.success("Stage updated");
//       } else {
//         const fileChanges = attachments.length > 0 || removedFiles.length > 0;
//         if (fileChanges) {
//           const body = buildFormData(formData, attachments, removedFiles);
//           await axios.put(`/api/sales-order/${editId}`, body, { headers });
//         } else {
//           await axios.put(`/api/sales-order/${editId}`, formData, { headers });
//         }
//         toast.success("Updated successfully");
//       }

//     // ───────── 🆕 CREATE MODE ─────────
//     } else {
//       const body = buildFormData(formData, attachments);
//       await axios.post("/api/sales-order", body, { headers });
//       toast.success("Created successfully");
//       setFormData(initialOrderState);
//       setAttachments([]);
//     }

//     router.push("/admin/sales-order-view");
//   } catch (e) {
//     toast.error(e?.response?.data?.message || e.message);
//   } finally {
//     setSubmitting(false);
//   }
// };




//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="m-8 p-5 border shadow-xl">
//       <h1 className="text-2xl font-bold mb-4">
//         {editId ? "Edit Sales Order" : "Create Sales Order"}
//       </h1>

//       {/* Customer & Meta */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//       {/* <div>
//             {editId || isCopied ? (
//               <>
//                 <label className="mb-2 block font-medium">
//                   Customer Name
//                 </label>
//                 <input
//                   type="text"
//                   name="customerName"
//                   value={formData.customerName}
//                   onChange={onInput}
//                   className="w-full rounded border p-2"
//                 />
//               </>
//             ) : (
//               <>
//                 <label className="mb-2 block font-medium">
//                   Customer Name
//                 </label>
//                 <CustomerSearch onSelectCustomer={onCustomer} />
//               </>
//             )}
//           </div> */}

//            <div>
//       <label className="mb-2 block font-medium">Customer Name</label>


//       {editId || isCopied ? (
//         <input
//           type="text"
//           name="customerName"
//           value={formData.customerName}
//           onChange={onInput}
//           className="w-full rounded border p-2"
//         />
//       ) : (
    
//         <>
//           {isNewCustomer ? (
//             <>
//               <input
//                 type="text"
//                 name="customerName"
//                 value={formData.customerName}
//                 onChange={onInput}
//                 placeholder="Enter new customer"
//                 className="w-full rounded border p-2"
//               />
//               <button
//                 type="button"
//                 onClick={handleNewCustomerToggle}
//                 className="mt-2 rounded bg-gray-200 px-3 py-1 text-sm"
//               >
//                 ⬅︎ Back to search
//               </button>
//             </>
//           ) : (
//             <>
            

//                <CustomerSearch onSelectCustomer={onCustomer} />
//               <button
//                 type="button"
//                 onClick={() => setIsNewCustomer(true)}
//                 className="mt-2 rounded bg-gray-200 px-3 py-1 text-sm"
//               >
//                 + Add new customer
//               </button>
//             </>
//           )}
//         </>
//       )}
//     </div>
//         <div>
//           <label className="font-medium">Customer Code</label>
//           <input  name="customerCode" value={formData.customerCode} onChange={handleChange} className="w-full p-2 border bg-gray-100 rounded" />
//         </div>
//         <div>
//           <label className="font-medium">Contact Person</label>
//           <input  name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full p-2 border bg-gray-100 rounded" />
//         </div>
//         <div>
//           <label className="font-medium">Reference No.</label>
//           <input name="refNumber" value={formData.refNumber} onChange={handleChange} className="w-full p-2 border rounded" />
//         </div>
//       </div>

//       {/* Customer Address Selection */}
//       <CustomerAddressSelector
//         customer={selectedCustomer}
//         selectedBillingAddress={formData.billingAddress}
//         selectedShippingAddress={formData.shippingAddress}
//         onBillingAddressSelect={(address) => setFormData(prev => ({ ...prev, billingAddress: address }))}
//         onShippingAddressSelect={(address) => setFormData(prev => ({ ...prev, shippingAddress: address }))}
//       />

//       {/* Dates & Status */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="font-medium">Order Date</label>
//           <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="w-full p-2 border rounded" />
//         </div>
//         <div>
//           <label className="font-medium">Expected Delivery</label>
//           <input type="date" name="expectedDeliveryDate" value={formData.expectedDeliveryDate} onChange={handleChange} className="w-full p-2 border rounded" />
//         </div>
//         <div>
//           <label className="font-medium">Status</label>
//           <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded">
//            <option>Open</option> <option>Pending</option><option>Closed</option><option>Cancelled</option>
//           </select>
//         </div>
//           {/* <div>
//           <label className="font-medium">Sales Stages</label>
//           <select name="statusStages" value={formData.statusStages} onChange={handleChange} className="w-full p-2 border rounded">
//            <option>ETD Confirmation from plant</option> <option>ETD notification for SC-cremika</option><option>SC to concerned sales & customer</option><option>Material in QC-OK/NOK</option>
//            <option>Dispatch with qty</option> <option>Delivered to customer</option>
//           </select>
//         </div> */}
//       </div>

//       {/* Items */}
//       {/* <ItemSection
//         items={Array.isArray(formData.items) ? formData.items : []}
//         onItemChange={handleItemChange}
//         onAddItem={addItemRow}
//         onRemoveItem={removeItemRow}
//         computeItemValues={computeItemValues}
//       /> */}

//                      <ItemSection
//           items={formData.items}
//           onItemChange={handleItemChange}
//           onAddItem={addItemRow}
//           onRemoveItem={removeItemRow}
//           computeItemValues={computeItemValues}
//         />


//       {/* Totals */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//         <div><label>Total Before Discount</label><input readOnly value={formData.totalBeforeDiscount} className="w-full p-2 border bg-gray-100 rounded" /></div>
//         <div><label>GST Total</label><input readOnly value={formData.gstTotal} className="w-full p-2 border bg-gray-100 rounded" /></div>
//         <div><label>Freight</label><input type="number" name="freight" value={formData.freight} onChange={handleChange} className="w-full p-2 border rounded" /></div>
//         <div><label>Rounding</label><input type="number" name="rounding" value={formData.rounding} onChange={handleChange} className="w-full p-2 border rounded" /></div>
//         <div><label>Grand Total</label><input readOnly value={formData.grandTotal} className="w-full p-2 border bg-gray-100 rounded" /></div>
//         <div><label>Open Balance</label><input readOnly value={formData.openBalance} className="w-full p-2 border bg-gray-100 rounded" /></div>
//       </div>

//       <div className="mt-6">
//         <label className="font-medium">Remarks</label>
//         <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows={3} className="w-full p-2 border rounded"></textarea>
//       </div>

//       <div className="mt-6">
//   <label className="font-medium block mb-1">Attachments</label>

//   {/* Existing uploaded files */}
// {existingFiles.length > 0 && (
//   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
//     {existingFiles.map((file, idx) => {
//       const url = typeof file === "string"
//         ? file
//         : file?.fileUrl || file?.url || file?.path || file?.location || "";

//       const type = file?.fileType || "";
//       const name = file?.fileName || url?.split("/").pop() || `File-${idx}`;
//       if (!url) return null;

//       const isPDF = type === "application/pdf" || url.toLowerCase().endsWith(".pdf");

//       return (
//         <div key={idx} className="relative border rounded p-2 text-center">
//           {isPDF ? (
//             <object data={url} type="application/pdf" className="h-24 w-full rounded" />
//           ) : (
//             <img src={url} alt={name} className="h-24 w-full object-cover rounded" />
//           )}

//           <a
//             href={url}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="block text-blue-600 text-xs mt-1 truncate"
//           >
//             {name}
//           </a>

//           {!isReadOnly && (
//             <button
//               onClick={() => {
//                 setExistingFiles((prev) => prev.filter((_, i) => i !== idx));
//                 // Optional: keep track of deleted files if needed for API call
//                 setRemovedFiles((prev) => [...prev, file]);
//               }}
//               className="absolute top-1 right-1 bg-red-600 text-white rounded px-1 text-xs"
//             >
//               ×
//             </button>
//           )}
//         </div>
//       );
//     })}
//   </div>
// )}

//   {/* New Uploads */}
// <input
//   type="file"
//   multiple
//   accept="image/*,application/pdf"
//   disabled={isReadOnly}
//   onChange={(e) => {
//     if (isReadOnly) return;
//     const files = Array.from(e.target.files);
//     setAttachments((prev) => {
//       const m = new Map(prev.map((f) => [f.name + f.size, f]));
//       files.forEach((f) => m.set(f.name + f.size, f));
//       return [...m.values()];
//     });
//     e.target.value = "";
//   }}
//   className={isReadOnly ? `${ro} cursor-not-allowed` : base}
// />


//   {/* Previews of new uploads */}
//   {!isReadOnly && attachments.length > 0 && (
//     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
//       {attachments.map((file, idx) => {
//         const url = URL.createObjectURL(file);
//         const isPDF = file.type === "application/pdf";
//         const isImage = file.type.startsWith("image/");

//         return (
//           <div key={idx} className="relative border rounded p-2 text-center">
//             {isImage ? (
//               <img src={url} alt={file.name} className="h-24 w-full object-cover rounded" />
//             ) : isPDF ? (
//               <object data={url} type="application/pdf" className="h-24 w-full rounded" />
//             ) : (
//               <p className="truncate text-xs">{file.name}</p>
//             )}
//             <button
//               onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
//               className="absolute top-1 right-1 bg-red-600 text-white rounded px-1 text-xs"
//             >
//               ×
//             </button>
//           </div>
//         );
//       })}
//     </div>
//   )}
// </div>

//       <div className="mt-6 flex gap-4">
//         <button onClick={handleSubmit} disabled={submitting} className={`px-4 py-2 rounded text-white ${submitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-500"}`}>
//           {submitting ? "Saving..." : editId ? "Update Order" : "Create Order"}
//         </button>
//         <button onClick={() => { setFormData(initialOrderState); router.push("/admin/salesOrder"); }} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// }














"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import axios from "axios";
import ItemSection from "@/components/ItemSection";
import CustomerSearch from "@/components/CustomerSearch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialOrderState = {
  customerCode: "",
  customerName: "",
  contactPerson: "",
  refNumber: "",
  salesEmployee: "",
  status: "Pending",
  orderDate: "",
  expectedDeliveryDate: "",
  items: [
    {
      item: "",
      itemCode: "",
      itemId: "",
      itemName: "",
      itemDescription: "",
      quantity: 0,
      allowedQuantity: 0,
      receivedQuantity: 0,
      unitPrice: 0,
      discount: 0,
      freight: 0,
      taxOption: "GST",
      priceAfterDiscount: 0,
      totalAmount: 0,
      gstAmount: 0,
      gstRate: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      managedBy: "",
      batches: [],
      errorMessage: "",
      warehouse: "",
      warehouseName: "",
      warehouseCode: "",
      warehouseId: "",
      managedByBatch: true,
    },
  ],
  remarks: "",
  freight: 0,
  rounding: 0,
  totalDownPayment: 0,
  appliedAmounts: 0,
  totalBeforeDiscount: 0,
  gstTotal: 0,
  grandTotal: 0,
  openBalance: 0,
  fromQuote: false,
};

function formatDateForInput(date) {
  if (!date) return "";
  const d = new Date(date);
  return `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`;
}

async function fetchManagedBy(itemId) {
  if (!itemId) {
    console.warn("fetchManagedBy called with undefined itemId");
    return "";
  }

  try {
    const res = await axios.get(`/api/items/${itemId}`);
    return res.data.managedBy;
  } catch (error) {
    console.error("Error fetching managedBy for item", itemId, error);
    return "";
  }
}

function SalesOrderFormWrapper() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading form data...</div>}>
      <SalesOrderForm />
    </Suspense>
  );
}

function SalesOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("editId");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState(initialOrderState);

  useEffect(() => {
    const calcTotals = () => {
      const totalBeforeDiscount = formData.items.reduce((acc, item) => acc + (item.unitPrice - item.discount) * item.quantity, 0);
      const totalItems = formData.items.reduce((acc, item) => acc + item.totalAmount, 0);
      const gstTotal = formData.items.reduce((acc, item) => acc + (item.taxOption === "IGST" ? item.igstAmount : item.gstAmount), 0);
      const freight = parseFloat(formData.freight) || 0;
      const rounding = parseFloat(formData.rounding) || 0;
      const downPayment = parseFloat(formData.totalDownPayment) || 0;
      const applied = parseFloat(formData.appliedAmounts) || 0;
      const grandTotal = totalItems + gstTotal + freight + rounding;
      const openBalance = grandTotal - (downPayment + applied);

      setFormData(prev => ({
        ...prev,
        totalBeforeDiscount,
        gstTotal,
        grandTotal,
        openBalance,
      }));
    };
    calcTotals();
  }, [formData.items, formData.freight, formData.rounding, formData.totalDownPayment, formData.appliedAmounts]);

  useEffect(() => {
    const storedData = sessionStorage.getItem("salesOrderData");
    if (storedData) {
      (async () => {
        try {
          const parsed = JSON.parse(storedData);
          parsed.items = await Promise.all(
            parsed.items.map(async (item, idx) => {
              const itemId = item.item || item.item?._id || item.item || "";
              console.log(`Processing item[${idx}]`, itemId);
              const managedBy = await fetchManagedBy(itemId);
              return { ...item, managedBy: managedBy || "batch" };
            })
          );
          setFormData(parsed);
          setIsCopied(true);
          sessionStorage.removeItem("salesOrderData");
        } catch (e) {
          console.error("Error parsing salesOrderData", e);
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (editId && /^[0-9a-fA-F]{24}$/.test(editId)) {
      setLoading(true);
      axios.get(`/api/sales-order/${editId}`)
        .then(res => {
          const record = res.data.data;
          setFormData({
            ...record,
            customer: record.customer?._id || record.customer || "",
            postingDate: formatDateForInput(record.postingDate),
            validUntil: formatDateForInput(record.validUntil),
            documentDate: formatDateForInput(record.documentDate),
            items: record.items.map((item) => ({
              ...item,
              item: item.item?._id || item.item || "",
              warehouse: item.warehouse?._id || item.warehouse || "",
            }))
          });
        })
        .catch(err => setError(err.response?.data?.error || err.message))
        .finally(() => setLoading(false));
    }
  }, [editId]);

  const handleCustomerSelect = useCallback((selectedCustomer) => {
    setFormData(prev => ({
      ...prev,
      customer: selectedCustomer._id || "",
      customerCode: selectedCustomer.customerCode || "",
      customerName: selectedCustomer.customerName || "",
      contactPerson: selectedCustomer.contactPersonName || "",
    }));
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleItemChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const items = [...prev.items];
      items[index] = { ...items[index], [name]: value };
      return { ...prev, items };
    });
  }, []);

  const removeItemRow = useCallback((index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);


  const addItemRow = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...initialOrderState.items[0] }],
    }));
  }, []);

  const handleSubmit = async () => {
    try {
      // const updatedItems = await Promise.all(
      //   formData.items.map(async (item) => {
      //     const itemId = item.itemId || item.item?._id || item.item || "";
      //     const managedByValue = await fetchManagedBy(itemId);
      //     return { ...item, managedBy: managedByValue || "batch" };
      //   })
      // );
      const updatedFormData = { ...formData};

      if (editId) {
        await axios.put(`/api/sales-order/${editId}`, updatedFormData);
        toast.success("Sales Order updated successfully");
      } else {
        await axios.post("/api/sales-order", updatedFormData);
        toast.success("Sales Order added successfully");
        setFormData(initialOrderState);
      }
      router.push("/admin/sales-order-view");
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(editId ? "Failed to update Sales Order" : "Failed to add Sales Order");
    }
  };

  return (
    <div className="m-11 p-5 shadow-xl">
      <h1 className="text-2xl font-bold mb-4">
        {editId ? "Edit Sales Order" : "Create Sales Order"}
      </h1>
      {/* Customer Section */}
      <div className="flex flex-wrap justify-between m-10 p-5 border rounded-lg shadow-lg">
        <div className="basis-full md:basis-1/2 px-2 space-y-4">
          <div>
            {isCopied ? (
              <div>
                <label className="block mb-2 font-medium">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName || ""}
                  onChange={handleInputChange}
                  placeholder="Enter customer name"
                  className="w-full p-2 border rounded"
                />
              </div>
            ) : (
              <div>
                <label className="block mb-2 font-medium">Customer Name</label>
                <CustomerSearch onSelectCustomer={handleCustomerSelect} />
              </div>
            )}
          </div>
          <div>
            <label className="block mb-2 font-medium">Customer Code</label>
            <input
              type="text"
              name="customerCode"
              value={formData.customerCode || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Contact Person</label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson || ""}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Reference Number</label>
            <input
              type="text"
              name="refNumber"
              value={formData.refNumber || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        {/* Additional Order Info */}
        <div className="basis-full md:basis-1/2 px-2 space-y-4">
          <div>
            <label className="block mb-2 font-medium">Status</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select status (optional)</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Order Date</label>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">
              Expected Delivery Date
            </label>
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <h2 className="text-xl font-semibold mt-6">Items</h2>
      <div className="flex flex-col m-10 p-5 border rounded-lg shadow-lg">
        <ItemSection
          items={formData.items}
          onItemChange={handleItemChange}
          onAddItem={addItemRow}
        
              onRemoveItem={removeItemRow}
       
          setFormData={setFormData}
        />
      </div>

      {/* Remarks & Sales Employee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 font-medium">Sales Employee</label>
          <input
            type="text"
            name="salesEmployee"
            value={formData.salesEmployee || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          ></textarea>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <div>
          <label className="block mb-2 font-medium">Total Before Discount</label>
          <input
            type="number"
            value={formData.totalBeforeDiscount.toFixed(2)}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Rounding</label>
          <input
            type="number"
            name="rounding"
            value={formData.rounding || 0}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">GST Total</label>
          <input
            type="number"
            value={(formData.gstTotal ?? 0).toFixed(2)}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Grand Total</label>
          <input
            type="number"
            value={(formData.grandTotal ?? 0).toFixed(2)}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 p-8 m-8 border rounded-lg shadow-lg">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          {editId ? "Update" : "Add"}
        </button>
        <button
          onClick={() => {
            setFormData(initialOrderState);
            router.push("/admin/salesOrder");
          }}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            sessionStorage.setItem("salesOrderData", JSON.stringify(formData));
            alert("Data copied from Sales Order!");
          }}
          className="px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-300"
        >
          Copy From
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}
export default SalesOrderFormWrapper;
