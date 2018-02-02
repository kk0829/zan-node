### 0.0.64

* 修复 rewrite 之后，ctx.path 可能为 null 的情况；

### 0.0.63

* 更新 validator 类 required 校验方法，支持参数是数字情况；

### 0.0.62

* 新增 添加一个新的基类 Exception_404

### 0.0.61

* 新增 添加一个健康检查中间件 health_check

### 0.0.60

* 新增 添加三个 session 操作方法，getSession/setSession/delSession

### 0.0.59

* 更新 setState/setGlobal/setEnv 这三个方法支持传入第三个参数 toSnakeCase ，如果 true，将驼峰转换成下划线格式，false则不处理；

### 0.0.57

* 新增 支持模板标签、过滤器扩展，通过在 server/extend/view.js 添加方法即可；

### 0.0.56

* 更新 renderString 方法支持第三个参数，toSnakeCase，如果 true，将驼峰转换成下划线格式，false则不处理；

### 0.0.55

* 新增 ctx 对象新增一个方法 renderString

### 0.0.54

* 更新 ctx.finalPath 获取方式

### 0.0.52

* 新增 ctx 对象添加一个新属性，finalPath

### 0.0.51

* 新增 支持 context 对象扩展，通过在 server/extend/context 添加方法即可；

### 0.0.49

* 删除 删除health中间件


