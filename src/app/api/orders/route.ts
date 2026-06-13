/**
 * Orders API Route
 * Handles CRUD operations for orders via Insforge API
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrder,
  updateOrderStatus,
} from '@/lib/insforge';
import type { Order } from '@/lib/insforge';

// Mock orders for development
const mockOrders: Order[] = [
  {
    id: 'order-001',
    customer_name: 'Ahmed Hassan',
    customer_phone: '252612345678',
    customer_email: 'ahmed@example.com',
    items: [
      { product_id: 'prod-001', product_name: 'Non-Stick Frying Pan 28cm', quantity: 2, price: 24.99 },
      { product_id: 'prod-008', product_name: 'Digital Rice Cooker 1.8L', quantity: 1, price: 45.99 },
    ],
    total: 95.97,
    status: 'pending',
    notes: 'Please call before delivery',
    created_at: new Date().toISOString(),
  },
  {
    id: 'order-002',
    customer_name: 'Fadumo Ali',
    customer_phone: '252612345679',
    items: [
      { product_id: 'prod-016', product_name: 'Ceramic Dinner Set 16-Piece', quantity: 1, price: 64.99 },
      { product_id: 'prod-018', product_name: 'Stainless Steel Cutlery Set 24-Piece', quantity: 1, price: 34.99 },
    ],
    total: 99.98,
    status: 'confirmed',
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
];

// GET /api/orders - Fetch all orders or a single order by ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');
    const useMock = searchParams.get('mock') === 'true';

    // Fetch single order by ID
    if (id) {
      const order = useMock
        ? mockOrders.find((o) => o.id === id) || null
        : await fetchOrderById(id);
      
      if (!order) {
        // Fallback to mock data
        const mockOrder = mockOrders.find((o) => o.id === id);
        if (!mockOrder) {
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        return NextResponse.json({ order: mockOrder, source: 'mock' });
      }
      
      return NextResponse.json({ order, source: 'api' });
    }

    // Fetch all orders with optional filtering
    let orders = useMock ? mockOrders : await fetchOrders();
    
    // If API returns empty, fallback to mock data
    if (orders.length === 0 && !useMock) {
      orders = mockOrders;
    }
    
    // Filter by status
    if (status) {
      orders = orders.filter((o) => o.status === status);
    }
    
    // Sort by created_at descending
    orders.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    return NextResponse.json({
      orders,
      count: orders.length,
      source: useMock ? 'mock' : orders === mockOrders ? 'mock' : 'api',
    });
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    // Fallback to mock data on error
    return NextResponse.json({
      orders: mockOrders,
      count: mockOrders.length,
      source: 'mock',
      error: 'API unavailable, using mock data',
    });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['customer_name', 'customer_phone', 'items', 'total'];
    const missingFields = requiredFields.filter((field) => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate customer name
    if (typeof body.customer_name !== 'string' || body.customer_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Customer name must be at least 2 characters' },
        { status: 400 }
      );
    }
    
    // Validate phone number (basic validation)
    if (typeof body.customer_phone !== 'string' || body.customer_phone.length < 9) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }
    
    // Validate items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }
    
    // Validate each item
    for (const item of body.items) {
      if (!item.product_id || !item.product_name || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: 'Each item must have product_id, product_name, quantity, and price' },
          { status: 400 }
        );
      }
      if (typeof item.quantity !== 'number' || item.quantity < 1) {
        return NextResponse.json(
          { error: 'Item quantity must be a positive number' },
          { status: 400 }
        );
      }
      if (typeof item.price !== 'number' || item.price < 0) {
        return NextResponse.json(
          { error: 'Item price must be a non-negative number' },
          { status: 400 }
        );
      }
    }
    
    // Validate total
    if (typeof body.total !== 'number' || body.total < 0) {
      return NextResponse.json(
        { error: 'Total must be a non-negative number' },
        { status: 400 }
      );
    }
    
    // Create order with pending status
    const orderData = {
      ...body,
      status: 'pending' as const,
    };
    
    const order = await createOrder(orderData);
    return NextResponse.json({ order, source: 'api' }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/orders:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders - Update an existing order
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Don't allow status updates through PUT, use PATCH for that
    if (updates.status) {
      return NextResponse.json(
        { error: 'Use PATCH /api/orders for status updates' },
        { status: 400 }
      );
    }
    
    const order = await updateOrder(id, updates);
    return NextResponse.json({ order, source: 'api' });
  } catch (error) {
    console.error('Error in PUT /api/orders:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// PATCH /api/orders - Update order status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }
    
    // Validate status
    const validStatuses: Order['status'][] = [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ];
    
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }
    
    const order = await updateOrderStatus(id, status);
    return NextResponse.json({ order, source: 'api' });
  } catch (error) {
    console.error('Error in PATCH /api/orders:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}