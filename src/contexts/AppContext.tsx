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

interface Action {
  type: string;
  payload?: any;
}

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
    /* empty */
  }
}

function reducer(state: AppState, action: Action): AppState {
  var s = Object.assign({}, state);

  switch (action.type) {
    case "LOGIN":
      s.currentUser = action.payload;
      break;
    case "LOGOUT":
      s.currentUser = null;
      break;
    case "ADD_PROPERTY":
      s.properties = [action.payload].concat(s.properties);
      s.propCounter = s.propCounter + 1;
      break;
    case "UPDATE_PROPERTY":
      s.properties = s.properties.map(function (p) {
        if (p.id === action.payload.id) return action.payload;
        return p;
      });
      break;
    case "DELETE_PROPERTY":
      s.properties = s.properties.filter(function (p) {
        return p.id !== action.payload;
      });
      break;
    case "ADD_CLIENT":
      s.clients = s.clients.concat([action.payload]);
      s.cliCounter = s.cliCounter +  1;
      break;
    case "UPDATE_CLIENT":
      s.clients = s.clients.map(function (c) {
        if (c.id === action.payload.id) return action.payload;
        return c;
      });
      s.requests = s.requests.map(function (r) {
        if (r.clientId === action.payload.id) {
          return Object.assign({}, r, { clientName: action.payload.name });
        }
        return r;
      });
      break;
    case "DELETE_CLIENT":
      s.clients = s.clients.filter(function (c) {
        return c.id !== action.payload;
      });
      s.requests = s.requests.filter(function (r) {
        return r.clientId !== action.payload;
      });
      break;
    case "ADD_REQUEST":
      s.requests = s.requests.concat([action.payload]);
      s.reqCounter = s.reqCounter + 1;
      break;
    case "UPDATE_REQUEST":
      s.requests = s.requests.map(function (r) {
        if (r.id === action.payload.id) return action.payload;
        return r;
      });
      break;
    case "DELETE_REQUEST":
      s.requests = s.requests.filter(function (r) {
        return r.id !== action.payload;
      });
      break;
    case "TOGGLE_FAV":
      var isFav = s.favorites.indexOf(action.payload);
      if (isFav === -1) {
        s.favorites = s.favorites.concat([action.payload]);
      } else {
        s.favorites = s.favorites.filter(function (id) {
          return id !== action.payload;
        });
      }
      break;
    case "SHOW_TOAST":
      s.toast = action.payload;
      break;
    case "LOAD_STATE":
      s = action.payload;
      break;
  }
  return s;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export var AppProvider = function (props: { children: ReactNode }) {
  var children = props.children;
  var loaded = React.useRef(false);

  var state = useReducer(reducer, initialState);
  var dispatch = state[1];

  React.useEffect(function () {
    if (!loaded.current) {
      var saved = loadState();
      dispatch({ type: "LOAD_STATE", payload: saved });
      loaded.current = true;
    }
  }, []);

  React.useEffect(function () {
    if (loaded.current && state) {
      saveState(state);
    }
  });

  React.useEffect(function () {
    if (state && state.toast) {
      var t = setTimeout(function () {
        dispatch({ type: "SHOW_TOAST", payload: null });
      }, 3000);
      return function () { clearTimeout(t); };
    }
  }, [state && state.toast]);

  var login = function (email: string, password: string): User | null {
    var user: User | null = null;
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

  var getMatches = function (property: Property): string[] {
    if (!state) return [];
    var matches: string[] = [];
    state.requests.forEach(function (req) {
      var opMatch = (property.operation === "بيع" && req.operation === "شراء") || property.operation === req.operation;
      var typeMatch = req.propertyType.indexOf(property.propertyType) !== -1 || property.propertyType.indexOf(req.propertyType) !== -1;
      var cityMatch = !req.city || property.city === req.city || property.district.indexOf(req.city) !== -1;
      var priceMatch = property.operation === "بيع"
        ? !req.budgetMax || (property.price >= req.budgetMin && property.price <= req.budgetMax)
        : property.operation === "كراء"
          ? !req.budgetMax || (property.rent >= req.budgetMin && property.rent <= req.budgetMax)
          : !req.mortgage || property.mortgage >= req.budgetMin;
      var roomsMatch = !req.rooms || req.rooms <= property.rooms;
      if (opMatch && typeMatch && cityMatch && priceMatch && roomsMatch) {
        matches.push(req.clientName);
      }
    });
    var unique = [];
    matches.forEach(function (m) {
      if (unique.indexOf(m) === -1) unique.push(m);
    });
    return unique;
  };

  if (!state) {
    return (
      <div style={{ color: "#94a3b8", padding: "40px", textAlign: "center" }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state: state, dispatch: dispatch, login: login, getMatches: getMatches }}>
      {children}
    </AppContext.Provider>
  );
};

// ✅ يجب أن يكون موجوداً:
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
