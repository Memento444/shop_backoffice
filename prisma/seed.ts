import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 เริ่มต้นการนำเข้าข้อมูลจำลอง (Seeding Data)...");

  await prisma.transaction.deleteMany();
  await prisma.shop.deleteMany();

  const shop = await prisma.shop.create({
    data: {
      name: "ร้านมาม่าเกาหลี",
      initialCapital: 3581.0,
    },
  });

  console.log(`✅ สร้างร้านค้า: ${shop.name} ทุนเริ่มต้น ${shop.initialCapital} บาท`);

  const salesData = [
    { amount: 1001, date: "2026-09-17", note: "ยอดขายวันเปิดร้าน" },
    { amount: 1219, date: "2026-09-18", note: "ยอดขายหน้าร้าน" },
    { amount: 282,  date: "2026-09-19", note: "วันฝนตกหนัก" },
    { amount: 1277, date: "2026-09-20", note: "ยอดขายช่วงเที่ยงและเย็น" },
    { amount: 1234, date: "2026-09-21", note: "ยอดขายหน้าร้านปกติ" },
    { amount: 1397, date: "2026-09-22", note: "ลูกค้ากลุ่มใหญ่สั่งเซ็ตหม้อไฟ" },
    { amount: 1059, date: "2026-09-23", note: "ยอดขายหน้าร้าน" },
    { amount: 1283, date: "2026-09-24", note: "ยอดขายวันพฤหัส" },
    { amount: 510,  date: "2026-09-25", note: "ปิดร้านช่วงบ่ายไปซื้อของ" },
    { amount: 3092, date: "2026-09-26", note: "วันเสาร์คนแน่น ยอดขายสูงสุดประจำเดือน" },
  ];

  for (const item of salesData) {
    await prisma.transaction.create({
      data: {
        shopId: shop.id,
        type: TransactionType.SALE,
        amount: item.amount,
        date: new Date(item.date),
        note: item.note,
      },
    });
  }

  const investmentData = [
    { amount: 478,  date: "2026-09-17", note: "ซื้อเส้นมาม่าเกาหลีและกิมจิเพิ่ม" },
    { amount: 79,   date: "2026-09-18", note: "ซื้อผักกวางตุ้งและต้นหอมญี่ปุ่น" },
    { amount: 219,  date: "2026-09-19", note: "ซื้อไข่ไก่ 1 แผงและชีสแผ่น" },
    { amount: 1354, date: "2026-09-20", note: "ซื้อเนื้อหมูสไลด์และไส้กรอกตุนรอบสัปดาห์" },
    { amount: 65,   date: "2026-09-21", note: "ซื้อน้ำแข็งและถุงพลาสติก" },
    { amount: 252,  date: "2026-09-23", note: "ซื้อซอสโคชูจังและพริกป่นเกาหลี" },
    { amount: 216,  date: "2026-09-24", note: "ซื้อน้ำดื่มและเครื่องปรุงรส" },
    { amount: 233,  date: "2026-09-25", note: "ซื้อกล่องเดลิเวอรี่และช้อนส้อม" },
  ];

  for (const item of investmentData) {
    await prisma.transaction.create({
      data: {
        shopId: shop.id,
        type: TransactionType.INVESTMENT,
        amount: item.amount,
        date: new Date(item.date),
        note: item.note,
      },
    });
  }

  console.log("✅ นำเข้าข้อมูลจำลองเรียบร้อยสมบูรณ์!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
