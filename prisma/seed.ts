import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  try {
    console.log("🌱 Starting seed...");

    // Delete existing data
    await prisma.task.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();

    console.log("🗑️  Cleared existing data");

    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@teamflow.com",
        password: adminPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Created admin user:", admin.email);

    // Create demo user
    const userPassword = await hashPassword("user123");
    const user = await prisma.user.create({
      data: {
        name: "Demo User",
        email: "user@teamflow.com",
        password: userPassword,
        role: "USER",
      },
    });
    console.log("✅ Created demo user:", user.email);

    // Create sample projects
    const project1 = await prisma.project.create({
      data: {
        title: "Website Redesign",
        description:
          "Complete redesign of the company website with modern UI/UX",
        deadline: new Date("2026-06-30"),
      },
    });
    console.log("✅ Created project:", project1.title);

    const project2 = await prisma.project.create({
      data: {
        title: "Mobile App Development",
        description: "Build a native mobile application for iOS and Android",
        deadline: new Date("2026-08-31"),
      },
    });
    console.log("✅ Created project:", project2.title);

    const project3 = await prisma.project.create({
      data: {
        title: "API Integration",
        description: "Integrate third-party APIs into our platform",
        deadline: new Date("2026-05-31"),
      },
    });
    console.log("✅ Created project:", project3.title);

    // Create tasks for project 1
    const task1 = await prisma.task.create({
      data: {
        title: "Design Homepage",
        description: "Create modern homepage design",
        priority: "HIGH",
        status: "IN_PROGRESS",
        dueDate: new Date("2026-05-20"),
        projectId: project1.id,
        assignedToId: user.id,
      },
    });
    console.log("✅ Created task:", task1.title);

    const task2 = await prisma.task.create({
      data: {
        title: "Setup Backend Infrastructure",
        description: "Setup servers and databases",
        priority: "HIGH",
        status: "PENDING",
        dueDate: new Date("2026-05-15"),
        projectId: project1.id,
        assignedToId: user.id,
      },
    });
    console.log("✅ Created task:", task2.title);

    const task3 = await prisma.task.create({
      data: {
        title: "Testing and QA",
        description: "Perform comprehensive testing",
        priority: "MEDIUM",
        status: "PENDING",
        dueDate: new Date("2026-06-10"),
        projectId: project1.id,
      },
    });
    console.log("✅ Created task:", task3.title);

    // Create tasks for project 2
    const task4 = await prisma.task.create({
      data: {
        title: "Create UI Components",
        description: "Build reusable UI components",
        priority: "HIGH",
        status: "COMPLETED",
        dueDate: new Date("2026-05-10"),
        projectId: project2.id,
        assignedToId: user.id,
      },
    });
    console.log("✅ Created task:", task4.title);

    const task5 = await prisma.task.create({
      data: {
        title: "Implement Authentication",
        description: "Add user authentication system",
        priority: "HIGH",
        status: "IN_PROGRESS",
        dueDate: new Date("2026-05-25"),
        projectId: project2.id,
        assignedToId: user.id,
      },
    });
    console.log("✅ Created task:", task5.title);

    // Create tasks for project 3
    const task6 = await prisma.task.create({
      data: {
        title: "Documentation Review",
        description: "Review API documentation",
        priority: "LOW",
        status: "PENDING",
        dueDate: new Date("2026-05-12"),
        projectId: project3.id,
      },
    });
    console.log("✅ Created task:", task6.title);

    console.log("\n✨ Seed completed successfully!");
    console.log("\n📋 Demo Credentials:");
    console.log("Admin - Email: admin@teamflow.com, Password: admin123");
    console.log("User - Email: user@teamflow.com, Password: user123");
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
