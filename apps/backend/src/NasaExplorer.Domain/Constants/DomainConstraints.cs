namespace NasaExplorer.Domain.Constants;

public static class DomainConstraints
{
    public static class Users
    {
        public const int EmailMaxLength = 256;
        public const int PasswordHashMaxLength = 512;
        public const int DisplayNameMaxLength = 120;
        public const int RefreshTokenMaxLength = 512;
    }

    public static class Collections
    {
        public const int NameMaxLength = 120;
        public const int DescriptionMaxLength = 1_000;
    }

    public static class CollectionImages
    {
        public const int NasaImageIdMaxLength = 120;
        public const int TitleMaxLength = 300;
        public const int DescriptionMaxLength = 4_000;
        public const int UrlMaxLength = 2_048;
    }

    public static class ImageEnrichments
    {
        public const int TypeMaxLength = 40;
        public const int ContentMaxLength = 4_000;
    }

    public static class ImageTags
    {
        public const int NameMaxLength = 60;
        public const int SourceMaxLength = 20;
    }
}
