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
    case "ADD_CLIENT": s = { ...s, clients: [...s.clients, action.payload
