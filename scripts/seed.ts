import { config } from "dotenv";
config({ path: ".env.local" });

import { devices, users } from "../src/lib/db/schema";
import { hashPassword } from "../src/lib/auth/password";
// import { db } from "../src/lib/db/index"; // Moved to main() to avoid hoisting issues

const equipmentList = [
  "Alat partus set",
  "Angiografi",
  "Apheresis",
  "Arthroscope",
  "Audiometri",
  "Autoclave",
  "Autorefkeratometer",
  "Biopsi terpimpin (Guiding biopsy)",
  "BNO IVP",
  "Bone scan",
  "Bronchoscope",
  "Bronchoscope and accessories",
  "C Arm",
  "CT Scan",
  "CT Scan dengan kontras",
  "CT Scan Kepala leher",
  "CT Scan toraks",
  "Cultur chamber",
  "Curretage instrument set",
  "Cystoscopy",
  "Cyto Centrifuge",
  "Dental unit",
  "Dental X-Ray",
  "ECG with treadmill",
  "ECG/EKG/Electrocardiograph",
  "Echocardiografi",
  "Electro Convulsive Therapy (ECT)",
  "Electroencephalograph",
  "Elektromyogram (EMG)/Evoke Potential/Neurostimulator",
  "Endoscopy THT",
  "Endoskopi",
  "ESWL",
  "Fakoemulsifikasi set",
  "Fundus photography",
  "General Instrument Bone Surgery",
  "Glaukoma set",
  "Incubator Baby",
  "Infant Warmer",
  "Infusion pump",
  "IRR (Infra Red),",
  "Laboratorium Mikrobiologi Klinik",
  "Laboratorium PA",
  "Laboratorium Parasitologi Klinik",
  "Laboratorium PK",
  "Laminectomy",
  "Laringoskop",
  "Major Surgery Instrument Set utk abdomen pediatric",
  "Major Surgery Instrument Set utk bedah plastik",
  "Major Surgery Instrument Set utk Bedah rahang dan mulut",
  "Major Surgery Instrument Set utk leher (Dewasa dan pediatric)",
  "Major Surgery Instrument Set utk thorak dan cardiac Baby",
  "Major Surgery Instrument Set utk thorak dan cardiac Dewasa",
  "Major Surgery Instrument Set utk urologi Dewasa",
  "Mesin Polymerase Chain Reaction (PCR)",
  "Mikroskop binokular",
  "Minor electro surgery",
  "Minor Surgery Set",
  "MRI",
  "MWD (Microwave diathermy)",
  "Nebulizer",
  "Oven",
  "Panoramic",
  "Peralatan Bedah Skalpel",
  "Pesawat Sinar-X, C-Arm",
  "Pesawat Sinar-X, Dental Panoramic",
  "Pesawat Sinar-X, Fluoroscopy",
  "Photo Therapy/Blue Light",
  "Radiografi konvensional",
  "Radiografi konvensional (termasuk abdomen BNO/3 posisi)",
  "Radioterapi",
  "Resusitation Set / Resusitation bay / Resusitation kit",
  "Root canal metter",
  "Sectio Caesarian set",
  "Set Bedah Endodonsi",
  "Set kraniotomi dasar",
  "Slit Lamp",
  "Spekular mikroskop",
  "Spirometri",
  "Surgery Instrument Set",
  "SWD (Short Wave Diathermy)",
  "TENS / ES (Trans Electric Nerve Simulation/Electrical Simulation)",
  "Tonometer",
  "Trakeostromi set",
  "Treadmill",
  "TURP(prostat)",
  "Ultrasonograph (USG)/Obstetric-gynecologic ultrasonic imager",
  "Uroflowmetri",
  "US (Ultra Sound)",
  "USG",
  "USG / USG Doppler sendi & jaringan lunak",
  "USG urolog",
  "Vacum Ekstraktor/Fetal vacuum extractor",
  "Ventilator",
];

async function main() {
  const { db } = await import("../src/lib/db/index");

  console.log("🗑️  Clearing existing data...");

  // Delete in correct order (respect foreign key constraints)
  try {
    await db.delete(devices);
    await db.delete(users);
    console.log("✓ Existing data cleared!\n");
  } catch (error) {
    console.error("Error clearing data:", error);
  }

  // Seed Users
  console.log("Seeding users...");
  try {
    const usersData = [
      {
        email: "admin@simpkes.com",
        username: "Admin Simpkes",
        password: await hashPassword("admin123"),
        role: "admin",
      },
      {
        email: "user1@simpkes.com",
        username: "User 1",
        password: await hashPassword("user123"),
        role: "user",
      },
      {
        email: "user2@simpkes.com",
        username: "User 2",
        password: await hashPassword("user123"),
        role: "user",
      },
    ];

    await db.insert(users).values(usersData);
    console.log("✓ Users seeded successfully!");
  } catch (error) {
    console.error("Error seeding users:", error);
  }

  // Seed Devices
  console.log("Seeding devices...");

  try {
    // Remove duplicates from equipmentList
    const uniqueEquipment = [...new Set(equipmentList)];

    const values = uniqueEquipment.map((name) => ({
      name,
    }));

    await db.insert(devices).values(values);
    console.log(`✓ ${values.length} devices seeded successfully!`);
  } catch (error) {
    console.error("Error seeding devices:", error);
  }

  console.log("\n🎉 All seeding complete!");
  process.exit(0);
}

main();
