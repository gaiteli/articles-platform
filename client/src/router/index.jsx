import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import TestPage from "../pages/TestPage/index.jsx";
import Login from "../pages/Login/Login/index.jsx";
import Register from "../pages/Login/Register/index.jsx";
import {GeekLayout as Layout} from "../pages/Layout/index.jsx";
import Home from "../pages/Home/index.jsx";
import Article from "../pages/Article/index.jsx";
import Publish from "../pages/Publish/index.jsx";

import { AuthRoute } from "/src/components/AuthRoute.jsx";
import User from "../pages/User/index.jsx";

/* 文章平台前台页面 */
import ArticlesPlatformFrontPage from "../pages/articles_platform/FrontPage/index.jsx";
import ArticlesPlatformListPage from "../pages/articles_platform/ListPage/index.jsx";
import ArticlesPlatformArticleEditPage from "../pages/articles_platform/ArticleEditPage/index.jsx";
import ArticlesPlatformArticlePage from "../pages/articles_platform/ArticlePage/index.jsx";

const router = createBrowserRouter([
  // articles_platform 文章平台
  {
    path: "/",
    element: <Navigate replace to="/articles/list" />, // 重定向并且不保留历史记录'/'
  },
  {
    path: "/articles",
    element: <ArticlesPlatformFrontPage />,
  },
  {
    path: "/articles/list",
    element: <ArticlesPlatformListPage />
  },
  {
    path: "/articles/write",
    element: <ArticlesPlatformArticleEditPage />
  },
  {
    path: "/articles/:id/edit",
    element: <ArticlesPlatformArticleEditPage />
  },
  {
    path: "/articles/:id",
    element: <ArticlesPlatformArticlePage />
  },
  // 后台
  {
    path: "/admin",
    element: <AuthRoute><Layout /></AuthRoute>,
    // errorElement: <ErrorPage />,    //只能给root加才有效
    children:[
      { index: true, element: <Home /> },
      {
        path: "home",
        element: <Home />
      },
      {
        path: "article",
        element: <Article />
      },
      {
        path: "publish",
        element: <Publish />
      },
      {
        path: "user",
        element: <User />
      }
    ]
  },
  {
    path: "/signin",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Register />
  },
  {
    path: "/test-page",
    element: <TestPage />,
  },
  // {
  //   path: "official-home",
  //   element: <OfficialExampleHomePage />,
  //   loader: officialHomeLoader,
  //   action: officialHomeAction,
  //   children: [
  //     { index: true, element: <Index /> },
  //     {
  //       path: "contacts/:contactId",
  //       element: <Contact />,
  //       loader: contactLoader,
  //       action: contactAction,
  //     },
  //     // edit界面在侧边栏右contact位置显示，故放在这里
  //     {
  //       path: "contacts/:contactId/edit",
  //       element: <EditContact />,
  //       loader: contactLoader, // 这是偷懒了，不同路由不应该共用一个loader
  //       action: editAction,
  //     },
  //     {
  //       path: "contacts/:contactId/destroy",
  //       action: destroyAction,
  //       errorElement: <div>发生了一个错误</div>
  //     },
  //   ],
  // },
])

export default router