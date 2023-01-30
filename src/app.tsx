// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate

export async function getInitialState(): Promise<{ name: string }> {
  return { name: '@umijs/max' };
}

import Page403 from '@/pages/Error/403';
import Page404 from '@/pages/Error/404';
import Footer from '@/layouts/footer';

export const layout: RunTimeLayoutConfig = () => {
  return {
    logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    menu: {
      locale: false,
    },
    // 自定义 403 页面
    unAccessible: <Page403 />,
    // 自定义 404 页面
    noFound: <Page404 />,
    footerRender: () => <Footer />,
  };
};

import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { message } from 'antd';
import { RequestError } from '@@/plugin-request/request';

export const request: RequestConfig = {
  timeout: 10000,
  // other axios options you want
  errorConfig: {
    errorHandler(error: RequestError) {
      message.error(error.message);
    },
    errorThrower() {},
  },
  requestInterceptors: [],
  responseInterceptors: [
    [
      (response) => {
        return response;
      },
      (error: Error) => {
        return Promise.reject(error);
      },
    ],
  ],
};
