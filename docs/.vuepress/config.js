module.exports = {
  title: '熊Mer的知识库',
  description: 'golang/mysql/redis/kafka',
  head: [
      [
          'link',
        {rel: 'icon', href: 'tv.ico'}
      ]
  ],
  themeConfig: {
    // 导航栏
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Golang', items: [
          {text: 'Golang基础知识', link: '/knowledge/golang/base/base_struct.html'}
        ]
      },
      {text: 'Mysql', items: [
          {text: 'Mysql基础知识', link: '/knowledge/mysql/base/data_type.html'},
        ]
      },
      {text: 'Linux', items: [
          {text: '基础知识', link: '/knowledge/linux/base/coding.html'},
        ]
      },
      {text: 'Tools', items: [
          {text: 'git', link: '/knowledge/tools/git/git_cmd.html'},
        ]
      }
    ],

    //侧边栏
    sidebar: {
      '/knowledge/golang/': getGolangSlider(),
      '/knowledge/mysql/': getMysqlSlider(),
      '/knowledge/linux/': getLinuxSlider(),
      '/knowledge/tools/': getToolsSlider(),
    }
  }
}

function getGolangSlider(){
  return [
    {
      title: "Golang基础知识",
      path: '',
      collapsable: false,
      sidebarDepth: 0,
      children: [
        ['base/base_struct.md', '基本类型'],
        ['base/normal_struct.md', 'slice、map、channel']
      ]
    },
    {
      title: "Golang进阶知识",
      path: '',
      collapsable: false,
      sidebarDepth: 0,
      children: [
        ['', 'TODO'],
      ]
    },
    {
      title: "gin",
      path: '',
      collapsable: false,
      sidebarDepth: 0,
      children: [
        ['gin/route.md', 'gin-route']
      ]
    },
  ]
}

function getMysqlSlider(){
  return [
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

function getLinuxSlider(){
  return [
    {
      title: "Linux基础知识",
      path: '',
      collapsable: false,
      sidebarDepth: 0,
      children: [
        ['base/coding.md', '编码规则'],
      ]
    }
  ]
}

function getToolsSlider(){
  return [
    {
      title: "工具箱",
      path: '',
      collapsable: false,
      sidebarDepth: 0,
      children: [
        ['git/git_cmd.md', 'git命令'],
      ]
    }
  ]
}
