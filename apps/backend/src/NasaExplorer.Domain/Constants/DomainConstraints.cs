namespace NasaExplorer.Domain.Constants;

public static class DomainConstraints
{
    public static class Users
    {
        public const int EmailMaxLength = 256;
        public const int PasswordHashMaxLength = 512;
        public const int DisplayNameMaxLength = 120;
        public const int RefreshTokenMaxLength = 512;
        public const int PasswordResetTokenMaxLength = 512;
    }

    public static class Collections
    {
        public const int NameMaxLength = 120;
        public const int DescriptionMaxLength = 1_000;
    }

    public static class CollectionImages
    {
        public const int UserNoteMaxLength = 1_000;
    }

    public static class SpaceImages
    {
        public const int NasaIdMaxLength = 180;
        public const int TitleMaxLength = 300;
        public const int DescriptionMaxLength = 4_000;
        public const int UrlMaxLength = 2_048;
        public const int MediaTypeMaxLength = 50;
        public const int CenterMaxLength = 120;
        public const int MissionMaxLength = 120;
        public const int RoverMaxLength = 120;
        public const int CameraMaxLength = 120;
        public const int KeywordsMaxLength = 2_000;
    }

    public static class ImageEnrichments
    {
        public const int TypeMaxLength = 60;
        public const int PromptMaxLength = 8_000;
        public const int ContentMaxLength = 8_000;
        public const int ModelMaxLength = 120;
        public const int ProviderMaxLength = 80;
    }

    public static class Tags
    {
        public const int NameMaxLength = 80;
        public const int NormalizedNameMaxLength = 80;
    }

    public static class ImageComparisons
    {
        public const int TitleMaxLength = 180;
        public const int AnalysisMaxLength = 8_000;
        public const int PromptMaxLength = 8_000;
        public const int ModelMaxLength = 120;
        public const int MinimumImageCount = 2;
    }

    public static class CollectionExports
    {
        public const int FormatMaxLength = 40;
        public const int FileNameMaxLength = 255;
        public const int FileUrlMaxLength = 1_000;
    }
}
