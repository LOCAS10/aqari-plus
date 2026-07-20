"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppContext } from "@/contexts/AppContext";
import { displayPrice } from "@/components/PropertyCard";
import { addNotification } from "@/lib/notifications";
import { addRequest as fbAddRequest } from "@/lib/firestore";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { state, dispatch } = useAppContext();
  const [selectedImage, setSelectedImage] = useState(0);
  const property = state.properties.find(p => p.id === id);
  const router = useRouter();
  
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiryType, setInquiryType] = useState<'زيارة' | 'شراء' | 'كراء'>('شراء');
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    notes: '',
  });
  
  const isAdmin = state.currentUser?.role === "مدير";

  if (!property) {
    return (
      <div className="max-w
