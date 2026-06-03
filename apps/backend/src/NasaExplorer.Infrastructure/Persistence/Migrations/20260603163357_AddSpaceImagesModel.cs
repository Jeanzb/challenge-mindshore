using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NasaExplorer.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddSpaceImagesModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SpaceImages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false, defaultValueSql: "NEWSEQUENTIALID()"),
                    NasaId = table.Column<string>(type: "nvarchar(180)", maxLength: 180, nullable: false),
                    Title = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    SourceUrl = table.Column<string>(type: "nvarchar(2048)", maxLength: 2048, nullable: true),
                    MediaType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Center = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Mission = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Rover = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    Camera = table.Column<string>(type: "nvarchar(120)", maxLength: 120, nullable: true),
                    DateCreated = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    Keywords = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SpaceImages", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SpaceImages_Camera",
                table: "SpaceImages",
                column: "Camera");

            migrationBuilder.CreateIndex(
                name: "IX_SpaceImages_DateCreated",
                table: "SpaceImages",
                column: "DateCreated");

            migrationBuilder.CreateIndex(
                name: "IX_SpaceImages_MediaType",
                table: "SpaceImages",
                column: "MediaType");

            migrationBuilder.CreateIndex(
                name: "IX_SpaceImages_Mission",
                table: "SpaceImages",
                column: "Mission");

            migrationBuilder.CreateIndex(
                name: "IX_SpaceImages_NasaId",
                table: "SpaceImages",
                column: "NasaId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_SpaceImages_Rover",
                table: "SpaceImages",
                column: "Rover");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SpaceImages");
        }
    }
}
