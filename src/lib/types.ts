
export interface Property {
  id: string;
  operation: "بيع" | "كراء" | "رهن";
  propertyType: string;
  city: string;
  district: string;
  address: string;
  price: number;
  area: number;
  rooms: number;
  salons: number;
  bathrooms: number;
  kitchens: number;
  floor: number;
  garage: boolean;
  elevator: boolean;
  balcony: boolean;
  garden: boolean;
  pool: boolean;
  guard: boolean;
  facade: string;
  view: string;
  year: number;
  status: "متوفر" | "محجوز" | "تم البيع" | "تم الكراء";
  negotiable: boolean;
  rent: number;
  mortgage: number;
  images: string[];
  video: string;
  description: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  city: string;
  notes: string;
  createdAt: Date;
}

export interface Request {
  id: string;
  clientId: string;
  clientName: string;
  operation: "شراء" | "كراء" | "رهن";
  propertyType: string;
  budgetMin: number;
  budgetMax: number;
  city: string;
  district: string;
  rooms: number;
  area: number;
  mortgage: boolean;
  notes: string;
  status: string;
  createdAt: Date;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  role: "مدير" | "موظف";
}

export interface AppState {
  properties: Property[];
  clients: Client[];
  requests: Request[];
  currentUser: User | null;
  favorites: string[];
  toast: { message: string; type: "success" | "error" | "info" | "warning" } | null;
  propCounter: number;
  reqCounter: number;
  cliCounter: number;
}

export type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "ADD_PROPERTY"; payload: Property }
  | { type: "UPDATE_PROPERTY"; payload: Property }
  | { type: "DELETE_PROPERTY"; payload: string }
  | { type: "ADD_CLIENT"; payload: Client }
  | { type: "UPDATE_CLIENT"; payload: Client }
  | { type: "DELETE_CLIENT"; payload: string }
  | { type: "ADD_REQUEST"; payload: Request }
  | { type: "UPDATE_REQUEST"; payload: Request }
  | { type: "DELETE_REQUEST"; payload: string }
  | { type: "TOGGLE_FAV"; payload: string }
  | { type: "SHOW_TOAST"; payload: { message: string; type: "success" | "error" | "info" | "warning" } };
