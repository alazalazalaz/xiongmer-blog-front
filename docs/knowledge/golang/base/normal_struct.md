## 常用结构

### slice

#### 什么是切片

切片是一个24byte的结构体，源码`reflect/value.go`中的定义如下：

```Go
type SliceHeader struct {
	Data uintptr
	Len  int
	Cap  int
}
```

不难看出切片这个结构体就三个字段，len表示长度，cap表示容量，data表示具体的数据(data是个指针哦)。

使用`unsafe.sizeof()`打印某个切片始终是24字节=8byte+8byte+8byte。而数组使用`unsafe.sizeof()`结果会根据数组的长度不同而不同。

**slice的函数传递发生的是浅拷贝，只会对slice结构体进行一次值拷贝。但是slice的读写是和指针的读写类似，通过一个指针变量Data去修改具体的数据，从而达到函数内外相互影响的作用。**

**不止是函数传递，包括slice的复制，同样也是只拷贝slice的结构体，共用底层的数据，所以复制出来的切片修改数据也会影响到原值。**

![img.png](../assets/slice.png)

#### 定义切片

1. make定义
```Go
 var numbers = make([]int, 3, 5)//make函数(类型，长度，容量)
```
2. 字面量定义
```Go
var slice []int//定义但未初始化
numbers := []int{1, 2, 3}//定义+初始化
```

3. 通过下标从数组截取
```Go
var array = [4]int {1, 2, 3, 4}
s1 := array[:] //所有
```

#### 切片的赋值和传递

赋值和传递都只会拷贝切片结构体，引用的数据会共享。
```Go
var abc = []int{1, 2, 3, 4, 5, 6, 7, 8, 9}
ss1 := abc[:4]//ss1 = 1,2,3,4
ss1[3] = 100
fmt.Println(abc)//[1,2,3,100,5,6,7,8,9]
```

```Go
var sliceX = []int{1, 2}
changeSliceX(sliceX)
fmt.Println(sliceX)//[100, 200]

func changeSliceX(sliceX []int){
	sliceX[0] = 100
	sliceY := sliceX[:]
	sliceY[1] = 200
}
```

#### 切片拷贝&追加
```Go
var slice []int
slice1 := make([]int, len(slice), cap(slice) * 2)//拷贝会深拷贝
copy(slice1, slice)

slice = append(slice, 5, 100, 7)//追加会自动扩容
```

#### 切片的删除和常用函数

删除第n个元素(len(slice))>=n>=1)
```Go
b := []int{1, 2, 3}
b1 := b[:n-1]
b1 = append(b1, b[n:]...)
```

遍历切片
```Go
sliceZ := [...]int{1, 2, 3, 4}
for i, s := range sliceZ{
    fmt.Printf("i=>s , %d=> %d\n", i, s)
}
```

