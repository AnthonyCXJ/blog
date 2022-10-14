## TypeScript 高级用法

## 一、类型

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

## 二、运算符
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
## 三、操作符
  #### 3.1 键值获取 keyof
  keyof 可以获取一个类型所有键值，返回一个联合类型，例🌰  
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
  typeof 是获取一个对象/实例的 <font color="#ff7980">类型</font>，例🌰  
  ```typescript
  const me: Person = { name: '张无忌', age: 18 }
  type p = typeof me    // { name: string, age: number | undefined }
  const you: typeof me = { name: 'you', age: 69 }  // 可以通过编译
  ```
  typeof 可以和 keyof 一起使用(因为 typeof 是返回一个类型嘛)，例🌰  
  ```typescript

  // 这两种写法等价
  type PersonKey = keyof Person
  type PersonKey = keyof typeof me  // name || age
  ```
  > typeof 只能用在具体的 *对象* 上，这与 js 中的 typeof 是一致的，并且它会根据左侧值自动决定应该执行哪种行为 

  #### 3.3 遍历属性 in
  in 只能用在类型的定义中，可以对枚举类型进行遍历，例🌰
  ```typescript
  // 这个类型可以将任何类型的键值转化成number类型
  type TypeToNumber<T> = {
    [key in keyof T]: number
  }

  const obj: TypeToNumber<Person> = { name: 10, age: 10 }
  ```
  总结起来 in 的语法格式，例🌰  
  > 用法: [ 自定义变量名 in 枚举类型 ]: 类型

## 四、泛型
  #### 4.1 基本使用
  泛型可以用在普通类型定义，类定义、函数定义上，例🌰
  ```typescript
  // 普通类型定义
  type Dog<T> = {
    name: string
    type: T
  }
  // 普通类型使用
  const dog: Dog<number> = {
    name: '滚滚',
    type: 20
  }

  // 类定义
  class Cat<T> {
    private type T
    constructor(type: T) {
      this.type = type
    }
  }

  // 类使用
  const cat: Cat<number> = new Cat<number>(20)  // 或简写 const cat = new Cat(20)

  // 函数定义
  function swipe<T, U>(value: [T, U]): [U, T] {
    return [value[1], value[0]]
  }

  // 函数使用
  swipe<Cat<number>, Dog<number>>([cat, dog])   // 或简写 swipe([cat, dog])
  ```

  泛型的语法格式简单总结如下
   > 类型名<泛型列表> 具体类型定义

  #### 4.2 泛型推导与默认值
  上面提到了，我们可以简化对泛型类型定义的书写，因为TS会自动根据变量定义时的类型推导出变量类型，这一般是发生在函数调用的场合的  
  ```typescript
  type Dog<T> = { 
    name: string
    type: T
  }

  function adopt<T>(dog: Dog<T>) {
    return dog
  }

  const dog = { name: 'ww', type: 'hsq' }  // 这里按照Dog类型的定义一个type为string的对象
  adopt(dog)  // Pass: 函数会根据入参类型推断出type为string
  ```
  泛型默认值的语法格式简单总结
    > 泛型名 = 默认类型 

  #### 4.3 泛型约束
  有的时候，我们可以不用关注泛型具体的类型，如：  
  ```typescript
  function fill<T>(length: number, value: T): T[] {
    return new Array(length).fill(value)
  }
  ```
  如果需要限定类型，这时候使用extends关键字即可 
  ```typescript
  function sum<T extends number>(value: T[]): number {
    let count = 0
    value.forEach(v => count += v)
    return count
  }

  // 这里的意思是、约束U一定是T中key类型中的子集
  function pick<T, U extends keyof T>() {}
  ```
  extends 的语法格式简单总结如下，注意下面的类型既可以是一般意义上的类型也可以是泛型
  > 泛型名 extends 类型

  #### 4.4 泛型条件
  ```typescript
  // 这里便不限制 T 一定要是 U 的子类型，如果是 U 子类型，则将 T 定义为 X 类型，否则定义为 Y 类型
  T extends U ? X : Y
  ```
  extends 的语法格式可以扩展为
  > 泛型名A extends 类型B ? 类型C: 类型D

## 五、泛型工具
  #### Partial<T>
  此工具的作用就是将泛型中全部属性变为可选的
  ```typescript
  type Partial<T> = {
    [P in keyof T]?: T[P]
  }

  type Animal = {
    name: string
    age: number
    eat: () => number
  }

  // type PartialAnimate = {
  //   name?: string
  //   age?: number
  //   eat?: () => number
  // }
  // 等价于上面的写法
  type PartialAnimate = Partial<Animate>
  const dog: PartialAnimate = { name: 'dog' }   // 属性全部可选后，可以只赋值部分属性了
  ```

  #### Record<K, T>
  此工具的作用是将 K 中所有属性值转化为 T 类型，我们常用它来申明一个普通 object 对象

  > keyof any 对应的类型为number | string | symbol
  > 也就是可以做对象键(专业说法叫索引 index)的类型集合
  ```typescript
  type Record<K extends keyof any, T> = {
    [key in K]: T
  }

  // 例🌰
  const obj: Record<string, string> = {
    'name': '张无忌',
    'tag': '打工人'
  }
  ```

#### Pick<T, K>
此工具的作用是将 T 类型中的 K 键列表提取出来，生成新的子键值对类型

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

const bird: Pick<Animal, 'name' | 'age'> = {
  name: 'bird',
  age: 1
}
```