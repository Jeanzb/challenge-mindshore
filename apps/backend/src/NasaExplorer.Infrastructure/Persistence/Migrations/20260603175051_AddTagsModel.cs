using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NasaExplorer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddTagsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImageTags_CollectionImages_CollectionImageId",
                table: "ImageTags");

            migrationBuilder.DropIndex(
                name: "IX_ImageTags_CollectionImageId_Name",
                table: "ImageTags");

            migrationBuilder.CreateTable(
                name: "Tags",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    NormalizedName = table.Column<string>(type: "nvarchar(80)", maxLength: 80, nullable: false),
                    IsAiGenerated = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tags", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Tags_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "ImageTags",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SpaceImageId",
                table: "ImageTags",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TagId",
                table: "ImageTags",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.Sql("""
                INSERT INTO [Tags] (
                    [UserId],
                    [Name],
                    [NormalizedName],
                    [IsAiGenerated],
                    [CreatedAt])
                SELECT
                    [collection].[UserId],
                    MAX(LTRIM(RTRIM([imageTag].[Name]))),
                    LOWER(LTRIM(RTRIM([imageTag].[Name]))),
                    CAST(MAX(CASE WHEN LOWER([imageTag].[Source]) = N'ai' THEN 1 ELSE 0 END) AS bit),
                    MIN([collectionImage].[CreatedAt])
                FROM [ImageTags] AS [imageTag]
                INNER JOIN [CollectionImages] AS [collectionImage]
                    ON [collectionImage].[Id] = [imageTag].[CollectionImageId]
                INNER JOIN [Collections] AS [collection]
                    ON [collection].[Id] = [collectionImage].[CollectionId]
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM [Tags] AS [existing]
                    WHERE [existing].[UserId] = [collection].[UserId]
                        AND [existing].[NormalizedName] = LOWER(LTRIM(RTRIM([imageTag].[Name]))))
                GROUP BY
                    [collection].[UserId],
                    LOWER(LTRIM(RTRIM([imageTag].[Name])));
                """);

            migrationBuilder.Sql("""
                UPDATE [imageTag]
                SET
                    [imageTag].[SpaceImageId] = [collectionImage].[SpaceImageId],
                    [imageTag].[TagId] = [tag].[Id],
                    [imageTag].[CreatedAt] = [collectionImage].[CreatedAt]
                FROM [ImageTags] AS [imageTag]
                INNER JOIN [CollectionImages] AS [collectionImage]
                    ON [collectionImage].[Id] = [imageTag].[CollectionImageId]
                INNER JOIN [Collections] AS [collection]
                    ON [collection].[Id] = [collectionImage].[CollectionId]
                INNER JOIN [Tags] AS [tag]
                    ON [tag].[UserId] = [collection].[UserId]
                    AND [tag].[NormalizedName] = LOWER(LTRIM(RTRIM([imageTag].[Name])));
                """);

            migrationBuilder.Sql("""
                WITH [duplicates] AS (
                    SELECT
                        [Id],
                        ROW_NUMBER() OVER (
                            PARTITION BY [SpaceImageId], [TagId]
                            ORDER BY [CreatedAt], [Id]) AS [RowNumber]
                    FROM [ImageTags]
                )
                DELETE FROM [duplicates]
                WHERE [RowNumber] > 1;
                """);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "CreatedAt",
                table: "ImageTags",
                type: "datetimeoffset",
                nullable: false,
                oldClrType: typeof(DateTimeOffset),
                oldType: "datetimeoffset",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "SpaceImageId",
                table: "ImageTags",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "TagId",
                table: "ImageTags",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "CollectionImageId",
                table: "ImageTags");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "ImageTags");

            migrationBuilder.DropColumn(
                name: "Source",
                table: "ImageTags");

            migrationBuilder.CreateIndex(
                name: "IX_ImageTags_SpaceImageId",
                table: "ImageTags",
                column: "SpaceImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageTags_SpaceImageId_TagId",
                table: "ImageTags",
                columns: new[] { "SpaceImageId", "TagId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ImageTags_TagId",
                table: "ImageTags",
                column: "TagId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_NormalizedName",
                table: "Tags",
                column: "NormalizedName");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_UserId",
                table: "Tags",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_UserId_NormalizedName",
                table: "Tags",
                columns: new[] { "UserId", "NormalizedName" },
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_ImageTags_SpaceImages_SpaceImageId",
                table: "ImageTags",
                column: "SpaceImageId",
                principalTable: "SpaceImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ImageTags_Tags_TagId",
                table: "ImageTags",
                column: "TagId",
                principalTable: "Tags",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImageTags_SpaceImages_SpaceImageId",
                table: "ImageTags");

            migrationBuilder.DropForeignKey(
                name: "FK_ImageTags_Tags_TagId",
                table: "ImageTags");

            migrationBuilder.DropIndex(
                name: "IX_ImageTags_SpaceImageId",
                table: "ImageTags");

            migrationBuilder.DropIndex(
                name: "IX_ImageTags_SpaceImageId_TagId",
                table: "ImageTags");

            migrationBuilder.DropIndex(
                name: "IX_ImageTags_TagId",
                table: "ImageTags");

            migrationBuilder.AddColumn<Guid>(
                name: "CollectionImageId",
                table: "ImageTags",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ImageTags",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "ImageTags",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE [imageTag]
                SET
                    [imageTag].[CollectionImageId] = [collectionImage].[Id],
                    [imageTag].[Name] = LEFT([tag].[Name], 60),
                    [imageTag].[Source] = CASE WHEN [tag].[IsAiGenerated] = 1 THEN N'ai' ELSE N'manual' END
                FROM [ImageTags] AS [imageTag]
                INNER JOIN [Tags] AS [tag]
                    ON [tag].[Id] = [imageTag].[TagId]
                CROSS APPLY (
                    SELECT TOP 1 [candidate].[Id]
                    FROM [CollectionImages] AS [candidate]
                    INNER JOIN [Collections] AS [collection]
                        ON [collection].[Id] = [candidate].[CollectionId]
                    WHERE [candidate].[SpaceImageId] = [imageTag].[SpaceImageId]
                        AND ([tag].[UserId] IS NULL OR [collection].[UserId] = [tag].[UserId])
                    ORDER BY [candidate].[CreatedAt], [candidate].[Id]
                ) AS [collectionImage];
                """);

            migrationBuilder.Sql("""
                DELETE FROM [ImageTags]
                WHERE [CollectionImageId] IS NULL;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "CollectionImageId",
                table: "ImageTags",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "ImageTags",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(60)",
                oldMaxLength: 60,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Source",
                table: "ImageTags",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(20)",
                oldMaxLength: 20,
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "ImageTags");

            migrationBuilder.DropColumn(
                name: "SpaceImageId",
                table: "ImageTags");

            migrationBuilder.DropColumn(
                name: "TagId",
                table: "ImageTags");

            migrationBuilder.DropTable(
                name: "Tags");

            migrationBuilder.CreateIndex(
                name: "IX_ImageTags_CollectionImageId_Name",
                table: "ImageTags",
                columns: new[] { "CollectionImageId", "Name" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ImageTags_CollectionImages_CollectionImageId",
                table: "ImageTags",
                column: "CollectionImageId",
                principalTable: "CollectionImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
