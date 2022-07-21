# 师大Buy系统的Nodejs后端



## 关于

师大Buy系统分为前台展示、后台管理系统和后端服务器接口文件。本项目为后端服务器。

1. 前台项目——师大Buy校园闲置信息平台，项目基于Vue2，给学生提供了获取二手商品信息的平台，实现了注册、登录、收藏和加入购物车功能。
   技术栈：`vue2 + vuex + vue-router + ES6+ axios`
   项目上线地址：http://101.34.27.188:8080/

   github地址：https://github.com/janice143/vue2-school-buy
   
2. 后台管理系统，作为师大Buy校园闲置信息平台的后台管理系统，给学生提供发布二手商品的入口，实现了用户登录、管理以及商品
   管理功能。普通管理员和超级管理员具有不同的管理权限。
   技术栈：`vue2 + vuex + vue-router + ES6 + element-ui` 
   项目上线地址： http://101.34.27.188:9528/
   （超级管理员账户：admin 密码：123；普通管理员账户：user123 密码：123456）
   
   github地址：https://github.com/janice143/cms-schoolbuy



## 技术栈

 `nodejs + express + mongoDB`

## 项目运行

```
项目运行之前，请确保系统已经安装以下应用
1、node (8.0 及以上版本)
2、mongodb (开启状态)

git clone git@github.com:janice143/nodejs-mongodb-schoolbuy.git

cd nodejs-mongodb-schoolbuy

npm install

nodemon server.js

访问: http://localhost:3000
```



## 师大Buy接口文档

前台项目

```
baseUrl: http://101.34.27.188:8080/api
```

后台管理系统

```
baseUrl: http://101.34.27.188:9528/api
```



## 目录：

### 前台接口列表

[1、获取商品分类](#1获取商品分类)<br/>
[2、按条件展示商品](#2按条件展示商品)<br/>
[3、按照商品的productId查找商品详情](#3按照商品的productId查找商品详情)<br/>
[4、获取商品发布的用户信息](#4获取商品发布的用户信息)<br/>
[5、点击想要商品，对应商品的hotScore+1](#5点击想要商品，对应商品的hotScore+1)<br/>
[6、取消想要商品，对应商品的hotScore-1](#6取消想要商品，对应商品的hotScore-1)<br/>
[7、登录](#7登录)<br/>[8、获取登录用户信息](#8获取登录用户信息)<br/>
[9、退出登录](#9退出登录)<br/>
[10、注册](#10注册)<br/>
[11、完善用户信息](#11完善用户信息)<br/>
[12、加入购物车](#12加入购物车)<br/>
[13、获取购物车列表](#13获取购物车列表)<br/>
[14、删除购物车商品](#14删除购物车商品)<br/>

### 后台接口列表

[1、按条件获取商品](#1按条件获取商品)<br/>
[2、上传商品图片](#2上传商品图片)<br/>
[3、上传商品信息](#3上传商品信息)<br/>
[4、根据id删除商品](#4根据id删除商品)<br/>
[5、获取所有用户信息](#5获取所有用户信息)<br/>
[6、添加用户](#6添加用户)<br/>
[7、更新用户信息](#7更新用户信息)<br/>[8、删除用户](#8删除用户)<br/>
[9、 批量删除用户](#9 批量删除用户)<br/>

## 前台接口列表：

### 1、获取商品分类

#### 请求URL：
```
http://101.34.27.188:8080/api/category
```

#### 示例：

http://101.34.27.188:8080/api/category

#### 请求方式：

```
GET
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |
| 无   |    无    | 无   | 无   |

#### 返回示例：

```javascript
{
    "msg": "成功",
    "code": 200,
    "data": [
        {
            "_id": "62b0430fbcd554dc7e0768bc",
            "categoryName": "全部商品",
            "categoryId": 0,
            "level": 1
        }
}
```

### 2、按条件展示商品

#### 请求URL：
```
http://101.34.27.188:8080/api/front/productlist
```

#### 示例：
http://101.34.27.188:8080/api/front/productlist

#### 请求方式：
```
POST
```

#### 参数类型：body

| 参数         | 是否必选 | 类型   | 说明                                                         |
| :----------- | :------: | :----- | :----------------------------------------------------------- |
| category1Id  |    Y     | string | 分类id                                                       |
| categoryName |    Y     | string | 分类名称                                                     |
| keyword      |    Y     | string | 搜索框的值（按照商品关键字查找商品）                         |
| order        |    Y     | string | 排序方式 （1: 综合,2: 价格 asc: 升序,desc: 降序 ），示例: "1:desc" |
| pageNo       |    Y     | number | 页码                                                         |
| pageSize     |    Y     | number | 每页数量                                                     |



#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": {
        "totalPages": 2,
        "pageNo": 1,
        "totalCount": 9,
        "pageSize": 6,
        "productlist": [
            {
                "_id": "62b0744474c148003a459fb3",
                "imgUrl": "http://101.34.27.188:3000/uploadImgs/1655731245174/1655731245174_fjgns.jpg",
                "gallery": [
                    "http://101.34.27.188:3000/uploadImgs/1655731245174/1655731245174_fjgns.jpg",
                    "http://101.34.27.188:3000/uploadImgs/1655731245174/1655731245174_ss1fh.jpg",
                    "http://101.34.27.188:3000/uploadImgs/1655731245174/1655731245174_3oc01.jpg"
                ],
                "title": "T恤",
                "description": "<h1 style=\"text-indent: 0px; text-align: start;\">师大Buy&nbsp;校园闲置交易平台</h1><blockquote style=\"text-indent: 0px; text-align: start; line-height: 1.5;\">开发者：iaineisalsoyan&nbsp;介绍：物电学院研二学生，为了找工作，开发了本平台&nbsp;联系方式：lanjanice1@gmail.com</blockquote><h2 style=\"text-indent: 0px; text-align: start;\">概要</h2><p style=\"text-indent: 0px; text-align: start; line-height: 1.5;\">师大Buy校园闲置平台给在师大的学生提供了一个可以获取和发布二手闲置商品信息的平台。平台只供师大学生使用，交易方式推荐线下交易，本平台暂时没有提供交易业务。另外，线下交易也放每位同学对货源更加放心。</p><h2 style=\"text-indent: 0px; text-align: start;\">前台物品展示平台</h2><p style=\"text-indent: 0px; text-align: start; line-height: 1.5;\">本平台分为两个子平台：<strong>前台物品展示平台</strong>，以及<strong>后台管理系统</strong>。学生可以在前台物品展示平台获取二手商品发布信息，另外，可以通过注册登录可以对商品信息&nbsp;想要和加入购物车操作，标记自己中意的商品。</p><ul style=\"text-indent: 0px; text-align: start;\"><li>搜索商品</li><li>想要标记</li><li>加入购物车</li></ul><h2 style=\"text-indent: 0px; text-align: start;\">后台管理系统</h2><p style=\"text-indent: 0px; text-align: start; line-height: 1.5;\">本平台每位用户都可以进入后台管理系统，只需要完善一下学号等信息即可。在后台管理系统中，学生可以在商品管理中发布自己要出售的二手物品，查看自己已经发布的商品。在商品管理界面中，第一个需要确定物品的分类。然后添加想要的商品名称、描述等信息。在描述自己商品的时候，尽可能得将文字排版好，以便其他用户浏览，商品图片最少上传1张，最多7张，可以从多个角度展示自己的商品，以便其他用户了解你的物品。</p><ul style=\"text-indent: 0px; text-align: start;\"><li>发布商品</li><li>查看商品</li><li>编辑商品</li></ul><h2 style=\"text-indent: 0px; text-align: start;\">结尾</h2><p style=\"text-indent: 0px; text-align: start; line-height: 1.5;\">希望学生可以充分利用本平台。最后，说一下本平台的slogan：在师大这里买买买！💩💩💩</p><p style=\"text-indent: 0px; text-align: start; line-height: 1.5;\">&nbsp;</p><p style=\"text-indent: 0px; text-align: center; line-height: 1.5;\">@iaineisalsoyan</p><p style=\"text-indent: 0px; text-align: center; line-height: 1.5;\">2022/06/20</p>",
                "price": 12,
                "createTime": "1655731245174",
                "categoryName": "食品饮料",
                "hotScore": 1,
                "keyword": [
                    "T恤",
                    "蓝色",
                    "男"
                ],
                "username": "西红柿",
                "__v": 0
            }
}
```

### 3、按照商品的productId查找商品详情

#### 请求URL：
```
http://101.34.27.188:8080/api/productdetail/${productionId}
```

#### 示例：
http://101.34.27.188:8080/api/productdetail/62b0708274c148003a459f52

#### 请求方式：
```
GET
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": {
        "_id": "62b0708274c148003a459f52",
        "imgUrl": "http://101.34.27.188:3000/uploadImgs/1655730265256/1655730265256_p22cc.jpg",
        "gallery": [
            "http://101.34.27.188:3000/uploadImgs/1655730265256/1655730265256_p22cc.jpg",
            "http://101.34.27.188:3000/uploadImgs/1655730265256/1655730265256_mn00b.webp"
        ],
        "title": "狗狗",
        "description": "<p>一些狗狗</p>",
        "price": 123,
        "createTime": "1655730265256",
        "categoryName": "图书办公",
        "hotScore": 0,
        "keyword": [
            "狗",
            "我",
            "朋友"
        ],
        "username": "小羊羔",
        "__v": 0
    },
    "ok": true
}
```

### 4、获取商品发布的用户信息

#### 请求URL：
```
http://101.34.27.188:8080/api/product/users
```

#### 示例：
http://101.34.27.188:8080/api/product/users

#### 请求方式：
```
GET
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": [
        {
            "_id": "62b0438d4e2ea32183d8863a",
            "username": "西红柿",
            "password": "******",
            "studentnumber": "******",
            "place": "天地一号",
            "phone": "******",
            "admin": false,
            "routes": [],
            "__v": 0
        },
}
```

### 5、点击想要商品，对应商品的hotScore+1

#### 请求URL：
```
http://101.34.27.188:8080/api/want/${productId}
```

#### 示例：
http://101.34.27.188:8080/api/want/62b064bb74c148003a459cf6

#### 请求方式：
```
POST
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```

### 6、取消想要商品，对应商品的hotScore-1

#### 请求URL：
```
http://101.34.27.188:8080/api/wantno/${productId}
```

#### 示例：
http://101.34.27.188:8080/api/wantno/62b064bb74c148003a459cf6

#### 请求方式：
```
POST
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |


#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```


### 7、登录

#### 请求URL：
```
http://101.34.27.188:8080/api/user/login
```

#### 示例：
http://101.34.27.188:8080/api/user/login

#### 请求方式：
```
POST
```

#### 参数类型：body

| 参数     | 是否必选 | 类型   | 说明   |
| :------- | :------: | :----- | :----- |
| username |    Y     | string | 经纬度 |
| password |    Y     | string | 密码   |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": {
        "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IueUqOaItzEyMyIsImlhdCI6MTY1NTg4NjYyNCwiZXhwIjoxNjU1ODkwMjI0fQ.Jr8TCpltt5Md7OXwNk2hko5M8xX4YkSW0kgFoQ3_TYE"
    },
    "ok": true
}
```


### 8、获取登录用户信息

#### 请求URL：
```
http://101.34.27.188:8080/api/user/getInfo
```

#### 示例：
http://101.34.27.188:8080/api/user/getInfo

#### 请求方式：
```
GET
```

#### 参数类型：header

| 参数          | 是否必选 | 类型   | 说明                          |
| :------------ | :------: | :----- | :---------------------------- |
| Authorization |    Y     | string | 用户登录，需要带着token拿信息 |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": {
        "_id": "62b1c88674c148003a45a443",
        "username": "用户123",
        "password": "******",
        "studentnumber": "",
        "place": "",
        "phone": "",
        "admin": false,
        "routes": [],
        "__v": 0
    },
    "ok": false
}
```


### 9、退出登录

#### 请求URL：
```
http://101.34.27.188:8080/api/user/logout
```

#### 示例：
http://101.34.27.188:8080/api/user/logout

#### 请求方式：
```
GET
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```

### 10、注册

#### 请求URL：
```
http://101.34.27.188:8080/api/user/register
```

#### 示例：
http://101.34.27.188:8080/api/user/register

#### 请求方式：
```
POST
```

#### 参数类型：body

| 参数          | 是否必选 | 类型   | 说明   |
| :------------ | :------: | :----- | :----- |
| username      |    Y     | string | 用户名 |
| phone         |    N     | string | 手机号 |
| studentnumber |    N     | string | 学号   |
| place         |    N     | string | 寝室   |
| password      |    Y     | string | 密码   |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```


### 11、完善用户信息

#### 请求URL：
```
http://101.34.27.188:8080/api/user/complete
```

#### 示例：
http://101.34.27.188:8080/api/user/complete

#### 请求方式：

```
POST
```

#### 参数类型：body

| 参数          | 是否必选 | 类型   | 说明   |
| :------------ | :------: | :----- | :----- |
| username      |    Y     | string | 用户名 |
| phone         |    Y     | string | 手机号 |
| studentnumber |    Y     | string | 学号   |
| place         |    Y     | string | 寝室   |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```


### 12、加入购物车

#### 请求URL:  
```
http://101.34.27.188:8080/api/cart/addcart/${productId}
```

#### 示例：

http://101.34.27.188:8080/api/cart/addcart/62b064bb74c148003a459cf6

#### 请求方式: 
```
POST
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```


### 13、获取购物车列表

#### 请求URL：
```
http://101.34.27.188:8080/api/cart/list
```

#### 示例：

http://101.34.27.188:8080/api/cart/list


#### 请求方式：
```
GET
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": [],
    "ok": true
}
```

### 14、删除购物车商品

#### 请求URL：
```
http://101.34.27.188:8080/api/cart/delete/${productId}
```

#### 示例：

http://101.34.27.188:8080/api/cart/delete/62b064bb74c148003a459cf6


#### 请求方式：
```
DELETE
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```

#### 

## 后台接口列表：

### 1、按条件获取商品

#### 请求URL：

```
http://101.34.27.188:9528/api/category
```

#### 示例：

http://101.34.27.188:9528/api/category

#### 请求方式：

```
GET
```

#### 参数类型：

| 参数 | 是否必选 | 类型 | 说明 |
| :--- | :------: | :--- | :--- |
| 无   |    无    | 无   | 无   |

#### 返回示例：

```javascript
{
    "msg": "成功",
    "code": 200,
    "data": [
        {
            "_id": "62b0430fbcd554dc7e0768bc",
            "categoryName": "全部商品",
            "categoryId": 0,
            "level": 1
        }
}
```

### 2、上传商品图片

#### 请求URL：

```
http://101.34.27.188:9528/api/product/fileUpload
```

#### 示例：

http://101.34.27.188:8080/api/front/productlist

#### 请求方式：

```
POST
```

#### 参数类型：body

| 参数   | 是否必选 | 类型     | 说明                                                 |
| :----- | :------: | :------- | :--------------------------------------------------- |
| file   |    Y     | (binary) | 图片列表                                             |
| folder |    Y     | string   | 编辑状态下，记录原来图片存储文件夹，根据当前时间命名 |
| count  |    Y     | number   | 文件个数                                             |
| isEdit |    Y     | boolean  | 是否是编辑状态                                       |

#### 返回示例：

```javascript
{
    code: 200
    data: "http://101.34.27.188:3000/uploadImgs/1655728617879/1655728617879_s7cbb.jpg"
    msg: "图片上传成功"
    ok: true
}
```

### 3、上传商品信息

#### 请求URL：

```
http://101.34.27.188:9528/api/product/saveProduct
```

#### 示例：

http://101.34.27.188:9528/api/product/saveProduct

#### 请求方式：

```
GET
```

#### 参数类型：body

| 参数         | 是否必选 | 类型   | 说明                                                         |
| :----------- | :------: | :----- | :----------------------------------------------------------- |
| categoryName |    Y     | string | 分类名称                                                     |
| description  |    Y     | string | 描述                                                         |
| id           |    Y     | string | 商品id                                                       |
| keywordList  |    Y     | array  | 关键字 示例 [{valueName: "苹果", flag: false}, {valueName: "水果", flag: false}, {valueName: "新鲜", flag: false}] |
| owner        |    Y     | string | 发布人                                                       |
| price        |    Y     | number | 价格                                                         |
| spuImageList |    Y     | array  | 图片列表 [{imageName: "1655726846124_gx7eq.jpg",…}, {imageName: "1655726846124_muwiu.jpg",…},…] |
| spuName      |    Y     | string | 商品名称                                                     |

#### 返回示例：

```javascript
{
    code: 200
    data: null
    msg: "操作成功"
    ok: true
}
```

### 4、根据id删除商品

#### 请求URL：

```
http://101.34.27.188:9528/api/product/deleteProduct
```

#### 示例：

http://101.34.27.188:9528/api/product/deleteProduct

#### 请求方式：

```
DELETE
```

#### 参数类型：body

| 参数   | 是否必选 | 类型   | 说明                                      |
| :----- | :------: | :----- | :---------------------------------------- |
| id     |    Y     | string | 商品id                                    |
| imgUrl |    Y     | string | 商品主图的url，可以定位商品图片的存储位置 |

#### 返回示例：

```javascript
{
    code: 200
    data: null
    msg: "删除成功"
    ok: true
}
```

### 5、获取所有用户信息

#### 请求URL：

```
http://101.34.27.188:9528/api/admin/user/list/${pageNo}/${pageSize}
```

#### 示例：

http://101.34.27.188:9528/api/admin/user/list/1/3?username=

#### 请求方式：

```
POST
```

#### 参数类型：params

| 参数     | 是否必选 | 类型   | 说明   |
| :------- | :------: | :----- | :----- |
| username |    N     | string | 用户名 |

#### 返回示例：

```javascript
{
    code: 200
    data: {totalPages: 3, pageNo: "1", totalCount: 7, pageSize: "3",…}
    msg: "操作成功"
    ok: true
}
```

### 6、添加用户

#### 请求URL：

```
http://101.34.27.188:9528/api/admin/user/list/save
```

#### 示例：

http://101.34.27.188:9528/api/admin/user/list/save

#### 请求方式：

```
POST
```

#### 参数类型：body

| 参数          | 是否必选 | 类型   | 说明   |
| :------------ | :------: | :----- | :----- |
| username      |    Y     | string | 用户名 |
| phone         |    N     | string | 手机号 |
| studentnumber |    N     | string | 学号   |
| place         |    N     | string | 寝室   |
| password      |    Y     | string | 密码   |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```


### 7、更新用户信息

#### 请求URL：

```
http://101.34.27.188:9528/api/admin/user/list/update
```

#### 示例：

http://101.34.27.188:9528/api/admin/user/list/update

#### 请求方式：

```
PUT
```

#### 参数类型：body

| 参数          | 是否必选 | 类型   | 说明   |
| :------------ | :------: | :----- | :----- |
| username      |    Y     | string | 用户名 |
| phone         |    Y     | string | 手机号 |
| studentnumber |    Y     | string | 学号   |
| place         |    Y     | string | 寝室   |

#### 返回示例：

```javascript
{
    "msg": "操作成功",
    "code": 200,
    "data": null,
    "ok": true
}
```


### 8、删除用户

#### 请求URL：

```
http://101.34.27.188:9528/api/admin/user/list/remove/${id}
```

#### 示例：

http://101.34.27.188:9528/api/admin/user/list/remove/62b2d64274c148003a45a62b

#### 请求方式：

```
DELETE
```

#### 返回示例：

```javascript
{
    code: 200
    data: null
    msg: "删除成功"
    ok: true
}
```


### 9、 批量删除用户

#### 请求URL：

```
http://101.34.27.188:9528/api/admin/user/list/batchRemove
```

#### 示例：

http://101.34.27.188:9528/api/admin/user/list/batchRemove

#### 请求方式：

```
DELETE
```

#### 参数类型：body

| 参数 | 是否必选 | 类型  | 说明     |
| :--- | :------: | :---- | :------- |
| ids  |    Y     | array | 用户的id |

#### 返回示例：

```javascript
{
    code: 200
    data: null
    msg: "删除成功"
    ok: true
}
```

### 