using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NasaExplorer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddImageComparisonsModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ImageComparisons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: true),
                    Analysis = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Prompt = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Model = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageComparisons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImageComparisons_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ImageComparisonItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    ImageComparisonId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpaceImageId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageComparisonItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImageComparisonItems_ImageComparisons_ImageComparisonId",
                        column: x => x.ImageComparisonId,
                        principalTable: "ImageComparisons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ImageComparisonItems_SpaceImages_SpaceImageId",
                        column: x => x.SpaceImageId,
                        principalTable: "SpaceImages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ImageComparisonItems_ImageComparisonId",
                table: "ImageComparisonItems",
                column: "ImageComparisonId");

            migrationBuilder.CreateIndex(
                name: "UX_ImageComparisonItems_ImageComparisonId_SpaceImageId",
                table: "ImageComparisonItems",
                columns: new[] { "ImageComparisonId", "SpaceImageId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ImageComparisonItems_SpaceImageId",
                table: "ImageComparisonItems",
                column: "SpaceImageId");

            migrationBuilder.CreateIndex(
                name: "IX_ImageComparisons_UserId",
                table: "ImageComparisons",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImageComparisonItems");

            migrationBuilder.DropTable(
                name: "ImageComparisons");
        }
    }
}
