using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NasaExplorer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class LinkCollectionImagesToSpaceImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CollectionImages_CollectionId_NasaImageId",
                table: "CollectionImages");

            migrationBuilder.RenameColumn(
                name: "AddedAt",
                table: "CollectionImages",
                newName: "CreatedAt");

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "CollectionImages",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "SpaceImageId",
                table: "CollectionImages",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UserNote",
                table: "CollectionImages",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.Sql("""
                INSERT INTO [SpaceImages] (
                    [NasaId],
                    [Title],
                    [Description],
                    [ImageUrl],
                    [ThumbnailUrl],
                    [SourceUrl],
                    [MediaType],
                    [Center],
                    [Mission],
                    [Rover],
                    [Camera],
                    [DateCreated],
                    [Keywords],
                    [CreatedAt],
                    [UpdatedAt])
                SELECT
                    [source].[NasaImageId],
                    MAX([source].[Title]),
                    MAX([source].[Description]),
                    MAX([source].[ImageUrl]),
                    MAX([source].[ThumbnailUrl]),
                    NULL,
                    N'image',
                    NULL,
                    NULL,
                    NULL,
                    NULL,
                    MAX([source].[DateTaken]),
                    NULL,
                    MIN([source].[CreatedAt]),
                    MAX([source].[CreatedAt])
                FROM [CollectionImages] AS [source]
                WHERE NOT EXISTS (
                    SELECT 1
                    FROM [SpaceImages] AS [existing]
                    WHERE [existing].[NasaId] = [source].[NasaImageId])
                GROUP BY [source].[NasaImageId];
                """);

            migrationBuilder.Sql("""
                UPDATE [collectionImage]
                SET [collectionImage].[SpaceImageId] = [spaceImage].[Id]
                FROM [CollectionImages] AS [collectionImage]
                INNER JOIN [SpaceImages] AS [spaceImage]
                    ON [spaceImage].[NasaId] = [collectionImage].[NasaImageId];
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "SpaceImageId",
                table: "CollectionImages",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "DateTaken",
                table: "CollectionImages");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "CollectionImages");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "CollectionImages");

            migrationBuilder.DropColumn(
                name: "NasaImageId",
                table: "CollectionImages");

            migrationBuilder.DropColumn(
                name: "ThumbnailUrl",
                table: "CollectionImages");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "CollectionImages");

            migrationBuilder.CreateIndex(
                name: "IX_CollectionImages_CollectionId",
                table: "CollectionImages",
                column: "CollectionId");

            migrationBuilder.CreateIndex(
                name: "IX_CollectionImages_CollectionId_SpaceImageId",
                table: "CollectionImages",
                columns: new[] { "CollectionId", "SpaceImageId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CollectionImages_SpaceImageId",
                table: "CollectionImages",
                column: "SpaceImageId");

            migrationBuilder.AddForeignKey(
                name: "FK_CollectionImages_SpaceImages_SpaceImageId",
                table: "CollectionImages",
                column: "SpaceImageId",
                principalTable: "SpaceImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CollectionImages_SpaceImages_SpaceImageId",
                table: "CollectionImages");

            migrationBuilder.DropIndex(
                name: "IX_CollectionImages_CollectionId",
                table: "CollectionImages");

            migrationBuilder.DropIndex(
                name: "IX_CollectionImages_CollectionId_SpaceImageId",
                table: "CollectionImages");

            migrationBuilder.DropIndex(
                name: "IX_CollectionImages_SpaceImageId",
                table: "CollectionImages");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "CollectionImages",
                newName: "AddedAt");

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "DateTaken",
                table: "CollectionImages",
                type: "datetimeoffset",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "CollectionImages",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "CollectionImages",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "NasaImageId",
                table: "CollectionImages",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ThumbnailUrl",
                table: "CollectionImages",
                type: "nvarchar(2048)",
                maxLength: 2048,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "CollectionImages",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: false,
                defaultValue: "");

            migrationBuilder.Sql("""
                UPDATE [collectionImage]
                SET
                    [collectionImage].[DateTaken] = [spaceImage].[DateCreated],
                    [collectionImage].[Description] = [spaceImage].[Description],
                    [collectionImage].[ImageUrl] = [spaceImage].[ImageUrl],
                    [collectionImage].[NasaImageId] = [spaceImage].[NasaId],
                    [collectionImage].[ThumbnailUrl] = COALESCE([spaceImage].[ThumbnailUrl], [spaceImage].[ImageUrl]),
                    [collectionImage].[Title] = [spaceImage].[Title]
                FROM [CollectionImages] AS [collectionImage]
                INNER JOIN [SpaceImages] AS [spaceImage]
                    ON [spaceImage].[Id] = [collectionImage].[SpaceImageId];
                """);

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "CollectionImages");

            migrationBuilder.DropColumn(
                name: "SpaceImageId",
                table: "CollectionImages");

            migrationBuilder.DropColumn(
                name: "UserNote",
                table: "CollectionImages");

            migrationBuilder.CreateIndex(
                name: "IX_CollectionImages_CollectionId_NasaImageId",
                table: "CollectionImages",
                columns: new[] { "CollectionId", "NasaImageId" },
                unique: true);
        }
    }
}
