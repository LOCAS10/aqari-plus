"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { AppState, Action, Property, User } from "@/lib/types";
import { sampleProperties, sampleClients, sampleRequests, sampleUsers, initialCounters } from "@/lib/data";

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (email: string, password: string) => User | null;
  getMatches: (property: Property) => string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

const reducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, currentUser: action.payload };
    case "LOGOUT":
      return { ...state, currentUser: null };
    case "ADD_PROPERTY":
      return { ...state, properties: [...state.properties, action.payload], propCounter: state.propCounter + 1 };
    case "UPDATE_PROPERTY":
      return {
        ...state,
        properties: state.properties.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };
    case "DELETE_PROPERTY":
      return { ...state, properties: state.properties.filter((p) => p.id !== action.payload) };
    case "ADD_CLIENT":
      return { ...state, clients: [...state.clients, action.payload], cliCounter: state.cliCounter + 1 };
    case "UPDATE_CLIENT":
      return {
        ...state,
        clients: state.clients.map((c) => (c.id === action.payload.id ? action.payload : c)),
      };
    case "DELETE_CLIENT":
      return { ...state, clients: state.clients.filter((c) => c.id !== action.payload) };
    case "ADD_REQUEST":
      return { ...state, requests: [...state.requests, action.payload], reqCounter: state.reqCounter + 1 };
    case "UPDATE_REQUEST":
      return {
        ...state,
        requests: state.requests.map((r) => (r.id === action.payload.id ? action.payload : r)),
      };
    case "DELETE_REQUEST":
      return { ...state, requests: state.requests.filter((r) => r.id !== action.payload) };
    case "TOGGLE_FAV":
      const isFav = state.favorites.includes(action.payload);
      const newFavs = isFav
        ? state.favorites.filter((id) => id !== action.payload)
        : [...state.favorites, action.payload];
      localStorage.setItem("favorites", JSON.stringify(newFavs));
      return { ...state, favorites: newFavs };
    case "SHOW_TOAST":
      return { ...state, toast: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedFavs = localStorage.getItem("favorites");
    if (savedFavs) {
      const favs = JSON.parse(savedFavs);
      favs.forEach((id: string) => dispatch({ type: "TOGGLE_FAV", payload: id }));
    }
  }, []);

  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => dispatch({ type: "SHOW_TOAST", payload: { message: '', type: 'info' }}), 3000);
      return () => clearTimeout(timer);
    }
  }, [state.toast]);

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
    const matches: string[] = [];
    state.requests.forEach((req) => {
      const opMatch =
        (property.operation === "بيع" && req.operation === "شراء") ||
        (property.operation === req.operation);
      const typeMatch = req.propertyType.includes(property.propertyType) || property.propertyType.includes(req.propertyType);
      const cityMatch = property.city === req.city;
      const priceMatch =
        property.operation === "بيع"
          ? property.price >= req.budgetMin && property.price <= req.budgetMax
          : property.operation === "كراء"
          ? property.rent >= req.budgetMin && property.rent <= req.budgetMax
          : property.mortgage >= req.budgetMin && property.mortgage <= req.budgetMax;
      const roomsMatch = req.rooms <= property.rooms;

      if (opMatch && typeMatch && cityMatch && (priceMatch || true) && (roomsMatch || true)) {
        matches.push(req.clientName);
      }
    });
    return [...new Set(matches)];
  };

  return (
    <AppContext.Provider value={{ state, dispatch, login, getMatches }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
  export const useApp = useAppContext;;
