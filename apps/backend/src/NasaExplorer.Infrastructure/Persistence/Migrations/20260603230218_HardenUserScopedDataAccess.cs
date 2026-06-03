using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NasaExplorer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class HardenUserScopedDataAccess : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tags_NormalizedName",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_AiEnrichments_SpaceImageId_UserId_Type",
                table: "AiEnrichments");

            migrationBuilder.CreateIndex(
                name: "UX_Tags_Global_NormalizedName",
                table: "Tags",
                column: "NormalizedName",
                unique: true,
                filter: "[UserId] IS NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AiEnrichments_SpaceImageId_UserId_Type",
                table: "AiEnrichments",
                columns: new[] { "SpaceImageId", "UserId", "Type" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "UX_Tags_Global_NormalizedName",
                table: "Tags");

            migrationBuilder.DropIndex(
                name: "IX_AiEnrichments_SpaceImageId_UserId_Type",
                table: "AiEnrichments");

            migrationBuilder.CreateIndex(
                name: "IX_Tags_NormalizedName",
                table: "Tags",
                column: "NormalizedName");

            migrationBuilder.CreateIndex(
                name: "IX_AiEnrichments_SpaceImageId_UserId_Type",
                table: "AiEnrichments",
                columns: new[] { "SpaceImageId", "UserId", "Type" });
        }
    }
}
