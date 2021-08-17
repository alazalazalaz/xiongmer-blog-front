module.exports = {
  title: '熊Mer的知识库',
  description: 'golang/mysql/redis/kafka',

  themeConfig: {
    // 导航栏
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Golang', items: [
          {text: '基础知识', link: '/knowledge/golang/base/hello_world.html'},
          {text: '数据结构', link: '/knowledge/golang/base/data_struct.html'}
        ]
      },
      {text: 'Mysql', items: [
          {text: '基础知识', link: '/knowledge/mysql/base/data_type.html'},
        ]
      }
    ],

    //侧边栏
    sidebar: {
      '/knowledge/golang/': [
        {
          title: "Golang基础知识",
          path: '',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            ['base/hello_world.md', '基础知识'],
            ['base/data_struct.md', '数据结构']
          ]
        },
        {
          title: "Golang进阶知识",
          path: '',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            ['base/hello_world.md', 'TODO'],
          ]
        }
      ],
      '/knowledge/mysql/': [
        {
          title: "Mysql基础知识",
          path: '',
          collapsable: false,
          sidebarDepth: 0,
          children: [
            ['base/data_type.md', '数据类型'],
          ]
        }
      ]
    }
  }
}
