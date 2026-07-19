"use client";

import React, { createContext, useContext, useReducer, useRef, useEffect, ReactNode } from "react";
import { Property, Client, Request, User } from "@/lib/types";
import { sampleUsers } from "@/lib/data";

// ✅ استيراد دوال Firebase للقراءة فقط:
import {
  getAllProperties,
  getAllClients,
  getAllRequests,
} from "@/lib/firestore";

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
  loading: boolean;
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
  properties: [],
  clients: [],
  requests: [],
  currentUser: null,
  favorites: [],
  toast: null,
  loading: true,
};

// ✅✅✅ Reducer - State فقط! (بدون كتابة مزدوجة في Firebase)
function reducer(state: AppState, action: Action): AppState {
  var s = Object.assign({}, state);

  switch (action.type) {
    case "LOGIN":
      s.currentUser = action.payload;
      break;
    case "LOGOUT":
      s.currentUser = null;
      break;
      
    // ✅ العقارات - State فقط
    case "ADD_PROPERTY":
      s.properties = [action.payload].concat(s.properties);
      break;
    case "UPDATE_PROPERTY":
      s.properties = s.properties.map(function (p) {
        if (p.id === action.payload.id) return action.payload;
        return p;
      });
      break;
    case "DELETE_PROPERTY":
      s.properties = s.properties.filter(function (p) { return p.id !== action.payload; });
      break;

    // ✅ العملاء - State فقط
    case "ADD_CLIENT":
      s.clients = s.clients.concat([action.payload]);
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
      s.clients = s.clients.filter(function (c) { return c.id !== action.payload; });
      s.requests = s.requests.filter(function (r) { return r.clientId !== action.payload; });
      break;

    // ✅ الطلبات - State فقط
    case "ADD_REQUEST":
      s.requests = s.requests.concat([action.payload]);
      break;
    case "UPDATE_REQUEST":
      s.requests = s.requests.map(function (r) {
        if (r.id === action.payload.id) return action.payload;
        return r;
      });
      break;
    case "DELETE_REQUEST":
      s.requests = s.requests.filter(function (r) { return r.id !== action.payload; });
      break;

    case "TOGGLE_FAV":
      var isFav = s.favorites.indexOf(action.payload);
      if (isFav === -1) {
        s.favorites = s.favorites.concat([action.payload]);
      } else {
        s.favorites = s.favorites.filter(function (id) { return id !== action.payload; });
      }
      break;
    case "SHOW_TOAST":
      s.toast = action.payload;
      break;
    case "LOAD_STATE":
      s = { ...s, ...action.payload, loading: false };
      break;
    case "SET_LOADING":
      s.loading = action.payload;
      break;
  }
  return s;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const loaded = useRef(false);

  // ✅ تحميل البيانات من Firebase عند البداية
  useEffect(function () {
    if (!loaded.current) {
      loadFromFirebase();
      loaded.current = true;
    }
  }, []);

  // ✅ دالة تحميل البيانات من Firebase
  async function loadFromFirebase() {
    try {
      console.log("🔄 جاري تحميل البيانات من Firebase...");

      const [properties, clients, requests] = await Promise.all([
        getAllProperties(),
        getAllClients(),
        getAllRequests(),
      ]);

      dispatch({
        type: "LOAD_STATE",
        payload: {
          properties,
          clients,
          requests,
          favorites: JSON.parse(localStorage.getItem("aqari_favorites") || "[]"),
        },
      });

      console.log("✅ تم تحميل البيانات بنجاح!");
      console.log(`📊 العقارات: ${properties.length} | العملاء: ${clients.length} | الطلبات: ${requests.length}`);
    } catch (error) {
      console.error("❌ خطأ في تحميل البيانات:", error);
      dispatch({ type: "SET_LOADING", payload: false });
      dispatch({
        type: "SHOW_TOAST",
        payload: { message: "فشل في تحميل البيانات", type: "error" },
      });
    }
  }

  // حفظ المفضلة في localStorage
  useEffect(function () {
    if (state.favorites && !state.loading) {
      localStorage.setItem("aqari_favorites", JSON.stringify(state.favorites));
    }
  }, [state.favorites, state.loading]);

  // إدارة Toast
  useEffect(function () {
    if (state && state.toast) {
      var t = setTimeout(function () {
        dispatch({ type: "SHOW_TOAST", payload: null });
      }, 3000);
      return function () { clearTimeout(t); };
    }
  }, [state?.toast]);

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
    var unique: string[] = [];
    matches.forEach(function (m) {
      if (unique.indexOf(m) === -1) unique.push(m);
    });
    return unique;
  };

  // ✅ شاشة التحميل
  if (state.loading) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#0f172a',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, flexDirection: 'column', gap: '20px'
      }}>
        <div style={{ fontSize: '60px', animation: 'bounce 1s infinite' }}>🏠</div>
        <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          جاري تحميل البيانات...
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>من فضلك انتظر قليلاً</p>
        <div style={{
          width: '200px', height: '4px', backgroundColor: '#1e293b',
          borderRadius: '4px', overflow: 'hidden', marginTop: '10px'
        }}>
          <div style={{
            width: '60%', height: '100%', backgroundColor: '#10b981',
            borderRadius: '4px', animation: 'loading 1.5s ease-in-out infinite'
          }}></div>
        </div>
        <style>{`
          @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
          @keyframes loading { 0% { transform: translateX(-100%); } 50% { transform: translateX(150%); } 100% { transform: translateX(-100%); } }
        `}</style>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, dispatch, login, getMatches }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

export const useApp = useAppContext;
