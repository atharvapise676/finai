import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding FinAI database...");

  // 1. Clear existing seed data if any
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.aIMessage.deleteMany();
  await prisma.aIConversation.deleteMany();
  await prisma.calculation.deleteMany();
  await prisma.budgetItem.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.financialGoal.deleteMany();
  await prisma.financialProfile.deleteMany();
  await prisma.eligibilityRule.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Default Eligibility Rules
  const defaultRule = await prisma.eligibilityRule.create({
    data: {
      ruleVersion: "v1.0.0",
      minIncome: 25000,
      maxFOIR: 0.50, // 50% max fixed-obligation-to-income
      minCreditScore: 650,
      maxLoanTenure: 360,
      maxMultiplier: 60,
      isActive: true,
      updatedBy: "FinAI Risk Architecture Committee",
    },
  });

  const passwordHash = await bcrypt.hash("demo123", 10);
  const adminPasswordHash = await bcrypt.hash("admin123", 10);

  // 3. Create Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@finai.com",
      name: "FinAI Administrator",
      passwordHash: adminPasswordHash,
      role: "admin",
      profile: {
        create: {
          monthlyIncome: 120000,
          monthlyExpenses: 40000,
          existingEmi: 15000,
          savings: 450000,
          emergencyFund: 240000,
          creditScore: 810,
          employmentType: "salaried",
          age: 38,
          dependents: 2,
        },
      },
    },
  });

  // 4. Create Demo Persona 1: Aarav Sharma (Prime Profile)
  const aarav = await prisma.user.create({
    data: {
      email: "demo@finai.com",
      name: "Aarav Sharma",
      passwordHash,
      role: "user",
      profile: {
        create: {
          monthlyIncome: 85000,
          monthlyExpenses: 32000,
          existingEmi: 8000,
          savings: 180000,
          emergencyFund: 150000,
          creditScore: 780,
          employmentType: "salaried",
          age: 31,
          dependents: 1,
        },
      },
      goals: {
        create: [
          {
            name: "Emergency Fund Buffer (6 Mo)",
            category: "Emergency",
            targetAmount: 200000,
            currentAmount: 150000,
            targetDate: new Date("2026-12-31"),
          },
          {
            name: "Down Payment for Home",
            category: "Home",
            targetAmount: 800000,
            currentAmount: 250000,
            targetDate: new Date("2028-06-30"),
          },
          {
            name: "Electric Vehicle Purchase",
            category: "Vehicle",
            targetAmount: 300000,
            currentAmount: 95000,
            targetDate: new Date("2027-03-31"),
          },
        ],
      },
      budgets: {
        create: {
          month: "2026-09",
          income: 85000,
          items: {
            create: [
              { category: "Housing", allocated: 22000, spent: 22000 },
              { category: "Food & Groceries", allocated: 12000, spent: 10500 },
              { category: "Transport & Fuel", allocated: 6000, spent: 5400 },
              { category: "Utilities & Bills", allocated: 5000, spent: 4800 },
              { category: "Debt Payments (EMI)", allocated: 8000, spent: 8000 },
              { category: "Savings & Investments", allocated: 25000, spent: 25000 },
              { category: "Entertainment & Leisure", allocated: 7000, spent: 6200 },
            ],
          },
        },
      },
      notifications: {
        create: [
          {
            title: "Financial Health Score Updated",
            message: "Your financial health indicator is 82/100 (Strong Tier). Review your debt-to-income buffer.",
            type: "success",
          },
          {
            title: "Goal Progress Alert",
            message: "Emergency buffer is 75% funded! ₹50,000 remaining to complete your 6-month safety net.",
            type: "info",
          },
        ],
      },
    },
  });

  // 5. Create Demo Persona 2: Priya Patel (Balanced Planner)
  const priya = await prisma.user.create({
    data: {
      email: "priya@finai.com",
      name: "Priya Patel",
      passwordHash,
      role: "user",
      profile: {
        create: {
          monthlyIncome: 60000,
          monthlyExpenses: 25000,
          existingEmi: 5000,
          savings: 80000,
          emergencyFund: 60000,
          creditScore: 740,
          employmentType: "salaried",
          age: 28,
          dependents: 0,
        },
      },
      goals: {
        create: [
          {
            name: "Higher Education Certification",
            category: "Education",
            targetAmount: 120000,
            currentAmount: 70000,
            targetDate: new Date("2027-01-31"),
          },
          {
            name: "International Travel",
            category: "Travel",
            targetAmount: 150000,
            currentAmount: 45000,
            targetDate: new Date("2026-11-15"),
          },
        ],
      },
    },
  });

  // 6. Create Demo Persona 3: Rohit Verma (High Debt / Needs Attention)
  const rohit = await prisma.user.create({
    data: {
      email: "rohit@finai.com",
      name: "Rohit Verma",
      passwordHash,
      role: "user",
      profile: {
        create: {
          monthlyIncome: 45000,
          monthlyExpenses: 24000,
          existingEmi: 18000,
          savings: 20000,
          emergencyFund: 10000,
          creditScore: 640,
          employmentType: "self_employed",
          age: 34,
          dependents: 2,
        },
      },
      goals: {
        create: [
          {
            name: "Debt Paydown Acceleration",
            category: "Debt",
            targetAmount: 150000,
            currentAmount: 20000,
            targetDate: new Date("2027-08-31"),
          },
        ],
      },
    },
  });

  // 7. Seed Initial Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: adminUser.id,
        action: "RULE_VERSION_INIT",
        metadata: JSON.stringify({ version: "v1.0.0", ruleId: defaultRule.id }),
      },
      {
        userId: aarav.id,
        action: "PROFILE_INITIALIZED",
        metadata: JSON.stringify({ income: 85000, creditScore: 780 }),
      },
      {
        userId: aarav.id,
        action: "CALCULATION_PERFORMED",
        metadata: JSON.stringify({ type: "affordability", requestedLoan: 2500000 }),
      },
    ],
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
