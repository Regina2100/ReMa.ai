import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const mockInterview = pgTable("MockInterview", {
	id: serial().primaryKey().notNull(),
	jsonMockResp: text().notNull(),
	jobPosition: varchar().notNull(),
	jobDesc: varchar().notNull(),
	jobExperience: varchar().notNull(),
	createdBy: varchar().notNull(),
	createdAt: varchar(),
	mockId: varchar().notNull(),
});

export const userAnswer = pgTable("userAnswer", {
	id: serial().primaryKey().notNull(),
	mockId: varchar().notNull(),
	question: varchar().notNull(),
	correctAns: text(),
	userAns: text(),
	feedback: text(),
	rating: varchar(),
	userEmail: varchar(),
	createdAt: varchar(),
});
