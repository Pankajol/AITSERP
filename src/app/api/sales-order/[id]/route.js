import dbConnect from "@/lib/db";
import SalesOrder from "@/models/SalesOrder";
import { NextResponse } from "next/server";


// GET /api/sales-order/[id]: Get a single Sales Order by ID
export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const salesOrder = await SalesOrder.findById(id);
    if (!salesOrder) {
      return new Response(JSON.stringify({ message: "Sales Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ success: true, data: salesOrder }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching Sales Order:", error);
    return new Response(
      JSON.stringify({ message: "Error fetching Sales Order", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


// export async function GET(req, { params }) {
//   try {
//     await dbConnect();
//     const { id } = params;

  

//     const order = await SalesOrder.findById(id)
//       .populate("customer") // only if you use refs
//       .populate("items.item")
//       .populate("items.warehouse");

//     if (!order) {
//       return NextResponse.json({ message: "Sales Order not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: order });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
//   }
// }

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const data = await req.json();
    
    // Handle address data properly
    if (data.billingAddress && typeof data.billingAddress === 'object') {
      delete data.billingAddress._id;
    }
    if (data.shippingAddress && typeof data.shippingAddress === 'object') {
      delete data.shippingAddress._id;
    }
    
    const updatedSalesOrder = await SalesOrder.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!updatedSalesOrder) {
      return new Response(JSON.stringify({ message: "Sales Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "Sales Order updated successfully", data: updatedSalesOrder }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error updating Sales Order:", error);
    return new Response(
      JSON.stringify({ message: "Error updating Sales Order", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = await params;  // Ensure params are awaited here.
    const deletedSalesOrder = await SalesOrder.findByIdAndDelete(id);
    if (!deletedSalesOrder) {
      return new Response(JSON.stringify({ message: "Sales Order not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ message: "Sales Order deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error deleting Sales Order:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting Sales Order", error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}