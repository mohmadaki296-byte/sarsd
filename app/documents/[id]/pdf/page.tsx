// app/(whatever)/pdf/[id]/page.tsx — Server Component
import { db } from "@/lib/firestore";
import { doc, getDoc } from "firebase/firestore";
import { notFound } from "next/navigation";
import type { ShippingDocument, CargoItem } from "@/types/shipping-document";
import PdfClient from "@/components/clinent-fodc";

export default async function PDFPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const docRef = doc(db, "shipping_documents", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) notFound();

  const document = { id: docSnap.id, ...docSnap.data() } as ShippingDocument;
  const cargoItems = (document.cargo_items as CargoItem[]) || [];
  const docUrl = `https://www.zosikm.com/documents/${document.id}`;

  return (
    <PdfClient document={document} cargoItems={cargoItems} docUrl={docUrl} />
  );
}
