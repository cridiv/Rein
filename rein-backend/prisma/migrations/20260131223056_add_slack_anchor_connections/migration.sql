-- CreateTable
CREATE TABLE "commitments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "platform_user_id" TEXT,
    "commitment_text" TEXT NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "context" TEXT,
    "channel_or_dm" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending',

    CONSTRAINT "commitments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reminders" (
    "id" TEXT NOT NULL,
    "commitment_id" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message_id" TEXT NOT NULL,
    "response_type" TEXT,
    "response_text" TEXT,
    "response_at" TIMESTAMP(3),

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "escalations" (
    "id" TEXT NOT NULL,
    "commitment_id" TEXT NOT NULL,
    "escalated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,

    CONSTRAINT "escalations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slack_connections" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "workspace_name" TEXT,
    "bot_access_token" TEXT NOT NULL,
    "slack_user_id" TEXT NOT NULL,
    "slack_user_name" TEXT,
    "scope" TEXT,
    "connected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "slack_connections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slack_connections_user_id_key" ON "slack_connections"("user_id");

-- AddForeignKey
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_commitment_id_fkey" FOREIGN KEY ("commitment_id") REFERENCES "commitments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "escalations" ADD CONSTRAINT "escalations_commitment_id_fkey" FOREIGN KEY ("commitment_id") REFERENCES "commitments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
