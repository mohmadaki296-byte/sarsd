"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { ShippingDocument, CargoItem } from "@/types/shipping-document";
import { Plus, Trash2, Save } from "lucide-react";
import { db } from "@/lib/firestore";

export function DocumentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<ShippingDocument>({
    document_number: "",
    license_number: "",
    status: "محفوظه",
    receipt_date: "",
    exit_date: "",
    is_negotiable: false,
    cargo_document_number: "",
    carrier_name: "",
    carrier_phone: "",
    carrier_notes: "",
    driver_name: "",
    driver_id_number: "",
    driver_id_type: "رقم هوية السائق",
    driver_nationality: "",
    driver_birth_date: "",
    driver_phone: "",
    truck_country: "",
    truck_city: "",
    truck_plate_number: "",
    truck_plate_code: "",
    truck_classification_code: "",
    truck_color: "",
    truck_type: "",
    sender_name: "",
    sender_address: "",
    sender_city: "",
    sender_country: "",
    sender_phone: "",
    sender_notes: "",
    recipient_name: "",
    recipient_address: "",
    recipient_city: "",
    recipient_country: "",
    recipient_phone: "",
    recipient_notes: "",
    route_from_city: "",
    route_from_country: "",
    route_to_city: "",
    route_to_country: "",
    cargo_items: [],
    payment_by: "المرسل إليه",
    payment_method: "",
    payment_instructions: "",
  });

  const [cargoItems, setCargoItems] = useState<CargoItem[]>([
    {
      description: "",
      quantity: 0,
      weight: 0,
      unit: "طن",
      dimensions: "",
      status: "سليمة",
    },
  ]);

  const addCargoItem = () => {
    setCargoItems([
      ...cargoItems,
      {
        description: "",
        quantity: 0,
        weight: 0,
        unit: "طن",
        dimensions: "",
        status: "سليمة",
      },
    ]);
  };

  const removeCargoItem = (index: number) => {
    setCargoItems(cargoItems.filter((_, i) => i !== index));
  };

  const updateCargoItem = (
    index: number,
    field: keyof CargoItem,
    value: string | number
  ) => {
    const updated = [...cargoItems];
    updated[index] = { ...updated[index], [field]: value };
    setCargoItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const documentData = {
        ...formData,
        cargo_items: cargoItems,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, "shipping_documents"),
        documentData
      );

      router.push(`/documents/${docRef.id}`);
    } catch (error) {
      console.error("[v0] Error saving document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      {/* Document Info */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات الوثيقة</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="document_number">رقم الوثيقة *</Label>
            <Input
              id="document_number"
              required
              value={formData.document_number}
              onChange={(e) =>
                setFormData({ ...formData, document_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="license_number">رقم الترخيص</Label>
            <Input
              id="license_number"
              value={formData.license_number}
              onChange={(e) =>
                setFormData({ ...formData, license_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="status">الحالة</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="محفوظه">محفوظه</SelectItem>
                <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
                <SelectItem value="مكتملة">مكتملة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="receipt_date">تاريخ الاستلام</Label>
            <Input
              id="receipt_date"
              type="date"
              value={formData.receipt_date}
              onChange={(e) =>
                setFormData({ ...formData, receipt_date: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="exit_date">تاريخ الخروج</Label>
            <Input
              id="exit_date"
              type="date"
              value={formData.exit_date}
              onChange={(e) =>
                setFormData({ ...formData, exit_date: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="cargo_document_number">رقم وثيقة بيان حمولة</Label>
            <Input
              id="cargo_document_number"
              value={formData.cargo_document_number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cargo_document_number: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Carrier Info */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات الناقل</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="carrier_name">الإسم</Label>
            <Input
              id="carrier_name"
              value={formData.carrier_name}
              onChange={(e) =>
                setFormData({ ...formData, carrier_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="carrier_phone">رقم الهاتف</Label>
            <Input
              id="carrier_phone"
              value={formData.carrier_phone}
              onChange={(e) =>
                setFormData({ ...formData, carrier_phone: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="carrier_notes">ملاحظات الناقل</Label>
            <Textarea
              id="carrier_notes"
              value={formData.carrier_notes}
              onChange={(e) =>
                setFormData({ ...formData, carrier_notes: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Driver Info */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات السائق</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="driver_name">اسم السائق</Label>
            <Input
              id="driver_name"
              value={formData.driver_name}
              onChange={(e) =>
                setFormData({ ...formData, driver_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="driver_id_number">رقم الهوية</Label>
            <Input
              id="driver_id_number"
              value={formData.driver_id_number}
              onChange={(e) =>
                setFormData({ ...formData, driver_id_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="driver_id_type">نوع الهوية</Label>
            <Select
              value={formData.driver_id_type}
              onValueChange={(value) =>
                setFormData({ ...formData, driver_id_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="رقم هوية السائق">رقم هوية السائق</SelectItem>
                <SelectItem value="جواز سفر">جواز سفر</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="driver_nationality">الجنسية</Label>
            <Input
              id="driver_nationality"
              value={formData.driver_nationality}
              onChange={(e) =>
                setFormData({ ...formData, driver_nationality: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="driver_birth_date">تاريخ ميلاد السائق</Label>
            <Input
              id="driver_birth_date"
              type="date"
              value={formData.driver_birth_date}
              onChange={(e) =>
                setFormData({ ...formData, driver_birth_date: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="driver_phone">رقم جوال السائق</Label>
            <Input
              id="driver_phone"
              value={formData.driver_phone}
              onChange={(e) =>
                setFormData({ ...formData, driver_phone: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Truck Info */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات الشاحنة</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="truck_country">الدولة</Label>
            <Input
              id="truck_country"
              value={formData.truck_country}
              onChange={(e) =>
                setFormData({ ...formData, truck_country: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="truck_city">المدينة</Label>
            <Input
              id="truck_city"
              value={formData.truck_city}
              onChange={(e) =>
                setFormData({ ...formData, truck_city: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="truck_plate_number">رقم اللوحة</Label>
            <Input
              id="truck_plate_number"
              value={formData.truck_plate_number}
              onChange={(e) =>
                setFormData({ ...formData, truck_plate_number: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="truck_plate_code">ترميز اللوحة</Label>
            <Input
              id="truck_plate_code"
              value={formData.truck_plate_code}
              onChange={(e) =>
                setFormData({ ...formData, truck_plate_code: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="truck_classification_code">
              رمز مجموعة التصنيف
            </Label>
            <Input
              id="truck_classification_code"
              value={formData.truck_classification_code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  truck_classification_code: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="truck_color">اللون</Label>
            <Input
              id="truck_color"
              value={formData.truck_color}
              onChange={(e) =>
                setFormData({ ...formData, truck_color: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="truck_type">نوع الشاحنة</Label>
            <Input
              id="truck_type"
              value={formData.truck_type}
              onChange={(e) =>
                setFormData({ ...formData, truck_type: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Sender Info */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات المرسل</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sender_name">الإسم</Label>
            <Input
              id="sender_name"
              value={formData.sender_name}
              onChange={(e) =>
                setFormData({ ...formData, sender_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="sender_phone">رقم الهاتف</Label>
            <Input
              id="sender_phone"
              value={formData.sender_phone}
              onChange={(e) =>
                setFormData({ ...formData, sender_phone: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="sender_city">المدينة</Label>
            <Input
              id="sender_city"
              value={formData.sender_city}
              onChange={(e) =>
                setFormData({ ...formData, sender_city: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="sender_country">الدولة</Label>
            <Input
              id="sender_country"
              value={formData.sender_country}
              onChange={(e) =>
                setFormData({ ...formData, sender_country: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="sender_address">العنوان</Label>
            <Textarea
              id="sender_address"
              value={formData.sender_address}
              onChange={(e) =>
                setFormData({ ...formData, sender_address: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="sender_notes">ملاحظات المرسل</Label>
            <Textarea
              id="sender_notes"
              value={formData.sender_notes}
              onChange={(e) =>
                setFormData({ ...formData, sender_notes: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Recipient Info */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات المرسل إليه</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="recipient_name">الإسم</Label>
            <Input
              id="recipient_name"
              value={formData.recipient_name}
              onChange={(e) =>
                setFormData({ ...formData, recipient_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="recipient_phone">رقم الهاتف</Label>
            <Input
              id="recipient_phone"
              value={formData.recipient_phone}
              onChange={(e) =>
                setFormData({ ...formData, recipient_phone: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="recipient_city">المدينة</Label>
            <Input
              id="recipient_city"
              value={formData.recipient_city}
              onChange={(e) =>
                setFormData({ ...formData, recipient_city: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="recipient_country">الدولة</Label>
            <Input
              id="recipient_country"
              value={formData.recipient_country}
              onChange={(e) =>
                setFormData({ ...formData, recipient_country: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="recipient_address">العنوان</Label>
            <Textarea
              id="recipient_address"
              value={formData.recipient_address}
              onChange={(e) =>
                setFormData({ ...formData, recipient_address: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="recipient_notes">ملاحظات المرسل إليه</Label>
            <Textarea
              id="recipient_notes"
              value={formData.recipient_notes}
              onChange={(e) =>
                setFormData({ ...formData, recipient_notes: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Route Info */}
      <Card>
        <CardHeader>
          <CardTitle>خط سير الرحلة</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="route_from_city">من - المدينة</Label>
            <Input
              id="route_from_city"
              value={formData.route_from_city}
              onChange={(e) =>
                setFormData({ ...formData, route_from_city: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="route_from_country">من - الدولة</Label>
            <Input
              id="route_from_country"
              value={formData.route_from_country}
              onChange={(e) =>
                setFormData({ ...formData, route_from_country: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="route_to_city">إلى - المدينة</Label>
            <Input
              id="route_to_city"
              value={formData.route_to_city}
              onChange={(e) =>
                setFormData({ ...formData, route_to_city: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="route_to_country">إلى - الدولة</Label>
            <Input
              id="route_to_country"
              value={formData.route_to_country}
              onChange={(e) =>
                setFormData({ ...formData, route_to_country: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Cargo Items */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>بيانات البضاعة</CardTitle>
          <Button
            type="button"
            onClick={addCargoItem}
            size="sm"
            variant="outline"
          >
            <Plus className="h-4 w-4 ml-2" />
            إضافة صنف
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {cargoItems.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">صنف {index + 1}</h4>
                {cargoItems.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeCargoItem(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <Label>وصف البضاعة</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateCargoItem(index, "description", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>العدد</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCargoItem(index, "quantity", Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label>الوزن</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={item.weight}
                    onChange={(e) =>
                      updateCargoItem(index, "weight", Number(e.target.value))
                    }
                  />
                </div>
                <div>
                  <Label>الوحدة</Label>
                  <Select
                    value={item.unit}
                    onValueChange={(value) =>
                      updateCargoItem(index, "unit", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="طن">طن</SelectItem>
                      <SelectItem value="كجم">كجم</SelectItem>
                      <SelectItem value="قطعة">قطعة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>الأبعاد (متر)</Label>
                  <Input
                    value={item.dimensions}
                    onChange={(e) =>
                      updateCargoItem(index, "dimensions", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>الحالة</Label>
                  <Select
                    value={item.status}
                    onValueChange={(value) =>
                      updateCargoItem(index, "status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="سليمة">سليمة</SelectItem>
                      <SelectItem value="تالفة">تالفة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات أجور النقل</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="payment_by">تدفع من قبل</Label>
            <Select
              value={formData.payment_by}
              onValueChange={(value) =>
                setFormData({ ...formData, payment_by: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="المرسل">المرسل</SelectItem>
                <SelectItem value="المرسل إليه">المرسل إليه</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="payment_method">طريقة دفع الأجور</Label>
            <Input
              id="payment_method"
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="payment_instructions">
              تعليمات خاصة بدفع الأجور
            </Label>
            <Textarea
              id="payment_instructions"
              value={formData.payment_instructions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  payment_instructions: e.target.value,
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/")}
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={loading}>
          <Save className="h-4 w-4 ml-2" />
          {loading ? "جاري الحفظ..." : "حفظ الوثيقة"}
        </Button>
      </div>
    </form>
  );
}
