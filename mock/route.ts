import {Request, Response} from "express";

export default {
  '/api/auth_routes': {
    '/form/advanced-form': { authority: ['admin', 'user'] },
  },

  'GET /api/authorization/resource/consoleMenu' : (req: Request, res: Response) => {
    setTimeout(() => {
      res.send({
        code: 200, message: '', data: [
          {
            path: '/auth',
            layout: false,
            routes: [
              {
                name: 'login',
                path: '/auth/login',
                component: './user/login',
              },
            ],
          },
          {
            path: '/welcome',
            name: 'welcome',
            icon: 'smile',
            component: './Welcome',
          },
          {
            path: '/admin',
            name: 'admin',
            icon: 'smile',
            access: 'canAdmin',
            component: './Admin',
            routes: [
              {
                path: '/admin/ddd',
                name: 'admin',
                icon: 'smile',
                component: './Admin/dsa',
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    menuRender: false,
                    component: './Welcome',
                  }
                ]
              },
              {
                path: '/admin/sub-page',
                name: 'sub-page',
                icon: 'smile',
                menuRender: false,
                component: './Welcome',
              },
            ],
          },
          {
            name: 'list.table-list',
            icon: 'table',
            path: '/list',
            component: './ListTableList',
          },
          {
            name: 'list.table-list',
            icon: 'table',
            path: 'http://127.0.0.1:8080/zipkin/home',
            target: '_blank',
            component: './ListTableList',
          },
          {
            path: '/',
            redirect: '/welcome',
          },
          {
            component: './404',
          },
        ]
      })
    }, 2000)
  }
};
