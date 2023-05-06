-- CreateTable
CREATE TABLE "Field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "blurb" TEXT,

    CONSTRAINT "Field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "link" TEXT,
    "video" TEXT,
    "image" TEXT,
    "published" BOOLEAN NOT NULL,
    "page" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FieldToProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FieldToProject_AB_unique" ON "_FieldToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_FieldToProject_B_index" ON "_FieldToProject"("B");

-- AddForeignKey
ALTER TABLE "_FieldToProject" ADD CONSTRAINT "_FieldToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Field"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FieldToProject" ADD CONSTRAINT "_FieldToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

