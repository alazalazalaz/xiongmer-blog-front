# xiongmaoer-blog-front
a simple personal blog, knowledge framework.


# how to use

1、安装npm
2、执行命令`npm run docs:dev`（会启动一个http://localhost:8080/的node服务）
3、访问该服务即可

# 常见错误
Q：执行`npm run docs:dev`时报错：'Error: error:0308010C:digital envelope routines::unsupported
'

A: 

方案1：降低node版本

方案2：各个平台执行如下命令

```shell
#mac/linux
export NODE_OPTIONS=--openssl-legacy-provider
# win
set NODE_OPTIONS=--openssl-legacy-provider
```

# version

|version|desc|
|---|---|
|tag v1.0.0|自己撸的页面，半成品|
|tag v2.x.x|vuepress|

# vuepress

https://vuepress.vuejs.org/zh/guide/getting-started.html#%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE

