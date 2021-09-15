# 常用结构

## slice

### 什么是切片

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

### 定义切片

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

### 切片的赋值和传递

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

### 切片拷贝&追加
```Go
var slice []int
slice1 := make([]int, len(slice), cap(slice) * 2)//拷贝会深拷贝
copy(slice1, slice)

slice = append(slice, 5, 100, 7)//追加会自动扩容
```

### 切片的删除和常用函数

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

## map

### 什么是map

map是指针，指向`hmap`结构体的指针。它和切片类似，在赋值或者传递的时候，只会发生指针的拷贝，引用的值未发生拷贝。

看看源码`runtime/map.go`对map的创建

```Go
func makemap(t *maptype, hint int, h *hmap) *hmap {
	mem, overflow := math.MulUintptr(uintptr(hint), t.bucket.size)
	if overflow || mem > maxAlloc {
		hint = 0
	}
	...
	...
```

以及`hmap`结构体
```
// A header for a Go map.
type hmap struct {
	// Note: the format of the hmap is also encoded in cmd/compile/internal/gc/reflect.go.
	// Make sure this stays in sync with the compiler's definition.
	count     int // # live cells == size of map.  Must be first (used by len() builtin)
	flags     uint8
	B         uint8  // log_2 of # of buckets (can hold up to loadFactor * 2^B items)
	noverflow uint16 // approximate number of overflow buckets; see incrnoverflow for details
	hash0     uint32 // hash seed

	buckets    unsafe.Pointer // array of 2^B Buckets. may be nil if count==0.
	oldbuckets unsafe.Pointer // previous bucket array of half the size, non-nil only when growing
	nevacuate  uintptr        // progress counter for evacuation (buckets less than this have been evacuated)

	extra *mapextra // optional fields
}
```

**所以如果用`*map`的方式，相当于对指针再次使用指针，有点多此一举的感觉了**。

但是为什么我们使用`reflect.TypeOf()`打印指针的时候没有`*`呢？

```
var mapZ map[int]int
fmt.Println(reflect.TypeOf(mapZ)) # map[int]int
fmt.Println(reflect.TypeOf(&user{})) # *main.user
```

以下摘抄[这里](https://groups.google.com/g/golang-nuts/c/SjuhSYDITm4/m/jnrp7rRxDQAJ)：

```
 In the very early days what we call maps now were written as pointers, so you wrote *map[int]int. 
 We moved away from that when we realized that no one ever wrote `map` without writing `*map`. 
 That simplified many things but it left this issue behind as a complication.
```

### 定义map

```Go
//定义方式1 使用map关键字，此方式未初始化，为nil map，不能用来存放键值对，会panic(assignment to entry in nil map)
// var variable_name map[key_type]value_type

//定义方式2 使用make函数，会被初始化
// variable_name := make(map[key_type]value_type)

var countryCapitalMap = make(map[string]string)

countryCapitalMap["中国"] = "北京"
countryCapitalMap["葡萄牙"] = "里斯本"
countryCapitalMap["西班牙"] = "马德里"
```

### 遍历map

和slice一样直接使用`range`，`range`放置1个参数表示key，如果放置2个参数表示key和value。

**注意：遍历输出元素的顺序与填充顺序无关！！！**
```Go
for key := range countryCapitalMap{
    fmt.Printf("key: %s, value: %s \n", key, countryCapitalMap[key])
}

for key, v := range countryCapitalMap{
    fmt.Printf("key: %s, value: %s \n", key, v)
}
```

### 判断元素是否存在于map中
```Go
value, isExist := countryCapitalMap["美国"]//isExist是bool值
```

### 删除map元素
```Go
delete(countryCapitalMap, "西班牙")
```

### map的普通赋值

```Go
//普通赋值
mapLeft, mapRight := make(map[int]int), make(map[int]int)
mapLeft[1] = 1
mapRight[2] = 2
fmt.Printf("mapLeft=%v, mapLeft's *hmap=%p, mapLeft address=%p\n", mapLeft, mapLeft, &mapLeft)
fmt.Printf("mapRight=%v, mapRight's *hmap=%p, mapRight address=%p\n", mapRight, mapRight, &mapRight)
mapLeft = mapRight
fmt.Printf("mapLeft=%v, mapLeft's *hmap=%p, mapLeft address=%p\n", mapLeft, mapLeft, &mapLeft)
```
输出：
```shell
mapLeft=map[1:1], mapLeft's *hmap=0xc000098210, mapLeft address=0xc0000b4020
mapRight=map[2:2], mapRight's *hmap=0xc000098240, mapRight address=0xc0000b4028
mapLeft=map[2:2], mapLeft's *hmap=0xc000098240, mapLeft address=0xc0000b4020
```
说明赋值后，mapLeft和mapRight都指向`0xc000098240,`这块内存*hmap空间。所以修改mapLeft和mapRight都会相互影响。

### map的方法传递

```Go
var mapUninit map[int]int
mapInited := make(map[int]int)
mapInited[1] = 1
fmt.Printf("mapUninit=%v, mapUninit's *hmap=%p, mapUninit address=%p\n", mapUninit, mapUninit, &mapUninit)
fmt.Printf("mapInited=%v, mapInited's *hmap=%p, mapInited address=%p\n", mapInited, mapInited, &mapInited)
_referenceMap(mapUninit, mapInited)

func _referenceMap(mapUninit map[int]int, mapInited map[int]int){
	fmt.Printf("in func mapUninit=%v, mapUninit's *hmap=%p, mapUninit address=%p\n", mapUninit, mapUninit, &mapUninit)
	fmt.Printf("in func mapInited=%v, mapInited's *hmap=%p, mapInited address=%p\n", mapInited, mapInited, &mapInited)
}
```

输出：
```shell
mapUninit=map[], mapUninit's *hmap=0x0, mapUninit address=0xc00000e040
mapInited=map[1:1], mapInited's *hmap=0xc000068300, mapInited address=0xc00000e048
in func mapUninit=map[], mapUninit's *hmap=0x0, mapUninit address=0xc00000e050
in func mapInited=map[1:1], mapInited's *hmap=0xc000068300, mapInited address=0xc00000e058
```

结论：
使用var声明的map是未被初始化的，也就是*hmap指针是空的，直接使用该变量赋值比如`mapUninit[1]=1`会panic。

map传递是值拷贝，实参`0xc00000e040`传递进来后，新拷贝了一个变量`0xc00000e048`，但是这两个变量的值也就是*hmap都是共享的同一个地址。所以函数内外修改都会相互影响实参。

## channel

### 什么是channel
channel是一个特殊类型，遵循FIFO的规则的队列。用于不同groutine之间传递信息。

channel和map同理，也是一个指针，指向的是runtime/chan.go中的hchan结构体。

```Go
func makechan(t *chantype, size int) *hchan {
    ...
}

type hchan struct {
	qcount   uint           // total data in the queue
	dataqsiz uint           // size of the circular queue
	buf      unsafe.Pointer // points to an array of dataqsiz elements
	elemsize uint16
	closed   uint32
	elemtype *_type // element type
	sendx    uint   // send index
	recvx    uint   // receive index
	recvq    waitq  // list of recv waiters
	sendq    waitq  // list of send waiters
	lock mutex
}
```

channel的操作分为三个，分别是发送、接收和关闭。发送和接收都使用`<-`符号，关闭使用`close()`函数。

### 创建一个no buffer的channel

```Go
func createNoBufferChan(){
	c1 := make(chan int)

	go func(c1 chan int) {//如果没有子协程去接受c1(也就是说如果没有这个goroutine)，那么主协程发送后会panic of deadlock
		time.Sleep(time.Second * 2)
		c1Result := <-c1
		fmt.Println("createNoBufferChan 接受c1=", c1Result)
	}(c1)

	c1<-1	//因为是no buffer，所以发送的时候会阻塞，直到接收方准备好接收。
	fmt.Println("createNoBufferChan 写入c1完成")
	time.Sleep(time.Second * 2)
	fmt.Println("createNoBufferChan end")
}

输出：
createNoBufferChan 接受c1= 1
createNoBufferChan 写入c1完成
createNoBufferChan end
或者
createNoBufferChan 写入c1完成
createNoBufferChan 接受c1= 1
createNoBufferChan end
```

说明：

使用make(chan type)创建的通道是无缓冲通道，也叫同步通道

如果使用var c1 chan int创建，创建后由于该通道没有初始化，直接使用会报错，建议使用make创建

无缓冲通道特点：

1、因为没有buffer所以，发送后，接收方goroutine必须立即接受，如果没有接收的goroutine存在，则发送方会panic of deadlock；如果接收方是阻塞状态，则发送方也会阻塞，直到接收方接收chan。

### 创建一个有buffer的channel
```Go
func createBufferChan(){
	ch := make(chan int, 1)
	ch<-1//这里主协程直接发送，就不会报错，因为会发送到缓冲里面去
	//ch<-2//但是如果发送第二次，则会报错，因为缓冲大小只有一个
	//go func(ch chan int) {
	//	time.Sleep(time.Second*5)
	//	fmt.Println(<-ch)
	//
	//}(ch)

	//fmt.Println("createBufferChan", <-ch)
	log.Println("end")
}
```

### 接收

从一个通道中接收值。
```Go
x := <-ch //从ch中取值并赋给x
<-ch    //从ch中取值并忽略
```

### 关闭

使用`close`函数关闭
```Go
close(chan)
```

对已关闭的channel执行读、写、关闭操作会导致以下情况：
- 再次读，如果里面还有内容会返回内容，如果没有内容会返回该类型的空值。
- 再次写，会panic
- 再次关闭，会panic

但是，channel可以不用显示调用关闭，因为它会被回收，这一点和文件句柄不同。

```Go
ch := make(chan int, 1)
ch<-1
fmt.Println("closeChan", <-ch)
close(ch)
fmt.Println("read a closed chan", <-ch)//继续读取一个已关闭的chan，如果里面有值会返回值，返回完后继续读取会返回该类型的空值，此处返回0
//ch<-2 // 继续往一个已关闭的chan写入，会导致panic
//close(ch) // 再次关闭一个已关闭的chan会panic
```



@todo 协程泄露问题，打印协程数

