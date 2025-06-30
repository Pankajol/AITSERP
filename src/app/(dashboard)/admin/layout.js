"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import LogoutButton from "@/components/LogoutButton";
import {
  HiHome,
  HiUsers,
  HiViewGrid,
  HiCurrencyDollar,
  HiChevronDown,
  HiChevronRight,
  HiShoppingCart,
  HiUserGroup,
  HiOutlineCube,
  HiOutlineCreditCard,
  HiPuzzle,
  HiOutlineLibrary,
  HiGlobeAlt,
  HiFlag,
  HiOutlineOfficeBuilding,
  HiCube,
  HiReceiptTax,
  HiChartSquareBar
} from "react-icons/hi";
import { SiCivicrm } from "react-icons/si";
import { GiStockpiles } from "react-icons/gi";
import TopBar from "@/components/TopBar";

export default function AdminSidebar({ children }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
    else {
      try { jwtDecode(token); }
      catch { localStorage.removeItem("token"); router.push("/"); }
    }
  }, [router]);

  const toggleMenu = (key) => {
    setOpenMenu(prev => prev === key ? null : key);
    setOpenSubmenu(null);
  };
  const toggleSubmenu = (key) => {
    setOpenSubmenu(prev => prev === key ? null : key);
  };

  return (
    <div className="min-h-screen flex">
        {/* <TopBar /> */}
      <aside className="fixed w-64 h-full overflow-y-auto bg-gray-700 text-white p-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><HiHome /> Dashboard</h2>
        <nav className="space-y-3">

          {/* Masters */}
          <Section title="Masters" icon={<HiUsers />} isOpen={openMenu==='master'} onToggle={()=>toggleMenu('master')}>
            <Item href="/admin/createCustomers" icon={<HiUserGroup />} label="Create Customer" />
            <Item href="/admin/Countries" icon={<HiGlobeAlt />} label="Countries" />
            <Item href="/admin/State" icon={<HiFlag />} label="State" />
            <Item href="/admin/City" icon={<HiOutlineOfficeBuilding />} label="City" />
            <Item href="/admin/supplier" icon={<HiUserGroup />} label="Supplier" />
            <Item href="/admin/item" icon={<HiCube />} label="Item" />
            {/* <Item href="/admin/PaymentDetailsForm" icon={<HiCurrencyDollar />} label="Payment Details Form" />
            <Item href="/admin/PaymentDetailsForm1" icon={<HiOutlineCreditCard />} label="Payment Details Form1" /> */}
            {/* <Item href="/admin/PurchaseReceiptForm" icon={<HiReceiptTax />} label="Purchase Receipt Form" /> */}
            <Item href="/admin/WarehouseDetailsForm" icon={<HiOutlineLibrary />} label="Warehouse Details Form" />
            <Item href="/admin/CreateGroup" icon={<HiUserGroup />} label="Create Group" />
            <Item href="/admin/CreateItemGroup" icon={<HiOutlineCube />} label="Create Item Group" />
            <Item href="/admin/account-bankhead" icon={<HiOutlineLibrary />} label="Account Head Details" />
            <Item href="/admin/bank-head-details" icon={<HiCurrencyDollar />} label="Bank Head Details" />
          </Section>

          {/* Masters View */}
          <Section title="Masters View" icon={<HiViewGrid />} isOpen={openMenu==='masterView'} onToggle={()=>toggleMenu('masterView')}>
            <Item href="/admin/customer-view" icon={<HiUsers />} label="Customer View" />
            <Item href="/admin/supplier" icon={<HiUserGroup />} label="Supplier View" />
            <Item href="/admin/item" icon={<HiCube />} label="Item View" />
            <Item href="/admin/account-head-view" icon={<HiOutlineLibrary />} label="Account Head View" />
            <Item href="/admin/bank-head-details-view" icon={<HiCurrencyDollar />} label="Bank Head Details View" />
          </Section>

          {/* Transactions */}
          <div>
            <button onClick={()=>toggleMenu('transactions')} className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600">
              <div className="flex items-center gap-2"><HiCurrencyDollar /> Transactions</div>
              {openMenu==='transactions'?<HiChevronDown/>:<HiChevronRight/>}
            </button>
            {openMenu==='transactions'&&(
              <div className="ml-6 mt-2 space-y-1">
                <button onClick={()=>toggleSubmenu('sales')} className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600">
                  <div className="flex items-center gap-2"><HiShoppingCart /> Sales</div>
                  {openSubmenu==='sales'?<HiChevronDown/>:<HiChevronRight/>}
                </button>
                {openSubmenu==='sales'&&(
                  <div className="ml-4 mt-1 space-y-1">
                    <Item href="/admin/sales-quotation" icon={<HiChevronDown />} label="Quotation" />
                    <Item href="/admin/sales-order" icon={<HiChevronRight />} label="Order" />
                    <Item href="/admin/delivery" icon={<HiOutlineCube />} label="Delivery" />
                    <Item href="/admin/sales-invoice" icon={<HiOutlineCreditCard />} label="Invoice" />
                    <Item href="/admin/credit-memo" icon={<HiReceiptTax />} label="Credit Memo" />
                  </div>
                )}
                <button onClick={()=>toggleSubmenu('purchase')} className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600">
                  <div className="flex items-center gap-2"><HiPuzzle /> Purchase</div>
                  {openSubmenu==='purchase'?<HiChevronDown/>:<HiChevronRight/>}
                </button>
                {openSubmenu==='purchase'&&(
                  <div className="ml-4 mt-1 space-y-1">
                    <Item href="/admin/purchase-quotation" icon={<HiChevronDown />} label="Quotation" />
                    <Item href="/admin/purchase-order" icon={<HiChevronRight />} label="Order" />
                    <Item href="/admin/purchase-receipt" icon={<HiReceiptTax />} label="Receipt" />
                    <Item href="/admin/purchase-invoice" icon={<HiCurrencyDollar />} label="Invoice" />
                    <Item href="/admin/debit-memo" icon={<HiOutlineCreditCard />} label="Debit Memo" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Transactions View */}
          <div>
            <button onClick={()=>toggleMenu('transactionsView')} className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600">
              <div className="flex items-center gap-2"><HiOutlineCreditCard /> Transactions View</div>
              {openMenu==='transactionsView'?<HiChevronDown/>:<HiChevronRight/>}
            </button>
            {openMenu==='transactionsView'&&(
              <div className="ml-6 mt-2 space-y-1">
                <button onClick={()=>toggleSubmenu('tvSales')} className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600">
                  <div className="flex items-center gap-2"><HiShoppingCart /> Sales</div>
                  {openSubmenu==='tvSales'?<HiChevronDown/>:<HiChevronRight/>}
                </button>
                {openSubmenu==='tvSales'&&(
                  <div className="ml-4 mt-1 space-y-1">
                    <Item href="/admin/sales-quotation-view" icon={<HiChevronDown />} label="Quotation View" />
                    <Item href="/admin/sales-order-view" icon={<HiChevronRight />} label="Order View" />
                    <Item href="/admin/delivery-view" icon={<HiOutlineCube />} label="Delivery View" />
                    <Item href="/admin/sales-invoice-view" icon={<HiOutlineCreditCard />} label="Invoice View" />
                    <Item href="/admin/credit-memo-veiw" icon={<HiReceiptTax />} label="Credit Memo View" />
                    <Item href="/admin/sales-report" icon={<HiChartSquareBar />} label="Report" />
                  </div>
                )}
                <button onClick={()=>toggleSubmenu('tvPurchase')} className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600">
                  <div className="flex items-center gap-2"><GiStockpiles /> Purchase</div>
                  {openSubmenu==='tvPurchase'?<HiChevronDown/>:<HiChevronRight/>}
                </button>
                {openSubmenu==='tvPurchase'&&(
                  <div className="ml-4 mt-1 space-y-1">
                    <Item href="/admin/PurchaseQuotationList" icon={<HiChevronDown />} label="Quotation View" />
                    <Item href="/admin/purchase-order-view" icon={<HiChevronRight />} label="Order View" />
                    <Item href="/admin/grn-view" icon={<HiOutlineCube />} label="GRN View" />
                    <Item href="/admin/purchaseInvoice-view" icon={<HiOutlineCreditCard />} label="Invoice View" />
                    <Item href="/admin/debit-notes-view" icon={<HiReceiptTax />} label="Debit Notes View" />
                    <Item href="/admin/purchase-report" icon={<HiChartSquareBar />} label="Report" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CRM */}
          <Section title="CRM" icon={<SiCivicrm />} isOpen={openMenu==='CRM'} onToggle={()=>toggleMenu('CRM')}>
            <Item href="/admin/LeadDetailsFormMaster" icon={<HiUserGroup />} label="Lead Generation" />
            <Item href="/admin/OpportunityDetailsForm" icon={<HiPuzzle />} label="Opportunity" />
          </Section>
           {/* CRM-View */}
          <Section title="CRM-View" icon={<SiCivicrm />} isOpen={openMenu==='CRM-View'} onToggle={()=>toggleMenu('CRM-View')}>
            <Item href="/admin/leads-view" icon={<HiUserGroup />} label="Lead Generation  " />
            <Item href="/admin/opportunities" icon={<HiPuzzle />} label="Opportunity" />
                <Item href="#" icon={<HiPuzzle />} label="Report" />
          </Section>

          {/* Stock */}
          <Section title="Stock" icon={<HiOutlineCube />} isOpen={openMenu==='Stock'} onToggle={()=>toggleMenu('Stock')}>
            <Item href="/admin/InventoryView" icon={<HiOutlineLibrary />} label="Inventory View" />
             <Item href="/admin/InventoryEntry" icon={<HiOutlineLibrary />} label="Inventory Entry" />
              <Item href="/admin/InventoryView" icon={<HiOutlineLibrary />} label="Inventory View" />
          </Section>

          {/* Payment */}
          <Section title="Payment" icon={<HiOutlineCreditCard />} isOpen={openMenu==='Payment'} onToggle={()=>toggleMenu('Payment')}>
            <Item href="/admin/Payment" icon={<HiCurrencyDollar />} label="Payment Form" />
          </Section>

          {/* Production */}
          <Section title="Production" icon={<HiPuzzle />} isOpen={openMenu==='Production'} onToggle={()=>toggleMenu('Production')}>
            <Item href="/admin/bom" icon={<HiOutlineCube />} label="BoM" />
            <Item href="/admin/ProductionOrder" icon={<HiReceiptTax />} label="Production Order" />
            {/* <Item href="/admin/issueForProduction" icon={<HiOutlineLibrary />} label="Issue for Production" />
            <Item href="/admin/reciptFromProduction" icon={<HiOutlineOfficeBuilding />} label="Receipt from Production" /> */}
          </Section>

          {/* Production View */}
          <Section title="Production View" icon={<HiOutlineLibrary />} isOpen={openMenu==='ProductionView'} onToggle={()=>toggleMenu('ProductionView')}>
            <Item href="/admin/bom-view" icon={<HiOutlineCube />} label="BoM View" />
            <Item href="/admin/productionorders-list-view" icon={<HiReceiptTax />} label="Production Orders View" />
            {/* <Item href="/admin/issueForProduction-view" icon={<HiOutlineLibrary />} label="Issue for Production View" />
            <Item href="/admin/reciptFromProduction-view" icon={<HiOutlineOfficeBuilding />} label="Receipt for Production View" /> */}
          </Section>

          {/* Logout */}
          <div className="mt-6"><LogoutButton /></div>
        </nav>
      </aside>
      <main className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">{children}</main>
    </div>
  );
}

function Section({ title, icon, children, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600">
        <div className="flex items-center gap-2">{icon} {title}</div>
        {isOpen ? <HiChevronDown /> : <HiChevronRight />}
      </button>
      {isOpen && <div className="ml-6 mt-2 space-y-1">{children}</div>}
    </div>
  );
}

function Item({ href, icon, label }) {
  return <Link href={href} className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-600">{icon} {label}</Link>;
}



// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode"; // Fixed import (jwtDecode is default export)
// import LogoutButton from "@/components/LogoutButton";
// import {
//   HiHome,
//   HiUsers,
//   HiViewGrid,
//   HiCurrencyDollar,
//   HiChevronDown,
//   HiChevronRight,
//   HiShoppingCart,
//   HiUserGroup,
//   HiOutlineCube,
//   HiOutlineCreditCard,
//   HiPuzzle,
//   HiOutlineLibrary 

  
// } from "react-icons/hi";
// import {SiCivicrm, } from "react-icons/si";


// export default function AdminSidebar({ children }) {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [openMenu, setOpenMenu] = useState(null);
//   const [submenuOpen, setSubmenuOpen] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/");
//     } else {
//       try {
//         const decodedToken = jwtDecode(token);
//         setUser(decodedToken);
//       } catch (error) {
//         console.error("Invalid token", error);
//         localStorage.removeItem("token");
//         router.push("/");
//       }
//     }
//   }, [router]);

//   const toggleMenu = (menuName) => {
//     setOpenMenu((prev) => {
//       if (prev === menuName) {
//         setSubmenuOpen("");
//         return null;
//       }
//       return menuName;
//     });
//   };

//   const toggleSubmenu = (menuName) => {
//     setSubmenuOpen((prev) => (prev === menuName ? "" : menuName));
//   };

//   return (
//     <div className="min-h-screen flex">
//       {/* Fixed Sidebar */}
//       <aside className="fixed w-64 h-full overflow-y-auto bg-gray-700 text-white p-4">
//         <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
//           <HiHome className="inline-block" />
//           Dashboard
//         </h2>

//         <nav className="space-y-3">
//           {/* Masters Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("master")}
//               className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//             >
//               <span className="flex items-center gap-2">
//                 <HiUsers size={20} />
//                 Masters
//               </span>
//               {openMenu === "master" ? <HiChevronDown /> : <HiChevronRight />}
//             </button>
//             {openMenu === "master" && (
//               <div className="ml-6 mt-2 space-y-1 max-h-[calc(100vh-160px)] overflow-y-auto">
//                 {/* <Link href="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   User
//                 </Link> */}
//                 <Link href="/admin/createCustomers" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   CreateCustomer
//                 </Link>
//                 <Link href="/admin/Countries" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Countries
//                 </Link>
//                 <Link href="/admin/State" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   State
//                 </Link>
//                 <Link href="/admin/City" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   City
//                 </Link>
//                 {/* <Link href="/admin/customers" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Customers
//                 </Link> */}
//                 <Link href="/admin/supplier" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Supplier
//                 </Link>
//                 <Link href="/admin/item" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Item
//                 </Link>
//                 <Link href="/admin/PaymentDetailsForm" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   PaymentDetailsForm
//                 </Link>
//                 <Link href="/admin/PaymentDetailsForm1" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   PaymentDetailsForm1
//                 </Link>
//                 <Link href="/admin/PurchaseReceiptForm" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   PurchaseReceiptForm
//                 </Link>
//                 <Link href="/admin/WarehouseDetailsForm" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   WarehouseDetailsForm
//                 </Link>
//                 <Link href="/admin/CreateGroup" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   CreateGroup
//                 </Link>
//                 <Link href="/admin/CreateItemGroup" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   CreateItemGroup
//                 </Link>
//                 <Link href="/admin/account-bankhead" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Account head details
//                 </Link>
//                 <Link href="/admin/bank-head-details" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Bank head details
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Masters-View Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("master-view")}
//               className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//             >
//               <span className="flex items-center gap-2">
//                 <HiViewGrid size={20} />
//                 Masters-View
//               </span>
//               {openMenu === "master-view" ? <HiChevronDown /> : <HiChevronRight />}
//             </button>
//             {openMenu === "master-view" && (
//               <div className="ml-6 mt-2 space-y-1">
//                 <Link href="/admin/customer-view" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Customers
//                 </Link>
//                 <Link href="/admin/supplier" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Supplier
//                 </Link>
//                 <Link href="/admin/item" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Item
//                 </Link>
//                 <Link href="/admin/account-head-view" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Account head
//                 </Link>
//                 <Link href="/admin/bank-head-details-view" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Bank head details
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Transactions Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("transaction")}
//               className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//             >
//               <span className="flex items-center gap-2">
//                 <HiCurrencyDollar size={20} />
//                 Transactions
//               </span>
//               {openMenu === "transaction" ? <HiChevronDown /> : <HiChevronRight />}
//             </button>
//             {openMenu === "transaction" && (
//               <div className="ml-6 mt-2 space-y-2">
//                 {/* Sales Submenu */}
//                 <button
//                   onClick={() => toggleSubmenu("sales")}
//                   className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   <span>Sales</span>
//                   {submenuOpen === "sales" ? <HiChevronDown /> : <HiChevronRight />}
//                 </button>
//                 {submenuOpen === "sales" && (
//                   <div className="ml-6 mt-2 space-y-1">
//                     <Link href="/admin/sales-quotation" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Quotation
//                     </Link>
//                     <Link href="/admin/sales-order" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Order
//                     </Link>
//                     <Link href="/admin/delivery" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Delivery
//                     </Link>
//                     <Link href="/admin/sales-invoice" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Invoice
//                     </Link>
//                     <Link href="/admin/credit-memo" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Credit Note
//                     </Link>
//                   </div>
//                 )}

//                 {/* Purchase Submenu */}
//                 <button
//                   onClick={() => toggleSubmenu("purchase")}
//                   className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//                 >
//                   <span>Purchase</span>
//                   {submenuOpen === "purchase" ? <HiChevronDown /> : <HiChevronRight />}
//                 </button>
//                 {submenuOpen === "purchase" && (
//                   <div className="ml-6 mt-2 space-y-1">
//                     <Link href="/admin/purchase-quotation" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Quotation
//                     </Link>
//                     <Link href="/admin/purchase-order" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Order
//                     </Link>
//                     <Link href="/admin/purchase-receipt" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Receipt
//                     </Link>
//                     <Link href="/admin/purchase-invoice" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Invoice
//                     </Link>
//                     <Link href="/admin/debit-memo" className="block px-4 py-2 rounded hover:bg-gray-600">
//                       Debit Note
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Transactions View Menu */}
// <div className="relative">
//   <button
//     onClick={() => toggleMenu("transactions-view")}
//     className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//   >
//     <span className="flex items-center gap-2">
//       <HiOutlineCreditCard size={20} />
//       Transactions View
//     </span>
//     {openMenu === "transactions-view" ? <HiChevronDown /> : <HiChevronRight />}
//   </button>

//   {openMenu === "transactions-view" && (
//     <div className="ml-6 mt-2 space-y-2">
//       {/* Sales Submenu */}
//       <button
//         onClick={() => toggleSubmenu("sales")}
//         className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//       >
//         <span className="flex items-center gap-2">
//           <HiShoppingCart size={18} />
//           Sales
//         </span>
//         {submenuOpen === "sales" ? <HiChevronDown /> : <HiChevronRight />}
//       </button>
//       {submenuOpen === "sales" && (
//         <div className="ml-4 mt-2 space-y-1">
//           <Link href="/admin/sales-quotation-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Quotation
//           </Link>
//           <Link href="/admin/sales-order-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Order
//           </Link>
//           <Link href="/admin/delivery-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Delivery
//           </Link>
//           <Link href="/admin/sales-invoice-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Invoice
//           </Link>
//           <Link href="/admin/credit-memo-veiw" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Credit-note
//           </Link>
//         </div>
//       )}

//       {/* Purchase Submenu */}
//       <button
//         onClick={() => toggleSubmenu("purchase")}
//         className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//       >
//         <span className="flex items-center gap-2">
//           <GiStockpiles size={18} />
//           Purchase
//         </span>
//         {submenuOpen === "purchase" ? <HiChevronDown /> : <HiChevronRight />}
//       </button>
//       {submenuOpen === "purchase" && (
//         <div className="ml-4 mt-2 space-y-1">
//           <Link href="/admin/PurchaseQuotationList" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Quotation
//           </Link>
//           <Link href="/admin/purchase-order-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Order
//           </Link>
//           <Link href="/admin/grn-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             GRN
//           </Link>
//           <Link href="/admin/purchaseInvoice-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Invoice
//           </Link>
//           <Link href="/admin/debit-notes-view" className="block px-4 py-2 hover:bg-gray-700 rounded">
//             Debit-Note
//           </Link>
//         </div>
//       )}
//     </div>
//   )}
// </div>


       
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("CRM")}
//               className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//             >
//               <span className="flex items-center gap-2"> <SiCivicrm size={20}/> CRM</span>
//               {openMenu === "CRM" ? <HiChevronDown /> : <HiChevronRight />}
//             </button>
//             {openMenu === "CRM" && (
//               <div className="ml-6 mt-2 space-y-1">
//                 <Link href="/admin/LeadDetailsFormMaster" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Lead Generation
//                 </Link>
//                 <Link href="/admin/OpportunityDetailsForm" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Opportunity
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Stock Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("Stock")}
//               className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//             >
//                 <span className="flex items-center gap-2"> <HiOutlineCube  size={20}/> Stock</span>
//               {openMenu === "Stock" ? <HiChevronDown /> : <HiChevronRight />}
//             </button>
//             {openMenu === "Stock" && (
//               <div className="ml-6 mt-2 space-y-1">
//                 <Link href="/admin/InventoryView" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   View
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Payment Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("Payment")}
//               className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//             >
//               <span className="flex items-center gap-2"> <HiOutlineCreditCard size={20}/>Payment</span>
//               {openMenu === "Payment" ? <HiChevronDown /> : <HiChevronRight />}
//             </button>
//             {openMenu === "Payment" && (
//               <div className="ml-6 mt-2 space-y-1">
//                 <Link href="/admin/Payment" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Payment Form
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Production Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("Production")}
//               className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//             >
//               <span className="flex items-center gap-2">   <HiPuzzle  size={20} /> Production</span>
//               {openMenu === "Production" ? <HiChevronDown /> : <HiChevronRight />}
//             </button>
//             {openMenu === "Production" && (
//               <div className="ml-6 mt-2 space-y-1">
//                 <Link href="/admin/bom" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   BoM
//                 </Link>
//                 <Link href="/admin/ProductionOrder" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Production Order
//                 </Link>
//                 <Link href="/admin/issueForProduction" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Issue for Production
//                 </Link>
//                 <Link href="/admin/reciptFromProduction" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Receipt for Production
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Production-View Menu */}
//           <div className="relative">
//             <button
//               onClick={() => toggleMenu("Production-View")}
//               className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-gray-600"
//             >
//               <span className="flex items-center gap-2"> <HiOutlineLibrary  size={20}/> Production-View</span>
//               {openMenu === "Production-View" ? <HiChevronDown /> : <HiChevronRight />}
//             </button>
//             {openMenu === "Production-View" && (
//               <div className="ml-6 mt-2 space-y-1">
//                 <Link href="/admin/bom" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   BoM-View
//                 </Link>
//                 <Link href="/admin/productionorders-list-view" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   Production Order View
//                 </Link>
//                 <Link href="/admin/issueForProduction" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   All Issue for Production View
//                 </Link>
//                 <Link href="/admin/reciptFromProduction" className="block px-4 py-2 rounded hover:bg-gray-600">
//                   All Receipt for Production View
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Logout */}
//           <div className="mt-6">
//             <LogoutButton />
//           </div>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 ml-64 p-6 bg-gray-100 min-h-screen">
//         {children}
//       </main>
//     </div>
//   );
// }






// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { jwtDecode } from "jwt-decode";
// import LogoutButton from "@/components/LogoutButton";

// export default function AdminSidebar({ children }) {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [openMenu, setOpenMenu] = useState(null);
//   const [submenuOpen, setSubmenuOpen] = useState("");

//   // Token Validation and User Setup
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       router.push("/"); // Redirect to sign-in if no token
//     } else {
//       try {
//         const decodedToken = jwtDecode(token); // Decode token to get user info
//         setUser(decodedToken); // Set user data
//       } catch (error) {
//         console.error("Invalid token", error);
//         localStorage.removeItem("token");
//         router.push("/"); // Redirect if token is invalid
//       }
//     }
//   }, [router]);

//   // Toggle main menus
//   const toggleMenu = (menuName) => {
//     // When closing a main menu, also clear any open submenu
//     setOpenMenu((prev) => {
//       if (prev === menuName) {
//         setSubmenuOpen("");
//         return null;
//       }
//       return menuName;
//     });
//   };

//   // Toggle submenus (for Transactions menu)
//   const toggleSubmenu = (menuName) => {
//     setSubmenuOpen((prev) => (prev === menuName ? "" : menuName));
//   };

//   return (
//     <div className="min-h-screen flex">
//   {/* Fixed Sidebar */}
//   <aside className="fixed w-64 h-full overflow-y-auto bg-gray-500 text-white p-4">
//     <h2 className="text-xl font-bold">Dashboard</h2>
//     <nav className="mt-4 space-y-2">
//       {/* Masters Menu */}
//       <div className="relative">
//         <button
//           onClick={() => toggleMenu("master")}
//           className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//         >
//           Masters
//         </button>
//         {openMenu === "master" && (
//           <div className="ml-4 mt-2 space-y-1 max-h-screen overflow-y-auto">
//             <Link
//               href="/admin/users"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               User
//             </Link>
//             <Link
//               href="/admin/createCustomers"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               CreateCustomer
//             </Link>
//             <Link
//               href="/admin/Countries"
//               className="block px-4 py-2 hover:bg-gray-700"
//             >
//               Countries
//             </Link>
//             <Link
//               href="/admin/State"
//               className="block px-4 py-2 hover:bg-gray-700"
//             >
//               State
//             </Link>
//             <Link
//               href="/admin/City"
//               className="block px-4 py-2 hover:bg-gray-700"
//             >
//               City
//             </Link>
//             <Link
//               href="/admin/customers"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Customers
//             </Link>
//             <Link
//               href="/admin/supplier"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Supplier
//             </Link>
//             <Link
//               href="/admin/item"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Item
//             </Link>
//             <Link
//               href="/admin/PaymentDetailsForm"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               PaymentDetailsForm
//             </Link>
//             <Link
//               href="/admin/PaymentDetailsForm1"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               PaymentDetailsForm1
//             </Link>
//             <Link
//               href="/admin/PurchaseReceiptForm"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               PurchaseReceiptForm
//             </Link>
//             <Link
//               href="/admin/WarehouseDetailsForm"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               WarehouseDetailsForm
//             </Link>
//             <Link
//               href="/admin/CreateGroup"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               CreateGroup
//             </Link>
//             <Link
//               href="/admin/CreateItemGroup"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               CreateItmeGroup
//             </Link>
//             <Link
//               href="/admin/account-bankhead"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Account head deatails
//             </Link>
//             <Link
//               href="/admin/bank-head-details"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Bank head deatails
//             </Link>
//           </div>
//         )}
//       </div>

      // {/* Masters-View Menu */}
      // <div className="relative">
      //   <button
      //     onClick={() => toggleMenu("master-view")}
      //     className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
      //   >
      //     Masters-View
      //   </button>
      //   {openMenu === "master-view" && (
      //     <div className="ml-4 mt-2 space-y-1">
      //       {/* <Link
      //         href="/admin/users-view"
      //         className="block px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         User
      //       </Link> */}
      //       <Link
      //         href="/admin/customer-view"
      //         className="block px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Customers
      //       </Link>
      //       <Link
      //         href="/admin/supplier"
      //         className="block px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Supplier
      //       </Link>
      //       <Link
      //         href="/admin/item"
      //         className="block px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Item
      //       </Link>
      //       <Link
      //         href="/admin/account-head-view"
      //         className="block px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Account head
      //       </Link>
      //       <Link
      //         href="/admin/bank-head-details-view"
      //         className="block px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Bank head details
      //       </Link>
      //     </div>
      //   )}
      // </div>

      // {/* Transactions Menu */}
      // <div className="relative">
      //   <button
      //     onClick={() => toggleMenu("transaction")}
      //     className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
      //   >
      //     Transactions
      //   </button>
      //   {openMenu === "transaction" && (
      //     <div className="ml-4 mt-2 space-y-1">
      //       {/* Sales Submenu */}
      //       <button
      //         onClick={() => toggleSubmenu("sales")}
      //         className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Sales
      //       </button>
      //       {submenuOpen === "sales" && (
      //         <div className="ml-4 mt-2 space-y-1">
      //           <Link
      //             href="/admin/sales-quotation"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Quotation
      //           </Link>
      //           <Link
      //             href="/admin/sales-order"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //            Order
      //           </Link>
      //           <Link
      //             href="/admin/delivery"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Delivery
      //           </Link>
      //           {/* <Link
      //             href="/admin/AR-Invoice"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             AR-Invoice
      //           </Link> */}
      //           <Link
      //             href="/admin/sales-invoice"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Invoice
      //           </Link>
      //           <Link
      //             href="/admin/credit-memo"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Credit Note
      //           </Link>
      //         </div>
      //       )}

      //       {/* Purchase Submenu */}
      //       <button
      //         onClick={() => toggleSubmenu("purchase")}
      //         className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Purchase
      //       </button>
      //       {submenuOpen === "purchase" && (
      //         <div className="ml-4 mt-2 space-y-1">
      //            <Link
      //             href="/admin/purchase-quotation"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //              Quotation
      //           </Link>
      //           <Link
      //             href="/admin/purchase-order"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Order
      //           </Link>
                
      //           <Link
      //             href="/admin/GRN"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             GRN
      //           </Link>
      //           <Link
      //             href="/admin/purchase-invoice"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Invoice
      //           </Link>
              
               
      //           <Link
      //             href="/admin/debit-note"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Debit Note
      //           </Link>
      //           {/* <Link
      //             href="/admin/Payment"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Payment
      //           </Link> */}
      //         </div>
      //       )}
      //     </div>
      //   )}
      // </div>

      // {/* Transactions View Menu */}
      // <div className="relative">
      //   <button
      //     onClick={() => toggleMenu("transactions-view")}
      //     className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
      //   >
      //     Transactions View
      //   </button>
      //   {openMenu === "transactions-view" && (
      //     <div className="ml-4 mt-2 space-y-1">
      //       {/* Sales Submenu */}
      //       <button
      //         onClick={() => toggleSubmenu("sales")}
      //         className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Sales
      //       </button>
      //       {submenuOpen === "sales" && (
      //         <div className="ml-4 mt-2 space-y-1">
      //           <Link
      //             href="/admin/sales-quotation-view"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Quotation 
      //           </Link>
      //           <Link
      //             href="/admin/sales-order-view"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Order
      //           </Link>
      //           <Link
      //             href="/admin/delivery-view"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Delivery
      //           </Link>
      //           <Link
      //             href="/admin/sales-invoice-view"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Invoice
      //           </Link>
      //           <Link
      //             href="/admin/credit-memo-veiw"
      //             className="block px-4 py-2 hover:bg-gray-700"
      //           >
      //             Credit-note
      //           </Link>
      //         </div>
      //       )}

      //       {/* Purchase Submenu */}
      //       <button
      //         onClick={() => toggleSubmenu("purchase")}
      //         className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
      //       >
      //         Purchase
      //       </button>
      //       {submenuOpen === "purchase" && (
      //         <div className="ml-4 mt-2 space-y-1">
      //           <Link
      //             href="/admin/PurchaseQuotationList"
      //             className="block px-4 py-2 hover:bg-gray-700 rounded"
      //           >
      //             Quotation
      //           </Link>
      //           <Link
      //             href="/admin/purchase-order-view"
      //             className="block px-4 py-2 hover:bg-gray-700 rounded"
      //           >
      //             Order
      //           </Link>
      //           <Link
      //             href="/admin/grn-view"
      //             className="block px-4 py-2 hover:bg-gray-700 rounded"
      //           >
      //             GRN
      //           </Link>
      //           <Link
      //             href="/admin/purchaseInvoice-view"
      //             className="block px-4 py-2 hover:bg-gray-700 rounded"
      //           >
      //             Invoice
      //           </Link>
      //           <Link
      //             href="/admin/debit-notes-view"
      //             className="block px-4 py-2 hover:bg-gray-700 rounded"
      //           >
      //             Debit-Note
      //           </Link>
              
              
              
      //         </div>
      //       )}
      //     </div>
      //   )}
      // </div>

//       {/* CRM Menu */}
//       <div className="relative">
//         <button
//           onClick={() => toggleMenu("CRM")}
//           className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//         >
//           CRM
//         </button>
//         {openMenu === "CRM" && (
//           <div className="ml-4 mt-2 space-y-1">
//             <Link
//               href="/admin/LeadDetailsFormMaster"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Lead Generation
//             </Link>
//             <Link
//               href="/admin/OpportunityDetailsForm"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Opportunity
//             </Link>
         
//           </div>
//         )}
//       </div>

//       {/* Stock Menu */}
//       <div className="relative">
//         <button
//           onClick={() => toggleMenu("Stock")}
//           className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//         >
//           Stock
//         </button>
//         {openMenu === "Stock" && (
//           <div className="ml-4 mt-2 space-y-1">
//             <Link
//               href="/admin/InventoryView"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               View
//             </Link>
//           </div>
//         )}
//       </div>

//        {/* payment Menu */}
//        <div className="relative">
//         <button
//           onClick={() => toggleMenu("Payment")}
//           className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//         >
//           Payment
//         </button>
//         {openMenu === "Payment" && (
//           <div className="ml-4 mt-2 space-y-1">
//             <Link
//               href="/admin/Payment"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Payment from
//             </Link>
//           </div>
//         )}
//       </div>


//        {/* Production Menu */}
//        <div className="relative">
//         <button
//           onClick={() => toggleMenu("Production")}
//           className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//         >
//           Production
//         </button>
//         {openMenu === "Production" && (
//           <div className="ml-4 mt-2 space-y-1">
//             <Link
//               href="/admin/bom"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               BoM
//             </Link>
//             <Link
//               href="/admin/ProductionOrder"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Production Order
//             </Link>
//             <Link
//               href="/admin/issueForProduction"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Issue for Production
//             </Link>
//             <Link
//               href="/admin/reciptFromProduction"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Receipt for Production
//             </Link>
//           </div>
//         )}
//       </div>



      
//        {/* Production Menu */}
//        <div className="relative">
//         <button
//           onClick={() => toggleMenu("Production-View")}
//           className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
//         >
//           Production-View
//         </button>
//         {openMenu === "Production-View" && (
//           <div className="ml-4 mt-2 space-y-1">
//             <Link
//               href="/admin/bom"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               BoM-View
//             </Link>
//             <Link
//               href="/admin/productionorders-list-view"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               Production Order View
//             </Link>
//             <Link
//               href="/admin/issueForProduction"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//              all Issue for Production view
//             </Link>
//             <Link
//               href="/admin/reciptFromProduction"
//               className="block px-4 py-2 hover:bg-gray-700 rounded"
//             >
//               all Receipt for Production view
//             </Link>
//           </div>
//         )}
//       </div>
//     </nav>
//     {/* Logout Button */}
//     <div className="mt-4">
//       <LogoutButton />
//     </div>
//   </aside>

//   {/* Main Content Area with left margin to account for fixed sidebar */}
//   <main className="flex-1 ml-64 bg-gray-100 p-12">
//     {children}
//   </main>
// </div>



//   );
// }
