// 📁 src/lib/deviceUUID.js

// دالة لتوليد UUID فريد
function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    // استخدام مولد UUID المدمج في المتصفح لو متاح
    return crypto.randomUUID();
  }

  // fallback لو crypto.randomUUID مش مدعوم
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// الدالة الرئيسية اللي بتجيب UUID ثابت للجهاز الحالي
export function getDeviceUUID() {
  const storageKey = "userDeviceUUID"; // المفتاح اللي بنخزن تحته الـ UUID في localStorage

  try {
    let uuid = localStorage.getItem(storageKey);

    if (!uuid) {
      // لو مفيش UUID محفوظ، نعمل واحد جديد ونخزنه
      uuid = generateUUID();
      localStorage.setItem(storageKey, uuid);
    }

    return uuid; // نرجع UUID سواء جديد أو محفوظ
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    // fallback: نرجع UUID جديد لكن مش هيتخزن
    return generateUUID();
  }
}

// دالة إضافية لو عايز تمسح UUID الجهاز (اختياري)
export function clearDeviceUUID() {
  try {
    localStorage.removeItem("userDeviceUUID");
  } catch (error) {
    console.error("Error clearing device UUID:", error);
  }
}
