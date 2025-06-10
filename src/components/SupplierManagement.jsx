// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
// import CountryStateSearch from "@/components/CountryStateSearch";
// import GroupSearch from "@/components/groupmaster";

// function SupplierManagement({ supplierId, supplierCode }) {
//    const [view, setView] = useState("list");
//   const [supplierList, setSupplierList] = useState([]);
//   const [suppliers, setSuppliers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);

//   const filteredSuppliers = supplierList.filter(
//     (supplier) =>
//       supplier.supplierCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supplier.emailId.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const [supplierDetails, setSupplierDetails] = useState({
//     supplierCode: "",
//     supplierName: "",
//     supplierType: "",
//     emailId: "",
//     mobileNumber: "",
//     billingAddress1: "",
//     billingAddress2: "",
//     billingCountry: null,
//     billingState: null,
//     billingCity: "",
//     billingZip: "",
//     shippingAddress1: "",
//     shippingAddress2: "",
//     shippingCountry: null,
//     shippingCity: "",
//     shippingState: null,
//     shippingZip: "",
//     paymentTerms: "",
//     gstNumber: "",
//     pan: "",
//     contactPersonName: "",
//     bankAccountNumber: "",
//     ifscCode: "",
//     leadTime: "",
//     qualityRating: "",
//     supplierCategory: "",
//   });

//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (supplierId) {
//       const fetchSupplierDetails = async () => {
//         try {
//           const response = await axios.get(`/api/suppliers/${supplierId}`);
//           setSupplierDetails(response.data);
//         } catch (error) {
//           console.error("Error fetching supplier details:", error);
//         }
//       };
//       fetchSupplierDetails();
//     } else {
//       generateSupplierCode();
//     }
//   }, [supplierId]);

//   const generateSupplierCode = async () => {
//     try {
//       const lastCodeRes = await fetch("/api/lastSupplierCode");
//       const { lastSupplierCode } = await lastCodeRes.json();
//       const lastNumber = parseInt(lastSupplierCode.split("-")[1], 10) || 0;
//       let newNumber = lastNumber + 1;

//       let generatedCode = "";
//       let codeExists = true;

//       while (codeExists) {
//         generatedCode = `SUPP-${newNumber.toString().padStart(4, "0")}`;
//         const checkRes = await axios.get(
//           `/api/checkSupplierCode?code=${generatedCode}`
//         );
//         const { exists } = await checkRes.data;
//         if (!exists) break;
//         newNumber++;
//       }

//       setSupplierDetails((prev) => ({
//         ...prev,
//         supplierCode: generatedCode,
//       }));
//     } catch (error) {
//       console.error("Failed to generate code:", error);
//     }
//   };

//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const handleGroupSelect = (group) => {
//     setSelectedGroup(group);
//     setSupplierDetails((prev) => ({ ...prev, supplierGroup: group.name }));
//   };

//   // Country/State handlers same as Customer component
//   const handleSelectBillingCountry = (country) => {
//     setSupplierDetails((prev) => ({ ...prev, billingCountry: country.name }));
//   };

//   const handleSelectBillingState = (state) => {
//     setSupplierDetails((prev) => ({ ...prev, billingState: state.name }));
//   };

//   const handleSelectShippingCountry = (country) => {
//     setSupplierDetails((prev) => ({ ...prev, shippingCountry: country.name }));
//   };

//   const handleSelectShippingState = (state) => {
//     setSupplierDetails((prev) => ({ ...prev, shippingState: state.name }));
//   };

//   const supplierTypeOptions = [
//     { value: "Manufacturer", label: "Manufacturer" },
//     { value: "Distributor", label: "Distributor" },
//     { value: "Wholesaler", label: "Wholesaler" },
//     { value: "Service", label: "Service" },
//   ];

//   const validate = () => {
//     const requiredFields = [
//       "supplierName",
//       "emailId",
//       "billingAddress1",
//       "billingCity",
//       "billingCountry",
//       "billingState",
//       "billingZip",
//       "bankAccountNumber",
//       "ifscCode",
//     ];

//     for (const field of requiredFields) {
//       if (!supplierDetails[field]) {
//         alert(`Please fill the required field: ${field}`);
//         return false;
//       }
//     }
//     return true;
//   };

//   useEffect(() => {
//     const fetchSuppliers = async () => {
//       try {
//         const response = await axios.get("/api/suppliers");
//         setSupplierList(response.data || []);
//       } catch (err) {
//         console.error("Error fetching suppliers:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSuppliers();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       if (isEditing) {
//         const res = await axios.put(
//           `/api/suppliers/${supplierDetails._id}`,
//           supplierDetails
//         );
//         setSuppliers(
//           suppliers.map((supplier) =>
//             supplier._id === supplierDetails._id ? res.data : supplier
//           )
//         );
//         alert("Supplier updated successfully!");
//       } else {
//         const res = await axios.post("/api/suppliers", supplierDetails);
//         setSuppliers([...suppliers, res.data]);
//         alert("Supplier created successfully!");
//       }
//       resetForm();
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       alert(error.response?.data?.error || "Form submission error");
//     }
//   };

//   const resetForm = () => {
//     setSupplierDetails({
//       supplierCode: "",
//       supplierName: "",
//       supplierGroup: "",
//       supplierType: "",
//       emailId: "",
//       mobileNumber: "",
//       billingAddress1: "",
//       billingAddress2: "",
//       billingCity: "",
//       billingZip: "",
//       shippingAddress1: "",
//       shippingAddress2: "",
//       shippingCity: "",
//       shippingZip: "",
//       paymentTerms: "",
//       gstNumber: "",
//       pan: "",
//       contactPersonName: "",
//       bankAccountNumber: "",
//       ifscCode: "",
//       leadTime: "",
//       qualityRating: "",
//       supplierCategory: "",
//     });
//     setIsEditing(false);
//   };

//   const handleEdit = (supplier) => {
//     setSupplierDetails(supplier);
//     setIsEditing(true);
//   };

//   const handleDelete = async (id) => {
//     if (confirm("Delete this supplier?")) {
//       try {
//         await axios.delete(`/api/suppliers/${id}`);
//         setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
//       } catch (error) {
//         console.error("Error deleting supplier:", error);
//       }
//     }
//   };


  
//   // Filter customers based on search term
//   const filteredCustomers = customers.filter(
//     (supplier) =>
//       supplier.supplierCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supplier.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       supplier.emailId?.toLowerCase().includes(searchTerm.toLowerCase())
//   );




//       {/* <h2 className="text-2xl font-bold text-blue-600 mt-12">Supplier List</h2>
//       <div className="mt-6 bg-gray-100 p-6 rounded-lg shadow-lg">
//         <input
//           type="text"
//           placeholder="Search suppliers..."
//           className="mb-4 p-2 border border-gray-300 rounded w-full"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <table className="table-auto w-full border border-gray-300">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2 border">Supplier Code</th>
//               <th className="p-2 border">Supplier Name</th>
//               <th className="p-2 border">Email</th>
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSuppliers.map((supplier) => (
//               <tr key={supplier._id} className="hover:bg-gray-50">
//                 <td className="p-2 border">{supplier.supplierCode}</td>
//                 <td className="p-2 border">{supplier.supplierName}</td>
//                 <td className="p-2 border">{supplier.emailId}</td>
//                 <td className="p-2 border flex gap-2">
//                   <button
//                     onClick={() => handleEdit(supplier)}
//                     className="text-blue-500"
//                   >
//                     <FaEdit />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(supplier._id)}
//                     className="text-red-500"
//                   >
//                     <FaTrash />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div> */}





//  const renderListView = () => (

//  );

  
//       // Render customer form view


      
//   const renderFormView = () => (
//     <div className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
//       <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
//         {isEditing ? "Edit Supplier" : "Create Supplier"}
//       </h1>

//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Supplier Code
//             </label>
//             <input
//               type="text"
//               value={supplierDetails.supplierCode}
//               readOnly
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Supplier Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={supplierDetails.supplierName}
//               onChange={(e) =>
//                 setSupplierDetails({
//                   ...supplierDetails,
//                   supplierName: e.target.value,
//                 })
//               }
//               required
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Supplier Category
//             </label>
//             <GroupSearch onSelectGroup={handleGroupSelect} />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-gray-700 mb-2">
//               Supplier Type
//             </label>
//             <select
//               value={supplierDetails.supplierType}
//               onChange={(e) =>
//                 setSupplierDetails({
//                   ...supplierDetails,
//                   supplierType: e.target.value,
//                 })
//               }
//               className="border border-gray-300 rounded-lg px-4 py-2 w-full"
//             >
//               {supplierTypeOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Add remaining supplier-specific fields following same pattern */}
//           {/* Include banking details, quality ratings, lead times, etc. */}

          
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Email ID <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 value={supplierDetails.emailId}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     emailId: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Mobile Number
//               </label>
//               <input
//                 type="text"
//                 value={supplierDetails.mobileNumber}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     mobileNumber: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Billing Address
//               </label>
//               <input
//                 type="text"
//                 placeholder="Address Line 1"
//                 value={supplierDetails.billingAddress1}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     billingAddress1: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//               <input
//                 type="text"
//                 placeholder="Address Line 2"
//                 value={supplierDetails.billingAddress2}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     billingAddress2: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//               <input
//                 type="text"
//                 placeholder="City"
//                 value={supplierDetails.billingCity}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     billingCity: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//               <CountryStateSearch
//                 onSelectCountry={handleSelectBillingCountry}
//                 onSelectState={handleSelectBillingState}
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//               <input
//                 type="text"
//                 placeholder="PIN Code"
//                 value={supplierDetails.billingZip}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     billingZip: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Shipping Address
//               </label>
//               <input
//                 type="text"
//                 placeholder="Address Line 1"
//                 value={supplierDetails.shippingAddress1}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     shippingAddress1: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//               <input
//                 type="text"
//                 placeholder="Address Line 2"
//                 value={supplierDetails.shippingAddress2}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     shippingAddress2: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//               <input
//                 type="text"
//                 placeholder="City"
//                 value={supplierDetails.shippingCity}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     shippingCity: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//               <CountryStateSearch
//                 onSelectCountry={handleSelectShippingCountry}
//                 onSelectState={handleSelectShippingState}
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
//               />
//               <input
//                 type="text"
//                 placeholder="PIN Code"
//                 value={supplierDetails.shippingZip}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     shippingZip: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
          
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Payment Terms
//               </label>
//               <input
//                 type="text"
//                 value={supplierDetails.paymentTerms}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     paymentTerms: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 GST Number
//               </label>
//               <input
//                 type="text"
//                 value={supplierDetails.gstNumber}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     gstNumber: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 GST Category
//               </label>
//               <input
//                 type="text"
//                 value={supplierDetails.gstCategory}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     gstCategory: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 PAN
//               </label>
//               <input
//                 type="text"
//                 value={supplierDetails.pan}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     pan: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Contact Person Name
//               </label>
//               <input
//                 type="text"
//                 value={supplierDetails.contactPersonName}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     contactPersonName: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             {/* Supplier Specific Fields */}
//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Bank Account Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={supplierDetails.bankAccountNumber}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     bankAccountNumber: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 IFSC Code <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={supplierDetails.ifscCode}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     ifscCode: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Lead Time (Days)
//               </label>
//               <input
//                 type="number"
//                 value={supplierDetails.leadTime}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     leadTime: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium text-gray-700 mb-2">
//                 Quality Rating
//               </label>
//               <select
//                 value={supplierDetails.qualityRating}
//                 onChange={(e) =>
//                   setSupplierDetails({
//                     ...supplierDetails,
//                     qualityRating: e.target.value,
//                   })
//                 }
//                 className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Rating</option>
//                 <option value="A">Excellent (A)</option>
//                 <option value="B">Good (B)</option>
//                 <option value="C">Average (C)</option>
//                 <option value="D">Poor (D)</option>
//               </select>
//             </div>

          
         
//         </div>

//         <div className="flex gap-3 mt-8">
//           <button
//             type="submit"
//             className={`px-6 py-3 text-white rounded-lg ${
//               isEditing ? "bg-blue-600" : "bg-green-600"
//             }`}
//           >
//             {isEditing ? "Update Supplier" : "Create Supplier"}
//           </button>
//           <button
//             type="button"
//             onClick={resetForm}
//             className="bg-gray-600 text-white rounded-lg px-6 py-3"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>

//     </div>
//   );

//   return view === "list" ? renderListView() : renderFormView();
// }

// export default SupplierManagement;





import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import CountryStateSearch from "@/components/CountryStateSearch";
import GroupSearch from "@/components/groupmaster";

function SupplierManagement() {
  // State management
  const [view, setView] = useState("list"); // 'list' or 'form'
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [supplierDetails, setSupplierDetails] = useState({
    supplierCode: "",
    supplierName: "",
    supplierGroup: "",
    supplierType: "",
    emailId: "",
    mobileNumber: "",
    billingAddress1: "",
    billingAddress2: "",
    billingCountry: "",
    billingState: "",
    billingCity: "",
    billingZip: "",
    shippingAddress1: "",
    shippingAddress2: "",
    shippingCountry: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    paymentTerms: "",
    gstNumber: "",
    pan: "",
    contactPersonName: "",
    bankAccountNumber: "",
    ifscCode: "",
    leadTime: "",
    qualityRating: "",
    supplierCategory: "",
  });

  // Fetch suppliers on mount
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/suppliers");
      setSuppliers(response.data || []);
    } catch (err) {
      setError("Unable to fetch suppliers. Please try again.");
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  // Generate supplier code for new suppliers
  const generateSupplierCode = async () => {
    try {
      const lastCodeRes = await fetch("/api/lastSupplierCode");
      const { lastSupplierCode } = await lastCodeRes.json();
      const lastNumber = parseInt(lastSupplierCode.split("-")[1], 10) || 0;
      let newNumber = lastNumber + 1;

      let generatedCode = "";
      let codeExists = true;

      while (codeExists) {
        generatedCode = `SUPP-${newNumber.toString().padStart(4, "0")}`;
        const checkRes = await fetch(
          `/api/checkSupplierCode?code=${generatedCode}`
        );
        const { exists } = await checkRes.json();
        if (!exists) break;
        newNumber++;
      }

      setSupplierDetails(prev => ({
        ...prev,
        supplierCode: generatedCode,
      }));
    } catch (error) {
      console.error("Failed to generate code:", error);
    }
  };

  // Handle group selection
  const handleGroupSelect = (group) => {
    setSupplierDetails(prev => ({ 
      ...prev, 
      supplierGroup: group.name 
    }));
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplierDetails(prev => ({ ...prev, [name]: value }));
  };

  // Form validation
  const validate = () => {
    const requiredFields = [
      "supplierName",
      "emailId",
      "billingAddress1",
      "billingCity",
      "billingCountry",
      "billingState",
      "billingZip",
      "bankAccountNumber",
      "ifscCode",
    ];

    for (const field of requiredFields) {
      if (!supplierDetails[field]) {
        alert(`Please fill the required field: ${field}`);
        return false;
      }
    }
    return true;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (supplierDetails._id) {
        // Update existing supplier
        const res = await axios.put(
          `/api/suppliers/${supplierDetails._id}`,
          supplierDetails
        );
        setSuppliers(suppliers.map(s => 
          s._id === supplierDetails._id ? res.data : s
        ));
        alert("Supplier updated successfully!");
      } else {
        // Create new supplier
        const res = await axios.post("/api/suppliers", supplierDetails);
        setSuppliers([...suppliers, res.data]);
        alert("Supplier created successfully!");
      }
      setView("list");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error.response?.data?.error || "There was an error submitting the form.");
    }
  };

  // Reset form and switch to list view
  const resetForm = () => {
    setSupplierDetails({
      supplierCode: "",
      supplierName: "",
      supplierGroup: "",
      supplierType: "",
      emailId: "",
      mobileNumber: "",
      billingAddress1: "",
      billingAddress2: "",
      billingCountry: "",
      billingState: "",
      billingCity: "",
      billingZip: "",
      shippingAddress1: "",
      shippingAddress2: "",
      shippingCountry: "",
      shippingCity: "",
      shippingState: "",
      shippingZip: "",
      paymentTerms: "",
      gstNumber: "",
      pan: "",
      contactPersonName: "",
      bankAccountNumber: "",
      ifscCode: "",
      leadTime: "",
      qualityRating: "",
      supplierCategory: "",
    });
    setView("list");
  };

  // Edit supplier handler
  const handleEdit = (supplier) => {
    setSupplierDetails(supplier);
    setView("form");
  };

  // Delete supplier handler
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this supplier?")) return;
    
    try {
      await axios.delete(`/api/suppliers/${id}`);
      setSuppliers(suppliers.filter(supplier => supplier._id !== id));
      alert("Supplier deleted successfully!");
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("Failed to delete supplier. Please try again.");
    }
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.supplierCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.supplierName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.emailId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Supplier type options
  const supplierTypeOptions = [
    { value: "Manufacturer", label: "Manufacturer" },
    { value: "Distributor", label: "Distributor" },
    { value: "Wholesaler", label: "Wholesaler" },
    { value: "Service", label: "Service" },
  ];

  // Quality rating options
  const qualityRatingOptions = [
    { value: "A", label: "Excellent (A)" },
    { value: "B", label: "Good (B)" },
    { value: "C", label: "Average (C)" },
    { value: "D", label: "Poor (D)" },
  ];

  // Render supplier list view
  const renderListView = () => (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
        <button
          onClick={() => {
            generateSupplierCode();
            setView("form");
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center"
        >
          <FaPlus className="mr-2" /> Create Supplier
        </button>
      </div>

      <div className="mb-6 relative">
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 px-4 w-full focus:outline-none"
          />
          <FaSearch className="text-gray-500 mx-4" />
        </div>
      </div>

      {loading ? (
        <p>Loading suppliers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Code</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Group</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{supplier.supplierCode}</td>
                  <td className="py-3 px-4">{supplier.supplierName}</td>
                  <td className="py-3 px-4">{supplier.emailId}</td>
                  <td className="py-3 px-4">{supplier.mobileNumber}</td>
                  <td className="py-3 px-4">{supplier.supplierGroup}</td>
                  <td className="py-3 px-4">{supplier.supplierType}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(supplier._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  // Render supplier form view
  const renderFormView = () => (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        {supplierDetails._id ? "Edit Supplier" : "Create Supplier"}
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Code
            </label>
            <input
              type="text"
              value={supplierDetails.supplierCode}
              readOnly
              className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="supplierName"
              value={supplierDetails.supplierName}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Group
            </label>
            <GroupSearch 
              onSelectGroup={handleGroupSelect}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Type
            </label>
            <select
              name="supplierType"
              value={supplierDetails.supplierType}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              {supplierTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="emailId"
              value={supplierDetails.emailId}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={supplierDetails.mobileNumber}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="billingAddress1"
                  value={supplierDetails.billingAddress1}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="billingAddress2"
                  value={supplierDetails.billingAddress2}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="billingCity"
                  value={supplierDetails.billingCity}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country/State <span className="text-red-500">*</span>
                </label>
                <CountryStateSearch
                  onSelectCountry={(country) => 
                    setSupplierDetails(prev => ({ 
                      ...prev, 
                      billingCountry: country.name 
                    }))
                  }
                  onSelectState={(state) => 
                    setSupplierDetails(prev => ({ 
                      ...prev, 
                      billingState: state.name 
                    }))
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="billingZip"
                  value={supplierDetails.billingZip}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="shippingAddress1"
                  value={supplierDetails.shippingAddress1}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="shippingAddress2"
                  value={supplierDetails.shippingAddress2}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="shippingCity"
                  value={supplierDetails.shippingCity}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country/State
                </label>
                <CountryStateSearch
                  onSelectCountry={(country) => 
                    setSupplierDetails(prev => ({ 
                      ...prev, 
                      shippingCountry: country.name 
                    }))
                  }
                  onSelectState={(state) => 
                    setSupplierDetails(prev => ({ 
                      ...prev, 
                      shippingState: state.name 
                    }))
                  }
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="shippingZip"
                  value={supplierDetails.shippingZip}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Terms
            </label>
            <input
              type="text"
              name="paymentTerms"
              value={supplierDetails.paymentTerms}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GST Number
            </label>
            <input
              type="text"
              name="gstNumber"
              value={supplierDetails.gstNumber}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PAN
            </label>
            <input
              type="text"
              name="pan"
              value={supplierDetails.pan}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPersonName"
              value={supplierDetails.contactPersonName}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Account <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="bankAccountNumber"
              value={supplierDetails.bankAccountNumber}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              IFSC Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="ifscCode"
              value={supplierDetails.ifscCode}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lead Time (Days)
            </label>
            <input
              type="number"
              name="leadTime"
              value={supplierDetails.leadTime}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality Rating
            </label>
            <select
              name="qualityRating"
              value={supplierDetails.qualityRating}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Rating</option>
              {qualityRatingOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier Category
            </label>
            <input
              type="text"
              name="supplierCategory"
              value={supplierDetails.supplierCategory}
              onChange={handleChange}
              className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            className={`px-6 py-3 text-white rounded-lg focus:outline-none ${
              supplierDetails._id ? "bg-blue-600" : "bg-green-600"
            } hover:${supplierDetails._id ? "bg-blue-700" : "bg-green-700"}`}
          >
            {supplierDetails._id ? "Update Supplier" : "Create Supplier"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  return view === "list" ? renderListView() : renderFormView();
}

export default SupplierManagement;
