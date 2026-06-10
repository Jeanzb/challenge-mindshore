import { Route as rootRouteImport } from "./routes/__root";
import { Route as IndexRouteImport } from "./routes/index";
import { Route as AuthIndexRouteImport } from "./routes/auth";
import { Route as CollectionsIndexRouteImport } from "./routes/collections";
import { Route as CollectionDetailRouteImport } from "./routes/collections/detail";
import { Route as ComparatorIndexRouteImport } from "./routes/comparator";
import { Route as ExportIndexRouteImport } from "./routes/export";
import { Route as ImagesIndexRouteImport } from "./routes/images";
import { Route as SearchIndexRouteImport } from "./routes/search";
import { Route as TimelineIndexRouteImport } from "./routes/timeline";

const IndexRoute = IndexRouteImport.update({
  id: "/",
  path: "/",
  getParentRoute: () => rootRouteImport
} as never);

const AuthIndexRoute = AuthIndexRouteImport.update({
  id: "/auth/",
  path: "/auth",
  getParentRoute: () => rootRouteImport
} as never);

const CollectionsIndexRoute = CollectionsIndexRouteImport.update({
  id: "/collections/",
  path: "/collections",
  getParentRoute: () => rootRouteImport
} as never);

const CollectionDetailRoute = CollectionDetailRouteImport.update({
  id: "/collections/$collectionId",
  path: "/collections/$collectionId",
  getParentRoute: () => rootRouteImport
} as never);

const ComparatorIndexRoute = ComparatorIndexRouteImport.update({
  id: "/comparator/",
  path: "/comparator",
  getParentRoute: () => rootRouteImport
} as never);

const ExportIndexRoute = ExportIndexRouteImport.update({
  id: "/export/",
  path: "/export",
  getParentRoute: () => rootRouteImport
} as never);

const ImagesIndexRoute = ImagesIndexRouteImport.update({
  id: "/images/",
  path: "/images",
  getParentRoute: () => rootRouteImport
} as never);

const SearchIndexRoute = SearchIndexRouteImport.update({
  id: "/search/",
  path: "/search",
  getParentRoute: () => rootRouteImport
} as never);

const TimelineIndexRoute = TimelineIndexRouteImport.update({
  id: "/timeline/",
  path: "/timeline",
  getParentRoute: () => rootRouteImport
} as never);

type RootRouteChildren = {
  IndexRoute: typeof IndexRoute;
  AuthIndexRoute: typeof AuthIndexRoute;
  CollectionsIndexRoute: typeof CollectionsIndexRoute;
  CollectionDetailRoute: typeof CollectionDetailRoute;
  ComparatorIndexRoute: typeof ComparatorIndexRoute;
  ExportIndexRoute: typeof ExportIndexRoute;
  ImagesIndexRoute: typeof ImagesIndexRoute;
  SearchIndexRoute: typeof SearchIndexRoute;
  TimelineIndexRoute: typeof TimelineIndexRoute;
};

type FileRouteTypes = {
  fileRoutesByFullPath: {
    "/": typeof IndexRoute;
    "/auth/": typeof AuthIndexRoute;
    "/collections/": typeof CollectionsIndexRoute;
    "/collections/$collectionId": typeof CollectionDetailRoute;
    "/comparator/": typeof ComparatorIndexRoute;
    "/export/": typeof ExportIndexRoute;
    "/images/": typeof ImagesIndexRoute;
    "/search/": typeof SearchIndexRoute;
    "/timeline/": typeof TimelineIndexRoute;
  };
  fullPaths:
    | "/"
    | "/auth/"
    | "/collections/"
    | "/collections/$collectionId"
    | "/comparator/"
    | "/export/"
    | "/images/"
    | "/search/"
    | "/timeline/";
  fileRoutesByTo: {
    "/": typeof IndexRoute;
    "/auth": typeof AuthIndexRoute;
    "/collections": typeof CollectionsIndexRoute;
    "/collections/$collectionId": typeof CollectionDetailRoute;
    "/comparator": typeof ComparatorIndexRoute;
    "/export": typeof ExportIndexRoute;
    "/images": typeof ImagesIndexRoute;
    "/search": typeof SearchIndexRoute;
    "/timeline": typeof TimelineIndexRoute;
  };
  to:
    | "/"
    | "/auth"
    | "/collections"
    | "/collections/$collectionId"
    | "/comparator"
    | "/export"
    | "/images"
    | "/search"
    | "/timeline";
  id:
    | "__root__"
    | "/"
    | "/auth/"
    | "/collections/"
    | "/collections/$collectionId"
    | "/comparator/"
    | "/export/"
    | "/images/"
    | "/search/"
    | "/timeline/";
  fileRoutesById: {
    __root__: typeof rootRouteImport;
    "/": typeof IndexRoute;
    "/auth/": typeof AuthIndexRoute;
    "/collections/": typeof CollectionsIndexRoute;
    "/collections/$collectionId": typeof CollectionDetailRoute;
    "/comparator/": typeof ComparatorIndexRoute;
    "/export/": typeof ExportIndexRoute;
    "/images/": typeof ImagesIndexRoute;
    "/search/": typeof SearchIndexRoute;
    "/timeline/": typeof TimelineIndexRoute;
  };
};

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": {
      id: "/";
      path: "/";
      fullPath: "/";
      preLoaderRoute: typeof IndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/auth/": {
      id: "/auth/";
      path: "/auth";
      fullPath: "/auth/";
      preLoaderRoute: typeof AuthIndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/collections/": {
      id: "/collections/";
      path: "/collections";
      fullPath: "/collections/";
      preLoaderRoute: typeof CollectionsIndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/collections/$collectionId": {
      id: "/collections/$collectionId";
      path: "/collections/$collectionId";
      fullPath: "/collections/$collectionId";
      preLoaderRoute: typeof CollectionDetailRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/comparator/": {
      id: "/comparator/";
      path: "/comparator";
      fullPath: "/comparator/";
      preLoaderRoute: typeof ComparatorIndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/export/": {
      id: "/export/";
      path: "/export";
      fullPath: "/export/";
      preLoaderRoute: typeof ExportIndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/images/": {
      id: "/images/";
      path: "/images";
      fullPath: "/images/";
      preLoaderRoute: typeof ImagesIndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/search/": {
      id: "/search/";
      path: "/search";
      fullPath: "/search/";
      preLoaderRoute: typeof SearchIndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
    "/timeline/": {
      id: "/timeline/";
      path: "/timeline";
      fullPath: "/timeline/";
      preLoaderRoute: typeof TimelineIndexRouteImport;
      parentRoute: typeof rootRouteImport;
    };
  }
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute,
  AuthIndexRoute,
  CollectionsIndexRoute,
  CollectionDetailRoute,
  ComparatorIndexRoute,
  ExportIndexRoute,
  ImagesIndexRoute,
  SearchIndexRoute,
  TimelineIndexRoute
};

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();
