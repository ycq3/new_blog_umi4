import { defineConfig } from '@umijs/max';
// const HOST = 'http://192.168.196.220:9050';
// const HOST = 'http://127.0.0.1:9050';
const HOST = 'http://api.pipiqiang.cn';
export default defineConfig({
  antd: {},
  access: {},
  model: {},
  dva: {},
  initialState: {},
  request: {},
  layout: {
    title: '皮皮强',
  },
  routes: [
    {
      path: '/',
      redirect: '/blog',
    },
    { path: '*', redirect: '/404' },
    { path: '/404', component: './Error/404' },
    { path: '/403', component: './Error/403' },
    {
      name: '博客',
      path: '/blog',
      routes: [
        {
          path: '/blog',
          component: './Blog',
        },
        {
          path: '/blog/article/:id/detail',
          component: './Blog/Article/detail',
        },
      ],
    },
    {
      name: '权限演示',
      path: '/access',
      component: './Access',
    },
    {
      name: ' CRUD 示例',
      path: '/table',
      component: './Table',
    },
    {
      name: '电影',
      path: '/movie',
      routes: [
        {
          name: 'M1907',
          path: '/movie/m1907',
          component: './Movie/M1907',
        },
        {
          name: '聚合搜索',
          path: '/movie/',
          component: './Movie',
        },
        {
          name: '我追的剧',
          path: '/movie/favorite',
          component: './Movie',
          access: 'canOpenFavorite',
        },
      ],
    },
    {
      name: '音乐',
      path: '/music',
      routes: [
        {
          name: '歌单导入',
          path: '/music/play_list',
          component: './Music/PlayList',
        },
        {
          name: '曲库',
          path: '/music/',
          component: './Music',
        },
        {
          name: '全网搜索',
          path: '/music/search',
          component: './Music/Search',
        },
      ],
    },
  ],
  npmClient: 'yarn',
  proxy: {
    '/api/article': {
      headers: { host: 'api.pipiqiang.cn' },
      target: HOST,
    },
    '/api/music': {
      target: HOST,
      headers: { host: 'music.pipiqiang.cn' },
    },
    '/api/movie': {
      target: HOST,
      headers: { host: 'music.pipiqiang.cn' },
    },
    '/api/song': {
      target: HOST,
      headers: { host: 'music.pipiqiang.cn' },
    },
    // '/api': {
    //   target: 'http://127.0.0.1:9050',
    // },
  },
  mock: {
    exclude: [
      '/api/songs/play_list',
      '/api/song/play_list/add',
      '/api/movie/search',
    ],
  },
  history: {
    type: 'hash',
  },
  hash: true,
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
});
