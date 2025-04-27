import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

/* 文章平台前台页面 */
import ArticlesPlatformFrontPage from "../pages/articles_platform/FrontPage/index.jsx";
import ArticlesPlatformListPage from "../pages/articles_platform/ListPage/index.jsx";
import ArticlesPlatformArticleEditPage from "../pages/articles_platform/ArticleEditPage/index.jsx";
import ArticlesPlatformArticlePage from "../pages/articles_platform/ArticlePage/index.jsx";
import ArticlesPlatformSettingsPage from "../pages/articles_platform/SettingsPage/index.jsx";
import ArticlesPlatformFeedbackPage from "../pages/articles_platform/FeedbacksPage/index.jsx";

import { GeekLayout as Layout } from "../pages/Layout/index.jsx";
import Home from "../pages/Home/index.jsx";
import Article from "../pages/Article/index.jsx";

import { AuthRoute } from "/src/components/AuthRoute.jsx";
import User from "../pages/User/index.jsx";
import Attachment from "../pages/admin/Attachment/index.jsx";
import Channel from "../pages/admin/Channel/index.jsx"
import Tag from "../pages/admin/Tag/index.jsx"

import ErrorPage from "../pages/errors/ErrorPage/index.jsx";
import TestPage from "../pages/TestPage/index.jsx";
import Login from "../pages/Login/Login/index.jsx";
import Register from "../pages/Login/Register/index.jsx";
import ErrorPageWithHeader from "../pages/errors/ErrorPageWithHeader/index.jsx";
import VerifyEmail from '../pages/VerifyEmail/index.jsx'
import ForgotPassword from "../pages/Login/ForgotPassword/index.jsx";
import ResetPassword from "../pages/Login/ResetPassword/index.jsx";
import Feedback from "../pages/admin/Feedback/index.jsx";

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
    element: (
      <ArticlesPlatformListPage />
    )
  },
  {
    path: "/articles/:id",
    element: (
      <ArticlesPlatformArticlePage />
    )
  },
  {
    path: "/articles/write",
    element: (
      <AuthRoute whitelistRoles={['user', 'admin', 'super']}>
        <ArticlesPlatformArticleEditPage />
      </AuthRoute>
    )
  },
  {
    path: "/articles/feedback",
    element: (
      <AuthRoute whitelistRoles={['user', 'admin', 'super']}>
        <ArticlesPlatformFeedbackPage />
      </AuthRoute>
    )
  },
  {
    path: "/articles/:id/edit",
    element: (
      <AuthRoute whitelistRoles={['admin', 'super']}>
        <ArticlesPlatformArticleEditPage />
      </AuthRoute>
    )
  },
  {
    path: "/articles/settings",
    element: (
      <AuthRoute whitelistRoles={['user', 'admin', 'super']}>
        <ArticlesPlatformSettingsPage />
      </AuthRoute>
    )
  },
  // 后台+
  {
    path: "/admin",
    element: (
      <AuthRoute requiredPermissions={['admin:access']}>
        <Layout />
      </AuthRoute>
    ),
    // errorElement: <ErrorPage />,    //只能给root加才有效
    children: [
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
        path: "attachment",
        element: <Attachment />
      },
      {
        path: "channel",
        element: <Channel />
      },
      {
        path: "tag",
        element: <Tag />
      },
      {
        path: "feedback",
        element: <Feedback />
      },
      {
        path: "user",
        element: <User />
      }
    ]
  },
  // 权限提升和兜底等
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: "/test-page",
    element: <TestPage />,
  },
  {
    path: "/error",
    element: <ErrorPageWithHeader />
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
])

export default router