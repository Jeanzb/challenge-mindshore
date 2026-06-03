using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NasaExplorer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAiEnrichmentsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImageEnrichments_CollectionImages_CollectionImageId",
                table: "ImageEnrichments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ImageEnrichments",
                table: "ImageEnrichments");

            migrationBuilder.DropIndex(
                name: "IX_ImageEnrichments_CollectionImageId_Type",
                table: "ImageEnrichments");

            migrationBuilder.RenameTable(
                name: "ImageEnrichments",
                newName: "AiEnrichments");

            migrationBuilder.RenameColumn(
                name: "GeneratedAt",
                table: "AiEnrichments",
                newName: "CreatedAt");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "AiEnrichments",
                type: "nvarchar(60)",
                maxLength: 60,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(40)",
                oldMaxLength: 40);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "AiEnrichments",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(4000)",
                oldMaxLength: 4000);

            migrationBuilder.AddColumn<string>(
                name: "Model",
                table: "AiEnrichments",
                type: "nvarchar(120)",
                maxLength: 120,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Prompt",
                table: "AiEnrichments",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "Migrated legacy enrichment");

            migrationBuilder.AddColumn<string>(
                name: "Provider",
                table: "AiEnrichments",
                type: "nvarchar(80)",
                maxLength: 80,
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "SpaceImageId",
                table: "AiEnrichments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "AiEnrichments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE [enrichment]
                SET
                    [enrichment].[SpaceImageId] = [collectionImage].[SpaceImageId],
                    [enrichment].[UserId] = [collection].[UserId]
                FROM [AiEnrichments] AS [enrichment]
                INNER JOIN [CollectionImages] AS [collectionImage]
                    ON [collectionImage].[Id] = [enrichment].[CollectionImageId]
                INNER JOIN [Collections] AS [collection]
                    ON [collection].[Id] = [collectionImage].[CollectionId];
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "SpaceImageId",
                table: "AiEnrichments",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "UserId",
                table: "AiEnrichments",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "CollectionImageId",
                table: "AiEnrichments");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AiEnrichments",
                table: "AiEnrichments",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AiEnrichments_SpaceImageId",
                table: "AiEnrichments",
                column: "SpaceImageId");

            migrationBuilder.CreateIndex(
                name: "IX_AiEnrichments_SpaceImageId_UserId_Type",
                table: "AiEnrichments",
                columns: new[] { "SpaceImageId", "UserId", "Type" });

            migrationBuilder.CreateIndex(
                name: "IX_AiEnrichments_UserId",
                table: "AiEnrichments",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AiEnrichments_SpaceImages_SpaceImageId",
                table: "AiEnrichments",
                column: "SpaceImageId",
                principalTable: "SpaceImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AiEnrichments_Users_UserId",
                table: "AiEnrichments",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AiEnrichments_SpaceImages_SpaceImageId",
                table: "AiEnrichments");

            migrationBuilder.DropForeignKey(
                name: "FK_AiEnrichments_Users_UserId",
                table: "AiEnrichments");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AiEnrichments",
                table: "AiEnrichments");

            migrationBuilder.DropIndex(
                name: "IX_AiEnrichments_SpaceImageId",
                table: "AiEnrichments");

            migrationBuilder.DropIndex(
                name: "IX_AiEnrichments_SpaceImageId_UserId_Type",
                table: "AiEnrichments");

            migrationBuilder.DropIndex(
                name: "IX_AiEnrichments_UserId",
                table: "AiEnrichments");

            migrationBuilder.DropColumn(
                name: "Model",
                table: "AiEnrichments");

            migrationBuilder.DropColumn(
                name: "Prompt",
                table: "AiEnrichments");

            migrationBuilder.DropColumn(
                name: "Provider",
                table: "AiEnrichments");

            migrationBuilder.AddColumn<Guid>(
                name: "CollectionImageId",
                table: "AiEnrichments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.Sql("""
                UPDATE [enrichment]
                SET [enrichment].[CollectionImageId] = [collectionImage].[Id]
                FROM [AiEnrichments] AS [enrichment]
                INNER JOIN [CollectionImages] AS [collectionImage]
                    ON [collectionImage].[SpaceImageId] = [enrichment].[SpaceImageId]
                INNER JOIN [Collections] AS [collection]
                    ON [collection].[Id] = [collectionImage].[CollectionId]
                    AND [collection].[UserId] = [enrichment].[UserId];
                """);

            migrationBuilder.Sql("""
                DELETE FROM [AiEnrichments]
                WHERE [CollectionImageId] IS NULL;
                """);

            migrationBuilder.AlterColumn<Guid>(
                name: "CollectionImageId",
                table: "AiEnrichments",
                type: "uniqueidentifier",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AiEnrichments");

            migrationBuilder.DropColumn(
                name: "SpaceImageId",
                table: "AiEnrichments");

            migrationBuilder.RenameTable(
                name: "AiEnrichments",
                newName: "ImageEnrichments");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "ImageEnrichments",
                newName: "GeneratedAt");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "ImageEnrichments",
                type: "nvarchar(40)",
                maxLength: 40,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(60)",
                oldMaxLength: 60);

            migrationBuilder.AlterColumn<string>(
                name: "Content",
                table: "ImageEnrichments",
                type: "nvarchar(4000)",
                maxLength: 4000,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ImageEnrichments",
                table: "ImageEnrichments",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ImageEnrichments_CollectionImageId_Type",
                table: "ImageEnrichments",
                columns: new[] { "CollectionImageId", "Type" });

            migrationBuilder.AddForeignKey(
                name: "FK_ImageEnrichments_CollectionImages_CollectionImageId",
                table: "ImageEnrichments",
                column: "CollectionImageId",
                principalTable: "CollectionImages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
