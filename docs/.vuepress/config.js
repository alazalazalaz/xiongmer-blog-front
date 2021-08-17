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
          {text: '数据结构', link: '/knowledge/mysql/data_struct/data_struct.html'}
        ]
      }

    ],

    //侧边栏
    sidebar: [
        ['/knowledge/mysql/base/data_type.md', 'mysql基础知识'],
        ['/knowledge/mysql/data_struct/data_struct.md', '数据结构']
    ]
  }
}
