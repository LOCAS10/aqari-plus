"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Property, Client, Request, User } from "@/lib/types";
import { sampleProperties, sampleClients, sampleRequests, sampleUsers, initialCounters } from "@/lib/data";

interface Toast { message: string; type: "success" | "error" | "info" | "warning"; }

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

interface Action { type: string; payload?: any; }

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (email: string, password: string) => User | null;
  getMatches: (property: Property) => string[];
}

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
      return { ...initialState, ...parsed, currentUser: null, toast: null };
    }
  } catch { return initialState; }
}

function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  try {
    const toSave = { properties: state.properties, clients: state.clients, requests: state.requests, favorites: state.favorites, propCounter: state.propCounter, reqCounter: state.reqCounter, cliCounter: state.cliCounter };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch { /* لا شيء */ }
}

const reducer = (state: AppState, action: Action): AppState => {
  let s = { ...state };
  switch (action.type) {
    case "LOGIN": s = { ...s, currentUser: action.payload }; break;
    case "LOGOUT": s = { ...s, currentUser: null }; break;
    case "ADD_PROPERTY": s = { ...s, properties: [action.payload, ...s.properties], propCounter: s.propCounter + 1 }; break;
    case "UPDATE_PROPERTY": s = { ...s, properties: s.properties.map((p) => (p.id === action.payload.id ? action.payload : p)) }; break;
    case "DELETE_PROPERTY": s = { ...s, properties: s.properties.filter((p) => p.id !== action.payload) }; break;
    case "ADD_CLIENT": s = { ...s, clients: [...s.clients, action.payload], cliCounter: s.cliCounter + 1 }; break;
    case "UPDATE_CLIENT": s = { ...s, clients: s.clients.map((c) => (c.id === action.payload.id ? action.payload : c)), requests: s.requests.map((r) => (r.clientId === action.payload.id ? { ...r, clientName: action.payload.name } : r)) }; break;
    case "DELETE_CLIENT": s = { ...s, clients: s.clients.filter((c) => c.id !== action.payload), requests: s.requests.filter((r) => r.clientId !== action.payload) }; break;
    case "ADD_REQUEST": s = { ...s, requests: [...s.requests, action.payload], reqCounter: s.reqCounter + 1 }; break;
    case "UPDATE_REQUEST": s = { ...s, requests: s.requests.map((r) => (r.id === action.payload.id ? action.payload : r)) }; break;
    case "DELETE_REQUEST": s = { ...s, requests: s.requests.filter((r) => r.id !== action.payload) }; break;
    case "TOGGLE_FAV": { const f = s.favorites.includes(action.payload); s = { ...s, favorites: f ? s.favorites.filter((id) => id !== action.payload) : [...s.favorites, action.payload] }; break; }
    case "SHOW_TOAST": s = { ...s, toast: action.payload }; break;
    case "LOAD_STATE": s = action.payload; break;
  }
  return s;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, null);

  useEffect(() => {
    const saved = loadState();
    dispatch({ type: "LOAD_STATE", payload: saved });
  }, []);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  useEffect(() => {
    if (state && state.toast) {
      const t = setTimeout(() => dispatch({ type: "SHOW_TOAST", payload: null }), 3000);
      return () => clearTimeout(t);
    }
  }, [state && state.toast]);

  const login = (email: string, password: string): User | null => {
    let user: User | null = null;
    if (email === "admin@aqari.ma" && password === "admin123") user = sampleUsers[0];
    else if (email === "user@aqari.ma" && password === "user123") user = sampleUsers[1];
    if (user) dispatch({ type: "LOGIN", payload: user });
    return user;
  };

  const getMatches = (property: Property): string[] => {
    if (!state) return [];
    const matches: string[] = [];
    state.requests.forEach((req) => {
      const opMatch = (property.operation === "بيع" && req.operation === "شراء") || property.operation === req.operation;
      const typeMatch = req.propertyType.includes(property.propertyType) || property.propertyType.includes(req.propertyType);
      const cityMatch = !req.city || property.city === req.city || property.district.includes(req.city);
      const priceMatch = property.operation === "بيع" ? !req.budgetMax || (property.price >= req.budgetMin && property.price <= req.budgetMax) : property.operation === "كراء" ? !req.budgetMax || (property.rent >= req.budgetMin && property.rent <= req.budgetMax) : !req.mortgage || property.mortgage >= req.budgetMin;
      const roomsMatch = !req.rooms || req.rooms <= property.rooms;
      if (opMatch && typeMatch && cityMatch && priceMatch && roomsMatch) matches.push(req.clientName);
    });
    return [...new Set(matches)];
  };

  if (!state) return <div style={{ color: "#94a3b8", padding: "40px", textAlign: "center" }}>جاري التحميل...</div>;

  return <AppContext.Provider value={{ state, dispatch, login, getMatches }}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
