module.exports = {
  title: '熊Mer的知识库',
  description: 'golang/mysql/redis/kafka',

  // 导航栏
  themeConfig: {
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Golang', items: [
          {text: '基础知识', link: '/knowledge/golang/base/hello_world.html'},
          {text: '数据结构', link: '/knowledge/golang/base/data_struct.html'}
        ]
      }
    ]
  }
}
