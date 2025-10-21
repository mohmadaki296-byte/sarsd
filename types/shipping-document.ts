export interface CargoItem {
  description: string;
  quantity: number;
  weight: number;
  unit: string;
  dimensions: string;
  status: string;
}

export interface ShippingDocument {
  carrier_license(carrier_license: any): import("react").ReactNode;
  driver_city(driver_city: any): import("react").ReactNode;
  departure_date(departure_date: any): import("react").ReactNode;
  truck_axles(truck_axles: any): import("react").ReactNode;
  truck_engine_power(truck_engine_power: any): import("react").ReactNode;
  carrier_email: string;
  id?: string;
  created_at?: string;

  // Document Info
  document_number: string;
  license_number?: string;
  status?: string;
  receipt_date?: string;
  exit_date?: string;
  is_negotiable?: boolean;
  cargo_document_number?: string;

  // Carrier Info
  carrier_name?: string;
  carrier_phone?: string;
  carrier_notes?: string;

  // Driver Info
  driver_name?: string;
  driver_id_number?: string;
  driver_id_type?: string;
  driver_nationality?: string;
  driver_birth_date?: string;
  driver_phone?: string;

  // Truck Info
  truck_country?: string;
  truck_city?: string;
  truck_plate_number?: string;
  truck_plate_code?: string;
  truck_classification_code?: string;
  truck_color?: string;
  truck_type?: string;

  // Sender Info
  sender_name?: string;
  sender_address?: string;
  sender_city?: string;
  sender_country?: string;
  sender_phone?: string;
  sender_notes?: string;

  // Recipient Info
  recipient_name?: string;
  recipient_address?: string;
  recipient_city?: string;
  recipient_country?: string;
  recipient_phone?: string;
  recipient_notes?: string;

  // Route Info
  route_from_city?: string;
  route_from_country?: string;
  route_to_city?: string;
  route_to_country?: string;

  // Cargo Info
  cargo_items?: CargoItem[];

  // Transport Fees Info
  payment_by?: string;
  payment_method?: string;
  payment_instructions?: string;
}
