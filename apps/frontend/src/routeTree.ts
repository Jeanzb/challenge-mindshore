import { Route as rootRouteImport } from "./routes/__root";
import { Route as IndexRouteImport } from "./routes/index";
import { Route as AuthIndexRouteImport } from "./routes/auth";
import { Route as CollectionsIndexRouteImport } from "./routes/collections";
import { Route as CollectionDetailRouteImport } from "./routes/collections/detail";
import { Route as ComparatorIndexRouteImport } from "./routes/comparator";
import { Route as SearchIndexRouteImport } from "./routes/search";

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

const SearchIndexRoute = SearchIndexRouteImport.update({
  id: "/search/",
  path: "/search",
  getParentRoute: () => rootRouteImport
} as never);

type RootRouteChildren = {
  IndexRoute: typeof IndexRoute;
  AuthIndexRoute: typeof AuthIndexRoute;
  CollectionsIndexRoute: typeof CollectionsIndexRoute;
  CollectionDetailRoute: typeof CollectionDetailRoute;
  ComparatorIndexRoute: typeof ComparatorIndexRoute;
  SearchIndexRoute: typeof SearchIndexRoute;
};

type FileRouteTypes = {
  fileRoutesByFullPath: {
    "/": typeof IndexRoute;
    "/auth/": typeof AuthIndexRoute;
    "/collections/": typeof CollectionsIndexRoute;
    "/collections/$collectionId": typeof CollectionDetailRoute;
    "/comparator/": typeof ComparatorIndexRoute;
    "/search/": typeof SearchIndexRoute;
  };
  fullPaths:
    | "/"
    | "/auth/"
    | "/collections/"
    | "/collections/$collectionId"
    | "/comparator/"
    | "/search/";
  fileRoutesByTo: {
    "/": typeof IndexRoute;
    "/auth": typeof AuthIndexRoute;
    "/collections": typeof CollectionsIndexRoute;
    "/collections/$collectionId": typeof CollectionDetailRoute;
    "/comparator": typeof ComparatorIndexRoute;
    "/search": typeof SearchIndexRoute;
  };
  to:
    | "/"
    | "/auth"
    | "/collections"
    | "/collections/$collectionId"
    | "/comparator"
    | "/search";
  id:
    | "__root__"
    | "/"
    | "/auth/"
    | "/collections/"
    | "/collections/$collectionId"
    | "/comparator/"
    | "/search/";
  fileRoutesById: {
    __root__: typeof rootRouteImport;
    "/": typeof IndexRoute;
    "/auth/": typeof AuthIndexRoute;
    "/collections/": typeof CollectionsIndexRoute;
    "/collections/$collectionId": typeof CollectionDetailRoute;
    "/comparator/": typeof ComparatorIndexRoute;
    "/search/": typeof SearchIndexRoute;
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
    "/search/": {
      id: "/search/";
      path: "/search";
      fullPath: "/search/";
      preLoaderRoute: typeof SearchIndexRouteImport;
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
  SearchIndexRoute
};

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();
