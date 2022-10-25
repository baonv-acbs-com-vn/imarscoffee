-- CreateTable
CREATE TABLE "ContentState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentDirectory" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "frontmatter" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL,
    "requiresUpdate" BOOLEAN DEFAULT false,
    "description" TEXT NOT NULL DEFAULT '',
    "price" INTEGER NOT NULL DEFAULT 0,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT NOT NULL,
    "state" TEXT NOT NULL DEFAULT 'none'
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentState_key_key" ON "ContentState"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");
