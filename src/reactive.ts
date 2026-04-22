//reactive 实现
// Vue 响应式就做两件事：
// 依赖收集（track）：读取数据时，把「用到这个数据的函数」存起来
// 触发更新（trigger）：修改数据时，把「存起来的函数」全部执行一遍
//1.  把普通对象变为响应式依赖
export const reactive = <T extends object>(target: T){

  //Proxy 代理整个对象, 拦截所有读写操作
  return new Proxy(target, {
    //拦截读取[属性]: obj.key
    get(target, key, reciver) {


      // 此处应收集依赖 track(target,key)
      track(target, key)
        return Reflect.get(target,key,reciver)
    },

    //拦截[设置]属性:obj.key = xxx
    set(target,key,value,reciver) {

      let res = Reflect.set(target, key,value, reciver)

      //此处应触发更新,并返回值
      trigger(target, key)
      return res
    }
  })
}

//effect 副作用函数实现 和依赖收集

//全局变量:记录当前正在执行的副作用函数
let activeEffect;

export const effect = (fn:Function) => {

  //包装一层, 方便管理依赖
  const _effect = function () {
    // 关键：把当前函数赋值给全局 activeEffect
    activeEffect = _effect
    // 执行用户传入的函数（里面会读取响应式数据）
    fn()
  }
// 立即执行一次，触发依赖收集
  _effect()
}


// 依赖收集
// 顶层存储结构：【对象】 → 【属性】 → 【依赖该属性的函数集合】
const targetMap = new WeakMap()

// 1. 拿到当前对象对应的依赖Map
export const track = (target,key) => {

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 2. 拿到当前属性对应的依赖集合

  let deps = depsMap.get(key)

  if (!deps) {
    deps = new Set()
    depsMap.set(key,deps)
  }

  // 3. 把当前正在执行的 effect 存入集合
  deps.add(activeEffect)
}

//4. trigger：触发更新（把存的函数执行一遍）, 触发式更新

export const trigger = (target, key) => {
  // 1. 找到当前对象的依赖Map
  const depsMap = targetMap.get(target)
// 2. 找到当前属性的依赖集合
  const deps = depsMap.get(key)
// 3. 遍历执行所有依赖这个属性的 effect 函数
  deps.forEach(effect=>effect())
}


//总结
// reactive：用 Proxy 劫持对象，读收集依赖，写触发更新。
// effect：包装用到响应式数据的函数，用 activeEffect 标记当前函数。
// track：用 WeakMap + Map + Set 存储「属性 → 依赖函数」。
// trigger：修改数据时，执行对应属性的所有依赖函数。
