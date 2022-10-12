## TypeScript 高级用法

### 一、类型

  ##### 1.1 unknown
  unknown 指的是 **不可预先定义的类型** ，在很多场景下，它可以替代 any 的功能同时保留静态检查的能力  
  
  ```typescript
  const num: number = 10
  (num as unknown as string).split('') // 注意，这里和any一样完全可以通过静态检查

  const foo: unknown = 'string'
  foo.substr(1) // Error: 静态检查不通过报错
  const bar: any = 10
  any.substr(1)		// Pass: any类型相当于放弃了静态检查
  ```

  #### 1.2 void
  在 TS 中，void 和 undefined 功能高度类似  
  void 和 undefined 类型最大的区别是，你可以理解为 undefined 是 void 的一个子集，当你对函数返回值并不在意时，使用 void 而不是 undefined

### 二、运算符
  #### 2.1 非空断言运算符 !
  这个运算符可以用在变量名或者函数名之后，用来强调对应的元素是非 null | undefined 的  
  ```typescript
  function onClick(callback?: () => void) {
    callback!()   // 参数是可选入参，加了这个感叹号!之后，TS编译不报错
  }
  ```

  #### 2.2 可选链运算符 ?.
  相比上面!作用于编译阶段的非空判断， <font color="#ff6980">?.</font> 这个是开发者最需要的运行时(当然编译时也有效)的非空判断 
  ?.用来判断左侧的表达式是否是 null | undefined，如果是则会停止表达式运行，可以减少我们大量的&&运算
  ```typescript
    // 正常的写法
    obj && obj.prop 
    obj && obj[index]
    callback && callback()

    // 可选链运算符
    obj?.prop
    obj?.[index]
    callback?.()
  ```

  #### 2.3 空值合并运算符 ??
  ?? 与 || 的功能是相似的
  || 表达式 对 **false、''、NAN、0** 也生效  
  区别在于 **??在左侧表达式结果为 null 或者 undefined 时，才会返回右侧表达式**
  ```typescript
  let b = a ? 10
  // 转换为如下代码
  // undefined === void 0   --> true
  // 等价
  let b = a!== null && a !==  void 0 ? a : 10
  let b = a!== null && a !==  undefined ? a : 10
  ```

  #### 2.4 数字分隔符_
  _可以用来对长数字做任意的分隔，主要设计是为了便于数字的阅读，编译出来的代码是没有下划线的，请放心食用 
  ```typescript
  let num: number = 12_345.6_789
  console.log(num)  // 12345.6789
  ```
### 三、操作符
  #### 3.1 键值获取 keyof
  keyof 可以获取一个类型所有键值，返回一个联合类型，如下：  
  ```typescript
  type Person = {
    name: string
    age: number
  }
  type PersonKey = keyof Person // PersonKey得到的类型为 'name' | 'age'
  ```
  keyof 的一个典型用途是限制访问对象的 key 合法化，因为 any 做索引是不被接受的  
  ```typescript
  function getValue(p: Person, k: keyof Person) {
    return p[k]   // 如果k不如此定义，则无法以p[k]的代码格式通过编译
  }
  ```

  #### 3.2 实例类型获取 typeof
  typeof 是获取一个对象/实例的 <font color="#ff7980">类型</font>，如下：  
  ```typescript
  const me: Person = { name: '张无忌', age: 18 }
  type p = typeof me    // { name: string, age: number | undefined }
  const you: typeof me = { name: 'you', age: 69 }  // 可以通过编译
  ```
  typeof 可以和 keyof 一起使用(因为 typeof 是返回一个类型嘛)，如下：  
  ```typescript

  // 这两种写法等价
  type PersonKey = keyof Person
  type PersonKey = keyof typeof me  // name || age
  ```
  > typeof 只能用在具体的 *对象* 上，这与 js 中的 typeof 是一致的，并且它会根据左侧值自动决定应该执行哪种行为 