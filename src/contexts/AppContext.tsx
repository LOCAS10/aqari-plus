"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Property, Client, Request, User } from "@/lib/types";
import { sampleProperties, sampleClients, sampleRequests, sampleUsers, initialCounters } from "@/lib/data";

interface Toast {
  message: string;
  type: "success" | "error" | "info" | "warning";
}

interface AppState {
  properties: Property[];
  clients: Client[];
  requests: Request[];
  currentUser: User | null;
  favorites: string[];
  toast: Toast | null;
  propCounter: number;
  reqCounter: number;
  cliCounter: number;
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (email: string, password: string) => User | null;
  getMatches: (property: Property) => string[];
}

type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "ADD_PROPERTY"; payload: Property }
  | { type: "UPDATE_PROPERTY"; payload: Property }
  | { type: "DELETE_PROPERTY"; payload: string }
  | { type: "ADD_CLIENT"; payload: Client }
  | { type: "UPDATE_CLIENT"; payload: Client }
  | type: "DELETE_CLIENT"; payload: string }
  | { type: "ADD_REQUEST"; payload: Request }
  | { type: "UPDATE_REQUEST"; payload: Request }
  | { type: "DELETE_REQUEST"; payload: string }
  | { type: "TOGGLE_FAV"; payload: string }
  | { type: "SHOW_TOAST"; payload: Toast | null }
  | { type: "LOAD_STATE"; payload: AppState };

const initialState: AppState = {
  properties: sampleProperties,
  clients: sampleClients,
  requests: sampleRequests,
  currentUser: null,
  favorites: [],
  toast: null,
  propCounter: initialCounters.propertyCounter,
  reqCounter: initialCounters.requestCounter,
  cliCounter: initialCounters.clientCounter,
};

const STORAGE_KEY = "aqari_plus_data";

function loadState(): AppState {
  if (typeof window === "undefined") return initialState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        ...parsed,
        currentUser: null,
        toast: null,
      };
    }
  } catch {
    return initialState;
  }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    const toSave = {
      properties: state.properties,
      clients: state.clients,
      requests: state.requests,
      favorites: state.favorites,
      propCounter: state.propCounter,
      reqCounter: state.reqCounter,
      cliCounter: state.cliCounter,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // فشل الحفظ - لا شيء يحدث
  }
}

const reducer = (state: AppState, action: Action): AppState => {
  let newState = state;

  switch (action.type) {
    case "LOGIN":
      newState = { ...state, currentUser: action.payload };
      break;
    case "LOGOUT":
      newState = { ...state, currentUser: null };
      break;
    case "ADD_PROPERTY":
      newState = { ...state, properties: [action.payload, ...state.properties], propCounter: state.propCounter + 1 };
      break;
    case "UPDATE_PROPERTY":
      newState = { ...state, properties: state.properties.map((p) => (p.id === action.payload.id ? action.payload : p)) };
      break;
    case "DELETE_PROPERTY":
      newState = { ...state, properties: state.properties.filter((p) => p.id !== action.payload) };
      break;
    case "ADD_CLIENT":
      newState = { ...state, clients: [...state.clients, action.payload], cliCounter: state.cliCounter + 1 };
      break;
    case "UPDATE_CLIENT":
      newState = {
        ...state,
        clients: state.clients.map((c) => (c.id === action.payload.id ? action.payload : c)),
        requests: state.requests.map((r) => (r.clientId === action.payload.id ? { ...r, clientName: action.payload.name } : r)),
      };
      break;
    case "DELETE_CLIENT":
      newState = { ...state, clients: state.clients.filter((c) => c.id !== action.payload), requests: state.requests.filter((r) => r.clientId !== action.payload) };
      break;
    case "ADD_REQUEST":
      newState = { ...state, requests: [...state.requests, action.payload], reqCounter: state.reqCounter + 1 };
      break;
    case "UPDATE_REQUEST":
      newState = { ...state, requests: state.requests.map((r) => (r.id === action.payload.id ? action.payload : r)) };
      break;
    case "DELETE_REQUEST":
      newState = { ...state, requests: state.requests.filter((r) => r.id !== action.payload) };
      break;
    case "TOGGLE_FAV": {
      const isFav = state.favorites.includes(action.payload);
      const newFavs = isFav
        ? state.favorites.filter((id) => id !== action.payload)
        : [...state.favorites, action.payload];
      newState = { ...state, favorites: newFavs };
      break;
    }
    case "SHOW_TOAST":
      newState = { ...state, toast: action.payload };
      break;
    case "LOAD_STATE":
      newState = action.payload;
      break;
  }

  return newState;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, null);

  // تحميل البيانات عند أول فتح
  useEffect(() => {
    const saved = loadState();
    dispatch({ type: "LOAD_STATE", payload: saved });
  }, []);

  // حفظ البيانات عند كل تغيير
  useEffect(() => {
    if (state) {
      saveState(state);
    }
  }, [state]);

  // إخفاء الإشعار بعد 3 ثواني
  useEffect(() => {
    if (state && state.toast) {
      const timer = setTimeout(() => {
        dispatch({ type: "SHOW_TOAST", payload: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state && state.toast]);

  const login = (email: string, password: string): User | null => {
    let user: User | null = null;
    if (email === "admin@aqari.ma" && password === "admin123") {
      user = sampleUsers[0];
    } else if (email === "user@aqari.ma" && password === "user123") {
      user = sampleUsers[1];
    }
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
    return user;
  };

  const getMatches = (property: Property): string[] => {
    if (!state) return [];
    const matches: string[] = [];
    state.requests.forEach((req) => {
      const opMatch =
        (property.operation === "بيع" && req.operation === "شراء") ||
        property.operation === req.operation;
      const typeMatch =
        req.propertyType.includes(property.propertyType) ||
        property.propertyType.includes(req.propertyType);
      const cityMatch =
        !req.city || property.city === req.city || property.district.includes(req.city);
      const priceMatch = property.operation === "بيع"
        ? !req.budgetMax || (property.price >= req.budgetMin && property.price <= req.budgetMax)
        : property.operation === "كراء"
        ? !req.budgetMax || (property.rent >= req.budgetMin && property.rent <= req.budgetMax)
        : !req.mortgage || property.mortgage >= req.budgetMin;
      const roomsMatch = !req.rooms || req.rooms <= property.rooms;

      if (opMatch && typeMatch && cityMatch && priceMatch && roomsMatch) {
        matches.push(req.clientName);
      }
    });
    return [...new Set(matches)];
  };

  if (!state) {
    return <div style={{ color: "#94a3b8", padding: "40px", textAlign: "center" }}>جاري التحميل...</div>;
  }

  return (
    <AppContext.Provider value={{ state, dispatch, login, getMatches }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
