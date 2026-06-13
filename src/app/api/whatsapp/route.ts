/**
 * WhatsApp API Route
 * Handles WhatsApp message generation and URL creation
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateWhatsAppMessage,
  generateWhatsAppUrl,
} from '@/lib/utils';

// GET /api/whatsapp - Generate WhatsApp URL for an order
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const customerName = searchParams.get('customerName');
    const total = searchParams.get('total');
    const lang = searchParams.get('lang') || 'en';
    
    // Parse items from JSON string
    const itemsJson = searchParams.get('items');
    
    // Validate required parameters
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    if (!customerName) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }
    
    if (!total) {
      return NextResponse.json(
        { error: 'Total is required' },
        { status: 400 }
      );
    }
    
    let items: Array<{ product_name: string; quantity: number; price: number }> = [];
    
    if (itemsJson) {
      try {
        items = JSON.parse(itemsJson);
      } catch {
        return NextResponse.json(
          { error: 'Invalid items JSON format' },
          { status: 400 }
        );
      }
    }
    
    // Validate items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }
    
    // Generate WhatsApp message
    const totalAmount = parseFloat(total);
    const message = generateWhatsAppMessage(
      customerName,
      items,
      totalAmount,
      lang as 'en' | 'so'
    );
    
    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppUrl(phone, message);
    
    return NextResponse.json({
      url: whatsappUrl,
      message: decodeURIComponent(message),
      phone,
    });
  } catch (error) {
    console.error('Error in GET /api/whatsapp:', error);
    return NextResponse.json(
      { error: 'Failed to generate WhatsApp URL' },
      { status: 500 }
    );
  }
}

// POST /api/whatsapp - Generate WhatsApp URL with order details
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { phone, customerName, items, total, lang = 'en' } = body;
    
    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    if (!customerName) {
      return NextResponse.json(
        { error: 'Customer name is required' },
        { status: 400 }
      );
    }
    
    if (!total || typeof total !== 'number') {
      return NextResponse.json(
        { error: 'Total must be a number' },
        { status: 400 }
      );
    }
    
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 }
      );
    }
    
    // Validate each item
    for (const item of items) {
      if (!item.product_name || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: 'Each item must have product_name, quantity, and price' },
          { status: 400 }
        );
      }
    }
    
    // Generate WhatsApp message
    const message = generateWhatsAppMessage(
      customerName,
      items,
      total,
      lang as 'en' | 'so'
    );
    
    // Generate WhatsApp URL
    const whatsappUrl = generateWhatsAppUrl(phone, message);
    
    return NextResponse.json({
      url: whatsappUrl,
      message: decodeURIComponent(message),
      phone,
    });
  } catch (error) {
    console.error('Error in POST /api/whatsapp:', error);
    return NextResponse.json(
      { error: 'Failed to generate WhatsApp URL' },
      { status: 500 }
    );
  }
}