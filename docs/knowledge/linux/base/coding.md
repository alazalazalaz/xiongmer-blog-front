## 编码规则

### bit&byte
在计算机中所有信息都是以二进制位`0`和`1`来存储的。8个bit位是一个字节，计算机对数据的读取是按照一个字节的大小来读取识别的，那么面对全世界这么多语言，计算机是如何知道当前字节表示的是什么意思呢？
今天就来了解下字符在计算机中的编码方式，其中会涉及到`ASCII` `unicode` `UTF-8`等。


### ASCII

首先看下wiki对它的定义：
> ASCII abbreviated from American Standard Code for Information Interchange, is a character encoding standard for electronic communication. ASCII codes represent text in computers, telecommunications equipment, and other devices. Most modern character-encoding schemes are based on ASCII, although they support many additional characters.

大概就是说ASCII是`美国信息交换标准代码`，用来表示电脑和其他电信设备的文本。大家都知道电脑所有信息都是以二进制的方式来计算和存储的，那么人们能识别的文字和计算机中的二进制必然存在一种映射关系，ASCII就是最初的一种映射关系。


比如在ASCII中，大写字母`A`对应的ASCII码是`65`二进制就是`01000001`；阿拉伯数字`0`对应的ASCII码是`48`二进制就是`110000`；还有些空格`32`；回车`13`等等一些键盘上所见的符号。

ASCII起初只规定了127个字符，就能代表了所有键盘上的普通符号、阿拉伯数字和英文字母，对于英文国家来说能满足日常使用，所以他们把每个字节的第一位置位0，只需要使用后面7位就足够了。

但是其他欧洲国家比如法语、葡萄牙语等无法用127个字符表示完全，所以他们就把第一个空闲0使用了起来。因此欧洲国家用一个字节(8位可表示256个字符)也能实现。

我们回顾一下，ASCII表示的范围：

![img](../assets/app-encoding.ascii.png)

### unicode
随着计算机在全球的发展和普及开来，其他语言，比如中文、日文，单字节256个字符肯定完全没法表示。所以就出现了一个全球统一的编码规则叫`unicode`，它的作用是把各个语言的字符映射为二进制和ASCII的目的一样。

unicode当前默认的版本是`UCS-2`也就是用定长2个字节来表示字符，6w+的字符量已经足以用于全球的主要语言的大多数字符。但是unicode还是提供了一个扩展机制，允许表示一百多万个字符。

比如英文字母`A`对应的unicode是`U+0041`，转换为十进制是`65`转换为二进制是`0100 0001`和ASCII码一致，只需要一个字节表示。

比如汉字`中`对应的unicode是`U+4e00`转换为十进制是`19968`转换为二进制是`100 1110 0000 0000`，这个二进制有15位，需要至少2个字节表示。

[点击](http://www.chi2ko.com/tool/CJK.htm) 查看中文的unicode编码。

所以这就出现了一个问题，计算机按照字节来读取数据时，如何知道当前字节就是要表示一个字符还是连续的两个字节表示一个字符？
如果按照`unicode`的方式统一用两个字节表示一个字符，那英文字符(只需要一个字节表示，前面全部填充0)的第一字节全是0，对于存储空间是极大的浪费。

### UTF-8
为了解决**如何来表示unicode**这一问题，或者叫**如何让计算机读懂unicode**这一问题，就诞生了UTF-8。它的特点是变长编码，可以使用1-4个字节表示一个字符(unicode)。

UTF-8的规则很简单，就是使用控制码+字符码组成，控制码就是告诉计算机当前是单字节还是多字节，字符码就是对应的`unicode`。

规则1：对于单字节的字符，8个bit位中高位必须以`0`开头，这完全等同于127位最初的`ASCII`码。比如大写字母`A`，对于的二进制为`01000001`

规则2：对于需要n个字节的字符：

```text
- 第一个字节:
    - 高位前n位为`1`
    - 第n+1位为`0`
- 其他字节：
    - 高位以`10`开头
- 未提及的位使用对应的unicode补充，不足的用高位0补充
```

unicode和utf-8的映射关系如下：

|unicode的符号范围(十六进制)|utf-8的编码方式(二进制)|
|---|---|
|0000 0000 ~ 0000 007F | 0xxxxxxx|
|0000 0080 ~ 0000 07FF | 110xxxxx 10xxxxxx|
|0000 0800 ~ 0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx|
|0001 0000 ~ 0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx|

#### 举例1-ASCII

unicode直接兼容了初期ASCII，所以ASCII的字符，无论是ASCII编码还是utf-8编码，都一样。

#### 举例2-中文

以中文`一`来说，`一`对应的unicode符号是`4e00`，`4e00`在`0800 ~ FFFF`的范围，所以对应的utf-8为三字节。
`4e00`对应的二进制为`100 1110 0000 0000`，所以utf-8为`11100100 10111000 10000000`，第一个字节的第二个`0`为补充。

附上代码打印`一`对应的编码：

```Go
var yi = "一"
log.Printf("bytes:%v, rune:%v", []byte(yi), []rune(yi))//bytes:[228 184 128], rune:[19968]
//其中golang里面，[]byte表示字符的utf-8编码对应的十进制，[]rune表示字符的unicode对应的十进制。
```

### UTF-16、UTF-32等

### GB2312、GBK等其他编码


### 引用

ascii wiki[https://zh.wikipedia.org/wiki/ASCII](https://zh.wikipedia.org/wiki/ASCII)

汉字编码表[http://www.chi2ko.com/tool/CJK.htm](http://www.chi2ko.com/tool/CJK.htm)